import React, { useState } from "react";
import useGetAllData from "hooks/useGetAllData";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import { IKafedra } from "models/edu_structure";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import Table, { ColumnsType } from "antd/es/table";
import { number_order } from "utils/number_orders";
import checkPermission from "utils/check_permission";
import CustomPagination from "components/Pagination";
import StatusTag from "components/StatusTag";
import Actions from "components/Actions";
import KafedraUpdate from "./crud/update";
import HeaderPage from "components/HeaderPage";
import { globalConstants } from "config/constants";
import SearchInput from "components/SearchInput";
import FilterSelect, { TypeFilterSelect } from "components/FilterSelect";
import { Col } from "antd";

const selectData: TypeFilterSelect[] = [
  {
    name: "faculty_id",
    label: "Faculty",
    url: "faculties",
    permission: "faculty_index",
    child_names:["direction_id"],
    span: { xs: 24, sm: 24, md: 12, lg: 6, xl: 4 },
  },
  {
    name: "direction_id",
    label: "Direction",
    url: "directions",
    permission: "direction_index",
    parent_name:"faculty_id",
    span: { xs: 24, sm: 24, md: 12, lg: 6, xl: 4 },
  },
]

const Kafedras: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { urlValue, writeToUrl } = useUrlQueryParams({
    currentPage: 1,
    perPage: 10,
  });
  // const searchVal = useDebounce(urlValue.q, globalConstants.debounsDuration);
  const [searchVal, setSearchVal] = useState<string>("");
  const [allData, setallData] = useState<IKafedra[]>();
  const [isOpenForm, setisOpenForm] = useState<boolean>(false);
  const [visibleView, setVisibleView] = useState<boolean>(false);
  const [id, setId] = useState<number | undefined>();

  const { data, refetch, isLoading } = useGetAllData<IKafedra>({
    queryKey: ["kafedras", urlValue.perPage, urlValue.currentPage, searchVal,urlValue?.filter?.faculty_id,urlValue?.filter?.direction_id],
    url: "kafedras?sort=-id&expand=description,userAccess,leader",
    urlParams: {
      "per-page": urlValue.perPage,
      page: urlValue.currentPage,
      query: searchVal,
      filter: JSON.stringify(urlValue.filter)
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

  const columns: ColumnsType<IKafedra> = [
    {
      title: "№",
      dataIndex: "order",
      width: 45,
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
        checkPermission("kafedra_view") ? (
          <Link
            to={`/structural-unit/kafedras/view/${e?.id}`}
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
      title: t("Headmaster"),
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
      width: 120,
      align: "center",
      render: (i, e) => (
        <Actions
          id={e?.id}
          url={"kafedras"}
          refetch={refetch}
          onClickEdit={() => {
            setisOpenForm(true);
            setId(e?.id);
          }}
          onClickView={() =>
            navigate(`/structural-unit/kafedras/view/${e?.id}`)
          }
          viewPermission={"kafedra_view"}
          editPermission={"kafedra_update"}
          deletePermission={"kafedra_delete"}
        />
      ),
    },
  ];

  return (
    <>
      <HeaderPage
        title={"Kafedra"}
        buttons={
          <div className="flex items-center">
            <SearchInput duration={globalConstants.debounsDuration} setSearchVal={setSearchVal}/>
            {selectData?.map((e, i) => (
            <Col key={i} xs={24} sm={24} md={12} lg={8} xl={8} className="ml-4">
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
          </div>
        }
        create_permission={"kafedra_create"}
        createOnClick={() => {
          setisOpenForm(true);
          setId(undefined);
        }}
        className="mb-5"
      />

      <Table
        columns={columns}
        dataSource={data?.items.length ? data?.items : allData}
        pagination={false}
        loading={isLoading}
      />

      <KafedraUpdate
        id={id}
        isOpenForm={isOpenForm}
        setisOpenForm={setisOpenForm}
        setId={setId}
        refetch={refetch}
      />

      {(data?._meta.totalCount ?? 0) > 10 ? <CustomPagination
        totalCount={data?._meta.totalCount}
        currentPage={urlValue.currentPage}
        perPage={urlValue.perPage}
      /> : null}
    </>
  );
};

export default Kafedras;

/**
 * kafedra_index
 * kafedra_delete
 * kafedra_update
 * kafedra_view
 * kafedra_create
 */
