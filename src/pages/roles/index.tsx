import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import useGetAllData from "hooks/useGetAllData";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import CustomPagination from "components/Pagination";
import { number_order } from "utils/number_orders";
import { Col, Row, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { CreateBtn } from "components/Buttons";
import { Link, useNavigate } from "react-router-dom";
import Actions from "components/Actions";
import SearchInput from "components/SearchInput";
import { globalConstants } from "config/constants";
import checkPermission from "utils/check_permission";
import useBreadCrumb from "hooks/useBreadCrumb";

const Roles = () => {

  const { t } = useTranslation();
  const [allData, setAllData] = useState<any[]>([]);
  const { urlValue } = useUrlQueryParams({ currentPage: 1, perPage: 15 });
  const navigate = useNavigate()
  const [searchVal, setSearchVal] = useState<string>("");

  const { data, refetch, isLoading } = useGetAllData({
    queryKey: ["roles", urlValue.perPage, urlValue.currentPage, searchVal],
    url: "roles?expand=description",
    urlParams: { "per-page": urlValue.perPage, page: urlValue.currentPage, query: searchVal },
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
      onSuccess: (res) => {
        setAllData(res?.items);
      }
    }
  })

  const columns: ColumnsType<any> = React.useMemo(() => [
    {
      title: '№',
      dataIndex: 'order',
      render: (_, __, i) => number_order(urlValue.currentPage, urlValue.perPage, Number(i), isLoading),
      width: 45,
    },
    {
      title: t('Name'),
      dataIndex: 'name',
      render: (i, e) => checkPermission("access-control_role-permissions") ? <Link to={`/roles/view/${e?.name}`} className="text-[#000]">{e?.name}</Link> : e?.name
    },
    {
      title: t('Description'),
      dataIndex: 'description',
    },
    {
      title: t("Actions"),
      dataIndex: 'actions',
      width: 120,
      align: "center",
      render: (i, e) => <Actions
        id={e?.name}
        url={'roles'}
        refetch={refetch}
        onClickEdit={() => navigate(`/roles/update/${e?.name}`)}
        onClickView={() => navigate(`/roles/view/${e?.name}`)}
        viewPermission={'access-control_role-permissions'}
        editPermission={"access-control_update-role"}
        deletePermission={"access-control_delete-role"}
      />
    },
  ], [data?.items]);

  useBreadCrumb({pageTitle: "Roles", breadcrumb: [
    { name: "Home", path: '/' },
    { name: "Roles", path: '/roles' }
  ]})

  return (
    <div className="content-card">
      <div className="flex justify-end">
        <CreateBtn
          onClick={() => navigate('/roles/update/0')}
          permission={"access-control_create-role"} />
      </div>
      <div className="px-[24px] py-[20px]">
        <Row gutter={[12, 12]}>
                <Col xs={24} sm={24} md={12} lg={8} xl={6}>
                    <SearchInput setSearchVal={setSearchVal} duration={globalConstants.debounsDuration} />
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={data?.items.length ? data?.items : allData}
                pagination={false}
                loading={isLoading}
                size="middle"
                className="mt-3"
                rowClassName="py-[12px]"
                scroll={globalConstants?.tableScroll}
            />
          {(data?._meta?.totalCount ?? 0) > 10 ? <CustomPagination totalCount={data?._meta.totalCount} currentPage={urlValue.currentPage} perPage={urlValue.perPage} /> : undefined}
      </div>
    </div>
  )
}

export default Roles;
