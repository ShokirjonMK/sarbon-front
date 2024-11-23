import React, { useState } from "react";
import { Col, Row, Select } from "antd";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { useTranslation } from "react-i18next";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import useGetAllData from "hooks/useGetAllData";
import FilterSelect, { TypeFilterSelect } from "components/FilterSelect";
import useGetData from "hooks/useGetData";
import { cf_filterOption } from "utils/others_functions";
import { IStudentMark } from "models/mark";
import ExamPermissionTable from "./permission_table";

const selectData: TypeFilterSelect[] = [
  {
    name: "faculty_id",
    label: "Faculty",
    url: "faculties",
    permission: "faculty_index",
    child_names: ["edu_plan_id"],
    span: { xs: 24, sm: 24, md: 12, lg: 4, xl: 4 },
  },
  {
    name: "edu_plan_id",
    label: "EduPlan",
    url: "edu-plans",
    permission: "edu-plan_index",
    parent_name: "faculty_id",
    child_names: ["group_id", "edu_semestr_id"],
    span: { xs: 24, sm: 24, md: 12, lg: 4, xl: 4 },
  },
  {
    name: "edu_semestr_id",
    label: "Edu semestr",
    url: "edu-semestrs?expand=semestr",
    permission: "edu-semestr_index",
    parent_name: "edu_plan_id",
    child_names: ["subject_id"],
    span: { xs: 24, sm: 24, md: 12, lg: 4, xl: 4 },
    render(e) {
      return e?.semestr?.name
    },
  },
  {
    name: "group_id",
    label: "Group",
    url: "groups",
    permission: "group_index",
    render: (e) => e?.unical_name ?? "eer",
    parent_name: "edu_plan_id",
    child_names: ["time_table_id"],
    span: { xs: 24, sm: 24, md: 12, lg: 4, xl: 4 },
  },
];

const FinalExamPermission: React.FC = (): JSX.Element => {

  const { t } = useTranslation();
  const { urlValue, writeToUrl } = useUrlQueryParams({});
  const [searchVal, setSearchVal] = useState<string>("");

  const { data: eduSemestrSubject } = useGetData({
    queryKey: ["edu-semestr-subjects", urlValue?.filter?.edu_semestr_id],
    url: `edu-semestr-subjects?expand=subject,eduSemestrExamsTypes,eduSemestrExamsTypes.examsType&filter={"edu_semestr_id":${urlValue?.filter?.edu_semestr_id}}`,
    options: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!urlValue?.filter?.edu_semestr_id,
    },
  });



  const { data, isFetching } = useGetAllData({
    queryKey: [ "students", urlValue?.filter?.group_id, searchVal, urlValue?.filter?.subject_id, eduSemestrSubject?.items?.find(i => i?.id === urlValue?.filter?.subject_id)?.subject_id],
    url: `students?expand=profile,marks,studentAttendsCount,studentAttendReasonCount`,
    urlParams: {
      "per-page": 0,
      filter: {"group_id": urlValue?.filter?.group_id},
      subject_id: eduSemestrSubject?.items?.find(i => i?.id === urlValue?.filter?.subject_id)?.subject_id,
      query: searchVal
    },
    options: {
      refetchOnWindowFocus: false,
      retry: 1,
      enabled: !!(urlValue?.filter?.group_id && urlValue?.filter?.subject_id && eduSemestrSubject?.items?.find(i => i?.id === urlValue?.filter?.subject_id)?.subject_id),
    },
  });  


  const { data: studentMarkData, refetch, isFetching: markIsFetching } = useGetAllData<IStudentMark>({
    queryKey: ["student-marks", {edu_semestr_subject_id: urlValue.filter?.subject_id, edu_semestr_id: urlValue.filter?.edu_semestr_id, group_id: urlValue.filter?.group_id}],
    url: `student-marks?expand=examType`,
    urlParams: {
      "per-page": 0,
      filter: {edu_semestr_subject_id: urlValue.filter?.subject_id, edu_semestr_id: urlValue.filter?.edu_semestr_id, group_id: urlValue.filter?.group_id, is_deleted: 0}
    },
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!urlValue?.filter?.group_id,
    },
  });
  
  return (
    <>
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: "/" },
          { name: "Yakuniy imtihon baholash shakli", path: "" },
        ]}
        title={'Yakuniy imtihon baholash shakli'}
      />
      <div className="p-3">
        <Row gutter={[4, 12]}>
          {selectData?.map((e, i) => (
            <Col key={i} xs={24} sm={24} md={12} lg={6} xl={6} xxl={i == 1 ? 6 : 4}>
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
                span={24}
              />
            </Col>
          ))}
          <Col xs={24} sm={24} md={12} lg={6} xl={6} >
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
              }}
              filterOption={cf_filterOption}
              options={eduSemestrSubject?.items?.map((subject: any) => ({
                label: subject?.subject?.name,
                value: subject?.id,
              }))}
            />
          </Col>
        </Row>

        <ExamPermissionTable 
          data={data?.items?.length ? data?.items : null} 
          studentMarkData={studentMarkData?.items} 
          examTypes={eduSemestrSubject?.items?.find(e => e?.id == urlValue.filter?.subject_id)?.eduSemestrExamsTypes?.filter((i:any) => i?.status == 1)} 
          refetch={refetch} 
          markIsFetching={markIsFetching} 
          isFetching={isFetching} 
          setSearchVal={setSearchVal} 
        />
      </div>
    </>
  );
};

export default FinalExamPermission;
