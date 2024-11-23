import React, { useState } from "react";
import { Col, Row, Select, Tag } from "antd";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { useTranslation } from "react-i18next";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import useGetAllData from "hooks/useGetAllData";
import useGetData from "hooks/useGetData";
import { cf_filterOption } from "utils/others_functions";
import { IStudentMark } from "models/mark";
import { IGroup } from "models/education";
import ExamPermissionTable from "./permission_table";

const TeacherStudentExamPermission: React.FC = (): JSX.Element => {

  const { t } = useTranslation();
  const { urlValue, writeToUrl } = useUrlQueryParams({});
  const [searchVal, setSearchVal] = useState<string>("");

  const { data, isFetching } = useGetAllData({
    queryKey: [ "students", urlValue?.filter?.group_id, searchVal],
    url: `students?expand=profile`,
    urlParams: {
      "per-page": 0,
      filter: {"group_id": urlValue?.filter?.group_id},
      query: searchVal
    },
    options: {
      refetchOnWindowFocus: false,
      retry: 1,
      enabled: !!(urlValue?.filter?.group_id && urlValue.filter?.edu_semestr_subject_id),
    },
  });

  const { data: groups } = useGetAllData<IGroup>({
    queryKey: ["groups"],
    url: `groups`,
    urlParams: {expand: 'eduSemestrs,eduSemestrs.semestr'},
    options: { staleTime: Infinity, refetchOnWindowFocus: false, retry: 0 },
  });

  const { data: eduSemestrSubject } = useGetData({
    queryKey: ["edu-semestr-subjects", urlValue?.filter?.edu_semestr_id],
    url: `edu-semestr-subjects?expand=subject,eduSemestrExamsTypes,eduSemestrExamsTypes.examsType`,
    urlParams: {filter: {edu_semestr_id: urlValue?.filter?.edu_semestr_id}},
    options: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!urlValue?.filter?.edu_semestr_id
    },
  });

  const { data: studentMarkData, refetch, isFetching: markIsFetching } = useGetAllData<IStudentMark>({
    queryKey: ["student-marks", {edu_semestr_subject_id: urlValue.filter?.edu_semestr_subject_id, group_id: urlValue.filter?.group_id, edu_semestr_id: urlValue?.filter?.edu_semestr_id}],
    url: `student-marks`,
    urlParams: {
      "per-page": 0,
      filter: {edu_semestr_subject_id: urlValue.filter?.edu_semestr_subject_id, group_id: urlValue.filter?.group_id, is_deleted: 0}
    },
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: (!!urlValue?.filter?.group_id && !!urlValue?.filter?.edu_semestr_subject_id && !!urlValue?.filter?.edu_semestr_id),
    },
  });
  
  return (
    <>
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: "/" },
          { name: "Exclusion from examination", path: "" },
        ]}
        title={t("Exclusion from examination")}
      />
      <div className="p-3">
        <Row gutter={[4, 12]}>

          <Col xs={24} sm={24} md={12} lg={6} xl={6} >
            <Select
              showSearch
              allowClear
              className="w-full"
              value={urlValue?.filter?.group_id}
              placeholder={t("Filter by edu group")}
              optionFilterProp="children"
              onChange={(e) => {
                writeToUrl({name: "group_id", value: e});
                writeToUrl({name: "edu_semestr_subject_id", value: undefined});
                writeToUrl({name: "edu_semestr_id", value: undefined});
              }}
              filterOption={cf_filterOption}
              options={groups?.items?.map((item) => ({
                label: item?.unical_name,
                value: item?.id,
              }))}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={6} xl={6} >
            <Select
              allowClear
              className="w-full"
              value={urlValue?.filter?.edu_semestr_id}
              placeholder={t("Filter by  edu semestr")}
              optionFilterProp="children"
              disabled={!urlValue?.filter?.group_id}
              onChange={(e) => {
                writeToUrl({name: "edu_semestr_id", value: e});
                writeToUrl({name: "edu_semestr_subject_id", value: undefined});
              }}
              filterOption={cf_filterOption}
              options={groups?.items?.find(i => i?.id === urlValue?.filter?.group_id)?.eduSemestrs?.map((item) => ({
                label: <p>{item?.semestr?.name} {item?.status == 1 ? <Tag color="success" className="ml-4">{t("Active")}</Tag>: ''}</p>,
                value: item?.id,
              }))}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={6} xl={6} >
            <Select
              showSearch
              allowClear
              className="w-full"
              value={urlValue?.filter?.edu_semestr_subject_id}
              placeholder={t("Filter by  edu semestr subject")}
              disabled={!urlValue?.filter?.edu_semestr_id}
              optionFilterProp="children"
              onChange={(e) => {
                writeToUrl({name: "edu_semestr_subject_id", value: e});
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
          examTypes={eduSemestrSubject?.items?.find(e => e?.id == urlValue.filter?.edu_semestr_subject_id)?.eduSemestrExamsTypes?.filter((i:any) => i?.status == 1)} 
          refetch={refetch} 
          markIsFetching={markIsFetching} 
          isFetching={isFetching} 
          setSearchVal={setSearchVal} 
        />

      </div>
    </>
  );
};

export default TeacherStudentExamPermission;
