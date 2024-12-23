import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import useGetAllData from "hooks/useGetAllData";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import CustomPagination from "components/Pagination";
import { number_order } from "utils/number_orders";
import { Row, Table, Tag, message } from "antd";
import { ColumnsType } from "antd/es/table";
import { CreateBtn, ExcelBtn } from "components/Buttons";
import { Link, useNavigate } from "react-router-dom";
import Actions from "components/Actions";
import UserStatusTag from "components/StatusTag/userStatusTag";
import FilterSelect, { TypeFilterSelect } from "components/FilterSelect";
import checkPermission from "utils/check_permission";
import SearchInputWithoutIcon from "components/SearchInput/searchInputWithoutIcon";
import { globalConstants } from "config/constants";
import { excelExport } from "utils/excelExport";
import instance from "config/_axios";
import useBreadCrumb from "hooks/useBreadCrumb";
import { renderFullName } from "utils/others_functions";

const selectData: TypeFilterSelect[] = [
  {
    name: "region_id",
    label: "Regions",
    url: "regions",
    permission: "region_index",
    child_names: ["area_id"],
    span: { xl: 8 }
  },
  {
    name: "area_id",
    label: "Areas",
    url: "areas",
    permission: "area_index",
    parent_name: "region_id",
    span: { xl: 8 }
  },
  {
    name: "kafedra_id",
    label: "Kafedras",
    url: "kafedras",
    permission: "kafedra_index",
    span: { xl: 8 }
  },
]

const Teacher = () => {

  const { t } = useTranslation();
  const [allData, setAllData] = useState<any[]>([]);
  const { urlValue, writeToUrl } = useUrlQueryParams({ currentPage: 1, perPage: 15 });
  const navigate = useNavigate()
  const [searchVal, setSearchVal] = useState<string>();
  const [first_name, setfirst_name] = useState<string>();
  const [last_name, setlast_name] = useState<string>();
  const [middle_name, setmiddle_name] = useState<string>();
  const [username, setusername] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  useBreadCrumb({pageTitle: "Teachers", breadcrumb: [
    {name: "Home", path: '/'},
    {name: "Teachers", path: '/teachers'},
  ]})

  const { data, refetch, isLoading } = useGetAllData({
    queryKey: [urlValue.perPage, urlValue.currentPage, urlValue.filter_like?.sort, searchVal, first_name, last_name, middle_name, username, ...(Object.values(urlValue?.filter) ?? [])],
    url: `users?expand=userAccessKafedra,userAccess,isTeacherAccess,userAccess.loadRate.workLoad,userAccess.loadRate.workRate&filter=${JSON.stringify({ role_name: ["teacher"], ...urlValue.filter })}${urlValue?.filter?.kafedra_id ? "&kafedra_id=" + urlValue?.filter?.kafedra_id : ""}`,
    urlParams: { "per-page": urlValue.perPage, page: urlValue.currentPage, sort: urlValue.filter_like?.sort ?? "-id", query: searchVal, "filter-like": { first_name, last_name, middle_name, username } },
    options: {
      refetchOnWindowFocus: false,
      retry: 1,
      onSuccess: (res) => {
        setAllData(res?.items);
      }
    }
  });


  const getUserAccess = (userAccess: any[]) => {
    let obj: any = {};

    userAccess?.forEach((e) => {
      e?.loadRate?.forEach((a: any) => {
        if (a?.work_load_id && obj[a?.work_load_id]) {
          obj = { ...obj, [a?.work_load_id]: { name: a?.workLoad?.name, rate: a?.workRate?.type + obj[a?.work_load_id]?.rate } }
        } else {
          obj = { ...obj, [a?.work_load_id]: { name: a?.workLoad?.name, rate: a?.workRate?.type } }
        }
      })
    });

    return Object.values(obj)?.map((e: any, i) => (
      <div key={i} className="d-f" ><span className="text-xs text-black opacity-70" >{e?.name}:</span>&nbsp;<Tag color="blue" className="border-0 ms-1 text-sm" >{e?.rate}</Tag></div>
    ))
  }

  const exportExcel = async (noSubject: boolean) => {
    const arr: any = [];
    setLoading(true);
    const res = await instance({
      method: "get",
      url: `users?expand=profile,userAccessKafedra,userAccess,isTeacherAccess,userAccess.loadRate.workLoad,userAccess.loadRate.workRate,decryptUser`,
      params: { "per-page": 0, filter: { "-role_name": ["student"], "role_name": ["teacher"] }, kafedra_id: urlValue?.filter?.kafedra_id }
    });
    setLoading(false);

    if(res.status === 200){
      res.data.data.items?.forEach((element: any) => {
        if (noSubject) {
          if (!element?.isTeacherAccess) {
            arr.push({
              ["F.I.SH"]: renderFullName(element?.profile),
              ["Holati"]: element?.status === 10 ? "Faol" : "Faol emas",
            });
          }
        } else {
          let obj: any = {};
          element?.userAccess?.forEach((e: any) => {
            e?.loadRate?.forEach((a: any) => {
              if (a?.work_load_id && obj[a?.work_load_id]) {
                obj = { ...obj, [a?.work_load_id]: { name: a?.workLoad?.name, rate: a?.workRate?.type + obj[a?.work_load_id]?.rate } }
              } else {
                obj = { ...obj, [a?.work_load_id]: { name: a?.workLoad?.name, rate: a?.workRate?.type } }
              }
            })
          });

          arr.push({
            ["F.I.SH"]: renderFullName(element?.profile),
            ['Username']: element?.username,
            ['Password']: element?.decryptUser,
            ['JSHSHIR']: element?.profile?.passport_pin,
            ['Telfon raqam']: element?.profile?.phone,
            ["Holati"]: element?.status === 10 ? "Faol" : "Faol emas",
            ["Kafedra"]: `${element?.userAccessKafedra?.map((e: any, i: number) => `${e?.name}`)}`,
            ["UserAccess"]: `${Object.values(obj)?.map((e: any, i) => `${e?.name}  ${e?.rate}`)}`
          })
        }
      })

      excelExport(arr, `Xodimlar ro'yxati`)
    } else {
      message.error(res.data?.message);
    }
  }

  const columns: ColumnsType<any> = React.useMemo(() => [
    {
      title: '№',
      width: 45,
      showSorterTooltip: false,
      sorter: () => { writeToUrl({ name: "sort", value: urlValue?.filter_like?.sort === "-id" ? "id" : "-id" }); return 0 },
      children: [
        {
          dataIndex: 'order',
          render: (_, __, i) => number_order(urlValue.currentPage, urlValue.perPage, Number(i), isLoading),
        }
      ]
    },
    {
      title: t('Last name'),
      showSorterTooltip: false,
      sorter: () => { writeToUrl({ name: "sort", value: urlValue?.filter_like?.sort === "-last_name" ? "last_name" : "-last_name" }); return 0 },
      children: [
        {
          title: <SearchInputWithoutIcon setSearchVal={setlast_name} duration={globalConstants.debounsDuration} filterKey="last_name" placeholder={`${t("Search by last name")}...`} />,
          render: (e) => checkPermission("user_view") ? (
            <Link to={`/teachers/view/${e?.id}`} className="text-neutral-900 hover:text-[#0a3180] underline cursor-pointer" >
              {e?.last_name}
            </Link>) : (<span>{e?.last_name}</span>),
        },
      ]
    },
    {
      title: t('First name'),
      showSorterTooltip: false,
      sorter: () => { writeToUrl({ name: "sort", value: urlValue?.filter_like?.sort === "-first_name" ? "first_name" : "-first_name" }); return 0 },
      children: [
        {
          title: <SearchInputWithoutIcon setSearchVal={setfirst_name} duration={globalConstants.debounsDuration} filterKey="first_name" placeholder={`${t("Search by name")}...`} />,
          render: (e) => checkPermission("user_view") ? (
            <Link to={`/teachers/view/${e?.id}`} className="text-neutral-900 hover:text-[#0a3180] underline cursor-pointer" >
              {e?.first_name}
            </Link>) : (<span>{e?.first_name}</span>),
        },
      ]
    },
    {
      title: t('Middle name'),
      showSorterTooltip: false,
      sorter: () => { writeToUrl({ name: "sort", value: urlValue?.filter_like?.sort === "-middle_name" ? "middle_name" : "-middle_name" }); return 0 },
      children: [
        {
          title: <SearchInputWithoutIcon setSearchVal={setmiddle_name} duration={globalConstants.debounsDuration} filterKey="middle_name" placeholder={`${t("Search by middle name")}...`} />,
          render: (e) => checkPermission("user_view") ? (
            <Link to={`/teachers/view/${e?.id}`} className="text-neutral-900 hover:text-[#0a3180] underline cursor-pointer" >
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
            <Link to={`/teachers/view/${e?.id}`} className="text-neutral-900 hover:text-[#0a3180] underline cursor-pointer" >
              {e?.username}
            </Link>) : (<span>{e?.username}</span>),
        },
      ]
    },
    {
      title: t('Role'),
      children: [
        {
          dataIndex: 'role',
          render: (i: string[]) => i?.map((role, index) => <Tag key={index} className={index !== (i?.length - 1) ? "mb-2" : ""}>{role}</Tag>)
        }
      ]
    },
    {
      title: t('Kafedra'),
      children: [
        {
          render: (e) => <div className="flex flex-wrap gap-2">
            {
              e?.userAccessKafedra?.map((e: any, i: number) => (
                <span key={i} >{e?.name}</span>
              ))
            }
          </div>,
        }
      ]
    },
    {
      title: t('User Access'),
      children: [
        {
          dataIndex: 'userAccess',
          render: (userAccess: any[]) => <div className="d-f flex-wrap gap-y-1">{getUserAccess(userAccess)}</div>
        }
      ]
    },
    {
      title: t('Fanlar'),
      children: [
        {
          render: (i, e) => e?.isTeacherAccess ? <span className="text-[#52C41A]">Mavjud</span> : <span className="text-[#E94235]">Mavjud emas</span>
        }
      ]
    },
    {
      title: t('Status'),
      children: [
        {
          dataIndex: 'status',
          render: (i: string) => <UserStatusTag status={i} />
        }
      ]
    },
    {
      title: t("Actions"),
      width: 120,
      align: "center",
      children: [
        {
          dataIndex: 'actions',
          render: (i, e) => <Actions
            id={e?.id}
            url={'users'}
            refetch={refetch}
            onClickEdit={() => navigate(`/teachers/update/${e?.id}`)}
            onClickView={() => navigate(`/teachers/view/${e?.id}`)}
            viewPermission={'user_view'}
            editPermission={"user_update"}
            deletePermission={"user_delete"}
          />
        }
      ]
    },
  ], [data?.items]);

  return (
    <div className="">
      <div className="content-card">
        <div className="d-f gap-3 justify-end mb-2">
            <ExcelBtn onClick={() => exportExcel(true)} text="Fan biriktirilmaganlar ro'yxati" loading={loading} />
            <ExcelBtn onClick={() => exportExcel(false)} loading={loading} />
            <CreateBtn onClick={() => navigate('/teachers/create?user-block=main-info')} permission={"user_create"} />
          </div>
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

export default Teacher;
