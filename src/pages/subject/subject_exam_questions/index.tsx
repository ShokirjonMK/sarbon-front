import { ColumnsType } from 'antd/es/table';
import { Switch, Table, Tag } from "antd";
import Actions from 'components/Actions';
import CustomPagination from 'components/Pagination';
import StatusTag from 'components/StatusTag';
import { globalConstants } from 'config/constants';
import useGetAllData from 'hooks/useGetAllData';
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import checkPermission from 'utils/check_permission';
import { number_order } from 'utils/number_orders';
import { DocumentText24Regular } from '@fluentui/react-icons';
import HeaderPage from 'components/HeaderPage';
import { IExamQuestions } from 'models/exam';
import { FILE_URL } from 'config/utils';
import { useMutation } from '@tanstack/react-query';
import { updateTestStatus } from 'pages/subject_topic_test/crud/request';
import { Notification } from 'utils/notification';
import { AxiosError } from 'axios';
import { updateExamTestStatus } from 'pages/exam_subject_tests/crud/request';

const SubjectExamQuestions: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const [allData, setAllData] = useState<any[]>([]);
  const {id} = useParams();
  const { urlValue } = useUrlQueryParams({ currentPage: 1, perPage: 15 });
  const navigate = useNavigate()
  const [testId, settestId] = useState<number>();

  const { data, refetch, isLoading } = useGetAllData({
    queryKey: ["tests", urlValue.perPage, urlValue.currentPage, urlValue?.filter],
    url: "tests?sort=-id&expand=language,examType",
    urlParams: { "per-page": urlValue.perPage, page: urlValue.currentPage, filter: {type: 1, subject_id: id} },
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
      onSuccess: (res) => {
        setAllData(res?.items);
      }
    }
  });

  const { mutate, isLoading: statusLoading } = useMutation({
    mutationFn: (newVals:{id: number, data: number}) => updateExamTestStatus(newVals.id, newVals.data),
    onSuccess: async (res) => {
      refetch()
      Notification("success", "update", res?.message)
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", "update", error?.response?.data ? error?.response?.data?.message : "");
    },
    retry: 0,
  });

  const columns: ColumnsType<IExamQuestions> = React.useMemo(() => [
    {
      title: '№',
      dataIndex: 'order',
      render: (_, __, i) => number_order(urlValue.currentPage, urlValue.perPage, Number(i), isLoading),
      width: 45,
    },
    {
      title: t('Question'),
      dataIndex: 'text',
      render: (question, e) => checkPermission("test_view") ? <Link to={`/exam-questions/view/${e?.id}`} className="text-[#000] underline"><div className="line-clamp-3 text-sm" dangerouslySetInnerHTML={{ __html: e?.text }} /></Link> : <div className="line-clamp-3 text-sm" dangerouslySetInnerHTML={{ __html: e?.text }} />
    },
    {
      title: t('File'),
      dataIndex: 'file',
      render: (i,e) => e?.file ? <a href={FILE_URL + e?.file} target='_blank'><DocumentText24Regular /></a> : "Fayl yuklanmagan"
    },
    {
      title: t('Language'),
      dataIndex: 'language',
      render: (language,e) => <Tag>{language?.name}</Tag>
    },
    {
      title: t('Exam type'),
      dataIndex: 'exam_type_id',
      width: 130,
      render: (language,e) => <span>{e?.examType?.name}</span>
    },
    {
      title: t('Confirm'),
      render: (i, a) => <div>
        <Switch className='mt-1' checked={a?.is_checked == 1} onChange={(e) => {mutate({id: a?.id, data: e ? 1 : 0}); settestId(a?.id)}} loading={testId == a?.id && statusLoading} disabled={!checkPermission("test_update")} defaultChecked />
      </div>
    },
    {
      title: t('Status'),
      render: (e) => <StatusTag status={e?.status} />,
      align: "center",
    },
    {
      title: t("Actions"),
      dataIndex: 'actions',
      width: 120,
      align: "center",
      render: (i, e) => <Actions
        id={e?.id}
        url={'tests'}
        refetch={refetch}
        onClickEdit={() => navigate(`/subject/exam-questions/update/${e?.id}?subject_id=${id}`)}
        onClickView={() => navigate(`/subject/exam-questions/view/${e?.id}?subject_id=${id}`)}
        viewPermission={'test_view'}
        editPermission={"test_update"}
        deletePermission={"test_delete"}
      />,
    },
  ], [data?.items]);

  return (
    <div className="px-3">
      <HeaderPage
        title={"Exam questions"}
        create_permission={"test_create"}
        createOnClick={() => { navigate(`/subject/exam-questions/create?subject_id=${id}`) }}
        className="mb-5"
        buttons={<></>}
      />

      <Table
        columns={columns}
        dataSource={data?.items.length ? data?.items : allData}
        pagination={false}
        loading={isLoading}
        size="middle"
        className="mt-3"
        rowClassName="py-[12px]"
        scroll={globalConstants?.tableScroll}
      />
      {(data?._meta?.totalCount ?? 0) > 10 ? <CustomPagination totalCount={data?._meta.totalCount} currentPage={urlValue.currentPage} perPage={urlValue.perPage} /> : undefined}
    </div>
  );
};

export default SubjectExamQuestions;