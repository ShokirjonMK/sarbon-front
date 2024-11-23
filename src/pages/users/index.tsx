import { useState } from "react";
import { useTranslation } from "react-i18next";
import useGetAllData from "hooks/useGetAllData";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import CustomPagination from "components/Pagination";
import { number_order } from "utils/number_orders";
import { Select, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { CreateBtn } from "components/Buttons";
import { Link, useNavigate } from "react-router-dom";
import Actions from "components/Actions";
import SearchInput from "components/SearchInput";
import UserStatusTag from "components/StatusTag/userStatusTag";
import SearchInputWithoutIcon from "components/SearchInput/searchInputWithoutIcon";
import { IRole } from "models/role_permissions";
import useGetData from "hooks/useGetData";
import { globalConstants } from "config/constants";
import checkPermission from "utils/check_permission";
import useBreadCrumb from "hooks/useBreadCrumb";

const Users = () => {
  const { t } = useTranslation();

  const [allData, setAllData] = useState<any[]>([]);
  const { urlValue, writeToUrl } = useUrlQueryParams({ currentPage: 1, perPage: 15 });
  const navigate = useNavigate()
  const [first_name, setfirst_name] = useState<string>();
  const [last_name, setlast_name] = useState<string>();
  const [middle_name, setmiddle_name] = useState<string>();
  const [username, setusername] = useState<string>();
  const [passport_number, setpassport_number] = useState<string>();
  const [passport_pin, setpassport_pin] = useState<string>();
  const [role_name, setrole_name] = useState<string>();

  const { data, refetch, isLoading } = useGetAllData({
    queryKey: [urlValue.perPage, urlValue.currentPage, urlValue.filter_like?.sort, first_name, last_name, middle_name, username, passport_number, role_name,  passport_pin ? passport_pin : undefined],
    url: `users?expand=profile`,
    urlParams: { 
      "per-page": urlValue.perPage, 
      page: urlValue.currentPage, 
      sort: urlValue.filter_like?.sort ?? "-id", 
      "filter-like": { first_name, last_name, middle_name, username, passport_number, passport_pin: passport_pin ? passport_pin : undefined }, 
      filter: { role_name, "-role_name": ["student"] }
    },
    options: {
      refetchOnWindowFocus: false,
      retry: 1,
      onSuccess: (res) => {
        setAllData(res?.items);
      }
    }
  })


  const { data: roles } = useGetData<IRole>({
    queryKey: ["roles"],
    url: "roles",
    options: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: checkPermission("access-control_roles")
    },
  });

  const columns: ColumnsType<any> = [
    {
      title: '№',
      showSorterTooltip: false,
      sorter: () => {writeToUrl({name: "sort", value: urlValue?.filter_like?.sort === "-id" ? "id" : "-id" }); return 0},
      children: [
        {
          width: 45,
          render: (_, __, i) => number_order(urlValue.currentPage, urlValue.perPage, Number(i), isLoading),
        },
      ]
    },
    {
      title: t('Last name'),
      showSorterTooltip: false,
      sorter: () => {writeToUrl({name: "sort", value: urlValue?.filter_like?.sort === "-last_name" ? "last_name" : "-last_name" }); return 0},
      children: [
        {
          title: <SearchInputWithoutIcon setSearchVal={setlast_name} duration={globalConstants.debounsDuration} filterKey="last_name" placeholder={`${t("Search by last name")}...`} />,
          render: (e) => checkPermission("user_view") ? (
            <Link to={`/users/view/${e?.id}`} className="text-neutral-900 hover:text-[#0a3180] underline cursor-pointer" >
              {e?.last_name}
            </Link>) : (<span>{e?.last_name}</span>),
        },
      ]
    },
    {
      title: t('First name'),
      showSorterTooltip: false,
      sorter: () => {writeToUrl({name: "sort", value: urlValue?.filter_like?.sort === "-first_name" ? "first_name" : "-first_name" }); return 0},
      children: [
        {
          title: <SearchInputWithoutIcon setSearchVal={setfirst_name} duration={globalConstants.debounsDuration} filterKey="first_name" placeholder={`${t("Search by name")}...`} />,
          render: (e) => checkPermission("user_view") ? (
            <Link to={`/users/view/${e?.id}`} className="text-neutral-900 hover:text-[#0a3180] underline cursor-pointer" >
              {e?.first_name}
            </Link>) : (<span>{e?.first_name}</span>),
        },
      ]
    },
    {
      title: t('Middle name'),
      showSorterTooltip: false,
      sorter: () => {writeToUrl({name: "sort", value: urlValue?.filter_like?.sort === "-middle_name" ? "middle_name" : "-middle_name" }); return 0},
      children: [
        {
          title: <SearchInputWithoutIcon setSearchVal={setmiddle_name} duration={globalConstants.debounsDuration} filterKey="middle_name" placeholder={`${t("Search by middle name")}...`} />,
          render: (e) => checkPermission("user_view") ? (
            <Link to={`/users/view/${e?.id}`} className="text-neutral-900 hover:text-[#0a3180] underline cursor-pointer" >
              {e?.middle_name}
            </Link>) : (<span>{e?.middle_name}</span>),
        },
      ]
    },
    {
      title: t('Username (login)'),
      children: [
        {
          title: <SearchInputWithoutIcon setSearchVal={setusername} duration={globalConstants.debounsDuration} filterKey="username" placeholder={`${t("Search by login")}...`} />,
          render: (e) => checkPermission("user_view") ? (
            <Link to={`/users/view/${e?.id}`} className="text-neutral-900 hover:text-[#0a3180] underline cursor-pointer" >
              {e?.username}
            </Link>) : (<span>{e?.username}</span>),
        },
      ]
    },
    {
      title: t('Role'),
      children: [
        {
          title: checkPermission("access-control_roles") ? <Select
            showSearch
            allowClear
            className="w-[180px]"
            placeholder={t("Filter by role")}
            optionFilterProp="children"
            onChange={(e) => setrole_name(e)}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={roles?.items?.map(role => ({ label: role?.name, value: role?.name }))}
          /> : "",
          dataIndex: 'role',
          render: (i: string[]) => i?.map((role, index) => <Tag key={role} className={index !== (i?.length - 1) ? "mb-2" : ""}>{role}</Tag>),
        },
      ]
    },
    {
      title: t('Identity document'),
      children: [
        {
          title: <SearchInputWithoutIcon setSearchVal={setpassport_number} duration={globalConstants.debounsDuration} filterKey="passport_number" placeholder={`${t("Search by passport")}...`} />,
          render: (_, __, i) => `${_?.profile?.passport_serial ? _?.profile?.passport_serial : "--"} ${_?.profile?.passport_number ? _?.profile?.passport_number : "-------"}`,
        },
      ]
    },
    {
      title: t('Status'),
      children: [
        {
          dataIndex: 'status',
          render: (i: string) => <UserStatusTag status={i} />,
        },
      ]
    },
    {
      title: t("Actions"),
      dataIndex: 'actions',
      width: 120,
      align: "center",
      children: [
        {
          render: (i, e) => <Actions
            id={e?.id}
            url={'users'}
            refetch={refetch}
            onClickEdit={() => navigate(`/users/update/${e?.id}`)}
            onClickView={() => navigate(`/users/view/${e?.id}`)}
            viewPermission={'user_view'}
            editPermission={"user_update"}
            deletePermission={"user_delete"}
          />,
        },
      ]
    },
  ];

  useBreadCrumb({pageTitle: t("Users"), breadcrumb: [
    { name: "Home", path: '/' },
    { name: "Users", path: '/users' }
  ]})

  return (
    <div className="">
      <div className="content-card">
        <div className="flex justify-between mb-3">
          <SearchInput className="max-w-[300px]" setSearchVal={setpassport_pin} duration={globalConstants.debounsDuration} placeholder="Search by JSHSHIR" />
          <CreateBtn onClick={() => navigate('/users/create?user-block=main-info')} permission={"user_create"} />
        </div>
        <Table
          columns={columns}
          dataSource={data?.items.length ? data?.items : allData}
          pagination={false}
          loading={isLoading}
          size="middle"
          className="mt-3"
          rowClassName="py-[12px]"
          scroll={{ x: 576 }}
        />
        {(data?._meta?.totalCount ?? 0) > 10 ? <CustomPagination totalCount={data?._meta.totalCount} currentPage={urlValue.currentPage} perPage={urlValue.perPage} /> : undefined}
      </div>
    </div>
  )
}

export default Users;
