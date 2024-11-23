import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { Row, Switch, Table, Tag } from "antd";
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
import { useMutation } from '@tanstack/react-query';
import { Notification } from 'utils/notification';
import { AxiosError } from 'axios';
import { finalExamStatusCheck } from './crud/requests';
import { IFinalExam } from 'models/exam';

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
]

const dateParserToDatePicker = (second: number | undefined) => dayjs((new Date(Number(second)*1000))).format('DD-MM-YYYY HH:mm')


const FinalExamControl: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const [allData, setAllData] = useState<IFinalExam[]>([]);
  const [selectedId, setselectedId] = useState<number>();
  const { urlValue } = useUrlQueryParams({ currentPage: 1, perPage: 15 });
  const navigate = useNavigate()

  const { data, refetch, isLoading } = useGetAllData<IFinalExam>({
    queryKey: ["exams", urlValue.perPage, urlValue.currentPage, urlValue?.filter],
    url: "exams?sort=-id&expand=subject,direction,faculty",
    urlParams: { "per-page": urlValue.perPage, page: urlValue.currentPage, filter: JSON.stringify(urlValue?.filter) },
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
      onSuccess: (res) => {
        setAllData(res?.items);
      }
    }
  })

  const { mutate, isLoading: checkLoading } = useMutation({
    mutationFn: (newVals: {status: number, id: number, order: 1 | 2 | 3 | 4 | 5}) => finalExamStatusCheck(newVals?.id, newVals?.status, newVals.order),
    onSuccess: async (res) => {
      Notification("success", "update", res?.message)
      refetch()
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", "update", error?.response?.data ? error?.response?.data?.message : "");
    },
    retry: 0,
  });

  const columns: ColumnsType<IFinalExam> = React.useMemo(() => [
    {
      title: '№',
      dataIndex: 'order',
      render: (_, __, i) => number_order(urlValue.currentPage, urlValue.perPage, Number(i), isLoading),
      width: 45,
    },
    {
      title: t('Name'),
      dataIndex: 'name',
      render: (_subject, e) => checkPermission("exam_view") ? <Link to={`/final-exam-controls/view/${e?.id}`} className="text-[#000] underline">{e?.name}</Link> : e?.name
    },
    {
      title: t('Faculty'),
      dataIndex: 'faculty',
      render: (faculty,_e) => faculty?.name
    },
    {
      title: t('Direction'),
      dataIndex: 'direction',
      render: (direction,_e) => direction?.name
    },
    {
      title: t('Date'),
      width: 300,
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
      render: (e) => <Tag>{EXAMCONTROLTYPES?.find(i => i?.id === e)?.name}</Tag>,
    },
    {
      title: t('Max ball'),
      dataIndex: 'max_ball'
    },
    checkPermission("exam_update") ? {
      title: t('Confirmation'),
      render: (e) => e?.status < 2 ? <Switch 
                        disabled={e?.status !== 1 && e?.status !== 0} 
                        loading={selectedId == e?.id && checkLoading} 
                        checked={e?.status === 1 || e?.status === 2 || e?.status === 3 || e?.status === 4 || e?.status === 5} 
                        onChange={(event) => {
                          mutate({id: e?.id, status: event ? 1 : 0, order: 1});
                          setselectedId(e?.id)
                        }} 
                      /> : <Tag color='success'>Tasdiqlangan</Tag>,
      align: "center",
    }: {},
    checkPermission("exam_exam-check") ? {
      title: t('Imtihonni e\'lon qilish'),
      render: (e) => e?.status < 3 ? <Switch 
                        disabled={e?.status !== 1 && e?.status !== 2} 
                        loading={selectedId == e?.id && checkLoading} 
                        checked={e?.status === 2 || e?.status === 3 || e?.status === 4 || e?.status === 5} 
                        onChange={(event) => {
                          mutate({id: e?.id, status: event ? 2 : 1, order: 2});
                          setselectedId(e?.id)
                        }} 
                      /> : <Tag color='success'>E'lon qilingan</Tag>,
      align: "center",
    }: {},
    checkPermission("exam_exam-finish") ? {
      title: t('Imtihonni yakunlash'),
      render: (e) => e?.status < 4 ? <Switch 
                      disabled={e?.status !== 2 && e?.status !== 3} 
                      loading={selectedId == e?.id && checkLoading} 
                      checked={e?.status === 3 || e?.status === 4 || e?.status === 5} 
                      onChange={(event) => {
                        mutate({id: e?.id, status: event ? 3 : 2, order: 3});
                        setselectedId(e?.id)
                      }} 
                    /> : <Tag color='success'>Imtihon yakunlangan</Tag>,
      align: "center",
    }: {},
    checkPermission("exam_allotment") ? {
      title: t('Taqsimlash'),
      render: (e) => e?.status < 5 ? <Switch 
                      disabled={e?.status !== 3 && e?.status !== 4} 
                      loading={selectedId == e?.id && checkLoading} 
                      checked={e?.status === 4 || e?.status === 5} 
                      onChange={(event) => {
                        mutate({id: e?.id, status: event ? 4 : 3, order: 4});
                        setselectedId(e?.id)
                      }} 
                    /> : <Tag color='success'>Taqsimlangan</Tag>,
      align: "center",
    }: {},
    checkPermission("exam_exam-notify") ? {
      title: t('Natijani elon qilish'),
      render: (e) => e?.status < 6 ? <Switch 
                      disabled={e?.status !== 4 && e?.status !== 5} 
                      loading={selectedId == e?.id && checkLoading} 
                      checked={e?.status === 5} 
                      onChange={(event) => {
                        mutate({id: e?.id, status: event ? 5 : 4, order: 5});
                        setselectedId(e?.id)
                      }} 
                    /> : <Tag color='success'>Natijani elon qilingan</Tag>,
      align: "center",
    }: {},
    {
      title: t("Actions"),
      dataIndex: 'actions',
      width: 120,
      align: "center",
      render: (_i, e) => <Actions
        id={e?.id}
        url={'exams'}
        refetch={refetch}
        onClickEdit={() => navigate(`/final-exam-controls/update/${e?.id}`)}
        onClickView={() => navigate(`/final-exam-controls/view/${e?.id}`)}
        viewPermission={'exam_view'}
        editPermission={e?.status === 0 ?"exam_update" : "not_permission"}
        deletePermission={"exam_delete"}
      />,
    },
  ], [data?.items, urlValue]);

  return (
    <div className="">
      <HeaderExtraLayout title={`Final exam control`}
        breadCrumbData={[
          { name: "Home", path: '/' },
          { name: "Final exam control", path: 'final-exam-controls' }
        ]}
        btn={
          <div className='flex'>
            {checkPermission("exam_create") ? <CreateBtn onClick={() => { navigate("/final-exam-controls/create") }} permission={"exam_create"} /> : null}
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
          scroll={{x: 2000}}
        />
        {(data?._meta?.totalCount ?? 0) > 10 ? <CustomPagination totalCount={data?._meta.totalCount} currentPage={urlValue.currentPage} perPage={urlValue.perPage} /> : undefined}
      </div>
    </div>
  );
};

export default FinalExamControl;


/**
  * exam_index
  * exam_delete
  * exam_update
  * exam_view
  * exam_create
*/