import React, {useEffect, useState} from "react";
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
import { Alert, Col, Input, Row, Select, Space, Tag, message } from "antd";
import CustomPagination from "components/Pagination";
import { cf_filterOption } from "utils/others_functions";
import instance from "config/_axios";
import { excelExport } from "utils/excelExport";
import useGetData from "hooks/useGetData";
import { ExcelBtn } from "components/Buttons";
import useDebounce from "hooks/useDebounce";

const StudentAttendStatistics : React.FC = () : JSX.Element => {

  const { t } = useTranslation();
  const [allData, setAllData] = useState<any[]>([]);
  const { urlValue, writeToUrl } = useUrlQueryParams({ currentPage: 1, perPage: 15 });
  const percentFromDebounce = useDebounce(urlValue?.filter_like?.from_percent, globalConstants.debounsDuration);
  const percentToDebounce = useDebounce(urlValue?.filter_like?.to_percent, globalConstants.debounsDuration);


  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false);
  const [first_name, setfirst_name] = useState<string>();
  const [last_name, setlast_name] = useState<string>();
  const [middle_name, setmiddle_name] = useState<string>();
  const [selectedSubject, setselectedSubject] = useState<any>();

  const selectData: TypeFilterSelect[] = [
    {
      name: "faculty_id",
      label: "Faculty",
      url: "faculties",
      permission: "faculty_index",
      child_names: ["edu_plan_id"],
      span: { xs: 24, sm: 24, md: 12, lg: 6, xl: 5 },
    },
    {
      name: "edu_plan_id",
      label: "EduPlan",
      url: "edu-plans",
      permission: "edu-plan_index",
      parent_name: "faculty_id",
      child_names: ["group_id", "edu_semestr_id"],
      span: { xs: 24, sm: 24, md: 12, lg: 8, xl: 6 },
    },
    {
      name: "edu_semestr_id",
      label: "Edu semestr",
      url: "edu-semestrs?expand=semestr",
      permission: "edu-semestr_index",
      parent_name: "edu_plan_id",
      filter: {status: "all"},
      child_names: ["edu_semestr_subject_id"],
      render: (e) => <div>{e?.semestr?.name} {e?.status == 1 ? <Tag color="green" className="ml-3">Active</Tag>: ""}</div>,
      span: { xs: 24, sm: 24, md: 12, lg: 6, xl: 4 },
      onChange(id, item) {
          writeToUrl({name: "edu_year_id", value: item?.edu_year_id});
          writeToUrl({name: "edu_semestr_id", value: id});

      },
    },
    {
      name: "group_id",
      label: "Group",
      url: "groups",
      permission: "group_index",
      render: (e) => e?.unical_name,
      parent_name: "edu_plan_id",
      span: { xs: 24, sm: 24, md: 12, lg: 4, xl: 3 },
    },
  ];

  const { data, refetch, isFetching } = useGetAllData({
    queryKey: [urlValue.perPage, urlValue.currentPage, percentFromDebounce, percentToDebounce, urlValue?.filter_like?.attend_sort,  ...(Object.values(urlValue?.filter) ?? []), first_name, last_name, middle_name, "student-ball-statsitics"],
    url: `students/missed-hours`,
    urlParams: { 
      "per-page": urlValue.perPage, 
      page: urlValue.currentPage, 
      subject_id: urlValue?.filter?.subject_id,
      edu_semestr_subject_id: urlValue?.filter?.edu_semestr_subject_id,
      edu_semestr_id: urlValue?.filter?.edu_semestr_id,
      edu_year_id: urlValue?.filter?.edu_year_id,
      attend_sort: urlValue?.filter_like?.attend_sort,
      from_percent: urlValue?.filter_like?.from_percent || '0',
      to_percent: urlValue?.filter_like?.to_percent || 100,
      filter: JSON.stringify({
        faculty_id: urlValue.filter?.faculty_id, 
        edu_plan_id: urlValue.filter?.edu_plan_id, 
        group_id: urlValue.filter?.group_id,
        status: 10,
      }),
      "filter-like": first_name || last_name || middle_name ? JSON.stringify({ first_name, last_name, middle_name}) : undefined,
      expand: "user,group,studentAttendsCount,studentAttendReasonCount"
    },
    options: {
      onSuccess: (res) => {
        setAllData(res?.items);
      },
      enabled: !!urlValue.filter?.edu_semestr_subject_id
    }
  });  

  const { data: eduSemestrSubject } = useGetData({
    queryKey: ["edu-semestr-subjects", urlValue?.filter?.edu_semestr_id],
    url: `edu-semestr-subjects?expand=subject,allHour,eduSemestrSubjectCategoryTimes&filter={"edu_semestr_id":${urlValue?.filter?.edu_semestr_id}}`,
    options: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!urlValue?.filter?.edu_semestr_id,
    },
  });


  useEffect(() => {
    if(urlValue?.filter?.subject_id) {
      refetch()
    }
  }, [urlValue?.filter?.subject_id, refetch])

  useEffect(() => {
    if(urlValue?.filter?.edu_semestr_subject_id) {
      setselectedSubject(eduSemestrSubject?.items?.find((a:any) => a?.id === urlValue?.filter?.edu_semestr_subject_id))
    }
  }, [urlValue?.filter?.edu_semestr_subject_id])

  const calcAttendPercent = (sababsizDarsSoati: number) => {
    
    const allDarsSoati = selectedSubject?.eduSemestrSubjectCategoryTimes?.reduce((accumulator: number, currentValue: any) => {      
      if(currentValue?.subject_category_id !== 6) return accumulator + currentValue?.hours
      return accumulator
    }, 0);

    const percent = (sababsizDarsSoati/allDarsSoati) * 100
    
    return {
      percent, 
      class: percent >= 25 ? 'text-red-500' : percent >= 15 ? 'text-yellow-500' : "text-black",
      type: percent >= 25 ? 'error' : percent >= 15 ? 'warning' : "",
    }

  }
  
  const columns: ColumnsType<any> = React.useMemo(() => [
    {
      title: '№',
      width: 45,
      children: [
        {
          render: (_, __, i) => number_order(urlValue.currentPage, urlValue.perPage, Number(i), false),
        }
      ]
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
                className={`hover:text-[#0a3180] underline cursor-pointer ${calcAttendPercent((Number(e?.studentAttendsCount)-Number(e?.studentAttendReasonCount))*2)?.class}`}
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
                className={`hover:text-[#0a3180] underline cursor-pointer ${calcAttendPercent((Number(e?.studentAttendsCount)-Number(e?.studentAttendReasonCount))*2)?.class}`}
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
              className={`hover:text-[#0a3180] underline cursor-pointer ${calcAttendPercent((Number(e?.studentAttendsCount)-Number(e?.studentAttendReasonCount))*2)?.class}`}
            >{e?.user?.middle_name} </span>
            ) : (<span>{e?.user?.middle_name}</span>),

        }
      ]
    },
    {
      title: t("Group"),
      dataIndex: 'group',
      render: (i:number,e:any) => <span className={calcAttendPercent((Number(e?.studentAttendsCount)-Number(e?.studentAttendReasonCount))*2)?.class}>{e?.group?.unical_name}</span>
    },
    {
      title: t("Reasonably(hour)"),
      key: "attend1",
      render: (e) => <span>{Number(e?.studentAttendReasonCount)*2}</span>
    },
    {
      title: t("Without reason(hour)"),
      key: "attend2",
      render: (e) => <span>{(Number(e?.studentAttendsCount)-Number(e?.studentAttendReasonCount))*2}</span>
    },
    {
      title: t("Sababsiz (foiz)"),
      key: "attend3",
      render: (e) => <Tag color={calcAttendPercent((Number(e?.studentAttendsCount)-Number(e?.studentAttendReasonCount))*2)?.type}>{calcAttendPercent((Number(e?.studentAttendsCount)-Number(e?.studentAttendReasonCount))*2)?.percent?.toFixed(2)} %</Tag>
    },
    {
      title: t("Jami NB (soat)"),
      key: "attend4",
      showSorterTooltip: false,
      sorter: () => { writeToUrl({ name: "attend_sort", value: urlValue?.filter_like?.attend_sort == '1' ? "0" : 1 }); return 0 },
      render: (e) => <span>{Number(e?.studentAttendsCount)*2}</span>
    },
    {
      title: t("Jami dars soati(soat)"),
      key: "attend5",
      render: (e) => <span>{selectedSubject?.allHour}</span>
    },
  ], [data?.items]);

  const exportExcel = async () => {
    const arr: any = [];

    if (urlValue.filter?.edu_semestr_subject_id) {

      setLoading(true);

      const res = await instance({
        method: "GET",
        url: `students/missed-hours`,
        params: { 
          "per-page": 0, 
          subject_id: urlValue?.filter?.subject_id,
          edu_semestr_subject_id: urlValue?.filter?.edu_semestr_subject_id,
          edu_semestr_id: urlValue?.filter?.edu_semestr_id,
          edu_year_id: urlValue?.filter?.edu_year_id,
          attend_sort: urlValue?.filter_like?.attend_sort,
          from_percent: urlValue?.filter_like?.from_percent || '0',
          to_percent: urlValue?.filter_like?.to_percent || 100,
          filter: JSON.stringify({
            faculty_id: urlValue.filter?.faculty_id, 
            edu_plan_id: urlValue.filter?.edu_plan_id, 
            group_id: urlValue.filter?.group_id,
            status: 10,
          }),
          expand: "user,group,course,studentAttendsCount,studentAttendReasonCount",
          "filter-like": first_name || last_name || middle_name ? JSON.stringify({ first_name, last_name, middle_name}) : undefined,
        }
      });

      res?.data?.data?.items?.forEach((element: any) => {
        arr.push({
          ["Familiya"]: element?.user?.last_name,
          ["Ism"]: element?.user?.first_name,
          ["Otasining ismi"]: element?.user?.middle_name,
          ["Kurs"]: element?.course?.name,
          ["Guruh"]: element?.group?.unical_name,
          ["Fan"]: selectedSubject?.subject?.name,
          ["Sababli(soat)"]: Number(element?.studentAttendReasonCount*2),
          ["Sababsiz(soat)"]: (Number(element?.studentAttendsCount)-Number(element?.studentAttendReasonCount))*2,
          ["Sababsiz (foiz %)"]: calcAttendPercent((Number(element?.studentAttendsCount)-Number(element?.studentAttendReasonCount))*2)?.percent?.toFixed(2),
          ["Jami NB(soat)"]: Number(element?.studentAttendsCount)*2,
          ["Jami dars soati(soat)"]: selectedSubject?.allHour,
        })
      })

      setLoading(false);
      excelExport(arr, `Fakultet kesimida talabalar davomati`);
    } else {
      message.warning("Fan tanlang!!!")
    }

  }

  return(
    <>
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: "/" },
          { name: "Student subject attend", path: "" },
        ]}
        title={'Student subject attend'}
        btn={
          <div>
            <ExcelBtn onClick={exportExcel} loading={loading} />
          </div>
        }
      />
      <div className="p-3">
        <Alert message="Talaba davomatini ko'rish uchun fan tanlang" type="warning" showIcon className="mb-3" />
        <Row gutter={[4, 24]}>
          {selectData?.map((e, i) => (
              <FilterSelect
                key={i}
                {...e}
              />
          ))}
          <Col xs={24} sm={24} md={12} lg={6} xl={6}>
            <Select
              showSearch
              allowClear
              className="w-full"
              value={urlValue?.filter?.edu_semestr_subject_id && urlValue?.filter?.subject_id ? `${urlValue?.filter?.edu_semestr_subject_id}-${urlValue?.filter?.subject_id}` : undefined}
              placeholder={t("Filter by edu semestr subject")}
              disabled={!urlValue?.filter?.edu_semestr_id}
              optionFilterProp="children"
              onChange={(e:any) => {
                writeToUrl({name: "edu_semestr_subject_id", value: e?.split("-")[0]});
                writeToUrl({name: "subject_id", value: e?.split("-")[1]});
              }}
              filterOption={cf_filterOption}
              options={eduSemestrSubject?.items.map((subject: any) => ({
                label: subject?.subject?.name,
                value: `${subject?.id}-${subject?.subject?.id}`,
              }))}
            />
          </Col>
        </Row>
        <Row gutter={[4, 24]} justify="end" className="mt-2">
          <Col md={24} lg={6} className="bg rounded-md p-2">
            <div className="mx-2">
              <label className="mb-1 block">Davomatni foizda filter qilish! (% dan - % gacha)</label>
              <Space.Compact className="w-full">
                <Input 
                  value={urlValue?.filter_like?.from_percent} 
                  max={urlValue?.filter_like?.to_percent} 
                  style={{ width: '50%' }} 
                  onChange={(e) => writeToUrl({name: "from_percent", value: e.target.value})} 
                  defaultValue="0" 
                />
                <Input 
                  value={urlValue?.filter_like?.to_percent} 
                  min={urlValue?.filter_like?.from_percent} 
                  max={100} style={{ width: '50%' }} 
                  onChange={(e) => writeToUrl({name: "to_percent", value: e.target.value})} 
                  defaultValue="100" 
                />
            </Space.Compact>
            </div>
            </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={data?.items.length ? data?.items : allData}
          pagination={false}
          loading={isFetching}
          bordered={true}
          size="middle"
          className="mt-3"
          rowClassName="py-[12px]"
          scroll={{ x: 1200 }}
        />
        {(data?._meta?.totalCount ?? 0) > 10 ? <CustomPagination totalCount={data?._meta.totalCount} currentPage={urlValue.currentPage} perPage={urlValue.perPage} /> : undefined}
      </div>
    </>
  )
}

export default StudentAttendStatistics