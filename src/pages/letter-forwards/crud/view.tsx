import { ReactNode, Dispatch, useState } from "react";
import { Button, Collapse, Divider, Drawer, Dropdown, Input, MenuProps, Popconfirm, Table, Tag, message } from "antd";
import { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import useGetOneData from "hooks/useGetOneData";
import checkPermission from "utils/check_permission";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Notification } from "utils/notification";
import { changeLetterForwardStatus, changeLetterReplyIsOk } from "./request";
import { MoreVertical24Filled, Send24Regular } from "@fluentui/react-icons";
import { renderFullName } from "utils/others_functions";
import FileViewer from "pages/subject_content/components/file_viewer";

interface DataType {
  name: string;
  value: ReactNode;
  value2?: ReactNode;
  value3?: ReactNode;
}

const ViewLetterForwardView = ({open, setOpen, refetch, setselectedItem, selectedItem}: {open:boolean, setOpen: Dispatch<boolean>, refetch: any, setselectedItem: Dispatch<any>, selectedItem: any}) => {

  const { t } = useTranslation();
  const [descVal, setDescVal] = useState<{[key: number]: string}>()

  const { data, isFetching, refetch: _refetch } = useGetOneData({
    queryKey: ['letter-forwards', selectedItem?.id],
    url: `letter-forwards/${selectedItem?.id}?expand=description,user,user.profile,createdBy,updatedBy,letterForwardItem,letterForwardItem.user,letterForwardItem.user.profile,letterForwardItem.letterReply,letterForwardItem.letterReplyHistory`,
    options: {
      onSuccess: (res) => {
        setselectedItem(res?.data)
      },
      enabled: !!selectedItem?.id
    },
  })
  
  const sharedOnCell = (_: DataType, index: number | undefined) => {
    if (index || index == 0) {
      if (index < 3) {
        return { colSpan: 0 };
      }
    }
    return {};
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: (vals: {id: number, isTrue: any}) => changeLetterForwardStatus({id: vals?.id, isTrue: vals?.isTrue}),
    onSuccess: async (res) => {
      _refetch();
      refetch()
      Notification("success","update", res?.message)
    },
    onError: (error: AxiosError<any>) => {
      message.error(error?.response?.data?.message);
    },
    retry: 0,
  });

  
  const { mutate: acceptMutation, isLoading: acceptLiading } = useMutation({
    mutationFn: (vals: {id: number, isOk: number}) => changeLetterReplyIsOk({id: vals?.id, isOk: vals?.isOk, message: descVal ? descVal[vals?.id] : ''}),
    onSuccess: async (res) => {
      _refetch();
      Notification("success","update", res?.message)
    },
    onError: (error: AxiosError<any>) => {
      message.error(error?.response?.data?.message);
    },
    retry: 0,
  });

  const menuItems = (item: any) => {

    const menuProps:MenuProps['items'] = [
      {
        label: checkPermission("letter-reply_is-ok") ?  
          <Popconfirm
              title="Bekor qilish sababi!"
              cancelText="Yopish"
              okText="Saqlash"
              onCancel={(event) => event?.stopPropagation()}
              icon={false}
              description={
                <div>
                  <Input.TextArea onClick={(event) => event.stopPropagation()} onChange={(e) => setDescVal(p => ({...p, [item?.letterReply?.id]: e?.target?.value}))} value={descVal ? descVal[item?.letterReply?.id] : ""} rows={4} className="w-[400px]" />
                </div>
              }
              onConfirm={(event) => {
                event?.stopPropagation();
                if(descVal && descVal[item?.letterReply?.id]){
                  acceptMutation({id: item?.letterReply?.id, isOk: 2})
                } else {
                  message.warning("Bekor qilish tavsifini kiriting!")
                  event?.preventDefault()
                }
              }}
          >
              <p onClick={(event) => event.stopPropagation()} className="">Bekor qilish</p>
          </Popconfirm> : null,
        key: '0',
      },
      {
        label: checkPermission("letter-reply_is-ok") ? "Qabul qilish" : null,
        onClick: (event) => {
          event.domEvent?.stopPropagation();
          acceptMutation({id: item?.letterReply?.id, isOk: 1})
        },
        key: '2',
      },
    ]
    return menuProps
  };

  const columns: ColumnsType<DataType> = [
    {
      title: t("Name"),
      dataIndex: "name",
      rowScope: "row",
    },
    {
      title: t("Value"),
      dataIndex: "value",
      onCell: (_, index) => ({
        colSpan: !(index == 0 || index == 1 || index == 2) ? 1 : 3,
      }),
    },
    {
      title: t("Name2"),
      dataIndex: "value2",
      onCell: (_, index) => sharedOnCell(_, index),
      className: "bg-[#FAFAFA]",
    },
    {
      title: t("Name3"),
      dataIndex: "value3",
      onCell: (_, index) => sharedOnCell(_, index),
    },
  ];

  const tableData: DataType[] = [
    {
      name: t("Description"),
      value: data?.data?.description,
    },
    {
      name: t("Asosiy ijrochi"),
      value: renderFullName(data?.data?.user?.profile),
    },
    {
      name: t("Qo'shimcha ijrochilar"),
      value: <>{data?.data?.letterForwardItem?.map((item: any) => <p>{renderFullName(item?.user?.profile)}</p>)}</>
    },
    {
      name: t("Ko'rish holati"),
      value: <Tag color={data?.data?.view_type === 1 ? "success" : "warning"}> {data?.data?.view_type === 1 ? <span>{t("Ko'rilgan")} - {dayjs(data?.data?.view_date*1000).format("YYYY.MM.DD HH:mm:ss")}</span> : t("Ko'rilmagan")} </Tag>,
      value2: t("Javob holati"),
      value3: <Tag color={data?.data?.is_answer === 1 ? "success" : "warning"}> {data?.data?.is_answer === 1 ? <span>{t("Javob berilgan")} - {dayjs(data?.data?.view_date*1000).format("YYYY.MM.DD HH:mm:ss")}</span> : t("Javob berilmagan")} </Tag>,
    },
    {
      name: t("Start date"),
      value: data?.data?.start_date ? dayjs(data?.data?.start_date*1000).format("YYYY.MM.DD HH:mm:ss") : "______",
      value2: t("End date"),
      value3: data?.data?.end_date ? dayjs(data?.data?.end_date*1000).format("YYYY.MM.DD HH:mm:ss") : "______",
    },
    {
      name: t("CreatedBy"),
      value: (
        <div>
          <span className="text-gray-400">
            {t("name")}/{t("Last Name")}/{t("Role")} :{" "}
          </span>
          {data?.data?.createdBy?.first_name} {data?.data?.createdBy?.last_name}{" "}
          (
          {data?.data?.createdBy?.role.map((item: string) => {
            return item;
          })}
          )
          {/* <p>
            <span className="text-gray-400">{t("Login")}: </span>
            {data?.data?.createdBy?.username}
          </p> */}
          <time className="block">
            <span className="text-gray-400">{t("Date")}: </span>
            {dayjs.unix(Number(data?.data?.created_at)).format('MM-DD-YYYY')}
          </time>
        </div>
      ),
      value2: t("UpdateBy"),
      value3: (
        <div>
          {data?.data?.updatedBy ? (
            <>
              <span className="text-gray-400">
                {t("name")}/{t("Last Name")}/{t("Role")} :{" "}
              </span>
              {data?.data?.updatedBy?.first_name}{" "}
              {data?.data?.updatedBy?.last_name} (
              {data?.data?.updatedBy?.role.map((item: string) => {
                return item;
              })}
              )
              {/* <p>
                <span className="text-gray-400">{t("Login")}: </span>
                {data?.data?.updatedBy?.username}
              </p> */}
              <time className="block">
                <span className="text-gray-400">{t("Date")}: </span>
                {dayjs.unix(Number(data?.data?.updated_at)).format('MM-DD-YYYY')}
              </time>
            </>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <Drawer title="Fishkani ko'rish" placement="right" width={1500} onClose={() => setOpen(false)} open={open}>
      <div className="">
        <div className="table-none-hover">
          <Table
            columns={columns}
            bordered
            dataSource={tableData}
            showHeader={false}
            pagination={false}
            loading={isFetching}
          />
          <div className="flex justify-end">
            {
              selectedItem?.status === 0 ?
              <Button disabled={!checkPermission("letter-forward_update")} onClick={() => mutate({id: selectedItem?.id, isTrue: true})} loading={isLoading} ghost className="mt-4 flex items-center">
                <span className="text-[#000]">Fishkani ijrochiga jo'natish </span><Send24Regular className="ml-3 text-[#000]" />
              </Button> : <Tag color="success" className="mt-5 text-[16px] py-1">Fishka ijrochiga yuborildi!</Tag>
            }
          </div>

          <h3 className="my-4">Javob xati:</h3>
          {
            data?.data?.letterForwardItem?.map((item: any, index: number) => (
                <Collapse key={index} className="mb-4">
                  <Collapse.Panel disabled={!item?.letterReply} header={
                      <div className="flex justify-between items-center">
                        <div>
                          <p>{renderFullName(item?.user?.profile)}</p>
                          <span className="text-[12px] font-semibold text-gray-400">Yuklangan vaqt: {item?.letterReply?.created_at ? dayjs(item?.letterReply?.created_at*1000).format("YYYY.MM.DD HH:mm:ss") : "Yuklanmagan"}</span>
                        </div>
                        
                        <div>
                          {
                            item?.letterReply ? item?.letterReply?.is_ok === 1 ?
                              <Tag color="success" className="text-[16px] py-1">Qabul qilingan!</Tag>
                              : item?.letterReply?.is_ok === 2 ? <Tag color="warning" className="text-[16px] py-1">Bekor qilingan!</Tag> 
                                : <Tag className="text-[16px] py-1">Tasdiqlanmagan</Tag> : <Tag className="text-[16px] py-1">Bajarilmagna</Tag>
                          }
                          {
                            item?.letterReply ? 
                              <Dropdown menu={{ items: menuItems(item) }} trigger={['click']} placement="bottomRight">
                                <MoreVertical24Filled onClick={(event) => event.stopPropagation()} className='cursor-pointer hover:text-neutral-500' />
                              </Dropdown> : ""
                          }
                        </div>
                      </div>
                    } 
                    key="1"
                  >
                    <p className="mb-4"><span className="font-semibold opacity-70 mr-3">Tavsif: </span>{item?.letterReply?.description}</p>
                    {
                      item?.letterReply?.file ? 
                      <FileViewer file={item?.letterReply?.file} />
                      : <p className="text-blue-500 underline">Fayl yuklanmagan!</p>
                    }
                    {item?.letterReplyHistory?.length ? <div>
                      <Divider />
                      <h4>Amaliyot tarixi:</h4>
                    </div> : ""}
                    {
                      item?.letterReplyHistory?.map((history: any) => (
                        <div key={history?.id} className="mt-4 bg-red-50 opacity-70 p-3 rounded-md" >
                          <p className="mb-2"><span className="font-semibold opacity-70 mr-3">Bekor qilish sababi: </span>{history?.message}</p>
                          <p className="mb-2"><span className="font-semibold opacity-70 mr-3">Tavsif: </span>{history?.description}</p>
                          <FileViewer file={history?.file} />
                          
                        </div>
                      ))
                    }
                  </Collapse.Panel>
                </Collapse>
            ))
          }
        </div>
      </div>
    </Drawer>
  );
};

export default ViewLetterForwardView;
