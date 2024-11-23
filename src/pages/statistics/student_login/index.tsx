import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import useGetAllData from "hooks/useGetAllData";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import CustomPagination from "components/Pagination";
import { number_order } from "utils/number_orders";
import { Row, Table, message, Select, Drawer, Button, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { CreateBtn, ExcelBtn } from "components/Buttons";
import { useNavigate } from "react-router-dom";
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
import { TitleModal } from "components/Titles";
import { IoClose } from "react-icons/io5";
import dayjs from "dayjs";
import useGetOneData from "hooks/useGetOneData";

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
]

const StudentsLoginTime = () => {
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

  const [isOpenDrawer, setisOpenDrawer] = useState<boolean>(false)
  const [view_id, setview_id] = useState<number>()

  const { data, refetch, isLoading } = useGetAllData({
    queryKey: [urlValue.perPage, urlValue.currentPage, urlValue.filter_like?.sort, searchVal, ...(Object.values(urlValue?.filter) ?? []), urlValue?.filter_like?.status, first_name, last_name, middle_name, username, passport_number, passport_pin],
    url: `students?sort=-id&expand=profile,user,user.lastIn,group,faculty&filter=${JSON.stringify({...urlValue.filter, status: urlValue?.filter_like?.status})}&filter-like=${JSON.stringify({ first_name, last_name, middle_name, username, passport_number, passport_pin })}`,
    urlParams: { "per-page": urlValue.perPage, page: urlValue.currentPage, sort: urlValue.filter_like?.sort ?? "-id", query: searchVal },
    options: {
      onSuccess: (res) => {
        setAllData(res?.items);
      }
    }
  });

  const { data: userTimeView } = useGetOneData<any>({
    queryKey: ["users", view_id],
    url: `students/${view_id}?expand=profile,user,user.lastIn,group,faculty`,
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: (isOpenDrawer && !!view_id),
    }
  })

  const columns: ColumnsType<any> = React.useMemo(() => [
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
              <span
                onClick={() => navigate(`/students/view/${e?.id}`)}
                className="hover:text-[#0a3180] underline cursor-pointer"
              >{e?.user?.last_name} </span>
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
              <span
                onClick={() => navigate(`/students/view/${e?.id}`)}
                className="hover:text-[#0a3180] underline cursor-pointer"
              >{e?.user?.first_name} </span>
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
              <span
                onClick={() => navigate(`/students/view/${e?.id}`)}
                className="hover:text-[#0a3180] underline cursor-pointer"
              >{e?.user?.middle_name} </span>
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
              <span
                onClick={() => navigate(`/students/view/${e?.id}`)}
                className="hover:text-[#0a3180] underline cursor-pointer"
              >{e?.user?.username} </span>
            ) : (<span>{e?.user?.username}</span>),
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
    {
      title: t('Oxirgi tizimga kirgan vaqti'),
      dataIndex: "created_on",
      render: (i,e) => <span>{e?.user?.lastIn?.created_on ? e?.user?.lastIn?.created_on : "Tizimga kirilmagan"}</span>
    },
    {
      title: t('Oxirgi foydalanilgan vaqti'),
      dataIndex: "last_seen_time",
      render: (i, e) => <span>{e?.user?.last_seen_time ? dayjs.unix(e?.user?.last_seen_time).format("DD-MM-YYYY hh:mm:ss a") : "Tizimdan foydalanilmagan"}</span>
    },
    // {
    //   title: t("Actions"),
    //   width: 120,
    //   align: "center",
    //   children: [
    //     {
    //       dataIndex: 'actions',
    //       render: (i, e) => <Actions
    //         id={e?.id}
    //         url={'students'}
    //         refetch={refetch}
    //         onClickEdit={() => "none"}
    //         onClickView={() => {setisOpenDrawer(true); setview_id(e?.id)}}
    //         viewPermission={'action-log_view'}
    //         editPermission={"none"}
    //         deletePermission={"none"}
    //       />,
    //     }
    //   ]
    // },
  ], [data?.items]);


  const exportExcel = async () => {
    const arr: any = [];

    if (urlValue?.filter?.faculty_id) {

      setLoading(true);

      const res = await instance({
        method: "GET",
        url: `students?expand=profile,user,user.lastIn,group,faculty,course,direction`,
        params: { "per-page": 0, filter: urlValue?.filter, faculty_id: urlValue?.filter?.faculty_id }
      });

      res?.data?.data?.items?.forEach((element: any) => {
        const rol = element?.user?.role?.map((item:any) => item)
        arr.push({
          ["Ism"]: element?.user?.first_name,
          ["Familiya"]: element?.user?.last_name,
          ["Otasining ismi"]: element?.user?.middle_name,
          ["Fakultet"]: element?.faculty?.name,
          ["Yo'nalish"]: element?.direction?.name,
          ["Kurs"]: element?.course?.name,
          ["Guruh"]: element?.group?.unical_name,
          ["Rol"]: rol ? rol.join(',') : "",
          ["Oxirgi tizimga kirgan vaqti"]: element?.user?.lastIn?.created_on ? element?.user?.lastIn?.created_on : "Tizimga kirilmagan",
          ["Oxirgi tizimdan foydalangan vaqti"]: element?.user?.last_seen_time ? dayjs.unix(element?.user?.last_seen_time).format("DD-MM-YYYY hh:mm:ss") : "Tizimdan foydalanilmagan",
        })
      })
      setLoading(false);
      excelExport(arr, `Fakultet kesimida talabalarni tizimdan foydalanish statistikasi`);
    } else {
      message.warning("Iltimos fakultet tanlang!!!")
    }

  }

  return (
    <div className="">
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: '/' },
          { name: "Student activity time", path: '' }
        ]}
        title={t("Student activity time")}
        btn={
          <div>
            <ExcelBtn onClick={exportExcel} loading={loading} />
          </div>
        }
      />

      <Drawer
        title={
          <div className="flex items-center justify-between">
            <TitleModal>{t("View student time")}</TitleModal>
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
        <p className="mb-2"><span className="text-gray-500">Ismi:</span> {userTimeView?.data?.user?.first_name}</p>
        <p className="mb-2"><span className="text-gray-500">Familiya:</span> {userTimeView?.data?.user?.last_name}</p>
        <p className="mb-2"><span className="text-gray-500">Otasining ismi:</span> {userTimeView?.data?.user?.middle_name}</p>
        <p className="mb-2"><span className="text-gray-500">Rol:</span> {userTimeView?.data?.user?.role?.map((item:any) => <Tag>{item}</Tag>)}</p>
        <p className="mb-2"><span className="text-gray-500">Tizimga oxirgi kirgan vaqti:</span> {userTimeView?.data?.user?.lastIn?.created_on ? userTimeView?.data?.user?.lastIn?.created_on : "Tizimga kirilmagan"}</p>
        <p className="mb-2"><span className="text-gray-500">Tizimdan oxirgi foydalangan vaqti:</span> {userTimeView?.data?.user?.last_seen_time ? dayjs.unix(userTimeView?.data?.user?.last_seen_time).format("YYYY-MM-DD hh:mm:ss") : "Tizimdan foydalanilmagan"}</p>
        <div className = "flex">
          <Button  onClick={() => setisOpenDrawer(false)}>{t('Cancel')}</Button>
        </div>
      </div>
      </Drawer>

      <div className="p-3">
        <Row gutter={[12, 12]}>
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

export default StudentsLoginTime;
