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
import VedomstMarkTableView from "./vedomst_mark_table";
import { ExcelBtn } from "components/Buttons";
import { excelExport } from "utils/excelExport";
import { IGroup } from "models/education";
import { IProfile } from "models/user";

const StudentMarksView: React.FC = (): JSX.Element => {
  
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
      span: { xs: 24, sm: 24, md: 12, lg: 6, xl: 6, xxl: 3 },
    },
    {
      name: "edu_plan_id",
      label: "EduPlan",
      url: "edu-plans",
      permission: "edu-plan_index",
      parent_name: "faculty_id",
      child_names: ["edu_semestr_id", "group_id", "subject-id", "type"],
      span: { xs: 24, sm: 24, md: 12, lg: 6, xl: 6, xxl: 6 },
    },
    {
      name: "edu_semestr_id",
      label: "Edu semestr",
      url: "edu-semestrs?expand=semestr",
      permission: "edu-semestr_index",
      parent_name: "edu_plan_id",
      all: true,
      child_names: ["subject_id", "type"],
      span: { xs: 24, sm: 24, md: 12, lg: 6, xl: 6, xxl: 3 },
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
      span: { xs: 24, sm: 24, md: 12, lg: 6, xl: 6, xxl: 3 },
    },
  ];

  const { data: eduSemestrSubject } = useGetData({
    queryKey: ["edu-semestr-subjects", { edu_semestr_id: urlValue?.filter?.edu_semestr_id}],
    url: `edu-semestr-subjects?expand=subjectVedomst.isPermission,subject,eduSemestrExamsTypes,eduSemestrExamsTypes.examsType&filter={"edu_semestr_id":${urlValue?.filter?.edu_semestr_id}}`,
    options: {
      enabled: !!urlValue?.filter?.edu_semestr_id ,
    },
  });

  const { data: studentMarkData, refetch, isFetching: markIsFetching } = useGetAllData<IStudentMark>({
    queryKey: ["student-marks/get", { vedomst: urlValue?.filter_like?.type, subject_id: urlValue.filter?.subject_id, edu_semestr_id: urlValue.filter?.edu_semestr_id, group_id: urlValue.filter?.group_id, edu_year_id: urlValue.filter?.edu_year_id }],
    url: `student-marks/get?expand=student.profile,group`,
    urlParams: {
      "per-page": 0,
      group_id: urlValue.filter?.group_id,
      edu_year_id: urlValue.filter?.edu_year_id,
      filter: { subject_id: urlValue.filter?.subject_id, vedomst: urlValue?.filter_like?.type },
      edu_semestr_id: urlValue.filter?.edu_semestr_id
    },
    options: {
      enabled: !!urlValue?.filter_like?.type,
    },
  });

  const students = useMemo(() => {
    let _students: { id: number, profile: IProfile | undefined, [key: number]: any, group: IGroup | undefined }[] = [];
    studentMarkData?.items?.forEach(e => {
      const i = _students?.findIndex(a => a?.id === e?.student_id);

      if (i >= 0) {
        _students[i] = { ..._students[i], [e?.exam_type_id]: e }
      } else {
        _students.push({
          id: e?.student_id,
          profile: e?.student?.profile,
          group: e?.group,
          [e?.exam_type_id]: e
        })
      }
    });

    return _students
  }, [studentMarkData])
  
  const vedomstData = useMemo(() => {
    return eduSemestrSubject?.items?.find((e: any) => e?.subject_id === urlValue.filter?.subject_id)?.subjectVedomst;
  }, [urlValue.filter?.subject_id, eduSemestrSubject?.items]);
  
  const isVedomstPermission = vedomstData?.find((e: any) => e?.type == urlValue?.filter_like?.type)?.isPermission;
  
  const examTypeData = useMemo(() => {
    return eduSemestrSubject?.items?.find(e => e?.subject_id === urlValue.filter?.subject_id)?.eduSemestrExamsTypes?.filter((i: any) => i?.status == 1)
  }, [urlValue.filter?.subject_id, eduSemestrSubject?.items])
  const exportExcel = async () => {
    const arr: any = [];

      students?.forEach((element) => {
        arr.push({
          ["Familiya"]: element?.profile?.last_name,
          ["Ism"]: element?.profile?.first_name,
          ["Otasining ismi"]: element?.profile?.middle_name,
          ["Guruh"]: element?.group?.unical_name,
          [examTypeData?.find((exType: any) => exType?.exams_type_id === 1)?.examsType?.name]: element[1]?.ball,
          [examTypeData?.find((exType: any) => exType?.exams_type_id === 2)?.examsType?.name]: element[2]?.ball,
          [examTypeData?.find((exType: any) => exType?.exams_type_id === 5)?.examsType?.name]: element[5]?.ball,
          [examTypeData?.find((exType: any) => exType?.exams_type_id === 3)?.examsType?.name]: element[3]?.ball,
          ["Umumiy ball"]: `${element[1]?.ball + element[2]?.ball + element[3]?.ball + element[5]?.ball} / 100`,
        })
      })
      excelExport(arr, `Baholar`);

  }  

  return (
    <>
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: "/" },
          { name: "Baholarni ko'rish", path: "" },
        ]}
        title={t("Baholarni ko'rish")}
        btn={<ExcelBtn onClick={exportExcel} />}
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
              onChange={e?.onChange}
            />
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
          <Col xs={24} sm={24} md={12} lg={6} xl={3} >
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

        <VedomstMarkTableView
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

export default StudentMarksView;
