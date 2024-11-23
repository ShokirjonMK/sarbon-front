import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import SimpleViewModal from "./crud/base_view";
import SimpleUpdateModal from "./crud/base_update";
import SimpleCreateModal from "./crud/base_create";
import useGetAllData from "hooks/useGetAllData";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import CustomPagination from "components/Pagination";
import { number_order } from "utils/number_orders";
import HeaderPage from "components/HeaderPage";
import { Col, Input, Row, Table } from "antd";
import StatusTag from "components/StatusTag";
import { ColumnsType } from "antd/es/table";
import { TypeSimpleIndexPageProps } from "./types";
import FilterSelect from "components/FilterSelect";
import { expandData, formUIDataColums } from "./utils";
import { SearchFilled } from "@fluentui/react-icons";
import useDebounce from "hooks/useDebounce";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { CreateBtn } from "components/Buttons";
import checkPermission from "utils/check_permission";
import Actions from "components/Actions";
import { globalConstants } from "config/constants";
import useBreadCrumb from "hooks/useBreadCrumb";

const SimpleIndexPage: React.FC<TypeSimpleIndexPageProps> = ({
  queryKey,
  indexTitle,
  createTitle,
  editTitle,
  permissions,
  url,
  viewTitle,
  search,
  formUIData,
  selectData,
  isMain = true,
  onEdit,
  onView,
  onCreate,
}): JSX.Element => {
  const { t } = useTranslation();
  const [visibleView, setVisibleView] = useState<boolean>(false);
  const [visibleEdit, setVisibleEdit] = useState<boolean>(false);
  const [visibleCreate, setVisibleCreate] = useState<boolean>(false);
  const [allData, setAllData] = useState<any[]>([]);
  const [id, setId] = useState<number>();
  const { urlValue, writeToUrl } = useUrlQueryParams({
    currentPage: 1,
    perPage: 15,
  });

  const searchVal = useDebounce(urlValue?.q, globalConstants.debounsDuration);

  const { data, refetch, isLoading } = useGetAllData({
    queryKey: [
      queryKey ?? url,
      urlValue.perPage,
      urlValue.currentPage,
      urlValue?.filter_like?.sort,
      searchVal,
      ...(selectData ?? [])?.map((e) => urlValue.filter[e?.name]),
    ],
    url:
      url +
      `?${"sort=" + (urlValue?.filter_like?.sort ? urlValue?.filter_like?.sort : "-id")}&expand=description${expandData(formUIData)}` +
      (search ? "&query=" + searchVal : "") +
      (selectData?.length ? `&filter=${JSON.stringify(urlValue.filter)}` : ""),
    urlParams: { "per-page": url === "nationalities" ? 100 : urlValue.perPage, page: urlValue.currentPage },
    options: {
      onSuccess: (res) => {
        setAllData(res?.items);
      },
    },
  });

  const columns: ColumnsType<any> = React.useMemo(
    () => [
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
        width: 45,
        sorter: () => {writeToUrl({name: "sort", value: urlValue?.filter_like?.sort === "-id" ? "id" : "-id" }); return 0},

      },
      {
        title: t("Name"),
        render: (e: any) =>
          checkPermission(permissions.view_) ? (
            <span
              onClick={
                onView
                  ? () => {
                    onView(e?.id);
                  }
                  : () => {
                    setVisibleView(true);
                    setId(e?.id);
                  }
              }
              className="hover:text-[#0a3180] hover:underline cursor-pointer"
            >
              {e?.name}
            </span>
          ) : (
            <span>{e?.name}</span>
          ),
      },
      {
        title: t("Description"),
        dataIndex: "description",
      },
      ...formUIDataColums(formUIData ?? [], t),
      {
        title: t("Status"),
        render: (e: any) => <StatusTag status={e?.status} />,
        align: "center",
      },
      {
        title: t("Actions"),
        dataIndex: "actions",
        width: 120,
        align: "center",
        render: (i, e: any) => (
          <Actions
            id={e?.id}
            url={url}
            onClickEdit={
              onEdit
                ? () => {
                  onEdit(e?.id);
                }
                : () => {
                  setVisibleEdit(true);
                  setId(e?.id);
                }
            }
            onClickView={
              onView
                ? () => {
                  onView(e?.id);
                }
                : () => {
                  setVisibleView(true);
                  setId(e?.id);
                }
            }
            refetch={refetch}
            viewPermission={permissions.view_}
            editPermission={permissions.update_}
            deletePermission={permissions.delete_}
          />
        ),
      },
    ],
    [data?.items]
  );

  useBreadCrumb({pageTitle: t(indexTitle), breadcrumb: [
    { name: "Home", path: "/" },
    { name: indexTitle, path: "/" },
  ]})

  return (
    <div className="">
      {!isMain && (
        <HeaderPage
          title={indexTitle}
          buttons={
            search ? (
              <Input
                className="w-[320px] h-[32px]"
                value={urlValue?.q}
                placeholder={`${t("Search by name")}...`}
                prefix={<SearchFilled fontSize={20} color="#b9b9b9" />}
                onChange={(e) =>
                  writeToUrl({ name: "q", value: e.target.value })
                }
                allowClear
              />
            ) : null
          }
          create_permission={permissions.create_}
          createOnClick={onCreate ? onCreate : () => setVisibleCreate(true)}
        />
      )}
      <div className={isMain ? "content-card" : ""}>
        {isMain && <div className="flex justify-end mb-2">
          <CreateBtn
                onClick={onCreate ? onCreate : () => setVisibleCreate(true)}
                permission={permissions.create_} />
        </div>}
        <Row gutter={[12, 12]}>
          {isMain && search ? (
            <Col xs={24} sm={24} md={12} lg={8} xl={6}>
              <Input
                className=""
                placeholder={`${t("Search by name")}...`}
                prefix={<SearchFilled fontSize={20} color="#b9b9b9" />}
                onChange={(e) =>
                  writeToUrl({ name: "q", value: e.target.value })
                }
                allowClear
              />
            </Col>
          ) : null}
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
              span={e?.span ?? (!isMain ? { xl: 8 } : undefined)}
            />
          ))}
        </Row>
        {id && !onView ? (
          <SimpleViewModal
            visible={visibleView}
            setVisible={setVisibleView}
            setEditVisible={setVisibleEdit}
            refetch={refetch}
            url={url}
            id={id}
            title={viewTitle}
            formUIData={formUIData?.filter((e) => !e?.onlyTable)}
            permissions={permissions}
          />
        ) : null}
        {id && !onEdit ? (
          <SimpleUpdateModal
            visible={visibleEdit}
            setVisible={setVisibleEdit}
            refetch={refetch}
            id={id}
            url={url}
            title={editTitle}
            formUIData={formUIData?.filter((e) => !e?.onlyTable)}
          />
        ) : null}
        {!onCreate ? (
          <SimpleCreateModal
            visible={visibleCreate}
            setVisible={setVisibleCreate}
            refetch={refetch}
            url={`/${url}`}
            title={createTitle}
            formUIData={formUIData?.filter((e) => !e?.onlyTable)}
          />
        ) : null}
        <Table
          columns={columns}
          dataSource={data?.items.length ? data?.items : allData}
          bordered
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
    </div>
  );
};

export default SimpleIndexPage;
