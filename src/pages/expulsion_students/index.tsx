import React, { useState } from "react";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { useTranslation } from "react-i18next";
import useGetAllData from "hooks/useGetAllData";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import { useNavigate } from "react-router";
import UserStatusTag from "components/StatusTag/userStatusTag";
import SearchInputWithoutIcon from "components/SearchInput/searchInputWithoutIcon";
import { globalConstants } from "config/constants";
import checkPermission from "utils/check_permission";
import { IStudent } from "models/student";
import Table, { ColumnsType } from "antd/es/table";
import { number_order } from "utils/number_orders";
import CustomPagination from "components/Pagination";
import FilterSelect, { TypeFilterSelect } from "components/FilterSelect";
import { Button, Card, Form, Row, Tag, Upload } from "antd";
import { TypeFormUIData } from "pages/common/types";
import FormUIBuilder from "components/FormUIBuilder";
import { InboxOutlined } from "@ant-design/icons";

const selectData: TypeFilterSelect[] = [
  {
    name: "faculty_id",
    label: "Faculty",
    url: "faculties",
    permission: "faculty_index",
    child_names: ["edu_plan_id"],
    span: { xl: 8 },
  },
  {
    name: "edu_plan_id",
    label: "Edu plan",
    url: "edu-plans",
    permission: "edu-plan_index",
    parent_name: "faculty_id",
    span: { xl: 8 },
  },
  {
    name: "course_id",
    label: "Course",
    url: "courses",
    permission: "course_index",
    span: { xl: 8 },
  },
  {
    name: "edu_lang_id",
    label: "Language",
    url: "languages",
    permission: "languages_index",
    span: { xl: 8 },
  },
];

const formData: TypeFormUIData[] = [
  {
    name: "command_type",
    label: "Command type",
    url:'commands',
    type: "select",
    span: 24,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    span: 24,
    row: 6,
  },
];

const ExpulsionStudents: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [allData, setAllData] = useState<any[]>([]);
  const { urlValue, writeToUrl } = useUrlQueryParams({
    currentPage: 1,
    perPage: 15,
  });
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState<string>("");

  const [first_name, setfirst_name] = useState<string>("");
  const [last_name, setlast_name] = useState<string>("");
  const [middle_name, setmiddle_name] = useState<string>("");
  const [passport_number, setpassport_number] = useState<string>("");
  const [passport_pin, setpassport_pin] = useState<string>("");

  const { data, isLoading } = useGetAllData({
    queryKey: [ urlValue.perPage, urlValue.currentPage, urlValue.filter_like?.sort, searchVal, ...(Object.values(urlValue?.filter) ?? []), first_name, last_name, middle_name, passport_number, passport_pin,
    ],
    url: `students?sort=-id&expand=profile,user,course,eduForm,eduType,group&filter=${JSON.stringify(urlValue.filter)}&filter-like=${JSON.stringify({ first_name, last_name, middle_name, passport_number, passport_pin, })}`,
    urlParams: { "per-page": urlValue.perPage, page: urlValue.currentPage, sort: urlValue.filter_like?.sort ?? "-id", query: searchVal,},
    options: {
      onSuccess: (res) => {
        setAllData(res?.items);
      },
    },
  });

  const dataSource = data?.items?.length ? data?.items?.map((item: any) => ({...item, key: item?.id})) : allData

  const columns: ColumnsType<IStudent> = React.useMemo(() => [
      {
        title: "№",
        width: 45,
        showSorterTooltip: false,
        sorter: () => {
          writeToUrl({
            name: "sort",
            value: urlValue?.filter_like?.sort === "-id" ? "id" : "-id",
          });
          return 0;
        },
        children: [
          {
            render: (_, __, i) =>
              number_order(
                urlValue.currentPage,
                urlValue.perPage,
                Number(i),
                isLoading
              ),
          },
        ],
      },
      {
        title: t("First name"),
        showSorterTooltip: false,
        sorter: () => {
          writeToUrl({
            name: "sort",
            value:
              urlValue?.filter_like?.sort === "-first_name"
                ? "first_name"
                : "-first_name",
          });
          return 0;
        },
        children: [
          {
            title: (
              <SearchInputWithoutIcon
                setSearchVal={setfirst_name}
                duration={globalConstants.debounsDuration}
                filterKey="first_name"
                placeholder={`${t("Search by name")}...`}
              />
            ),
            render: (e: IStudent) =>
              checkPermission("student_view") ? (
                <span
                  onClick={() => navigate(`/students/view/${e?.id}`)}
                  className="hover:text-[#0a3180] underline cursor-pointer"
                >
                  {e?.user?.first_name}{" "}
                </span>
              ) : (
                <span>{e?.user?.first_name}</span>
              ),
          },
        ],
      },
      {
        title: t("Last name"),
        showSorterTooltip: false,
        sorter: () => {
          writeToUrl({
            name: "sort",
            value:
              urlValue?.filter_like?.sort === "-last_name"
                ? "last_name"
                : "-last_name",
          });
          return 0;
        },
        children: [
          {
            title: (
              <SearchInputWithoutIcon
                setSearchVal={setlast_name}
                duration={globalConstants.debounsDuration}
                filterKey="last_name"
                placeholder={`${t("Search by last name")}...`}
              />
            ),
            render: (e) =>
              checkPermission("student_view") ? (
                <span
                  onClick={() => navigate(`/students/view/${e?.id}`)}
                  className="hover:text-[#0a3180] underline cursor-pointer"
                >
                  {e?.user?.last_name}{" "}
                </span>
              ) : (
                <span>{e?.user?.last_name}</span>
              ),
          },
        ],
      },
      {
        title: t("Middle name"),
        showSorterTooltip: false,
        sorter: () => {
          writeToUrl({
            name: "sort",
            value:
              urlValue?.filter_like?.sort === "-middle_name"
                ? "middle_name"
                : "-middle_name",
          });
          return 0;
        },
        children: [
          {
            title: (
              <SearchInputWithoutIcon
                setSearchVal={setmiddle_name}
                duration={globalConstants.debounsDuration}
                filterKey="middle_name"
                placeholder={`${t("Search by middle name")}...`}
              />
            ),
            render: (e) =>
              checkPermission("student_view") ? (
                <span
                  onClick={() => navigate(`/students/view/${e?.id}`)}
                  className="hover:text-[#0a3180] underline cursor-pointer"
                >
                  {e?.user?.middle_name}{" "}
                </span>
              ) : (
                <span>{e?.user?.middle_name}</span>
              ),
          },
        ],
      },
      {
        title: t("JSHSHIR"),
        children: [
          {
            dataIndex: "passort_pin",
            title: (
              <SearchInputWithoutIcon
                type="number"
                setSearchVal={setpassport_pin}
                duration={globalConstants.debounsDuration}
                filterKey="passport_pin"
                placeholder={`${t("Search by JSHSHIR")}...`}
              />
            ),
            render: (i: string, e) => <span>{e?.profile?.passport_pin}</span>,
          },
        ],
      },
      {
        title: t("Education type"),
        children: [
          {
            render: (i: string, e) => (
              <span>
                {e?.eduType?.name} {e?.eduForm?.name}
              </span>
            ),
          },
        ],
      },
      {
        title: t("Course"),
        children: [
          {
            dataIndex: "course_id",
            render: (i: string, e) => <span>{e?.course?.name}</span>,
          },
        ],
      },
      {
        title: t("Group"),
        children: [
          {
            dataIndex: "group_id",
            render: (i: string, e) => <span>{e?.group?.unical_name}</span>,
          },
        ],
      },
      {
        title: t("Status"),
        children: [
          {
            dataIndex: "status",
            render: (e: string) => <UserStatusTag status={e} />,
          },
        ],
      },
    ],
    [data?.items]
  );

  const normFile = (e: any) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  

  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  const onSelectChange = (selectedRowKeys: any) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  
  const filterData: IStudent[] | undefined = data && data?.items ?  data?.items?.filter((item) => selectedRowKeys.includes(item?.id)) : undefined

 

  return (
    <>
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: "/" },
          { name: "Expulsion", path: "" },
        ]}
        title={t("Expulsion of students")}
        btn={<div className="d-f gap-3"></div>}
      />

      <div className="p-3">
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
              // span={ xl: 8 }
            />
          ))}
        </Row>
        <div className="grid grid-cols-6 gap-12">
          <div className="col-span-4">
            <Table
              rowSelection={{
                type: 'checkbox',
                ...rowSelection,
                checkStrictly: true,
              }}
              columns={columns}
              dataSource={dataSource}
              pagination={false}
              loading={isLoading}
              size="middle"
              className="mt-3"
              rowClassName="py-[12px]"
              scroll={{ x: 576 }}
            />
            {(data?._meta?.totalCount ?? 0) > 10 ? (
              <CustomPagination
                totalCount={data?._meta.totalCount}
                currentPage={urlValue.currentPage}
                perPage={urlValue.perPage}
              />
            ) : undefined}
          </div>
          <div className="col-span-2 mt-3">
          <Card
              className="drop-shadow-md bgu content-card"
              bodyStyle={{ padding: "0.75rem" }}
              headStyle={{ padding: ".75rem" }}
              type="inner"
              title={<div className="top text-center">{t('Exclusion')}</div>}
            >
              <Form
                form={form}
                layout="vertical"
                // onFinish={mutate}
              >
                {
                  filterData?.map((item:any) => (<Tag className="mb-3">{item?.profile?.first_name} {item?.profile?.last_name}</Tag>))
                }
                <FormUIBuilder data={formData} form={form} />
                <Form.Item
                  name="dragger"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  noStyle
                >
                  <Upload.Dragger name="files" action="/upload.do">
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      {t('Load the command file')}
                    </p>
                  </Upload.Dragger>
                  <Button type="primary" className="mt-3 ml-auto block" htmlType="submit">{t("Exclusion")}</Button>
                </Form.Item>
              </Form>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExpulsionStudents;
