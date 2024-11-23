import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import useGetAllData from "hooks/useGetAllData";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import CustomPagination from "components/Pagination";
import { number_order } from "utils/number_orders";
import { Row, Table, message, Select } from "antd";
import { ColumnsType } from "antd/es/table";
import { CreateBtn, ExcelBtn } from "components/Buttons";
import { Link, useNavigate } from "react-router-dom";
import Actions from "components/Actions";
import UserStatusTag from "components/StatusTag/userStatusTag";
import FilterSelect, { TypeFilterSelect } from "components/FilterSelect";
import { IStudent } from "models/student";
import checkPermission from "utils/check_permission";
import SearchInputWithoutIcon from "components/SearchInput/searchInputWithoutIcon";
import { globalConstants } from "config/constants";
import { excelExport } from "utils/excelExport";
import instance from "config/_axios";
import { USERSTATUS } from "config/constants/staticDatas";
import useBreadCrumb from "hooks/useBreadCrumb";

const selectData: TypeFilterSelect[] = [
  // {
  //   name: "region_id",
  //   label: "Regions",
  //   url: "regions",
  //   permission: "region_index",
  //   child_names: ["area_id"],
  //   span: { xl: 8 }
  // },
  {
    name: "faculty_id",
    label: "Faculty",
    url: "faculties",
    permission: "faculty_index",
    child_names: ["edu_plan_id", "group_id"],
    span: { xl: 8 }
  },
  {
    name: "edu_plan_id",
    label: "Edu plan",
    url: "edu-plans",
    permission: "edu-plan_index",
    parent_name: "faculty_id",
    child_names: ["group_id"],
    span: { xl: 8 }
  },
  {
    name: "group_id",
    label: "Group",
    url: "groups",
    permission: "group_index",
    parent_name: "edu_plan_id",
    render: (e) => e?.unical_name,
    span: { xl: 8 }
  },
  {
    name: "course_id",
    label: "Course",
    url: "courses",
    permission: "course_index",
    span: { xl: 8 }
  },
  {
    name: "edu_lang_id",
    label: "Language",
    url: "languages",
    permission: "languages_index",
    span: { xl: 8 }
  }
]

const Students = () => {

  const { t } = useTranslation();
  const [allData, setAllData] = useState<any[]>([]);
  const { urlValue, writeToUrl } = useUrlQueryParams({ currentPage: 1, perPage: 15 });
  const navigate = useNavigate()
  const [searchVal, setSearchVal] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false)

  const [first_name, setfirst_name] = useState<string>();
  const [last_name, setlast_name] = useState<string>();
  const [middle_name, setmiddle_name] = useState<string>();
  const [username, setusername] = useState<string>();
  const [passport_number, setpassport_number] = useState<string>();
  const [passport_pin, setpassport_pin] = useState<string>();

  useBreadCrumb({pageTitle: "Students", breadcrumb: [
    {name: "Home", path: '/'},
    {name: "Students", path: '/students'},
  ]})

  const { data, refetch, isLoading } = useGetAllData({
    queryKey: [urlValue.perPage, urlValue.currentPage, urlValue.filter_like?.sort, searchVal, ...(Object.values(urlValue?.filter) ?? []), urlValue?.filter_like?.status, first_name, last_name, middle_name, username, passport_number, passport_pin],
    url: `students?sort=-id&expand=profile,user,group,faculty&filter=${JSON.stringify({...urlValue.filter, status: urlValue?.filter_like?.status})}&filter-like=${JSON.stringify({ first_name, last_name, middle_name, username, passport_number, passport_pin })}`,
    urlParams: { "per-page": urlValue.perPage, page: urlValue.currentPage, sort: urlValue.filter_like?.sort ?? "-id", query: searchVal,  },
    options: {
      onSuccess: (res) => {
        setAllData(res?.items);
      }
    }
  });

  const exportExcel = async () => {
    const arr: any = [];

    if (urlValue?.filter?.faculty_id) {
      setLoading(true);
    const res = await instance({
      method: "get",
      url: `students?expand=user,faculty,group,decryptUser,usernamePass,profile`,
      params: { "per-page": 0, filter: urlValue?.filter }
    });

    res.data.data.items?.forEach((element: any) => {
      arr.push({
        ["Familiyasi"]: element?.profile?.first_name,
        ["Ismi"]: element?.profile?.last_name,
        ["Otasining ismi"]: element?.profile?.middle_name,
        ['JSHSHIR']: element?.profile?.passport_pin,
        ['Username']: element?.user?.username,
        ['Password']: element?.usernamePass?.password,
        ['Facultet']: element?.faculty?.name,
        ["Guruh"]: element?.group?.unical_name,
      })
    })
    setLoading(false);

    excelExport(arr, `Talabalar ro'yxati (Fakultet kesimida)`)
    } else {
      message.warning("Fakultetni tanlang!!!")
    }
  }

  const columns: ColumnsType<IStudent> = React.useMemo(() => [
    {
      title: '№',
      width: 45,
      showSorterTooltip: false,
      sorter: () => { writeToUrl({ name: "sort", value: urlValue?.filter_like?.sort === "-id" ? "id" : "-id" }); return 0 },
      children: [
        {
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
          render: (e) =>
            checkPermission("student_view") ? (
              <Link to={`/students/view/${e?.id}`}
              className="text-black hover:text-[#0a3180] underline cursor-pointer"
              >{e?.user?.last_name} </Link>
            ) : (<span>{e?.user?.last_name}</span>),
        }
      ]
    },
    {
      title: t('First name'),
      showSorterTooltip: false,
      sorter: () => { writeToUrl({ name: "sort", value: urlValue?.filter_like?.sort === "-first_name" ? "first_name" : "-first_name" }); return 0 },
      children: [
        {
          title: <SearchInputWithoutIcon setSearchVal={setfirst_name} duration={globalConstants.debounsDuration} filterKey="first_name" placeholder={`${t("Search by name")}...`} />,
          render: (e: IStudent) =>
            checkPermission("student_view") ? (
              <Link to={`/students/view/${e?.id}`}
                className="text-black hover:text-[#0a3180] underline cursor-pointer"
              >{e?.user?.first_name} </Link>
            ) : (<span>{e?.user?.first_name}</span>),
        }
      ]
    },
    {
      title: t('Middle name'),
      showSorterTooltip: false,
      sorter: () => { writeToUrl({ name: "sort", value: urlValue?.filter_like?.sort === "-middle_name" ? "middle_name" : "-middle_name" }); return 0 },
      children: [
        {
          title: <SearchInputWithoutIcon setSearchVal={setmiddle_name} duration={globalConstants.debounsDuration} filterKey="middle_name" placeholder={`${t("Search by middle name")}...`} />,
          render: (e) =>
            checkPermission("student_view") ? (
              <Link to={`/students/view/${e?.id}`}
                className="text-black hover:text-[#0a3180] underline cursor-pointer"
              >{e?.user?.middle_name} </Link>
            ) : (<span>{e?.user?.middle_name}</span>),

        }
      ]
    },
    {
      title: t('Username (login)'),
      children: [
        {
          title: <SearchInputWithoutIcon width={120} setSearchVal={setusername} duration={globalConstants.debounsDuration} filterKey="username" placeholder={`${t("Search by username")}...`} />,
          render: (e) =>
            checkPermission("student_view") ? (
              <Link to={`/students/view/${e?.id}`}
                className="text-black hover:text-[#0a3180] underline cursor-pointer"
              >{e?.user?.username} </Link>
            ) : (<span>{e?.user?.username}</span>),
        }
      ]
    },
    {
      title: t('Passport seria and number'),
      children: [
        {
          title: <SearchInputWithoutIcon type="number" width={120} setSearchVal={setpassport_number} duration={globalConstants.debounsDuration} filterKey="passport_number" placeholder={`${t("Search by passport number")}...`} />,
          render: (i: string, e) => <span>{e?.profile?.passport_serial} {e?.profile?.passport_number}</span>,
        }
      ]
    },
    {
      title: t('JSHSHIR'),
      children: [
        {
          dataIndex: 'passort_pin',
          title: <SearchInputWithoutIcon type="number" setSearchVal={setpassport_pin} duration={globalConstants.debounsDuration} filterKey="passport_pin" placeholder={`${t("Search by JSHSHIR")}...`} />,
          render: (i: string, e) => <span>{e?.profile?.passport_pin}</span>,
        }
      ]
    },
    {
      title: t('Faculty'),
      children: [
        {
          title: "",
          render: (e) => <span>{e?.faculty?.name}</span>,
        }
      ]
    },
    {
      title: t('Group'),
      children: [
        {
          title: "",
          render: (e) => <span>{e?.group?.unical_name}</span>,
        }
      ]
    },
    // {
    //   title: t('Phone'),
    //   width: 120,
    //   children: [
    //     {
    //       dataIndex: 'phone',
    //       // title: <SearchInputWithoutIcon setSearchVal={setphone} duration={globalConstants.debounsDuration} filterKey="phone" placeholder={`${t("Search by phone")}...`} />,
    //       render: (i: string, e) => <span>{e?.profile?.phone}</span>,
    //     }
    //   ]
    // },
    {
      title: t('Status'),
      width: 100,
      children: [
        {
          title: <div>
            <Select
              allowClear
              placeholder="Status bo'yicha filter"
              optionFilterProp="children"
              onChange={(e) => writeToUrl({name: "status", value: e})}
              className="w-[100px]"
              options={USERSTATUS?.map(status => ({value: status?.id, label: status?.name}))}
            />
          </div>,
          dataIndex: 'status',
          render: (e: string) => <UserStatusTag status={e} />,
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
            url={'students'}
            refetch={refetch}
            onClickEdit={() => navigate(`/students/update/${e?.id}`)}
            onClickView={() => navigate(`/students/view/${e?.id}`)}
            viewPermission={'student_view'}
            editPermission={"student_update"}
            deletePermission={"student_delete"}
          />,
        }
      ]
    },
  ], [data?.items]);

  return (
    <div className="">
      <div className="content-card">
        <div className="d-f gap-3 mb-2 justify-end" >
          <ExcelBtn onClick={exportExcel} loading={loading} />
          <Link to={'/students/create'} style={{textDecoration:"none"}}><CreateBtn onClick={() => navigate('/students/create')} permission={"student_create"} /></Link>
        </div>
        <Row gutter={[12, 12]}>
          {/* <Col xs={24} sm={24} md={12} lg={8} xl={6}>
            <SearchInput setSearchVal={setSearchVal} duration={500} width={"full"} />
          </Col> */}
          {selectData?.map((e, i) => (
            <FilterSelect
              key={i}
              {...e}
            />
          ))}
        </Row>
        
          <Table
            columns={columns}
            dataSource={data?.items.length ? data?.items : allData}
            pagination={false}
            loading={isLoading}
            bordered={true}
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

export default Students;
