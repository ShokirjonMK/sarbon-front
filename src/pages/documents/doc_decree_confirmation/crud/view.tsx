import React, { ReactNode, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Table, Button, Tooltip, Tag, Popconfirm, Input } from "antd";
import checkPermission from 'utils/check_permission';
import { useNavigate, useParams } from 'react-router-dom';
import useGetOneData from 'hooks/useGetOneData';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { DocumentText24Regular, Eye16Filled } from '@fluentui/react-icons';
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import OpenFileByModal from 'components/openFileByModal';
import HeaderExtraLayout from 'components/HeaderPage/headerExtraLayout';
import A4FormatModal from 'components/A4FormatModal';
import { ILetterOutgoing } from 'models/document';
import { useMutation } from '@tanstack/react-query';
import { docNoticeConfirm } from './request';
import { Notification } from 'utils/notification';
import { AxiosError } from 'axios';
import { FilterSearchType } from 'antd/es/table/interface';
import FilterSelect, { TypeFilterSelect } from 'components/FilterSelect';

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

const DocDecreeConfirmView: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [open, setOpen] = useState<boolean>(false);
  const [file, setFile] = useState<any>();
  const [returnDescription, setReturnDescription] = useState<string>();
  const { urlValue, writeToUrl } = useUrlQueryParams({});

  const { data, refetch } = useGetOneData<any>({
    queryKey: ["document-decrees", id],
    url: `/document-decrees/${id}?expand=info.user.profile,user.profile,body,qrCode`,
    options: {},
  });

  const { mutate, isLoading: sendLoading } = useMutation({
    mutationFn: (data: { id: string | undefined, type: number, message?: string, signature_user_id?: number }) => docNoticeConfirm(id, data.type, data.message, data.signature_user_id),
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

  const selectData: TypeFilterSelect = {
     name: "user_id",
     label: "Imzolovchi",
     permission: "user_index",
     url: "users",
     filter: {role_name: ["rector", "prorector"], status: 10},
     render: e => e?.last_name + " " + e?.first_name,
     span: 24
    }

  const cancelButton = (type: 2 | 1) => {
    if(type === 1) return <Popconfirm
        title="Bekor qilish sababi!"
        cancelText="Yopish"
        okText="Saqlash"
        onCancel={(event) => {event?.stopPropagation()}}
        icon={false}
        okButtonProps={{disabled: !returnDescription}}
        description={
          <div>
            <Input.TextArea onChange={(e) => setReturnDescription(e?.target?.value)} value={returnDescription} rows={4} className="w-[400px]" />
          </div>
        }
        onConfirm={(event) => {
          event?.stopPropagation();
          mutate({id, type, message: returnDescription})
        }}
    >
        <Button onClick={(event) => {setReturnDescription(undefined); event.stopPropagation()}} danger>Qaytarish</Button>
    </Popconfirm>

    if(type === 2) return <Popconfirm
        title="Tasdiqlash!"
        cancelText="Yopish"
        okText="Saqlash"
        onCancel={(event) => {event?.stopPropagation(); writeToUrl({name: "user_id", value: ""});}}
        icon={false}
        okButtonProps={{disabled: !urlValue?.filter?.user_id}}
        description={
          <div className='w-[240px]' >
            <FilterSelect {...selectData} />
          </div>
        }
        onConfirm={(event) => {
          event?.stopPropagation();
          mutate({id, type, signature_user_id: urlValue?.filter?.user_id})
        }}
    >
        <Button onClick={(event) => {writeToUrl({name: "user_id", value: ""}); event.stopPropagation()}}>Tasdiqlash</Button>
    </Popconfirm>
  }

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
      name: t("HUjjatni tasdiqlash"),
      value: data?.data?.status && data?.data?.type === 0 ? <div className="d-f gap-1" >{cancelButton(2)}{cancelButton(1)}</div> : null,
    },
    {
      name: t("Farmoyish beruvchi"),
      value: <span>{data?.data?.user?.profile?.last_name} {data?.data?.user?.profile?.first_name}</span>,
      value2: t("Yuborilgan vaqt"),
      value3: <span>{data?.data?.sent_time ? dayjs(data?.data?.sent_time * 1000).format("YYYY.MM.DD HH:mm:ss") : ""}</span>,
    },
    {
      name: t("File"),
      value: data?.data?.body ? <DocumentText24Regular color='blue' cursor="pointer" onClick={() => {setFile(data?.data); setOpen(true)}} /> : <Tag color="red" className='border-0' >File yuklanmagan</Tag>,
      value2: t('Javob xati holati'),
      value3:
        (!data?.data?.status) ? <Tag color="gold" >Yuborilmagan</Tag>
          : (data?.data?.type === 2) ? <Tag color="success" >Kard tasdiqlagan</Tag>
            : (data?.data?.type === 4) ? <Tag color="blue" >Imzolangan</Tag>
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
  ];

  return (
    <div className="">
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: '/' },
          { name: "Farmoyishlar", path: '/document-confirmations/decree' },
          { name: "Farmoyishni Tasdiqlash", path: '/doc-decree/view/:id' }
        ]}
        title={t("Farmoyishni Tasdiqlash")}
        isBack={true}
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

export default DocDecreeConfirmView;


/**
  * _index
  * _delete
  * _update
  * _view
*/