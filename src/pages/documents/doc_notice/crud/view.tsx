import React, { ReactNode, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Table, Button, Tooltip, Tag } from "antd";
import checkPermission from 'utils/check_permission';
import { useNavigate, useParams } from 'react-router-dom';
import useGetOneData from 'hooks/useGetOneData';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { DocumentText24Regular, Eye16Filled, SendFilled } from '@fluentui/react-icons';
import HeaderExtraLayout from 'components/HeaderPage/headerExtraLayout';
import A4FormatModal from 'components/A4FormatModal';
import { useMutation } from '@tanstack/react-query';
import { sendNoticeData } from './request';
import { Notification } from 'utils/notification';
import { AxiosError } from 'axios';

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


const DocNoticeView: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [open, setOpen] = useState<boolean>(false);
  const [file, setFile] = useState<any>();

  const { data, refetch } = useGetOneData<any>({
    queryKey: ["document-notifications", id],
    url: `/document-notifications/${id}?expand=info.user.profile,user.profile,body,qrCode`,
    options: {},
  });

  const { mutate: sendNotice, isLoading: sendLoading } = useMutation({
    mutationFn: () => sendNoticeData(id),
    onSuccess: async (res) => {
      if (res?.status === 1) {
        Notification("success", "update", res?.message);
        refetch();
      } else {
        Notification("error", "update", res?.message);
      }
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", "update", error?.response?.data ? error?.response?.data?.data?.message : "");
    },
    retry: 0,
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
    {
      name: t("Description"),
      value: data?.data?.description,
    },
    {
      name: t("Hujjatni ko'rganlar"),
      value: data?.data?.info?.map((e: any, i: number) => (
        <div>{e?.user?.profile?.last_name} {e?.user?.profile?.first_name} / {dayjs(e?.view_time * 1000).format("YYYY.MM.DD HH:mm:ss")}</div>
      )),
    },
    {
      name: t("Bildirgi beruvchi"),
      value: <span>{data?.data?.user?.profile?.last_name} {data?.data?.user?.profile?.first_name}</span>,
      value2: t("Yuborilgan vaqt"),
      value3: <span>{data?.data?.sent_time ? dayjs(data?.data?.sent_time * 1000).format("YYYY.MM.DD HH:mm:ss") : ""}</span>,
    },
    {
      name: t("File"),
      value: data?.data?.body ? <DocumentText24Regular color='blue' cursor="pointer" onClick={() => {setFile(data?.data); setOpen(true)}} /> : <Tag color="red" className='border-0' >File yuklanmagan</Tag>,
      value2: t('Javob xati holati'),
      value3:
        (!data?.data?.status) ? <div className="d-f gap-1"><Tag color="gold" >Yuborilmagan</Tag><Tooltip title={"Yuborish"}>
        <Button
          type='primary'
          size='small'
          onClick={() => { sendNotice() }}
          className='d-f gap-1'
        ><SendFilled fontSize={15} className='-rotate-45- ml-1' /></Button>
      </Tooltip></div>
          : (data?.data?.type === 2) ? <Tag color="success" >Kard tasdiqlagan</Tag>
            : (data?.data?.type === 4) ? <Tag color="#87d068" >Imzolangan</Tag>
              : (data?.data?.type === 1) ? <div className="d-f" >
                <Tag color="error" >Kadr qaytargan</Tag>
                <Tooltip title={data?.data?.message ?? ""}>
                  <Button size="small" className="d-f" ><Eye16Filled /></Button>
                </Tooltip>
              </div>
                : (data?.data?.type === 3) ? <div className="d-f" >
                  <Tag color="error" >Rektor qaytargan</Tag>
                  <Tooltip title={data?.data?.message ?? ""}>
                    <Button size="small" className="d-f" ><Eye16Filled /></Button>
                  </Tooltip>
                </div>
                  : (data?.data?.status) ? <Tag color="blue" >Kutilmoqda</Tag>
                    : null,
    }
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

  return (
    <div className="">
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: '/' },
          { name: "Bildirgilar", path: '/doc-notice' },
          { name: "Bildirgini ko'rish", path: '/doc-notice/view/:id' }
        ]}
        title={t("Bildirgi")}
        isBack={true}
        btn={
          <div>
            {
              checkPermission("document-notification_create") && !data?.data?.status ?
                <Button
                  type="primary"
                  className="px-5 ml-2"
                  onClick={() => navigate(`/doc-notice/update/${data?.data?.id}`)}
                >
                  Tahrirlash
                </Button> : ""
            }
          </div>
        }
      />

      <div className="table-none-hover p-4">
        <Table
          columns={columns}
          bordered
          dataSource={tableData}
          showHeader={false}
          pagination={false}
        />
      </div>
      <A4FormatModal isModalOpen={open} setIsModalOpen={setOpen} data={file} />
    </div>
  );
};

export default DocNoticeView;


/**
  * _index
  * _delete
  * _update
  * _view
*/