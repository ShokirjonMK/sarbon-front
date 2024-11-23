import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { Row, Table, Tag } from "antd";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import FilterSelect, { TypeFilterSelect } from 'components/FilterSelect';
import { ColumnsType } from 'antd/es/table';
import checkPermission from 'utils/check_permission';
import { Link } from 'react-router-dom';
import { number_order } from 'utils/number_orders';
import useGetAllData from 'hooks/useGetAllData';
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import CustomPagination from 'components/Pagination';
import dayjs from 'dayjs';
import { EXAMCONTROLTYPES } from 'config/constants/staticDatas';
import { IFinalExam } from 'models/exam';
import useGetData from 'hooks/useGetData';

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


const FinalExamChecking: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const [allData, setAllData] = useState<IFinalExam[]>([]);
  const { urlValue } = useUrlQueryParams({ currentPage: 1, perPage: 15 });

  const { data, isLoading } = useGetData<IFinalExam>({
    queryKey: ["exams", urlValue.perPage, urlValue.currentPage, urlValue?.filter],
    url: "exams?sort=-id&expand=subject,direction,faculty,examStudentsCount,examStudentsCheckCount",
    urlParams: { "per-page": urlValue.perPage, page: urlValue.currentPage, filter: JSON.stringify(urlValue?.filter) },
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
      onSuccess: (res) => {
        setAllData(res?.items);
      }
    }
  })

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
      render: (_, e) => checkPermission("exam_view") ? <Link to={`/final-exam-checking/${e?.id}`} className="text-[#000] underline">{e?.name}</Link> : e?.name
    },
    {
      title: t('Subject'),
      dataIndex: 'subject',
      render: (_) => _?.name
    },
    {
      title: t('Talaba ishlari'),
      render: (_) => <><Tag className='text-[15px]'>{_?.examStudentsCheckCount ? _?.examStudentsCheckCount : "_"} / {_?.examStudentsCount ? _?.examStudentsCount : "_"}</Tag></>
    },
    {
      title: t('Status'),
      render: (e) => {
                      return <Tag className='text-[16px] p-1' color={
                              e.status === 0 ? "error" 
                              : e.status === 1 ? "warning"
                              : e.status === 2 ? "success"
                              : e.status === 3 ? "success"
                              : e.status === 4 ? "error"
                              : e.status === 5 ? "error"  :"" 
                                }>{e.status === 0 ? "Tasdiqlanmagan" 
                                      : e.status === 1 ? "Tasdiqlangan"
                                      : e.status === 2 ? "E'lon qilingan"
                                      : e.status === 3 ? "Imtihon yakunlangan"
                                      : e.status === 4 ? "Talaba ishlari O'qituvchilarga taqsimlangan"
                                      : e.status === 5 ? "Natijalar e'lon qilingan"  :"" }
                              </Tag>}
    },
    {
      title: t('Date'),
      width: 150,
      render: (e) => <span>{dateParserToDatePicker(e?.finish_time)}</span>
    },
    {
      title: t('Type'),
      dataIndex: 'type',
      render: (e) => <Tag>{EXAMCONTROLTYPES?.find(i => i?.id === e)?.name}</Tag>,
    },
  ], [data?.items, urlValue]);

  return (
    <div className="">
      <HeaderExtraLayout title={`Final exam checking`}
        breadCrumbData={[
          { name: "Home", path: '/' },
          { name: "Final exam checking", path: '/final-exam-checking' }
        ]}
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
          scroll={{x: 1000}}
        />
        {(data?._meta?.totalCount ?? 0) > 10 ? <CustomPagination totalCount={data?._meta.totalCount} currentPage={urlValue.currentPage} perPage={urlValue.perPage} /> : undefined}
      </div>
    </div>
  );
};

export default FinalExamChecking;


/**
  * exam-student-question_update-ball
*/