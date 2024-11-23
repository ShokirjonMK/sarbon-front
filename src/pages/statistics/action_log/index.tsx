import { Drawer, Select, Tag } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import Actions from "components/Actions";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import CustomPagination from "components/Pagination";
import SearchInput from "components/SearchInput";
import { TitleModal } from "components/Titles";
import { globalConstants } from "config/constants";
import dayjs from "dayjs";
import useGetAllData from "hooks/useGetAllData";
import useGetData from "hooks/useGetData";
import useGetOneData from "hooks/useGetOneData";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { IoClose } from "react-icons/io5";
import { number_order } from "utils/number_orders";
import { cf_filterOption, renderFullName } from "utils/others_functions";

const ActionLog : React.FC = () : JSX.Element => {
  const {t} =  useTranslation()
  const { urlValue, writeToUrl } = useUrlQueryParams({
    currentPage: 1,
    perPage: 10,
  });
  const [allData, setallData] = useState<any[]>([]);
  const [isOpenDrawer, setisOpenDrawer] = useState<boolean>(false)
  const [id, setid] = useState<number>()
  const [user_id, setuser_id] = useState<number>()

  const { data, isLoading, refetch,} = useGetAllData<any>({
    queryKey: ["action-logs", urlValue.perPage, urlValue.currentPage, user_id],
    url: `/action-logs?expand=user,user.profile`,
    urlParams: { "per-page": urlValue.perPage, page: urlValue.currentPage, filter: {"user_id": user_id}},
    options: {
      refetchOnWindowFocus: false,
      retry: 1,
      onSuccess: (res) => {
        setallData(res?.items);
      },
    },
  });

  const { data: Logs} = useGetAllData<any>({
    queryKey: ["users",],
    url: `/users?expand=profile`,
    urlParams: { "per-page": 0, page: 1},
    options: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  });


  const { data: actionLogs } = useGetOneData<any>({
    queryKey: ["action-logs", id],
    url: `action-logs/${id}`,
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: (isOpenDrawer && !! id),
    }
  })

  const columns: ColumnsType<any> = [
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
      title: t("F.I.O"),
      dataIndex: "fish",
      key: "fish",
      render: (i,e) => renderFullName(e?.user?.profile)
    },
    {
      title: t("User name"),
      dataIndex: "username",
      key: "username",
      render: (i,e) => <span>{e?.user?.username}</span>
    },
    {
      title: t("Controller"),
      dataIndex: "controller",
      key: "controller",
      render: (i,e) => <span>{e?.controller}</span>
    },
    {
      title: t("Action"),
      dataIndex: "action",
      key: "action",
      render: (i,e) => <span>{e?.action}</span>
    },
    {
      title: t("Method"),
      dataIndex: "method",
      key: "method",
      render: (i,e) => <span>{e?.method === "GET" ? <Tag color="success">{e?.method}</Tag> : e?.method === "POST" ? <Tag color="warning">{e?.method}</Tag> : e?.method === "PUT" ? <Tag color="blue">{e?.method}</Tag> : e?.method === "DEL" ? <Tag color="red">{e?.method}</Tag> : null}</span>
    },
    {
      title: t("Created date"),
      dataIndex: "created_at",
      key: "created_at",
      render: (i,e) => <span>{dayjs.unix(e?.created_at).format("DD-MM-YYYY hh:mm:ss a")}</span>
    },
    {
      title: t("Actions"),
      dataIndex: "actions",
      width: 120,
      align: "center",
      render: (i, e: any) => (
        <Actions
          id={e?.id}
          url={"/action-logs"}
          onClickEdit={() => {}}
          onClickView={() => {setid(e?.id); setisOpenDrawer(true);}}
          refetch={refetch}
          viewPermission={"action-log_view"}
          editPermission={"none"}
          deletePermission={"none"}
        />
      ),
    },
  ];

  return(
    <>
      <HeaderExtraLayout
        breadCrumbData={[
        { name: "Home", path: "/" },
        { name: "Action Log", path: "" },
        ]}
        title={'Action Log'}
      />

      <Drawer
        title={
          <div className="flex items-center justify-between">
            <TitleModal>{t("Action log view")}</TitleModal>
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
          <p className="mb-2"><span className="text-gray-400 mr-2">Controller:</span> {actionLogs?.data?.controller}</p>
          <p className="mb-2"><span className="text-gray-400 mr-2">Action:</span> {actionLogs?.data?.action}</p>
          <p className="mb-2"><span className="text-gray-400 mr-2">Method:</span> <span>{actionLogs?.data?.method === "GET" ? <Tag color="success">{actionLogs?.data?.method}</Tag> : actionLogs?.data?.method === "POST" ? <Tag color="warning">{actionLogs?.data?.method}</Tag> : actionLogs?.data?.method === "PUT" ? <Tag color="blue">{actionLogs?.data?.method}</Tag> : actionLogs?.data?.method === "DEL" ? <Tag color="red">{actionLogs?.data?.method}</Tag> : null}</span></p>
          <p className="mb-2"><span className="text-gray-400 mr-2">Created at:</span> {dayjs.unix(actionLogs?.data?.created_at).format("DD-MM-YYYY hh:mm:ss a")}</p>
        </div>
      <span className="mb-2 text-gray-400 block text-center mr-2 mt-4">Get data</span>  {
        isOpenDrawer && (
        Object.keys(JSON.parse(actionLogs?.data?.get_data ? actionLogs?.data?.get_data : "{}"))?.map((key:any) => (
          <ul className="list-none p-0 w-full">
            <li className="mb-2 break-words">{`${key}: ${JSON.parse(actionLogs?.data?.get_data)[key]}`}</li>
          </ul>
        )))
      }

      <span className="mb-2 text-gray-400 block text-center mr-2 mt-2">Post data</span> {
        isOpenDrawer && (
        Object.keys(JSON.parse(actionLogs?.data?.post_data ? actionLogs?.data?.post_data : "{}"))?.map((key:any) => (
          <ul className="list-none p-0 w-full">
            <li className="mb-2 break-words">{`${key}: ${JSON.parse(actionLogs?.data?.post_data)[key]}`}</li>
          </ul>
        )))
      }

      <p className="mb-2"><span className="text-gray-400 mr-2">Message :</span>{actionLogs?.data?.message}</p>
      {
        actionLogs?.data?.errors?.length > 0 ? <p className="mb-2"><span className="text-gray-400 mr-2">Error :</span>{actionLogs?.data?.errors}</p> : null
      }
      </Drawer>

      <div className='py-3 px-6'>
          <Select
            showSearch
            allowClear
            className="w-[400px] mb-3"
            placeholder={t("Filter by first name")}
            optionFilterProp="children"
            onChange={(e) => {setuser_id(e)}}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={Logs?.items.map(item => ({ label: `${item?.profile?.last_name} ${item?.profile?.first_name}`, value: item?.id }))}
          />
        <Table
          columns={columns}
          dataSource={data?.items.length ? data?.items : allData}
          pagination={false}
          loading={isLoading}
        />

        <CustomPagination
          totalCount={data?._meta.totalCount}
          currentPage={urlValue.currentPage}
          perPage={urlValue.perPage}
        />
      </div>
    </>
  )
}

export default ActionLog