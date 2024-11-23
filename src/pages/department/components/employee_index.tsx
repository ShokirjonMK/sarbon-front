import { Delete16Filled, Edit16Filled, } from "@fluentui/react-icons";
import { Switch, Tag, Tooltip, message } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import HeaderPage from "components/HeaderPage";
import CustomPagination from "components/Pagination";
import DeleteData from "components/deleteData";
import useDebounce from "hooks/useDebounce";
import useGetAllData from "hooks/useGetAllData";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import { IUserAccess } from "models/edu_structure";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import checkPermission from "utils/check_permission";
import { number_order } from "utils/number_orders";
import EmployeeUpdate from "./employee_update";
import { Link, useParams } from "react-router-dom";
import { globalConstants } from "config/constants";
import { useMutation } from "@tanstack/react-query";
import { submitData } from "./employee_request";
import { AxiosError } from "axios";
import { Notification } from "utils/notification";

const EmployeeIndexPage: React.FC<{ userAccessTypeId: number }> = ({ userAccessTypeId }): JSX.Element => {
  const { t } = useTranslation();
  const { id } = useParams()

  const { urlValue, writeToUrl } = useUrlQueryParams({
    currentPage: 1,
    perPage: 10,
  });
  const searchVal = useDebounce(urlValue.q, globalConstants.debounsDuration);

  const [allData, setallData] = useState<IUserAccess[]>();
  const [isOpenForm, setisOpenForm] = useState<boolean>(false);
  const [employeeId, setEmployeeId] = useState<number | undefined>();

  const { data, refetch, isLoading } = useGetAllData<IUserAccess>({
    queryKey: [
      "employees-department",
      urlValue.perPage,
      urlValue.currentPage,
      searchVal,
    ],
    url: `user-accesses?sort=-id&expand=user,loadRate,loadRate.workLoad,loadRate.workRate&filter={"table_id":${id}, "user_access_type_id":${userAccessTypeId}}`,
    urlParams: {
      "per-page": urlValue.perPage,
      page: urlValue.currentPage,
      query: searchVal,
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

  type mutatePropsType = {
    id: number,
    data: any,
    table_id: number | string | undefined,
    user_access_type_id: number | string | undefined,
    teacherAccess: any,
    leader?: number
  }

  const { mutate } = useMutation({
    mutationFn: ({ id, data, table_id, user_access_type_id, teacherAccess, leader }: mutatePropsType) => submitData(id, data, table_id, user_access_type_id, teacherAccess, Number(leader)),
    onSuccess: async (res) => {
      refetch();
      Notification("success", id ? "update" : "create", res?.message)
    },
    onError: (error: AxiosError<any>) => {
      message.error(error?.response?.data?.message);
    },
    retry: 0,
  });

  // const leadFunc = (checked: boolean) => {
  //   mutate({id: 179, data: data?.items, table_id: 2, user_access_type_id: 3, teacherAccess: 7, leader: 0})
  // }

  const changeLeader = (_id: number, is_leader: boolean) => {
    if (checkPermission("user-access_update"))
      mutate({ id: _id, data: {}, table_id: id, user_access_type_id: undefined, teacherAccess: undefined, leader: Number(is_leader) })
  }

  const columns: ColumnsType<IUserAccess> = [
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
      title: t('F.I.SH'),
      render: (e) => checkPermission("user_view") ? (
        <Link to={`/teachers/view/${e?.user?.id}`} className="text-neutral-900 hover:text-[#0a3180] underline cursor-pointer" >
          {e?.user?.first_name} {e?.user?.last_name} {e?.user?.middle_name}
        </Link>) : (<span>{e?.user?.first_name} {e?.user?.last_name} {e?.user?.middle_name}</span>),
    },
    {
      title: t("Role"),
      dataIndex: "role",
      key: "role",
      render: (i, e) => e?.user?.role?.map((item: any) => (<Tag>{item}</Tag>))
    },
    {
      title: t("Ish o'rni va stavkasi"),
      key: "position",
      render: (i, e) => <div>{e?.loadRate?.map((e, i) => (
        <div key={i} className="d-f" ><span className="text-xs text-black opacity-70" >{e?.workLoad?.name}:</span>&nbsp;<Tag color="blue" className="border-0 ms-1 text-sm" >{e?.workRate?.type}</Tag></div>
        // <span><b>{e?.workLoad?.name}:</b>&nbsp;&nbsp;{e?.workRate?.type}</span>
      ))}</div>
    },
    {
      title: t("Leader"),
      dataIndex: "leader",
      key: "leader",
      render: (i, e) => <Switch onChange={(a) => { changeLeader(e?.id, a) }} checked={e?.is_leader === 1 ? true : false} />,
    },
    {
      title: t("Actions"),
      dataIndex: "actions",
      key: "actions",
      render: (i, e) => (
        <div className="flex">
          {checkPermission("user-access_update") ? (
            <Tooltip placement="topLeft" title={t("Edit")}>
              <Edit16Filled
                className="edit text-[#595959] hover:cursor-pointer mr-4"
                onClick={() => {
                  setEmployeeId(e?.id);
                  setisOpenForm(true)
                }}
              />
            </Tooltip>
          ) : null}
          <DeleteData
            permission={"user-access_delete"}
            refetch={refetch}
            url={"user-accesses"}
            id={e?.id}
          >
            <Delete16Filled className="delete text-[#595959] hover:cursor-pointer" />
          </DeleteData>
        </div>
      ),
    },
  ];

  


  return (
    <>
      <HeaderPage
        title={"Employees"}
        create_permission={"user-access_create"}
        createOnClick={() => {
          setisOpenForm(true);
          setEmployeeId(undefined);
        }}
        className="mb-6"
      />

      <EmployeeUpdate
        id={employeeId}
        setId={setEmployeeId}
        isOpenForm={isOpenForm}
        setisOpenForm={setisOpenForm}
        refetch={refetch}
        userAccessTypeId={userAccessTypeId}
      />

      <Table
        columns={columns}
        dataSource={data?.items.length ? data?.items : allData}
        pagination={false}
        loading={isLoading}
        size="middle"
      />

      {(data?._meta?.totalCount ?? 0) > 10 ? (
        <CustomPagination
          totalCount={data?._meta.totalCount}
          currentPage={urlValue.currentPage}
          perPage={urlValue.perPage}
        />
      ) : undefined}
    </>
  );
};

export default EmployeeIndexPage;



