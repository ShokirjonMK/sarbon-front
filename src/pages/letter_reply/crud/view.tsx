import React, { ReactNode, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Table, Button, Tooltip, Tag } from "antd";
import HeaderUserView from 'pages/users/components/vewHeader';
import checkPermission from 'utils/check_permission';
import { useNavigate, useParams } from 'react-router-dom';
import useGetOneData from 'hooks/useGetOneData';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { FILE_URL } from 'config/utils';
import { DocumentText24Regular, Edit16Filled, Eye16Filled, SendFilled } from '@fluentui/react-icons';
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import useGetAllData from 'hooks/useGetAllData';
import { Notification } from 'utils/notification';
import { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import { requestReply } from './request';
import OpenFileByModal from 'components/openFileByModal';

interface DataType {
  name: string;
  value: ReactNode;
  value2?: ReactNode;
  value3?: ReactNode;
}

const sharedOnCell = (_: DataType, index: number | undefined) => {
  if (index || index == 0) {
    if (index < 2) {
      return { colSpan: 0 };
    }
  }
  return {};
};

const ComeLetterView: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { urlValue } = useUrlQueryParams({});
  const [open, setOpen] = useState<boolean>(false)

  const { data } = useGetOneData<any>({
    queryKey: ["letter-forward-items", id],
    url: `letter-forward-items/${id}?expand=updatedBy,createdBy,letterReply,letterForward.user.profile,letter,user.profile`,
    options: {},
  });

  const { data: replyData, refetch } = useGetAllData<any>({
    queryKey: ["letter-replies"],
    url: `letter-replies?sort=-id&expand=description,updatedBy,createdBy`,
    urlParams: { filter: { letter_forward_item_id: id } },
    options: {
      enabled: !!id
    }
  });

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
        colSpan: !(index == 0 || index == 1) ? 1 : 3,
      }),
    },
    {
      title: t("Name2"),
      dataIndex: "value2",
      onCell: (_, index) => sharedOnCell(_, index),
      className: "bg-[#FAFAFA] font-medium",
    },
    {
      title: t("Name3"),
      dataIndex: "value3",
      onCell: (_, index) => sharedOnCell(_, index),
    },
  ];

  const tableData: DataType[] = [
    // {
    //   name: t("Title"),
    //   value: data?.data?.title,
    // },
    {
      name: t("Description"),
      value: data?.data?.letterForward?.description,
    },
    {
      name: t("Topshiriq beruvchi"),
      value: <span>{data?.data?.createdBy?.last_name} {data?.data?.createdBy?.first_name}</span>,
    },
    {
      name: t("Ijrochi"),
      value: <span>{data?.data?.user?.profile?.last_name} {data?.data?.user?.profile?.first_name}</span>,
      value2: t("Asosiy ijrochi"),
      value3: <span>{data?.data?.letterForward?.user?.profile?.last_name} {data?.data?.letterForward?.user?.profile?.first_name}</span>,
    },
    {
      name: t("File"),
      value: data?.data?.letter?.file ? <DocumentText24Regular color='blue' cursor="pointer" onClick={() => setOpen(data?.data?.letter?.file)} /> : <Tag color="red" className='border-0' >File yuklanmagan</Tag>,
      value2: t('Javob xati holati'),
      value3: <span>{
        (!data?.data?.letterReply) ? <Tag color="warning" >Javob yozilmagan</Tag> :
        (!data?.data?.letterReply?.status) ? <Tag color="info" >Yuborilmagan</Tag> :
        (!data?.data?.letterReply?.is_ok) ? <Tag color="blue" >Kutilmoqda</Tag> :
        (data?.data?.letterReply?.is_ok === 1) ? <Tag color="success" >Tasdiqlangan</Tag> :
        (data?.data?.letterReply?.is_ok === 2) ? <div className="d-f" >
          <Tag color="error" >Qaytarilgan</Tag>
          <Tooltip title={data?.data?.letterReply?.message ?? ""}>
                <Button size="small" className="d-f" ><Eye16Filled/></Button>
              </Tooltip>
          </div> : null
      }</span>,
    },
    {
      name: t("Start date"),
      value: data?.data?.letterForward?.start_date ? dayjs(data?.data?.letterForward?.start_date * 1000).format("YYYY.MM.DD HH:mm:ss") : "______",
      value2: t("End date"),
      value3: data?.data?.letterForward?.end_date ? dayjs(data?.data?.letterForward?.end_date * 1000).format("YYYY.MM.DD HH:mm:ss") : "______",
    },
    // {
    //   name: t("CreatedBy"),
    //   value: (
    //     <div>
    //       <span className="text-gray-400">
    //         {t("name")}/{t("Last Name")}/{t("Role")} :{" "}
    //       </span>
    //       {data?.data?.createdBy?.first_name} {data?.data?.createdBy?.last_name}{" "}
    //       (
    //       {data?.data?.createdBy?.role.map((item: string) => {
    //         return item;
    //       })}
    //       )
    //       {/* <p>
    //         <span className="text-gray-400">{t("Login")}: </span>
    //         {data?.data?.createdBy?.username}
    //       </p> */}
    //       <time className="block">
    //         <span className="text-gray-400">{t("Date")}: </span>
    //         {dayjs.unix(Number(data?.data?.created_at)).format('MM-DD-YYYY')}
    //       </time>
    //     </div>
    //   ),
    //   value2: t("UpdateBy"),
    //   value3: (
    //     <div>
    //       {data?.data?.updatedBy ? (
    //         <>
    //           <span className="text-gray-400">
    //             {t("name")}/{t("Last Name")}/{t("Role")} :{" "}
    //           </span>
    //           {data?.data?.updatedBy?.first_name}{" "}
    //           {data?.data?.updatedBy?.last_name} (
    //           {data?.data?.updatedBy?.role.map((item: string) => {
    //             return item;
    //           })}
    //           )
    //           {/* <p>
    //             <span className="text-gray-400">{t("Login")}: </span>
    //             {data?.data?.updatedBy?.username}
    //           </p> */}
    //           <time className="block">
    //             <span className="text-gray-400">{t("Date")}: </span>
    //             {dayjs.unix(Number(data?.data?.updated_at)).format('MM-DD-YYYY')}
    //           </time>
    //         </>
    //       ) : null}
    //     </div>
    //   ),
    // },
  ];

  const replyColumn: ColumnsType<any> = [
    {
      title: '№',
      width: 45,
      showSorterTooltip: false,
      render: (_, __, i) => i + 1,
    },
    {
      title: t('Javob xat tasnifi'),
      render: (i: string, e) => <span>{e?.description}</span>,
    },
    {
      title: t('Javob xati file'),
      render: (e: any) => e?.file ? <a href={FILE_URL + e?.file} target='_blank'><DocumentText24Regular /></a> : "Fayl yuklanmagan"
    },
    {
      title: t('Yaratilgan vaqt'),
      render: (e) => <div>
        <p>{dayjs(e?.created_at * 1000).format("YYYY.MM.DD HH:mm:ss")}</p>
      </div>,
    },
    {
      title: t('Yuborilgan vaqt'),
      render: (e) => <div>
        <p>{e?.reply_date ? dayjs(e?.reply_date * 1000).format("YYYY.MM.DD HH:mm:ss") : ""}</p>
      </div>,
    },
    {
      title: t('Javob xati holati'),
      render: (e) => {
        if (!e?.status) return <Tag color="warning" >Yuborilmagan</Tag>
        if (!e?.is_ok) return <Tag color="blue" >Yuborilgan</Tag>
        if (e?.is_ok === 1) return <Tag color="success" >Tasdiqlangan</Tag>
        if (e?.is_ok === 2) return <div className="d-f" >
          <Tag color="error" >Qaytarilgan</Tag>
          <Tooltip title={e?.message ?? ""}>
            <Button size="small" className="d-f" ><Eye16Filled /></Button>
          </Tooltip>
        </div>
      },
    },
    {
      title: t("Actions"),
      width: 120,
      align: "center",
      render: (_, e, i) => <div className='d-f gap-2' >
        {checkPermission("letter-reply_update") && i === 0 && !e?.status ?
        <Tooltip title={"Tahrirlash"}>
          <Button
            size='small'
            onClick={() => navigate(`/letter-reply/${e?.letter_forward_item_id}/update/${e?.id}`)}
            className='d-f gap-1'
          ><Edit16Filled /></Button>
        </Tooltip>
          : null}
        {i === 0 && !e?.status ? <Tooltip title={"Yuborish"}>
          <Button
            type='primary'
            size='small'
            onClick={() => { reply(e?.id) }}
            className='d-f gap-1'
          ><SendFilled fontSize={15} className='-rotate-45 ml-1' /></Button>
        </Tooltip> : null}
      </div>,
    },
  ];

  const { mutate: reply, isLoading: clicked } = useMutation({
    mutationFn: (id: number) => requestReply(id),
    onSuccess: async (res: any) => {
      if (res?.status === 1) {
        Notification("success", id ? "update" : "create", res?.message);
        refetch();
      } else {
        Notification("error", id ? "update" : "create", res?.message);
      }
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", id ? "update" : "create", error?.response?.data ? error?.response?.data?.message : "");
    },
    retry: 0,
  });

  return (
    <div className="">
      <HeaderUserView
        breadCrumbData={[
          { name: "Home", path: "/" },
          { name: "Kelgan topshiriq xatlari", path: "/come-letters" },
          { name: data?.data?.title ?? "View come letter", path: "" },
        ]}
        title={data?.data?.title ?? "View come letter"}
        isBack={true}
        btn={
          <div>
            {
              checkPermission("letter-reply_create") && (!data?.data?.letterReply || data?.data?.letterReply?.is_ok === 2) ?
                <Button
                  type="primary"
                  className="px-5 ml-2"
                  onClick={() => navigate(`/letter-reply/${id}/create`)}
                >
                  Javob xati yozish
                </Button> : ""
            }
          </div>
        }
        tabs={[
          {
            key: "letter-info", label: t("Kelgan topshiriq xati"), children: <div>
              {/* <Divider orientation='left'>Topshiriq</Divider> */}
              <div className="table-none-hover px-4">
                <Table
                  columns={columns}
                  bordered
                  dataSource={tableData}
                  showHeader={false}
                  pagination={false}
                />
              </div>
              {/* <Divider orientation='left'>Xat</Divider> */}
              {/* <ViewLetter data={undefined} /> */}
            </div>,
          },
          {
            key: "letter-reply-info", label: t("Jo'natilgan xat"), children: <div>
              {/* <Divider orientation='left'>Topshiriq</Divider> */}
              <div className="table-none-hover px-4">
                <Table
                  columns={replyColumn}
                  bordered
                  dataSource={replyData?.items}
                  pagination={false}
                />
              </div>
              {/* <Divider orientation='left'>Xat</Divider> */}
              {/* <ViewLetter data={undefined} /> */}
            </div>,
          },
          // { key: 'document-executions', label: t("Document executions"), children: <LetterForwards />},
        ]}
      />
      <OpenFileByModal setVisible={setOpen} visible={open} file={data?.data?.letter?.file} width={"100%"} />
    </div>
  );
};

export default ComeLetterView;


/**
  * _index
  * _delete
  * _update
  * _view
*/