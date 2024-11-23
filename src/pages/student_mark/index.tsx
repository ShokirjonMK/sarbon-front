import React, { useMemo, useState } from "react";
import { Col, Row, Select, Tag } from "antd";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { useTranslation } from "react-i18next";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import useGetAllData from "hooks/useGetAllData";
import FilterSelect, { TypeFilterSelect } from "components/FilterSelect";
import useGetData from "hooks/useGetData";
import { cf_filterOption } from "utils/others_functions";
import { IStudentMark } from "models/mark";
import VedomstMarkTable from "./vedomst_mark_table";

const span = { xs: 24, sm: 24, md: 12, lg: 6, xl: 6, xxl: 4 };


const StudentMarks: React.FC = (): JSX.Element => {
  
  const { t } = useTranslation();
  const { urlValue, writeToUrl } = useUrlQueryParams({});
  const [searchVal, setSearchVal] = useState<string>("");
  
  const selectData: TypeFilterSelect[] = [
    {
      name: "faculty_id",
      label: "Faculty",
      url: "faculties",
      permission: "faculty_index",
      child_names: ["edu_plan_id", "edu_semestr_id", "group_id", "subject-id", "type"],
      span,
    },
    {
      name: "edu_plan_id",
      label: "EduPlan",
      url: "edu-plans",
      permission: "edu-plan_index",
      parent_name: "faculty_id",
      child_names: ["edu_semestr_id", "group_id", "subject-id", "type"],
      span,
    },
    {
      name: "edu_semestr_id",
      label: "Edu semestr",
      url: "edu-semestrs?expand=semestr",
      permission: "edu-semestr_index",
      parent_name: "edu_plan_id",
      all: true,
      child_names: ["subject_id", "type"],
      span,
      render(e) {
        return <div>{e?.semestr?.name} {e?.status === 1 ? <Tag color="success" className="ml-2">Aktiv</Tag> : ""}</div>
      },
      onChange(id, item) {
        writeToUrl({name: "edu_year_id", value: item?.edu_year_id})
      },
    },
    {
      name: "group_id",
      label: "Group",
      url: "groups",
      permission: "group_index",
      render: (e) => e?.unical_name ?? "eer",
      parent_name: "edu_plan_id",
      child_names: ["subject_id", "type"],
      span,
    },
  ];

  const { data: eduSemestrSubject } = useGetData({
    queryKey: ["edu-semestr-subjects", { edu_semestr_id: urlValue?.filter?.edu_semestr_id, group_id: urlValue?.filter?.group_id}],
    url: `edu-semestr-subjects?expand=subjectVedomst.isPermission,subject,eduSemestrExamsTypes,eduSemestrExamsTypes.examsType&filter={"edu_semestr_id":${urlValue?.filter?.edu_semestr_id}}`,
    urlParams: {group_id: urlValue?.filter?.group_id},
    options: {
      enabled: !!urlValue?.filter?.edu_semestr_id && !!urlValue?.filter?.group_id,
    },
  });

  const { data: studentMarkData, refetch, isFetching: markIsFetching } = useGetAllData<IStudentMark>({
    queryKey: ["student-marks/get", { vedomst: urlValue?.filter_like?.type, subject_id: urlValue.filter?.subject_id, edu_semestr_id: urlValue.filter?.edu_semestr_id, group_id: urlValue.filter?.group_id, edu_year_id: urlValue.filter?.edu_year_id }],
    url: `student-marks/get?expand=student.profile`,
    urlParams: {
      "per-page": 0,
      group_id: urlValue.filter?.group_id,
      filter: { subject_id: urlValue.filter?.subject_id, vedomst: urlValue?.filter_like?.type },
      edu_semestr_id: urlValue.filter?.edu_semestr_id,
      edu_year_id: urlValue.filter?.edu_year_id
    },
    options: {
      enabled: !!urlValue?.filter?.group_id && !!urlValue?.filter_like?.type,
    },
  });

  const vedomstData = useMemo(() => {
    return eduSemestrSubject?.items?.find((e: any) => e?.subject_id === urlValue.filter?.subject_id)?.subjectVedomst;
  }, [urlValue.filter?.subject_id, eduSemestrSubject?.items]);

  const isVedomstPermission = vedomstData?.find((e: any) => e?.type == urlValue?.filter_like?.type)?.isPermission;

  const examTypeData = useMemo(() => {
    return eduSemestrSubject?.items?.find(e => e?.subject_id === urlValue.filter?.subject_id)?.eduSemestrExamsTypes?.filter((i: any) => i?.status == 1)
  }, [urlValue.filter?.subject_id, eduSemestrSubject?.items])


  return (
    <>
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: "/" },
          { name: "Marks", path: "" },
        ]}
        title={t("Marks")}
      />
      <div className="p-3">
        <Row gutter={[8, 12]}>
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
              render={e?.render}
              span={e?.span}
              all={e?.all}
            />
          ))}
          <Col xs={24} sm={24} md={12} lg={6} xl={6} >
            <Select
              showSearch
              allowClear
              className="w-full"
              value={urlValue?.filter?.subject_id}
              placeholder={t("Filter by edu semestr subject")}
              disabled={!urlValue?.filter?.edu_semestr_id || !urlValue?.filter?.group_id}
              optionFilterProp="children"
              onChange={(e) => {
                writeToUrl({ name: "subject_id", value: e });
                writeToUrl({ name: "type", value: "" });
              }}
              filterOption={cf_filterOption}
              options={eduSemestrSubject?.items?.map((subject: any) => ({
                label: subject?.subject?.name,
                value: subject?.subject_id,
              }))}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={6} xl={6} >
            <Select
              showSearch
              allowClear
              className="w-full"
              value={urlValue?.filter_like?.type}
              placeholder={t("Filter by shakl")}
              disabled={!urlValue?.filter?.subject_id}
              optionFilterProp="children"
              onChange={(e) => {
                writeToUrl({ name: "type", value: e });
              }}
              filterOption={cf_filterOption}
              options={vedomstData?.map((e: any) => ({
                label: e?.type == 1 ? "1 - shakl" : e?.type == 2 ? "1 - A shakl" : e?.type ? "1 - B shakl" : "",
                value: String(e?.type),
              }))}
            />
          </Col>
        </Row>

        <VedomstMarkTable
          data={studentMarkData?.items}
          examTypes={examTypeData}
          refetch={refetch}
          isFetching={markIsFetching}
          setSearchVal={setSearchVal}
          isVedomstPermission={isVedomstPermission}
        />

      </div>
    </>
  );
};

export default StudentMarks;
