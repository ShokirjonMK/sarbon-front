import React, { useState } from "react";
import { Button, Col, Row, Select, Tag } from "antd";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { useTranslation } from "react-i18next";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import useGetAllData from "hooks/useGetAllData";
import FilterSelect, { TypeFilterSelect } from "components/FilterSelect";
import useGetData from "hooks/useGetData";
import { cf_filterOption, generateAntdColSpan } from "utils/others_functions";
import AttendanceTable from "pages/attend_student/attend-table";
// import AttendanceTable from "./attendance_table";

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
    child_names: ["subject_id"],
    render: (e) => <div>{e?.semestr?.name} {e?.status == 1 ? <Tag color="green" className="ml-3">Active</Tag>: ""}</div>,
    span: { xs: 24, sm: 24, md: 12, lg: 6, xl: 4 },
  },
  {
    name: "group_id",
    label: "Group",
    url: "groups",
    permission: "group_index",
    render: (e) => e?.unical_name ?? "eer",
    parent_name: "edu_plan_id",
    child_names: ["time_table_id"],
    span: { xs: 24, sm: 24, md: 12, lg: 4, xl: 3 },
  },
];

const Attendance: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { urlValue, writeToUrl } = useUrlQueryParams({});
  const [allData, setallData] = useState<any[]>();

  const { data, refetch, isFetching } = useGetAllData({
    queryKey: [ "timetable-dates/filter", urlValue.perPage, urlValue.currentPage, urlValue?.filter?.subject_id, urlValue?.filter?.group_id,],
    url: `timetable-dates/filter?expand=`,
    urlParams: {
      "per-page": urlValue.perPage,
      page: urlValue.currentPage,
      filter: {"subject_id": urlValue?.filter?.subject_id, "group_id": urlValue?.filter?.group_id, subject_category_id: 1}
    },
    options: {
      refetchOnWindowFocus: false,
      retry: 1,
      onSuccess: (res) => {
        setallData(res?.items);
      },
      enabled: !!(urlValue?.filter?.group_id && urlValue?.filter?.subject_id),
    },
  });

  const { data: eduSemestrSubject } = useGetData({
    queryKey: ["edu-semestr-subjects", urlValue?.filter?.edu_semestr_id],
    url: `edu-semestr-subjects?expand=subject&filter={"edu_semestr_id":${urlValue?.filter?.edu_semestr_id}}`,
    options: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!urlValue?.filter?.edu_semestr_id,
    },
  });

  return (
    <>
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: "/" },
          { name: "Attendance", path: "" },
        ]}
        title={t("Attendance")}
        // btn={<Button type="primary">{t("Absence students")}</Button>}
      />

      <div className="p-3">
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
              value={urlValue?.filter?.subject_id}
              placeholder={t("Filter by edu semestr subject")}
              disabled={!urlValue?.filter?.edu_semestr_id}
              optionFilterProp="children"
              onChange={(e) => {
                writeToUrl({name: "subject_id", value: e});
                writeToUrl({name: "time_table_id", value: ""});
              }}
              filterOption={cf_filterOption}
              options={eduSemestrSubject?.items?.map((subject: any) => ({
                label: subject?.subject?.name,
                value: subject?.subject_id,
              }))}
            />
          </Col>
          <Col xs={24} sm={24} md={18} lg={18} xl={18}>
            <Select
              showSearch
              allowClear
              className="w-full"
              value={urlValue?.filter?.time_table_id}
              placeholder={t("Filter by time table")}
              disabled={!(urlValue?.filter?.group_id && urlValue?.filter?.subject_id)}
              optionFilterProp="children"
              onChange={(e) => {writeToUrl({name: "time_table_id", value: e})}}
              filterOption={cf_filterOption}
              options={data?.items?.map((subject: any) => ({
                label: `${subject?.week?.name} / ${subject?.para?.start_time} - ${subject?.para?.end_time} / ${subject?.subjectCategory?.name} / ${subject?.teacherAccess?.teacher?.first_name} ${subject?.teacherAccess?.teacher?.last_name}`,
                value: subject?.id,
              }))}
            />
          </Col>
        </Row>
        {/* <AttendanceTable data={data?.data} refetch={refetch} isFetching={isFetching} teacher={true} /> */}
        <AttendanceTable data={data?.items?.length ? data?.items.find(e => e?.id == urlValue?.filter?.time_table_id) : null} refetch={refetch} isFetching={isFetching}/>

      </div>
    </>
  );
};

export default Attendance;
