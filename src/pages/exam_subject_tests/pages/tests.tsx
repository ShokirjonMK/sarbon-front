import React, { useState } from 'react';
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { useNavigate, useParams } from 'react-router-dom';
import { CreateBtn } from 'components/Buttons';
import { useTranslation } from 'react-i18next';
import useGetAllData from 'hooks/useGetAllData';
import { ITestQuestion } from 'models/test';
import { Avatar, Button, Col, Empty, Form, Modal, Row, Select, Spin, Switch, message } from 'antd';
import { FILE_URL } from 'config/utils';
import CustomPagination from 'components/Pagination';
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import { number_order } from 'utils/number_orders';
import DeleteData from 'components/deleteData';
import { ArrowUploadFilled, Delete16Filled, Eye20Filled } from '@fluentui/react-icons';
import checkPermission from 'utils/check_permission';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Notification } from 'utils/notification';
import useGetData from 'hooks/useGetData';
import { cf_filterOption } from 'utils/others_functions';
import { importExamTestToExcel, updateExamTestStatus } from '../crud/request';
import FilterSelect, { TypeFilterSelect } from 'components/FilterSelect';
import { TypeFormUIData } from 'pages/common/types';
import FormUIBuilder from 'components/FormUIBuilder';

const selectData: TypeFilterSelect[] = [
  {
    name: "kafedra_id",
    label: "Kafedra",
    url: "kafedras",
    permission: "kafedra_index",
    child_names: ["subject_id"],
    span: { xs: 24, sm: 24, md: 12, lg: 8, xl: 6 },
  },
  {
    name: "subject_id",
    label: "Subject",
    url: "subjects",
    permission: "subject_index",
    parent_name: "kafedra_id",
    span: { xs: 24, sm: 24, md: 12, lg: 8, xl: 6 },
  },
  {
    name: "exam_type_id",
    label: "Exam types",
    url: "exams-types",
    permission: "exams-type_index",
    span: { xs: 24, sm: 24, md: 12, lg: 8, xl: 6 },
  },
]

const formData: TypeFormUIData[] = [
  {
    name: "kafedra_id",
    label: "Kafedra",
    type: "select",
    url: `kafedras`,
    required: true,
    span: 24,
    render: (e) => `${e?.name}`,
    child_names: ["subject_id"]
  },
  {
    name: "subject_id",
    label: "Subject",
    type: "select",
    url: `subjects`,
    required: true,
    expand: 'semestr, eduForm',
    span: 24,
    parent_name: "kafedra_id",
    render: (e) => `${e?.name} ${e?.eduForm?.name} ${e?.semestr?.name}`
  },
  {
    name: "exam_type_id",
    label: "Exam types",
    url: "exams-types",
    required: true,
    type: "select",
    span: 24,
  },
];

const Tests: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const [testId, settestId] = useState<number>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [test_file, settest_file] = useState<any>();
  const [form] = Form.useForm();

  const navigate = useNavigate();

  const { urlValue } = useUrlQueryParams({
    currentPage: 1,
    perPage: 10,
  });

  const { data: examTypes, isFetching } = useGetData({
    queryKey: ["exams-types"],
    urlParams: { sort: "order" },
    url: "exams-types"
  });

  const { data, isLoading, refetch } = useGetAllData<ITestQuestion>({
    queryKey: ["tests", urlValue.perPage, urlValue.currentPage, urlValue.filter.subject_id, urlValue.filter?.exam_type_id],
    urlParams: { "per-page": urlValue.perPage, page: urlValue.currentPage, filter: { subject_id: urlValue.filter?.subject_id, exam_type_id: urlValue.filter?.exam_type_id, type: 2 } },
    url: `tests?sort=-id&expand=options,examsType,subject`,
  });

  const { mutate, isLoading: statusLoading } = useMutation({
    mutationFn: (newVals: { idd: number, is_checked: number }) => updateExamTestStatus(newVals.idd, newVals.is_checked),
    onSuccess: async (res) => {
      refetch()
      Notification("success", "update", res?.message)
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", "update", error?.response?.data ? error?.response?.data?.message : "");
    },
    retry: 0,
  });

  const { mutate: importExamTest } = useMutation({
    mutationFn: ({ file, exam_type_id }: { file: any, exam_type_id?: number }) => importExamTestToExcel(undefined, file, exam_type_id),
    onSuccess: async (res) => {
      refetch();
      Notification("success", "create", res?.message)
      setIsModalOpen(false)
    },
    onError: (error: AxiosError) => {
      message.error(`${t('Data retrieval error')}`)
    },
    retry: 0,
  });

  return (
    <div className="">
      <HeaderExtraLayout title={`Tests`} isBack
        breadCrumbData={[
          { name: "Home", path: '/' },
          { name: "Tests", path: 'Tests' }
        ]}
        btn={
          <div className="flex justify-end items-center mb-3">
            {/* <>
            <input type="file" accept=".xls,.xlsx" onChange={(e) => importExamTest({id: id ?? "", file: e?.target?.files ? e.target.files[0] ?? "" : ""})} className="hidden" style={{ display: "none" }} id="excel_import" />
            <label htmlFor="excel_import" className="d-f cursor-pointer text-[#52C41A] rounded-lg border border-solid border-[#52C41A] px-3 py-1" >
            <ArrowUploadFilled fontSize={16} color="#52C41A" />&nbsp;&nbsp;Import excel
            </label>
          </> */}
            { checkPermission("test_create") ? <Button onClick={() => setIsModalOpen(true)}>{t('Test import')}</Button> : null}
            <CreateBtn
              onClick={() => navigate(`/tests/create`)}
              permission={"test_create"}
              className='ml-3'
              text='Test create'
            />
          </div>
        }
      />
      <Row gutter={[12, 12]} className="my-3 px-4">
        {selectData?.map((e, i) => (
          <FilterSelect
            key={i}
            url={e.url}
            name={e.name}
            label={e.label}
            permission={e.permission}
            parent_name={e?.parent_name}
            child_names={e?.child_names}
            value_name={e?.value_name}
            render={e?.render}
            span={e.span}
          />
        ))}
      </Row>
      <Spin spinning={isLoading} size="small">
        <div className="px-4 pb-5 pt-2">
          {
            data?.items?.map((item, index) => (
              <div key={item?.id} className='bg-zinc-50 p-3 rounded-md mb-5 hover:shadow-lg relative test-list-actions-wrapper'>
                <div className='d-f absolute top-3 right-3 p-1 bg-zinc-50 test-list-actions'>
                  <div className="mr-4">
                    <p className="text-black opacity-50 text-xs">{t("Subject")}:</p>
                    <b>{item?.subject?.name}</b>
                  </div>
                  <div className="mr-4">
                    <p className="text-black opacity-50 text-xs">{t("Exam type")}:</p>
                    <b>{examTypes?.items?.find(e => e?.id === item?.exam_type_id)?.name}</b>
                  </div>
                  {checkPermission("test_is-check") ? <Switch className='mt-1' checked={item?.is_checked == 1} onChange={(e) => { mutate({ idd: item?.id, is_checked: e ? 1 : 0 }); settestId(item?.id) }} loading={testId == item?.id && statusLoading} defaultChecked /> : ""}
                  <DeleteData
                    permission={"test_delete"}
                    refetch={refetch}
                    url={"tests"}
                    id={item?.id}
                  >
                    <Button type="primary" className="mx-2" danger ghost>
                      <Delete16Filled className="text-red-500" />
                    </Button>
                  </DeleteData>
                  {checkPermission("test_view") ? <Button onClick={() => navigate(`/tests/view/${item?.id}`)} ><Eye20Filled className="view" /></Button> : ""}
                </div>
                <p className='flex items-center'>
                  <Avatar style={{ color: '#000', backgroundColor: '#eeeeee' }} className='mr-2'>{number_order(urlValue.currentPage, urlValue.perPage, Number(index), isLoading)}</Avatar>
                  <p dangerouslySetInnerHTML={{ __html: item?.text ?? "" }} />
                </p>
                {item?.file ? <img width={200} className='ml-[50px] mt-4' src={FILE_URL + item?.file} alt="" /> : ""}
                <div className='pl-5 pt-4'>
                  {
                    item?.options?.map(option => (
                      <div key={option?.id} className={`bg-[#f0f0f0] p-3 rounded-md mb-3`}>
                        <p dangerouslySetInnerHTML={{ __html: option?.text ?? "" }} />
                        {option?.file ? <img width={120} className='mt-2' src={FILE_URL + option?.file} alt="" /> : ""}
                      </div>
                    ))
                  }
                </div>
              </div>
            ))
          }
          {(data?._meta?.totalCount ?? 0) > 10 ? (
            <CustomPagination
              totalCount={data?._meta.totalCount}
              currentPage={urlValue.currentPage}
              perPage={urlValue.perPage}
            />
          ) : <Empty />}
        </div>
        <Modal title={t("Exam test")} open={isModalOpen} onOk={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)} footer={false}>
          <Form
            form={form}
            layout="vertical"
            onFinish={(vals: any) => importExamTest({ exam_type_id: vals?.exam_type_id, file: test_file })}
            className='my-4'
          >
            <FormUIBuilder data={formData} form={form} />
            <Form.Item
              label={t("Document file")}
              name='passport_file'
              className='w-[100%] mb-4'
              rules={[{ required: false, message: `Please upload file` }]}
            >
              <>
                <input type="file" accept=".xls,.xlsx" onChange={(e: any) => { settest_file(e.target.files[0]); console.log(e.target.files[0]?.name) }} className="hidden" style={{ display: "none" }} id="excel_import" />
                <label htmlFor="excel_import" className="d-f cursor-pointer text-[#52C41A] rounded-lg border border-solid border-[#52C41A] px-3 py-1" >
                  <ArrowUploadFilled fontSize={16} color="#52C41A" />&nbsp;&nbsp;Import excel
                </label>
                {test_file?.name}
              </>
            </Form.Item>
            <div className="flex justify-end">
              <Button htmlType='submit' loading={statusLoading}>{t("Save")}</Button>
            </div>
          </Form>
        </Modal>
      </Spin>
    </div>
  );
};

export default Tests;


/**
  * test_index
  * test_delete
  * test_update
  * test_view
*/