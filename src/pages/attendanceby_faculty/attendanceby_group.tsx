import { Col, Row } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import FilterSelect, { TypeFilterSelect } from "components/FilterSelect";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import useGetAllData from "hooks/useGetAllData";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import React, {useState} from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { number_order } from "utils/number_orders";

interface AttendanceGroupType {
  subject: any,
  subjectCategory: any,
  teacherAccess: any,
  para: any,
  week: any,
  language: any
}

const selectData: TypeFilterSelect[] = [
  {
    name: "subject_id",
    label: "Subject",
    url: "subjects",
    permission: "subject_index",
    span: { xs: 24, sm: 24, md: 12, lg: 6, xl: 4 },
  },
  {
    name: "subject_category_id",
    label: "Subject Category",
    url: "subject-categories",
    permission: "subject-category_index",
    span: { xs: 24, sm: 24, md: 12, lg: 6, xl: 4 },
  },
  {
    name: "para_id",
    label: "Para",
    url: "paras",
    permission: "para_index",
    span: { xs: 24, sm: 24, md: 12, lg: 6, xl: 4 },
  },
  {
    name: "week_id",
    label: "Week",
    url: "weeks",
    permission: "week_index",
    span: { xs: 24, sm: 24, md: 12, lg: 6, xl: 4 },
  },
]

const AttendanceByGroup : React.FC = () : JSX.Element => {
  const {t} = useTranslation()
  const { id } = useParams();
  const { urlValue, writeToUrl } = useUrlQueryParams({});
  const [allData, setallData] = useState<any[]>();

  const { data, isFetching, isLoading } = useGetAllData({
    queryKey: ["time-tables", urlValue.perPage, urlValue.currentPage, urlValue?.filter?.faculty_id,urlValue?.filter?.subject_id, urlValue?.filter?.subject_category_id, urlValue?.filter?.para_id, urlValue?.filter?.week_id],
    url: `time-tables?expand=para,subject,subjectCategory,week,language,teacherAccess`,
    urlParams: {
      "per-page": urlValue.perPage,
      page: urlValue.currentPage,
      filter: {"group_id": id,"faculty_id": urlValue?.filter?.faculty_id, "subject_id": urlValue?.filter?.subject_id, "subject_category_id": urlValue?.filter?.subject_category_id, "para_id": urlValue?.filter?.para_id, "week_id": urlValue?.filter?.week_id}
    },
    options: {
      refetchOnWindowFocus: false,
      retry: 1,
      onSuccess: (res) => {
        setallData(res?.items);
      },
    },
  });

  const columns: ColumnsType<AttendanceGroupType> = [
    {
      title: "№",
      dataIndex: "order",
      fixed: "left",
      width: 50,
      render: (_, __, i) =>
        number_order(
          urlValue.currentPage,
          urlValue.perPage,
          Number(i),
          isLoading
        ),
    },
    {
      title: t("Subject name"),
      dataIndex: "subject_name",
      key: "subject_name",
      fixed: "left",
      render: (i,e) => <span>{e?.subject?.name}</span>
    },
    {
      title: t("Subject category"),
      dataIndex: "subject_category",
      key: "subject_category",
      render: (i,e) => <span>{e?.subjectCategory?.name}</span>
    },
    {
      title: t("Teacher"),
      dataIndex: "teacher_access",
      key: "teacher_access",
      render: (i,e) => <span>{e?.teacherAccess?.teacher?.first_name} {e?.teacherAccess?.teacher?.last_name}</span>
    },
    {
      title: t("Class time"),
      dataIndex: "class_time",
      key: "class_time",
      render: (i,e) => <span>{e?.para?.start_time} - {e?.para?.end_time}</span>
    },
    {
      title: t("Week"),
      dataIndex: "week",
      key: "week",
      render: (i,e) => <span>{e?.week?.name}</span>
    },
    {
      title: t("Language"),
      dataIndex: "language",
      key: "language",
      render: (i,e) => <span>{e?.language?.name}</span>
    },
  ];


  return(
    <>
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: "/" },
          { name: "Group attendance", path: "" },
        ]}
        title={t("Group attendance")}
        // btn={<Button type="primary">{t("Group attendance")}</Button>}
      />
      <div className="p-3">
        <Row gutter={[12,12]}>
          {selectData?.map((e, i) => (
            <Col key={i} xs={24} sm={24} md={12} lg={6} xl={6}>
              <FilterSelect
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
        </Row>

        <Table
          className="mt-3"
          columns={columns}
          dataSource={data?.items.length ? data?.items : allData}
          pagination={false}
          loading={isFetching}
          scroll={{x:400}}
        />

      </div>
    </>
  )
}

export default AttendanceByGroup