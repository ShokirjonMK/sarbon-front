import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import useGetAllData from "hooks/useGetAllData";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import CustomPagination from "components/Pagination";
import { number_order } from "utils/number_orders";
import { Button, Drawer, Form, Row, Select, Table, Tag, message } from "antd";
import { ColumnsType } from "antd/es/table";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { Link } from "react-router-dom";
import SearchInputWithoutIcon from "components/SearchInput/searchInputWithoutIcon";
import { IRole } from "models/role_permissions";
import useGetData from "hooks/useGetData";
import { globalConstants } from "config/constants";
import checkPermission from "utils/check_permission";
import dayjs from "dayjs";
import FilterSelect, { TypeFilterSelect } from "components/FilterSelect";
import { ExcelBtn } from "components/Buttons";
import instance from "config/_axios";
import { excelExport } from "utils/excelExport";
import Actions from "components/Actions";
import { TitleModal } from "components/Titles";
import { IoClose } from "react-icons/io5";
import useGetOneData from "hooks/useGetOneData";

const selectData: TypeFilterSelect[] = [
  {
    name: "kafedra_id",
    label: "Kafedra",
    url: "kafedras",
    permission: "kafedra_index",
  },
]

const UsersStatistic = () => {
  const { t } = useTranslation();

  const [allData, setAllData] = useState<any[]>([]);
  const { urlValue, writeToUrl } = useUrlQueryParams({ currentPage: 1, perPage: 15 });
  const [first_name, setfirst_name] = useState<string>();
  const [last_name, setlast_name] = useState<string>();
  const [middle_name, setmiddle_name] = useState<string>();
  const [username, setusername] = useState<string>();
  const [passport_number, setpassport_number] = useState<string>();
  const [passport_pin, setpassport_pin] = useState<string>();
  const [role_name, setrole_name] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpenDrawer, setisOpenDrawer] = useState<boolean>(false);
  const [id, setId] = useState<number>()
  const [view_id, setview_id] = useState<number>()
 


  const { data, isLoading, refetch } = useGetAllData({
    queryKey: [urlValue.perPage, urlValue.currentPage, urlValue?.filter, urlValue.filter_like?.sort, first_name, last_name, middle_name, username, passport_number, role_name, passport_pin],
    url: `users?expand=lastIn`,
    urlParams: { 
      "per-page": urlValue.perPage, 
      page: urlValue.currentPage, 
      sort: urlValue.filter_like?.sort ?? "-id", 
      "filter-like": { first_name, last_name, middle_name, username, passport_number, passport_pin: passport_pin ? passport_pin : undefined }, 
      filter: { role_name: role_name ? [role_name]: undefined, "-role_name": ["student"] },
      kafedra_id: urlValue?.filter?.kafedra_id
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


  const { data: userTimeView, isFetching } = useGetOneData<any>({
    queryKey: ["users", view_id],
    url: `users/${view_id}?expand=lastIn`,
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: (isOpenDrawer && !!view_id),
    }
  })

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
      title: t('Oxirgi tizimga kirgan vaqti'),
      dataIndex: "created_on",
      render: (i,e) => <span>{e?.lastIn?.created_on ? e?.lastIn?.created_on : "Tizimga kirilmagan"}</span>
    },
    {
      title: t('Oxirgi foydalanilgan vaqti'),
      dataIndex: "last_seen_time",
      render: (i, e) => <span>{e?.last_seen_time ? dayjs.unix(e?.last_seen_time).format("DD-MM-YYYY hh:mm:ss") : "Tizimdan foydalanilmagan"}</span>
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
            onClickEdit={() => {}}
            onClickView={() => {setisOpenDrawer(true); setview_id(e?.id)}}
            viewPermission={'user_view'}
            editPermission={"none"}
            deletePermission={"none"}
          />,
        },
      ]
    },
  ];

  const exportExcel = async () => {
    const arr: any = [];

    if (urlValue?.filter?.kafedra_id) {

      setLoading(true);

      const res = await instance({
        method: "GET",
        url: `users?expand=lastIn`,
        params: { "per-page": 0, filter: urlValue?.filter, kafedra_id: urlValue?.filter?.kafedra_id }
      });

      res?.data?.data?.items?.forEach((element: any) => {
        const rol = element?.role?.map((item:any) => item)
        arr.push({
          ["Ism"]: element?.first_name,
          ["Familiya"]: element?.last_name,
          ["Otasining ismi"]: element?.middle_name,
          ["Rol"]: rol ? rol.join(',') : "",
          ["Oxirgi tizimga kirgan vaqti"]: element?.lastIn?.created_on ? element?.lastIn?.created_on : "Tizimga kirilmagan",
          ["Oxirgi tizimdan foydalangan vaqti"]: element?.last_seen_time ? dayjs.unix(element?.last_seen_time).format("DD-MM-YYYY hh:mm:ss") : "Tizimdan foydalanilmagan",
        })
      })
      setLoading(false);
      excelExport(arr, `Kafedra kesimida tizimdan foydalanish statistikasi`);
    } else {
      message.warning("Iltimos kafedra tanlang!!!")
    }

  }

  return (
    <div className="">
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: '/' },
          { name: "Users statistic", path: '/users' }
        ]}
        title={t("Users statistic")}
        btn={
          <div>
            <ExcelBtn onClick={exportExcel} loading={loading} />
          </div>
        }
      />

      <Drawer
        title={
          <div className="flex items-center justify-between">
            <TitleModal>{t("View user time")}</TitleModal>
            <IoClose
              onClick={() => { setisOpenDrawer(false); }}
              className="text-[24px] cursor-pointer text-[#00000073]"
            />    
          </div>
        }
        placement="right"
        closable={false}
        open={isOpenDrawer}
        onClose={() => { setisOpenDrawer(false) }}
        width={globalConstants.antdDrawerWidth}
        headerStyle={{ backgroundColor: "#F7F7F7" }}
      >
      <div>
        <p className="mb-2"><span className="text-gray-500">Ismi:</span> {userTimeView?.data?.first_name}</p>
        <p className="mb-2"><span className="text-gray-500">Familiya:</span> {userTimeView?.data?.last_name}</p>
        <p className="mb-2"><span className="text-gray-500">Otasining ismi:</span> {userTimeView?.data?.middle_name}</p>
        <p className="mb-2"><span className="text-gray-500">Rol:</span> {userTimeView?.data?.role?.map((item:any) => <Tag>{item}</Tag>)}</p>
        <p className="mb-2"><span className="text-gray-500">Tizimga oxirgi kirgan vaqti:</span> {userTimeView?.data?.lastIn?.created_on ? userTimeView?.data?.lastIn?.created_on : "Tizimga kirilmagan"}</p>
        <p className="mb-2"><span className="text-gray-500">Tizimdan oxirgi foydalangan vaqti:</span> {userTimeView?.data?.last_seen_time ? dayjs.unix(userTimeView?.data?.last_seen_time).format("YYYY-MM-DD hh:mm:ss") : "Tizimdan foydalanilmagan"}</p>
        {/* <p>Data: {Object.keys(userTimeView?.data?.lastIn?.data)?.map((key) => (
          <span>{`${key}: ${userTimeView?.data?.lastIn?.data[key]}`}</span>
        ))}</p> */}
        <div className = "flex">
          <Button  onClick={() => setisOpenDrawer(false)}>{t('Cancel')}</Button>
        </div>
      </div>
      </Drawer>

      <div className="p-3">
        <Row gutter={[12, 12]} className="w-full">
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
            />
          ))}
        </Row>
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

export default UsersStatistic;
