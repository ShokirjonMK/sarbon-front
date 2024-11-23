import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { Row, Table, Tag } from "antd";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { CreateBtn } from "components/Buttons";
import { globalConstants } from 'config/constants';
import FilterSelect, { TypeFilterSelect } from 'components/FilterSelect';
import Actions from 'components/Actions';
import StatusTag from 'components/StatusTag';
import { ColumnsType } from 'antd/es/table';
import checkPermission from 'utils/check_permission';
import { Link, useNavigate } from 'react-router-dom';
import { number_order } from 'utils/number_orders';
import useGetAllData from 'hooks/useGetAllData';
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import CustomPagination from 'components/Pagination';
import dayjs from 'dayjs';
import { EXAMCONTROLTYPES } from 'config/constants/staticDatas';
import { renderFullName } from 'utils/others_functions';

const selectData: TypeFilterSelect[] = [
  {
    name: "faculty_id",
    label: "Faculty",
    url: "faculties",
    permission: "faculty_index",
    child_names: ["direction_id", "direction_id", "edu_plan_id", "group_id"],
    span: { xs: 24, sm: 24, md: 12, lg: 6, xl: 6 }
  },
  {
    name: "direction_id",
    label: "Direction",
    url: "directions",
    permission: "direction_index",
    parent_name: "faculty_id",
    child_names: ["edu_plan_id", "group_id"],
    span: { xs: 24, sm: 24, md: 12, lg: 6, xl: 6 }
  },
  {
    name: "edu_plan_id",
    label: "Edu plan",
    url: "edu-plans",
    permission: "edu-plan_index",
    parent_name: "direction_id",
    child_names: ["group_id"],
    span: { xs: 24, sm: 24, md: 12, lg: 6, xl: 6 }
  },
  {
    name: "group_id",
    label: "Group",
    url: "groups",
    render: (e) => e?.unical_name,
    permission: "group_index",
    parent_name: "edu_plan_id",
    span: { xs: 24, sm: 24, md: 12, lg: 6, xl: 6 }
  },
]

const dateParserToDatePicker = (second: number | undefined) => dayjs((new Date(Number(second)*1000))).format('DD-MM-YYYY HH:mm')


const ExamControl: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const [allData, setAllData] = useState<any[]>([]);
  const { urlValue } = useUrlQueryParams({ currentPage: 1, perPage: 15 });
  const navigate = useNavigate()

  const { data, refetch, isLoading } = useGetAllData({
    queryKey: ["exam-controls", urlValue.perPage, urlValue.currentPage, urlValue?.filter],
    url: "exam-controls?sort=-id&expand=subject,group,user",
    urlParams: { "per-page": urlValue.perPage, page: urlValue.currentPage, filter: JSON.stringify(urlValue?.filter) },
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
      onSuccess: (res) => {
        setAllData(res?.items);
      }
    }
  })

  const columns: ColumnsType<any> = React.useMemo(() => [
    {
      title: '№',
      dataIndex: 'order',
      render: (_, __, i) => number_order(urlValue.currentPage, urlValue.perPage, Number(i), isLoading),
      width: 45,
    },
    {
      title: t('Name'),
      dataIndex: 'name',
      render: (subject, e) => checkPermission("exam-control_view") ? <Link to={`/exam-controls/view/${e?.id}`} className="text-[#000] underline">{e?.name}</Link> : e?.name
    },
    {
      title: t('Group'),
      dataIndex: 'group',
      render: (group,e) => group?.unical_name
    },
    {
      title: t('Teacher'),
      dataIndex: 'user',
      render: (e) => <span>{renderFullName(e)}</span>
    },
    {
      title: t('Date'),
      render: (e) => <span>{dateParserToDatePicker(e?.start_time)} - {dateParserToDatePicker(e?.finish_time)}</span>
    },
    {
      title: t('Duration'),
      dataIndex: "duration",
      render: (e) => <span>{e} - minut</span>,

    },
    {
      title: t('Type'),
      dataIndex: 'type',
      render: (e) => <Tag>{EXAMCONTROLTYPES?.find(i => i?.id === e)?.name}</Tag>
,
    },
    {
      title: t('Max ball'),
      dataIndex: 'max_ball'
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
        url={'exam-controls'}
        refetch={refetch}
        onClickEdit={() => navigate(`/exam-controls/update/${e?.id}`)}
        onClickView={() => navigate(`/exam-controls/view/${e?.id}`)}
        viewPermission={'exam-control_view'}
        editPermission={"exam-control_update"}
        deletePermission={"exam-control_delete"}
      />,
    },
  ], [data?.items]);

  return (
    <div className="">
      <HeaderExtraLayout title={`Exam control`}
        breadCrumbData={[
          { name: "Home", path: '/' },
          { name: "Exam control", path: 'exam-controls' }
        ]}
        btn={
          <div className='flex'>
            <CreateBtn onClick={() => { navigate("/exam-controls/create") }} permission={"exam-control_create"} />
          </div>
        }
      />

      <div className="px-[24px] py-[20px]">
        <Row gutter={[12, 12]}>
          {
            selectData?.map((e, i) => (
              <FilterSelect key={i} {...e} />
            ))
          }
        </Row>

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
    </div>
  );
};

export default ExamControl;


/**
  * exam-control_index
  * exam-control_delete
  * exam-control_update
  * exam-control_view
*/