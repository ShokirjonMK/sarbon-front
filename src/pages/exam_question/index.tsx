import React, {useState} from "react";
import useGetAllData from "hooks/useGetAllData";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import { useTranslation } from "react-i18next";
import StatusTag from "components/StatusTag";
import Table, { ColumnsType } from "antd/es/table";
import { number_order } from "utils/number_orders";
import checkPermission from "utils/check_permission";
import { Link, useNavigate } from "react-router-dom";
import Actions from "components/Actions";
import { globalConstants } from "config/constants";
import CustomPagination from "components/Pagination";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { CreateBtn } from "components/Buttons";
import { FILE_URL } from "config/utils";
import { DocumentText24Regular } from "@fluentui/react-icons";
import { Col, Row, Select, Switch, Tag } from "antd";
import { IExamQuestions } from "models/exam";
import { useMutation } from "@tanstack/react-query";
import { updateExamTestStatus } from "pages/exam_subject_tests/crud/request";
import { Notification } from "utils/notification";
import { AxiosError } from "axios";
import FilterSelect, { TypeFilterSelect } from "components/FilterSelect";


const selectData: TypeFilterSelect[] = [
  {
    name: "exam_type_id",
    label: "Exam type",
    url: "exams-types",
    permission: "exams-type_index",
  },
];

const ExamQuestions : React.FC = () : JSX.Element => {
  const {t} = useTranslation()
  const [allData, setAllData] = useState<any[]>([]);
  const navigate = useNavigate()
  const [testId, settestId] = useState<number>();
  const { urlValue, writeToUrl } = useUrlQueryParams({
    currentPage: 1,
    perPage: 10,
  });

  const { data, isLoading, refetch } = useGetAllData({
    queryKey: ["tests", urlValue.perPage, urlValue.currentPage, urlValue?.filter],
    url: "/tests?sort=-id&expand=language,subject,examType",
    urlParams: { "per-page": urlValue.perPage, page: urlValue.currentPage, filter: JSON.stringify({...(urlValue?.filter ?? {}), type: 1,}) },
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
      onSuccess: (res) => {
        setAllData(res?.items);
      }
    }
  })

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
      render: (question, e) => checkPermission("test_view") ? <Link to={`/exam-questions/view/${e?.id}`} className="text-[#000] underline"><div className="line-clamp-3 text-sm" dangerouslySetInnerHTML={{ __html: e?.text }} /></Link> : e?.text
    },
    {
      title: t('Subject'),
      dataIndex: 'subject',
      render: (subject,e) => e?.subject?.name
    },
    {
      title: t('File'),
      dataIndex: 'file',
      width: 140,
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
      title: t('Question type'),
      dataIndex: 'type',
      render: (language,e) => e?.type === 1 ? <Tag>Yozma</Tag> : e?.type === 2 ? <Tag>Test</Tag> : null
    },
    {
      title: t('Confirm'),
      render: (language,a) => <div>
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
        onClickEdit={() => navigate(`/exam-questions/update/${e?.id}`)}
        onClickView={() => navigate(`/exam-questions/view/${e?.id}`)}
        viewPermission={'test_view'}
        editPermission={"test_update"}
        deletePermission={"test_delete"}
      />,
    },
  ], [data?.items]);

  const [selectedOption, setSelectedOption] = useState<string>('all');
  const handleChange = (value: string) => {
    setSelectedOption(value);
  };

  const getFilteredData = () => {
    if (selectedOption === 'checked') {
      return data?.items.filter(item => item.is_checked === 1);
    } else if (selectedOption === 'unchecked') {
      return data?.items.filter(item => item.is_checked === 0);
    }
    return data?.items;
  };

  return(
    <div>
      <HeaderExtraLayout title={`Exam questions`}
        breadCrumbData={[
          { name: "Home", path: '/' },
          { name: "Exam questions", path: '' }
        ]}
        btn={
          <div className='flex'>
            <CreateBtn onClick={() => { navigate("/exam-questions/create") }} permission={"test_create"} />
          </div>
        }
      />
      <div className="py-3 px-6">
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <Select value={selectedOption} onChange={handleChange} style={{width: '100%'}}>
              <Select.Option value="all">Hammasi</Select.Option>
              <Select.Option value="checked">Tasdiqlangan</Select.Option>
              <Select.Option value="unchecked">Tasdiqlanmagan</Select.Option>
            </Select>
          </Col>
          {selectData?.map((e, i) => (
            <Col key={i} xs={24} sm={24} md={12} lg={8} xl={8}>
              <FilterSelect
                url={e.url}
                name={e.name}
                label={e.label}
                permission={e.permission}
                parent_name={e?.parent_name}
                child_names={e?.child_names}
                value_name={e?.value_name}
                span={{ xs: 24, sm: 24, xl: 24, lg: 24 }}
              />
            </Col>
          ))}
        </Row>
        <Table
          columns={columns}
          dataSource={getFilteredData()}
          pagination={false}
          loading={isLoading}
          size="middle"
          className="mt-3"
          rowClassName="py-[12px]"
          scroll={globalConstants?.tableScroll}
        />
        {(data?._meta?.totalCount ?? 0) > 10 ? <CustomPagination totalCount={data?._meta.totalCount} currentPage={urlValue.currentPage} perPage={urlValue.perPage} /> : undefined}
      </div>
    </div>
  )
}

export default ExamQuestions