import React, { useState } from "react";
import { Col,Row } from "antd";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import { useTranslation } from "react-i18next";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { CreateBtn } from "components/Buttons";
import { Link, useNavigate } from "react-router-dom";
import FilterSelect, { TypeFilterSelect } from "components/FilterSelect";
import { IGroup } from "models/education";
import Table, { ColumnsType } from "antd/es/table";
import { number_order } from "utils/number_orders";
import useGetAllData from "hooks/useGetAllData";
import checkPermission from "utils/check_permission";
import Actions from "components/Actions";
import CustomPagination from "components/Pagination";
import UpdateGroup from "./crud/update";
import SearchInput from "components/SearchInput";
import { globalConstants } from "config/constants";
import StatusTag from "components/StatusTag";

const selectData: TypeFilterSelect[] = [
  {
    name: "faculty_id",
    label: "Faculty",
    url: "faculties",
    permission: "faculty_index",
    child_names: ["direction_id","edu_plan_id"]
  },
  {
    name: "direction_id",
    label: "Direction",
    url: "directions",
    permission: "direction_index",
    parent_name: "faculty_id",
    child_names: ["edu_plan_id"]
  },
  {
    name: "edu_plan_id",
    label: "Edu plan",
    url: "edu-plans",
    permission: "edu-plan_index",
    parent_name: "direction_id"
  },
  
];

const Group: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate()
  const { urlValue } = useUrlQueryParams({
    currentPage: 1,
    perPage: 10,
  });

  const [id, setId] = useState<number | undefined>();
  const [isOpenForm, setisOpenForm] = useState<boolean>(false);
  const [allData, setallData] = useState<IGroup[]>();
  const [searchVal, setSearchVal] = useState<string>("");

  const { data, refetch, isLoading } = useGetAllData<IGroup>({
    queryKey: ["groups", urlValue.perPage,urlValue.currentPage,searchVal,urlValue?.filter?.faculty_id,urlValue?.filter?.direction_id,urlValue?.filter?.edu_plan_id,],
    url: `groups?sort=-id&expand=faculty,eduPlan,languages,direction,lang`,
    urlParams: {
      "per-page": urlValue.perPage,
      page: urlValue.currentPage, 
      query: searchVal ? searchVal : undefined, 
      filter: JSON.stringify(Object.keys(urlValue.filter)?.length ? urlValue.filter : undefined),
    },
    options: {
      refetchOnWindowFocus: false,
      retry: 1,
      onSuccess: (res) => {
        setallData(res?.items);
        setisOpenForm(false);
      },
    },
  });

  const columns: ColumnsType<IGroup> = [
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
        checkPermission("group_view") ? (
          <Link to={`/group/view/${e?.id}`} className="underline text-black">
            {e?.unical_name}
          </Link>
        ) : (
          <span>{e?.unical_name}</span>
        ),
    },
    {
      title: t("Faculty"),
      dataIndex: "faculty_id",
      key: "faculty",
      render: (i, e) => <span>{e?.faculty?.name}</span>,
    },
    {
      title: t("Direction"),
      dataIndex: "direction",
      key: "direction",
      render: (i, e) => <span>{e?.direction?.name}</span>,
    },
    {
      title: t("Edu plan"),
      dataIndex: "edu_plan_id",
      key: "edu_plan_id",
      render: (i, e) => <span>{e?.eduPlan?.name}</span>,
    },
    {
      title: t("Edu language"),
      dataIndex: "lang_id",
      key: "lang_id",
      render: (i, e) => <span>{e?.languages?.name}</span>,
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      render: (i) => <StatusTag status={i} />,
    },
    {
      title: t("Actions"),
      dataIndex: "actions",
      key: "actions",
      render: (i, e) => (
        <Actions
          id={e?.id}
          url={"groups"}
          refetch={refetch}
          onClickEdit={() => { setisOpenForm(true); setId(e?.id);}}
          onClickView={() => navigate(`/group/view/${e?.id}`)}
          viewPermission={"group_view"}
          editPermission={"group_update"}
          deletePermission={"group_delete"}
        />
      ),
    },
  ]

  return (
    <div className="">
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: "/" },
          { name: "Groups", path: "" },
        ]}
        title={t("Groups")}
        btn={
          <div className="flex items-center">
            <CreateBtn onClick={() => { setisOpenForm(true); setId(undefined); }} permission={"group_create"} />
          </div>
        }
      />

      <div className="content-card">
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={24} md={12} lg={6} xl={6}>
            <SearchInput duration={globalConstants.debounsDuration} setSearchVal={setSearchVal} />
          </Col>
          {selectData?.map((e, i) => (
            <Col key={i} xs={24} sm={24} md={12} lg={8} xl={4}>
              <FilterSelect
                url={e.url}
                name={e.name}
                label={e.label}
                permission={e.permission}
                parent_name={e?.parent_name}
                child_names={e?.child_names}
                value_name={e?.value_name}
                span={{ xs: 24, sm: 24, xl: 24, lg: 24 }}
              />
            </Col>
          ))}
        </Row>

        <UpdateGroup
          id={id}
          isOpenForm={isOpenForm}
          setisOpenForm={setisOpenForm}
          setId={setId}
          refetch={refetch}
        />

        <div className="mt-4">
          <Table
            columns={columns}
            dataSource={data?.items.length ? data?.items : allData}
            pagination={false}
            loading={isLoading}
            scroll={{ x: 765 }}
          />

          <CustomPagination
            totalCount={data?._meta.totalCount}
            currentPage={urlValue.currentPage}
            perPage={urlValue.perPage}
          />
        </div>
      </div>


    </div>
  )
}

export default Group