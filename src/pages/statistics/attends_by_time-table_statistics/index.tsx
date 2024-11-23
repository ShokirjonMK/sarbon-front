import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { Row, Table, TableColumnsType, Tag } from "antd";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import FilterSelect, { TypeFilterSelect } from 'components/FilterSelect';
import useGetAllData from 'hooks/useGetAllData';
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import dayjs from 'dayjs';
import CustomPagination from 'components/Pagination';
import "./style.scss"
import { renderFullName } from 'utils/others_functions';

const selectData: TypeFilterSelect[] = [
  {
    name: "edu_year_id",
    label: "Edu year",
    url: "edu-years",
    permission: "edu-year_index",
    filter: {},
    all: true,
    span: { xs: 24, sm: 24, md: 12, lg: 6, xl: 5 },
    render(e) {
        return <div>{e?.name} {e?.status === 1 ? <Tag className='ml-3' color='success'>Aktiv</Tag> : ""}</div>
    },
  },
  {
    name: "faculty_id",
    label: "Faculty",
    url: "faculties",
    permission: "faculty_index",
    child_names: ["edu_plan_id"],
    span: { xs: 24, sm: 24, md: 12, lg: 6, xl: 5 },
  },
  {
    name: "kafedra_id",
    label: "Kafedra",
    url: "kafedras",
    permission: "kafedra_index",
    parent_name: "faculty_id",
    span: { xs: 24, sm: 24, md: 12, lg: 8, xl: 6 },
  },
  // {
  //   name: "edu_semestr_id",
  //   label: "Edu semestr",
  //   url: "edu-semestrs?expand=semestr",
  //   permission: "edu-semestr_index",
  //   parent_name: "edu_plan_id",
  //   filter: { status: "all" },
  //   child_names: ["subject_id"],
  //   render: (e) => <div>{e?.semestr?.name} {e?.status == 1 ? <Tag color="green" className="ml-3">Active</Tag> : ""}</div>,
  //   span: { xs: 24, sm: 24, md: 12, lg: 6, xl: 4 },
  // },
];

const AttendsByTimetableStatistics: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { urlValue, writeToUrl } = useUrlQueryParams({ currentPage: 1, perPage: 20 });
  const [allData, setallData] = useState<any[]>();
  const [open, setOpen] = useState<boolean>(false)

  const { data: timeTable, refetch, isFetching } = useGetAllData({
    queryKey: ["timetables/user", urlValue.perPage, urlValue.currentPage, urlValue?.filter,],
    url: `timetables/user`,
    urlParams: {
      "per-page": urlValue.perPage,
      page: urlValue.currentPage,
      // filter: urlValue?.filter,
      edu_year_id: urlValue?.filter?.edu_year_id,
      expand: "teacherAccess.timetable.group,teacherAccess.timetable.all.group,teacherAccess.timetable.subject,teacherAccess.subject,teacherAccess.subjectCategory"
    },
    options: {
      refetchOnWindowFocus: false,
      retry: 1,
      onSuccess: (res) => {
        setallData(res?.items);
        setOpen(true);
      },
      // enabled: !!(urlValue?.filter?.group_id && urlValue?.filter?.subject_id), 
    },
  });

  const columns: TableColumnsType<any> = [
    { title: "O'qituvchi", key: 'name', render: (e) => <span className='text-blue-600' >{renderFullName(e)}</span> },
    { title: 'Fan', dataIndex: 'subject', key: 'platform', render: (e) => <span>{e?.name}</span> },
    { title: 'Fan toifasi', dataIndex: 'subjectCategory', key: 'platform', render: (e) => <span>{e?.name}</span> },
    { title: 'Group', dataIndex: 'group', key: 'version', render: (e) => <span>{e?.unical_name}</span> },
    { title: 'Kuni', dataIndex: 'week', key: 'upgradeNum', render: (e) => <span>{e?.name}</span> },
    { title: 'Vaqti', dataIndex: 'para', key: 'creator', render: (e) => <span>{e?.start_time} - {e?.end_time}</span> },
    { title: <span>Davomat soni (<span className="text-red-600">-</span> / <span className="text-green-600">+</span>)</span>, key: 'operation', render: (e) => <div><b className='text-red-600'>{Object.entries(e?.attendanceDates ?? {})?.filter(([key, value]: [key: string, value: any]) => dayjs(key).isBefore(e?.now[2]) && !value)?.length}</b> / <b className='text-green-600' >{Object.entries(e?.attendanceDates ?? {})?.filter(([key, value]: [key: string, value: any]) => dayjs(key).isBefore(e?.now[2]) && value)?.length}</b></div> },
  ];

  const expandedRowRender = (data: any) => {
    console.log("dddddddddddd", data);
    
    let obj: any = {};
    for (const item of data?.teacherAccess) {

      if(item?.timetable?.length) obj[item?.id] = {}
      for (const i of item?.timetable){
        obj[item?.id][i?.ids_id] = obj[item?.id][i?.ids_id] ? [...obj[item?.id][i?.ids_id], i] : [i]
      }

    }

    console.log("obj", obj);
    
    return (
      <table className='responsiveTable' >
        <tbody>
          {/* <tr>
            {
              Object.entries(data?.attendanceDates)?.map(([key, value]: [key: string, value: any]) =>
                <td key={key} className={`text-xs p-1 text-center ${dayjs(key).isAfter(data?.now[2]) ? "opacity-60" : ""}`} style={{ padding: "4px 8px" }} >{key.slice(5)}</td>)
            }
          </tr> */}
            {
              data?.teacherAccess?.map((item: any, key: number) =>
                (item?.timetable?.length ? 
                <tr key={key}>
                  <td rowSpan={Object.keys(obj[item?.id]).length}>{item?.subject?.name} ({item?.subjectCategory?.name})</td>
                  {/* <td>{obj[item?.id]}</td> */}
                  <td>{item?.timetable[key]?.all?.map((allItem: any) => <Tag className='my-1' key={allItem?.id}>{allItem?.group?.unical_name}</Tag>)}</td>

                  
                  {/* {
                    (item?.timetable?.filter((i: any) => i?.ids_id == Object.keys(obj[item?.id])[key]))?.map((tdate: any, index: number) => (
                      <td key={tdate?.id}>{tdate?.date} --  {key}</td>
                    ))
                  } */}
                </tr> : "")
              )
            }
        </tbody>
      </table>
    )
  }

  return (
    <div className="attent-by-timetable-wrapper">
      <HeaderExtraLayout title={`Dars jadvali bo'yicha davomat tahlili`}
        breadCrumbData={[
          { name: "Home", path: '/' },
          { name: "Dars jadvali bo'yicha davomat tahlili", path: '' }
        ]}
        btn={<div></div>}
      />
      <div className="p-4 pt-3">
        <Row gutter={[8, 8]} className='mb-3' >
          {selectData?.map((e, i) => <FilterSelect key={i} {...e} />)}
        </Row>
        <div className='flex'>

        </div>
        <Table
          columns={columns}
          expandable={{ expandedRowRender, defaultExpandAllRows: open }}
          dataSource={(timeTable?.items ?? allData)?.map(e => ({ ...e, key: e?.id }))}
          size="small"
          pagination={false}
          // loading={isFetching}
          bordered={true}
        />
        {(timeTable?._meta?.totalCount ?? 0) > 10 ? <CustomPagination totalCount={timeTable?._meta.totalCount} currentPage={urlValue.currentPage} perPage={urlValue.perPage} /> : undefined}
      </div>
    </div>
  );
};

export default AttendsByTimetableStatistics;

/**
  * time-table_index
  * time-table_delete
  * time-table_update
  * time-table_view
*/