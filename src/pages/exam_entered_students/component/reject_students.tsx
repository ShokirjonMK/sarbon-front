import { Tag } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import CustomPagination from 'components/Pagination';
import SearchInputWithoutIcon from 'components/SearchInput/searchInputWithoutIcon';
import { globalConstants } from 'config/constants';
import useGetAllData from 'hooks/useGetAllData';
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import { IStudent } from 'models/student';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom';
import checkPermission from 'utils/check_permission';
import { number_order } from 'utils/number_orders';

const RejectExamStudents : React.FC = () : JSX.Element => {
  const {t} = useTranslation()
  const {edu_plan_id, edu_semestr_subject_id} = useParams()
  const { urlValue, writeToUrl } = useUrlQueryParams({
    currentPage: 1,
    perPage: 10,
  });
  const [searchVal, setSearchVal] = useState<string>("");
  const [allData, setallData] = useState<IStudent[]>();

  const [first_name, setfirst_name] = useState<string>("");
  const [last_name, setlast_name] = useState<string>("");
  const [middle_name, setmiddle_name] = useState<string>("");
  const [passport_pin, setpassport_pin] = useState<string>("");

  const { data, isLoading } = useGetAllData<IStudent>({
    queryKey: ["student-marks",urlValue.perPage, urlValue.currentPage, urlValue.filter_like?.sort, searchVal, ...(Object.values(urlValue?.filter) ?? []), first_name,last_name,middle_name,passport_pin],
    url: `student-marks?expand=subject,examTypefilter,student,student.profile,student.course,student.group&filter={"edu_plan_id":${edu_plan_id}, "edu_semestr_subject_id":${edu_semestr_subject_id},"exam_type_id":3,"status":0}&filter-like=${JSON.stringify({ first_name,last_name,middle_name,passport_pin})}`,
    urlParams: {"per-page": urlValue.perPage, page: urlValue.currentPage, sort: urlValue.filter_like?.sort ?? "-id", query: searchVal },
    options: {
      refetchOnWindowFocus: false,
      retry: 1,
      onSuccess: (res) => {
        setallData(res?.items);
      },
    },
  });

  const columns: ColumnsType<any> = React.useMemo(() => [
    {
      title: '№',
      dataIndex: 'order',
      render: (_, __, i) => number_order(urlValue.currentPage, urlValue.perPage, Number(i), isLoading),
      width: 45,
    },
    {
      title: t('Last name'),
      dataIndex: 'last_name',
      children: [
        {
          title: <SearchInputWithoutIcon setSearchVal={setlast_name} duration={globalConstants.debounsDuration} filterKey="last_name" placeholder={`${t("Search by last name")}...`} />,
          render: (i,e) =>
            checkPermission("student-mark_view") ? (
              <span>{e?.student?.profile?.last_name} </span>) : (<span>{e?.student?.profile?.last_name}</span>),
        }
      ]
    },
    {
      title: t('First name'),
      dataIndex: 'first_name',
      children: [
        {
          title: <SearchInputWithoutIcon setSearchVal={setfirst_name} duration={globalConstants.debounsDuration} filterKey="first_name" placeholder={`${t("Search by name")}...`} />,
          render: (i,e) =>
            checkPermission("student-mark_view") ? (
              <span>{e?.student?.profile?.first_name} </span>) : (<span>{e?.student?.profile?.first_name}</span>),
        }
      ]
    },
    {
      title: t('Middle name'),
      dataIndex: 'middle_name',
      children: [
        {
          title: <SearchInputWithoutIcon setSearchVal={setmiddle_name} duration={globalConstants.debounsDuration} filterKey="middle_name" placeholder={`${t("Search by middle name")}...`} />,
          render: (i,e) =>
            checkPermission("student-mark_view") ? (
              <span>{e?.student?.profile?.middle_name} </span>) : (<span>{e?.student?.profile?.middle_name}</span>),
        }
      ]
    },
    {
      title: t('JSHSHIR'),
      children: [
        {
          dataIndex: 'passort_pin',
          title: <SearchInputWithoutIcon type="number" setSearchVal={setpassport_pin} duration={globalConstants.debounsDuration} filterKey="passport_pin" placeholder={`${t("Search by JSHSHIR")}...`} />,
          render: (i, e) => <span>{e?.student?.profile?.passport_pin}</span>,
        }
      ]
    },
    {
      title: t('Course'),
      dataIndex: 'course',
      children: [
        {
          title: '',
          render: (group,e) => e?.student?.course?.name
        }
      ]
    },
    {
      title: t('Group'),
      dataIndex: 'group',
      children: [
        {
          title: '',
          render: (group,e) => e?.student?.group?.unical_name
        }
      ]
    },
    {
      title: t('Subject'),
      dataIndex: 'subject_id',
      children: [
        {
          title: '',
          render: (group,e) => e?.subject?.name
        }
      ]
    },
    {
      title: t('Max ball'),
      dataIndex: 'max_ball',
      children: [
        {
          title: '',
          render: (ball,e) => e?.max_ball
        }
      ]
    },
    {
      title: t('Status'),
      align: "center",
      children: [
        {
          title: '',
          align: "center",
          render: (i,e) => e?.status === 0 ? <Tag color='red'>Taqiqlangan</Tag> : null,
        }
      ]
    },
  ], [data?.items]);

  return(
    <div className='py-2 px-6'>
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
  )
}

export default RejectExamStudents