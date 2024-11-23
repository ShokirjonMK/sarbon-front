import React, { useState } from 'react'
import Table, { ColumnsType } from 'antd/es/table';
import { IStudent, IStudentAttendReason } from 'models/student';
import HeaderExtraLayout from 'components/HeaderPage/headerExtraLayout';
import UploadingReference from './upload-reference';
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import useGetAllData from 'hooks/useGetAllData';
import { number_order } from 'utils/number_orders';
import checkPermission from 'utils/check_permission';
import { useNavigate } from 'react-router-dom';
import CustomPagination from 'components/Pagination';
import { Popover, Row, Tooltip } from 'antd';
import FilterSelect, { TypeFilterSelect } from 'components/FilterSelect';
import { Delete16Filled, DocumentArrowRight24Regular, Edit16Filled, Eye16Filled } from '@fluentui/react-icons';
import DeleteData from 'components/deleteData';
import CheckingReference from './checking';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { FILE_URL } from 'config/utils';

const selectData: TypeFilterSelect[] = [
  {
    name: "faculty_id",
    label: "Faculty",
    url: "faculties",
    permission: "faculty_index",
    child_names: ["edu_plan_id"],
    span: { xl: 8, lg: 12 }
  },
  {
    name: "edu_plan_id",
    label: "Edu plan",
    url: "edu-plans",
    permission: "edu-plan_index",
    parent_name: "faculty_id",
    span: { xl: 10, lg: 12 }
  },
  {
    name: "course_id",
    label: "Course",
    url: "courses",
    permission: "course_index",
    span: { xl: 6, lg: 12 }
  }
]

const dateParserToDatePicker = (second: number | undefined) => dayjs((new Date(Number(second)*1000))).format('YYYY-MM-DD HH:mm')

const CheckAttancesOld = () => {

  const navigate = useNavigate();
  const { t } = useTranslation();
  const { urlValue } = useUrlQueryParams({ currentPage: 1, perPage: 15 });
  const [allData, setAllData] = useState<IStudentAttendReason[]>([]);
  const [selectedItem, setselectedItem] = useState<IStudentAttendReason>();

  const { data, refetch, isLoading } = useGetAllData({
    queryKey: [urlValue.perPage, urlValue.currentPage, urlValue.filter_like?.sort, ...(Object.values(urlValue?.filter) ?? [])],
    url: `timetable-reasons?sort=-id&expand=student.profile,eduSemestr.semestr&filter=${JSON.stringify(urlValue.filter)}`,
    urlParams: { "per-page": urlValue.perPage, page: urlValue.currentPage, sort: urlValue.filter_like?.sort ?? "-id" },
    options: {
      onSuccess: (res) => {
        setAllData(res?.items);
        setselectedItem({} as IStudentAttendReason)
      }
    }
  })

  const columns: ColumnsType<IStudent> = React.useMemo(() => [
    {
      title: '№',
      width: 40,
      showSorterTooltip: false,
      render: (_, __, i) => number_order(urlValue.currentPage, urlValue.perPage, Number(i), isLoading),
    },
    {
      title: t('Last name'),
      showSorterTooltip: false,
      render: (e) =>
        checkPermission("student_view") ? (
          <span
            onClick={() => navigate(`/students/view/${e?.student?.id}`)}
            className="hover:text-[#0a3180] underline cursor-pointer"
          >{e?.student?.profile?.last_name} </span>
        ) : (<span>{e?.student?.profile?.last_name}</span>),
    },
    {
      title: t('First name'),
      showSorterTooltip: false,
      render: (e) =>
        checkPermission("student_view") ? (
          <span
            onClick={() => navigate(`/students/view/${e?.student?.id}`)}
            className="hover:text-[#0a3180] underline cursor-pointer"
          >{e?.student?.profile?.first_name} </span>
        ) : (<span>{e?.student?.profile?.first_name}</span>),
    },
    {
      title: t('Middle name'),
      showSorterTooltip: false,
      render: (e) =>
        checkPermission("student_view") ? (
          <span
            onClick={() => navigate(`/students/view/${e?.student?.id}`)}
            className="hover:text-[#0a3180] underline cursor-pointer"
          >{e?.student?.profile?.middle_name} </span>
        ) : (<span>{e?.student?.profile?.middle_name}</span>),
    },
    {
      title: t('Duration'),
      render: (e, i) => <span>{dateParserToDatePicker(e?.start)} - {dateParserToDatePicker(e?.end)}</span>,
    },
    {
      title: t('File'),
      render: (e, i) => <span>{e?.file ? <a href={FILE_URL + e?.file} target="_blank"><DocumentArrowRight24Regular /></a> : <p className="text-zinc-400">Fayl yuklanmagan</p>}</span>,
    },
    {
      title: t('Description'),
      width: 100,
      render: (e, i) => <Popover content={e?.description} title={t('Description')} >
          <span className='line-clamp-1'>{e?.description}</span>
        </Popover>,
    },
    {
      title: t('Status'),
      align: 'center',
      render: (e, i) => <CheckingReference selectedItem={e} refetch={refetch} />,
    },
    {
      title: t("Actions"),
      width: 120,
      align: "center",
      render: (i, e) => <div className='flex justify-center'>
        {checkPermission("timetable-reason_update") && i?.is_confirmed != 1 ? <Tooltip placement="topLeft" title={t("Edit")} className='mx-5'><Edit16Filled className="edit cursor-pointer" onClick={() => setselectedItem(i)} /></Tooltip> : ""}
        {i?.is_confirmed != 1 ? <Tooltip placement="left" title={t("Delete")}>
          <DeleteData permission={"timetable-reason_delete"} refetch={refetch} url={"timetable-reasons"} id={i?.id}><Delete16Filled className="text-[#595959] hover:cursor-pointer" /></DeleteData>
        </Tooltip> : ""}
      </div>,
    },
  ], [data?.items]);
  
  return (
    <>
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: "/" },
          { name: "Confirmation of student attendance", path: "" },
        ]}
        title={'Confirmation of student attendance'}
      />
      <div className='p-4'>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-9">
            <Row gutter={[12, 12]}>
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
                  span={e?.span}
                />
              ))}
            </Row>
            <Table
              columns={columns}
              dataSource={data?.items.length ? data?.items : allData}
              pagination={false}
              loading={isLoading}
              size="middle"
              className="mt-3"
              rowClassName="py-[12px]"
              scroll={{ x: 576 }}
            />
            {(data?._meta?.totalCount ?? 0) > 10 ? <CustomPagination totalCount={data?._meta.totalCount} currentPage={urlValue.currentPage} perPage={urlValue.perPage} /> : undefined}

          </div>
          {
            checkPermission("timetable-reason_create") ? 
            <div className="col-span-3">
              <UploadingReference selectedItem={selectedItem} setselectedItem={setselectedItem} refetch={refetch} />
            </div> : ""
          }
        </div>
      </div>
    </>
  )
}

export default CheckAttancesOld

/**
  *  timetable-reason_index
  *  timetable-reason_delete
  *  timetable-reason_create
  *  timetable-reason_update
*/