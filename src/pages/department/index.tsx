import { Col, Row, Select, Tag } from "antd";
import HeaderPage from "components/HeaderPage";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Radio } from "antd";
import {Table20Regular,TextBulletListTree20Filled,
} from "@fluentui/react-icons";
import useGetAllData from "hooks/useGetAllData";
import { IDepartment } from "models/edu_structure";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { number_order } from "utils/number_orders";
import DepartmentUpdate from "./crud/update";
import StatusTag from "components/StatusTag";
import checkPermission from "utils/check_permission";
import CustomPagination from "components/Pagination";
import { Link, useNavigate } from "react-router-dom";
import TreeDepartment from "./components/tree";
import Actions from "components/Actions";
import FilterSelect, { TypeFilterSelect } from "components/FilterSelect";
import useGetOneData from "hooks/useGetOneData";
import { globalConstants } from "config/constants";
import SearchInput from "components/SearchInput";
import useBreadCrumb from "hooks/useBreadCrumb";

const selectData: TypeFilterSelect[] = [
  {
    name: "parent_id",
    label: "Parent",
    url: "departments",
    permission: "department_index",
  },
];



const Department: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { urlValue, writeToUrl } = useUrlQueryParams({
    currentPage: 1,
    perPage: 10,
  });

  const [searchVal, setSearchVal] = useState<string>("");
  const [allData, setallData] = useState<IDepartment[]>();
  const [isOpenForm, setisOpenForm] = useState<boolean>(false);
  const [visibleView, setVisibleView] = useState<boolean>(false);
  const [id, setId] = useState<number | undefined>();
  const [types, setTypes] = useState<any>();

  const { data, refetch, isLoading } = useGetAllData<IDepartment>({
    queryKey: ["departments",urlValue.perPage,urlValue.currentPage,searchVal,urlValue?.filter?.parent_id,urlValue?.filter_like?.types,],
    url: "departments?sort=-id&expand=description,parent,types,userAccess,leader",
    urlParams: { "per-page": urlValue.perPage, page: urlValue.currentPage, query: searchVal, filter: JSON.stringify(urlValue.filter), type: urlValue.filter_like?.types,},
    options: {
      refetchOnWindowFocus: false,
      retry: 1,
      onSuccess: (res) => {
        setallData(res?.items);
        setisOpenForm(false);
      },
    },
  });

  useEffect(() => {
    if (!urlValue.filter_like?.type) {
      writeToUrl({ name: "type", value: "table" });
    } 
  }, []);

  const { isFetching } = useGetOneData({
    queryKey: ["departments/types"],
    url: "departments/types",
    urlParams: { "per-page": 0 },
    options: {
      onSuccess: (res) => {
        setTypes(res);
      },
      // enabled: false
    },
  });

  const columns: ColumnsType<IDepartment> = [
    {
      title: "№",
      dataIndex: "order",
      render: (_, __, i) =>
        number_order(
          urlValue.currentPage,
          urlValue.perPage,
          Number(i),
          isLoading
        ),
    },
    {
      title: t("Name"),
      dataIndex: "name",
      key: "name",
      render: (i, e) =>
        checkPermission("department_view") ? (
          <Link
            to={`/structural-unit/department/view/${e?.id}`}
            onClick={() => {
              setVisibleView(true);
              setId(e?.id);
            }}
            className="underline text-black"
          > 
            {e?.name}
          </Link> 
        ) : (
          <span>{e?.name}</span>
        ),
    },
    {
      title: t("Description"),
      dataIndex: "description",
      key: "description",
    },
    {
      title: t("Type"),
      key: "type",
      render: (i, e) => <Tag className="px-3">{e?.types?.name}</Tag>,
    },
    {
      title: t("Parent"),
      dataIndex: "parent_id",
      key: "parent",
      render: (i, e) => <span>{e?.parent?.name}</span>,
    },
    {
      title: t("Department head"),
      dataIndex: "leader",
      key: "leader",
      render: (i, e) => (
        <span>
          {e?.leader?.first_name} {e?.leader?.last_name}
        </span>
      ),
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      render: (i, e) => <StatusTag status={e?.status} />,
    },
    {
      title: t("Actions"),
      dataIndex: "actions",
      key: "actions",
      render: (i, e) => (
        <Actions
          id={e?.id}
          url={"departments"}
          refetch={refetch}
          onClickEdit={() => {
            setisOpenForm(true);
            setId(e?.id);
          }}
          onClickView={() =>
            navigate(`/structural-unit/department/view/${e?.id}`)
          }
          viewPermission={"department_view"}
          editPermission={"department_update"}
          deletePermission={"department_delete"}
        />
      ),
    },
  ];

  const options = [
    { label: <Table20Regular className="m-auto mt-1" />, value: "table" },
    {
      label: <TextBulletListTree20Filled className="m-auto mt-1" />,
      value: "tree",
    },
  ];

  useBreadCrumb({pageTitle: "Department", breadcrumb: [
    {name: "Home", path: '/'},
    {name: "Department", path: '/structural-unit/department?type=table'},
  ]})

  return (
    <>
      <HeaderPage
        title={"Department"}
        buttons={
          <>
            <Row gutter={[12, 12]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <SearchInput duration={globalConstants.debounsDuration} setSearchVal={setSearchVal} />
              </Col>

              {
                checkPermission('department_index') ? 
                <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                <Select
                  placeholder={t("Filter by type")}
                  allowClear
                  defaultValue={urlValue.filter_like?.types}
                  onChange={(e) => {
                    writeToUrl({ name: "types", value: e });
                  }}
                  loading={isFetching}
                >
                  {types?.length
                    ? types?.map((element: any, i: number) => (
                      <Select.Option key={i} value={element?.id}>
                        {element?.name}
                      </Select.Option>
                    ))
                    : null}
                </Select>
              </Col> : null
              }

              {
                checkPermission('department_index') ? 
                selectData?.map((e, i) => (
                  <Col key={i} xs={24} sm={24} md={12} lg={6} xl={6}>
                    <FilterSelect
                      url={e.url}
                      name={e.name}
                      label={e.label}
                      permission={e.permission}
                      parent_name={e?.parent_name}
                      child_names={e?.child_names}
                      value_name={e?.value_name}
                      span={24}
                    />
                  </Col>
                )) : null
              }

              
            </Row>
            <Radio.Group
              options={options}
              onChange={(e) =>
                writeToUrl({ name: "type", value: e.target.value })
              }
              value={urlValue.filter_like?.type}
              optionType="button"
            />
          </>
        }
        create_permission={"department_create"}
        createOnClick={() => {
          setisOpenForm(true);
          setId(undefined);
        }}
        className="mb-5"
      />

      <DepartmentUpdate
        id={id}
        isOpenForm={isOpenForm}
        setisOpenForm={setisOpenForm}
        setId={setId}
        refetch={refetch}
      />

      {urlValue.filter_like?.type !== "tree" ? (
        <div>
          <Table
            columns={columns}
            dataSource={data?.items.length ? data?.items : allData}
            pagination={false}
            loading={isLoading}
          />

          <CustomPagination
            totalCount={data?._meta.totalCount}
            currentPage={urlValue.currentPage}
            perPage={urlValue.perPage}
          />
        </div>
      ) : (
        <TreeDepartment
          data={data?.items ?? []}
          refetch={refetch}
          setVisibleEdit={setisOpenForm}
          setId={setId}
        />
      )}
    </>
  );
};

export default Department;
/*
 * department_index
 * department_delete
 * department_update
 * department_view
 */