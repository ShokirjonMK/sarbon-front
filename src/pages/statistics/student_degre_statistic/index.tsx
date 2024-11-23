import React, { useState } from "react";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import FilterSelect, { TypeFilterSelect } from "components/FilterSelect";
import { useTranslation } from "react-i18next";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import { useNavigate } from "react-router-dom";
import useGetAllData from "hooks/useGetAllData";
import SearchInputWithoutIcon from "components/SearchInput/searchInputWithoutIcon";
import { globalConstants } from "config/constants";
import checkPermission from "utils/check_permission";
import { IStudent } from "models/student";
import { number_order } from "utils/number_orders";
import Table, { ColumnsType } from "antd/es/table";
import { Alert, Input, Row, Tag } from "antd";
import CustomPagination from "components/Pagination";
import Actions from "components/Actions";
import { CheckmarkCircle16Regular } from "@fluentui/react-icons";
import { submitStudentVedomst } from "./request";
import { useMutation } from "@tanstack/react-query";
import { Notification } from "utils/notification";
import { AxiosError } from "axios";

const selectData: TypeFilterSelect[] = [
  {
    name: "faculty_id",
    label: "Faculty",
    url: "faculties",
    permission: "faculty_index",
    child_names: ["edu_plan_id"],
    span: { xs: 24, sm: 24, md: 12, lg: 4, xl: 5 },
  },
  {
    name: "edu_plan_id",
    label: "EduPlan",
    url: "edu-plans",
    permission: "edu-plan_index",
    parent_name: "faculty_id",
    child_names: ["group_id", "semestr_id"],
    span: { xs: 24, sm: 24, md: 12, lg: 10, xl: 9 },
  },
  {
    name: "semestr_id",
    label: "Edu semestr",
    url: "edu-semestrs?expand=semestr",
    permission: "edu-semestr_index",
    parent_name: "edu_plan_id",
    filter: {status: "all"},
    child_names: ["subject_id"],
    render: (e) => <div>{e?.name} {e?.status == 1 ? <Tag color="green" className="ml-3">Active</Tag>: ""}</div>,
    span: { xs: 24, sm: 24, md: 12, lg: 6, xl: 6 },
    value_name: "semestr"
  },
  {
    name: "group_id",
    label: "Group",
    url: "groups",
    permission: "group_index",
    render: (e) => e?.unical_name,
    parent_name: "edu_plan_id",
    span: { xs: 24, sm: 24, md: 12, lg: 4, xl: 4 },
  },
];

const StudentDegreStatistics : React.FC = () : JSX.Element => {
  
  const { t } = useTranslation();
  const [allData, setAllData] = useState<any[]>([]);
  const { urlValue, writeToUrl } = useUrlQueryParams({ currentPage: 1, perPage: 15 });
  const navigate = useNavigate()
  const [isEditVedmost, setisEditVedmost] = useState<{id: number, isOpen: boolean}>();
  const [vedomstMarks, setvedomstMarks] = useState<{[id: number]: {[id: number]: number}}>({});

  const [first_name, setfirst_name] = useState<string>();
  const [last_name, setlast_name] = useState<string>();
  const [middle_name, setmiddle_name] = useState<string>();
  
  const { data, isFetching, refetch } = useGetAllData({
    queryKey: [urlValue.perPage, urlValue.currentPage, urlValue.filter_like?.sort, ...(Object.values(urlValue?.filter) ?? []), first_name, last_name, middle_name, "student-ball-statsitics"],
    url: `students?sort=-id&expand=user,studentSemestrSubject,studentSemestrSubject.studentVedomst,studentSemestrSubject.eduSemestrSubject.subject,studentSemestrSubject.eduSemestrSubject.eduSemestrExamsTypes.examsType,studentSemestrSubject.studentVedomst.studentMark,group,direction,course&filter=${JSON.stringify(urlValue.filter)}&filter-like=${JSON.stringify({ first_name, last_name, middle_name})}`,
    urlParams: { "per-page": urlValue.perPage, page: urlValue.currentPage, sort: urlValue.filter_like?.sort ?? "-id", semestr_id: urlValue?.filter?.semestr_id},
    options: {
      onSuccess: (res) => {
        setAllData(res?.items);
      },
      enabled: !!urlValue?.filter?.semestr_id
    }
  });

  const columns: ColumnsType<any> = React.useMemo(() => [
    {
      title: '№',
      width: 45,
      showSorterTooltip: false,
      sorter: () => { writeToUrl({ name: "sort", value: urlValue?.filter_like?.sort === "-id" ? "id" : "-id" }); return 0 },
      children: [
        {
          render: (_, __, i) => number_order(urlValue.currentPage, urlValue.perPage, Number(i), isFetching),
        }
      ],
    },
    {
      title: t('Last name'),
      showSorterTooltip: false,
      sorter: () => { writeToUrl({ name: "sort", value: urlValue?.filter_like?.sort === "-last_name" ? "last_name" : "-last_name" }); return 0 },
      children: [
        {
          title: <SearchInputWithoutIcon setSearchVal={setlast_name} duration={globalConstants.debounsDuration} filterKey="last_name" placeholder={`${t("Search by last name")}...`} />,
          render: (e:any) =>
            checkPermission("student_view") ? (
              <span
                onClick={() => navigate(`/students/view/${e?.id}`)}
                className="hover:text-[#0a3180] underline cursor-pointer"
              >{e?.user?.last_name} </span>
            ) : (<span>{e?.user?.last_name}</span>),
        }
      ]
    },
    {
      title: t('First name'),
      showSorterTooltip: false,
      sorter: () => { writeToUrl({ name: "sort", value: urlValue?.filter_like?.sort === "-first_name" ? "first_name" : "-first_name" }); return 0 },
      children: [
        {
          title: <SearchInputWithoutIcon setSearchVal={setfirst_name} duration={globalConstants.debounsDuration} filterKey="first_name" placeholder={`${t("Search by name")}...`} />,
          render: (e: IStudent) =>
            checkPermission("student_view") ? (
              <span
                onClick={() => navigate(`/students/view/${e?.id}`)}
                className="hover:text-[#0a3180] underline cursor-pointer"
              >{e?.user?.first_name} </span>
            ) : (<span>{e?.user?.first_name}</span>),
        }
      ]
    },
    {
      title: t('Middle name'),
      showSorterTooltip: false,
      sorter: () => { writeToUrl({ name: "sort", value: urlValue?.filter_like?.sort === "-middle_name" ? "middle_name" : "-middle_name" }); return 0 },
      children: [
        {
          title: <SearchInputWithoutIcon setSearchVal={setmiddle_name} duration={globalConstants.debounsDuration} filterKey="middle_name" placeholder={`${t("Search by middle name")}...`} />,
          render: (e:any) =>
            checkPermission("student_view") ? (
              <span
                onClick={() => navigate(`/students/view/${e?.id}`)}
                className="hover:text-[#0a3180] underline cursor-pointer"
              >{e?.user?.middle_name} </span>
            ) : (<span>{e?.user?.middle_name}</span>),

        }
      ]
    },
    {
      title: t("Direction"),
      dataIndex: 'direction',
      render: (i:number,e:any) => <span>{e?.direction?.name}</span>
    },
    {
      title: t("Course"),
      dataIndex: 'course',
      render: (i:number,e:any) => <span>{e?.course?.name}</span>
    },
    {
      title: t("Group"),
      dataIndex: 'group',
      render: (i:number,e:any) => <span>{e?.group?.unical_name}</span>
    },
  ], [data?.items]);


  const move = (array: any[], from: number, to: number, on = 1) => {
    return array = array.slice(), array.splice(to, 0, ...array.splice(from, on)), array
  }

  const selectVedomst = (vedomst: any) => {
    const obj: {[key: number]: number} = {}
    for (const item of vedomst?.studentMark) {
      obj[item?.id] = item?.ball
    }
    setvedomstMarks({[vedomst?.id]: obj})
  }
  

  const { mutate, isLoading } = useMutation({
    mutationFn: () => submitStudentVedomst(vedomstMarks),
    onSuccess: async (res) => {
      refetch();
      Notification("success", "update" , res?.message)
      setisEditVedmost(undefined)
      setvedomstMarks({} as {[id: number]: {[id: number]: number}})
    },
    onError: (error: AxiosError) => {
      Notification("success", "update" , error?.message)
    },
    retry: 0,
  });
  
  const expandedRowRender = (tableData: any) => {
    return (
      <div className="pl-10">
        {
          tableData?.studentSemestrSubject?.map((item: any, idx: number ) => (
            <table key={item?.id} className='responsiveTableSm w-full mb-2 bg-white text-[13px]' >
              <tbody>
                <tr>
                  <th colSpan={1} rowSpan={item?.studentVedomst?.length + 1} className="text-left w-[300px]">{item?.eduSemestrSubject?.subject?.name}</th>
                  <th className="text-left"></th>
                    {
                      move(item?.eduSemestrSubject?.eduSemestrExamsTypes.sort((a: any, b: any) => a?.exams_type_id - b?.exams_type_id), 2, item?.eduSemestrSubject?.eduSemestrExamsTypes?.length - 1)?.map((examType: any) => (
                        <th  key={examType?.id} className="text-left">{examType?.examsType?.name} (max - {examType?.max_ball})</th>
                      ))
                    }
                  <th className="text-left">Umumiy (ball/Max)</th>
                  <th className="text-left">Amallar</th>
                </tr>
                    {
                      item?.studentVedomst?.map((vedomst: any, index: number) => (
                        <tr key={index} className={`text-center ${isEditVedmost?.isOpen && isEditVedmost?.id === vedomst?.id ? "bg-slate-100" : ""}`}>
                            <th className="text-left w-[150px]">{vedomst?.vedomst === 1 ? "1 - shakl" : vedomst?.vedomst === 2 ? "1 - A shakl" : vedomst?.vedomst === 3 ? "1 - B shakl" : ""}</th>
                            {
                              move(item?.eduSemestrSubject?.eduSemestrExamsTypes.sort((a: any, b: any) => a?.exams_type_id - b?.exams_type_id), 2, item?.eduSemestrSubject?.eduSemestrExamsTypes?.length - 1)?.map((examType: any) => {
                                
                                const stdMark = vedomst?.studentMark?.find((mark: any) => mark?.exam_type_id === examType?.exams_type_id && mark?.student_semestr_subject_vedomst_id === vedomst?.id);
                                
                                return <td key={examType?.id} className={`text-center`}>
                                        {
                                          isEditVedmost?.isOpen && isEditVedmost?.id === vedomst?.id 
                                            ? <Input 
                                                type="number"
                                                max={stdMark?.max_ball}
                                                
                                                className="text-center" 
                                                defaultValue={stdMark?.ball} 
                                                value={vedomstMarks[vedomst?.id]?.[stdMark?.id]} 
                                                onChange={(e) => setvedomstMarks(prev => ({[vedomst?.id] : {...prev[vedomst?.id], [stdMark?.id]: Number(e.target.value)}}))} 
                                              /> 
                                            : stdMark?.ball
                                        } 
                                      </td>
                              })
                            }

                            <td className="text-center">{vedomst?.studentMark?.reduce((acc: number, cur: any) => (acc + cur?.ball), 0)}/{vedomst?.studentMark?.reduce((acc: number, cur: any) => (acc + cur?.max_ball), 0)}</td>
                            <td className="text-center">
                              <div className="flex">
                                {
                                  isEditVedmost?.isOpen && isEditVedmost?.id === vedomst?.id
                                  ? <CheckmarkCircle16Regular onClick={() => mutate()} className="w-[22px] h-[22px] text-lime-600 cursor-pointer" /> : ""
                                }
                                <Actions
                                  id={vedomst?.id}
                                  url={"student-vedomsts"}
                                  refetch={refetch}
                                  onClickView={() => console.log("")}
                                  onClickEdit={() => {
                                    setisEditVedmost(prev => ({id: vedomst?.id, isOpen: true }));
                                    selectVedomst(vedomst)
                                  }}
                                  viewPermission={"_"}
                                  editPermission={(item?.studentVedomst?.length - 1 === index) && (isEditVedmost?.id !== vedomst?.id) ? "department_update" : "_"}
                                  deletePermission={(item?.studentVedomst?.length - 1 === index && item?.studentVedomst?.length !== 1) ? "department_delete" : "_"}
                                />
                              </div>
                            </td>

                        </tr>
                      ))
                    }
              </tbody>
            </table>
          ))
        }
      </div>
    )
  };
  return(
    <>
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: "/" },
          { name: "Students degre statistic", path: "" },
        ]}
        title={'Students degre statistic'}
      />
      <div className="p-3">
        <Alert message="Talaba baholarini ko'rish uchun ta'lim semestrini tanlang" type="warning" showIcon className="mb-3" />
        <Row gutter={[4, 24]}>
          {selectData?.map((e, i) => (
              <FilterSelect
                key={i}
                {...e}
              />
          ))}
        </Row>

        <Table
          columns={columns}
          dataSource={(data?.items.length ? data?.items : allData)?.map(e => ({ ...e, key: e?.id }))}
          expandable={{ expandedRowRender, defaultExpandAllRows: false }}
          pagination={false}
          loading={isFetching}
          bordered={true}
          size="middle"
          className="mt-3"
          locale={{emptyText: "Ma'lumotni olish uchun ta'lim semestrini tanlang!"}}
          rowClassName="py-[12px]"
          scroll={{ x: 1200 }}
        />
        {(data?._meta?.totalCount ?? 0) > 10 ? <CustomPagination totalCount={data?._meta.totalCount} currentPage={urlValue.currentPage} perPage={urlValue.perPage} /> : undefined}
      </div>
    </>
  )
}

export default StudentDegreStatistics