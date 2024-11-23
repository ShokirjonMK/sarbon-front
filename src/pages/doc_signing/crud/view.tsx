import React, { ReactNode, useState } from "react";
import { Button, Form, Input, Modal, Table, Tag, message } from "antd";
import { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { FILE_URL } from "config/utils";
import { useMutation } from "@tanstack/react-query";
import { changeLetterIsOk } from "./request";
import { AxiosError } from "axios";
import { Notification } from "utils/notification";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { useParams } from "react-router-dom";
import useGetOneData from "hooks/useGetOneData";
import { DocumentDismissFilled, SignatureFilled } from "@fluentui/react-icons";

const sharedOnCell = (_: DataType, index: number | undefined) => {
  if (index || index == 0) {
    if (index < 3) {
      return { colSpan: 0 };
    }
  }
  return {};
};

interface DataType {
  name: string;
  value: ReactNode;
  value2?: ReactNode;
  value3?: ReactNode;
}

const ViewDocSigning: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [open, setOpen] = useState<"sign" | "cancle">()

  const { data, isFetching, refetch } = useGetOneData({
    queryKey: ["doc-outgoings", id],
    url: `doc-outgoings/${id}?expand=description,updatedBy,createdBy,files,qrCode,letterOutgoingBody`,
    options: {
      enabled: !!id
    },
  });

  const { mutate } = useMutation({
    mutationFn: (vals: { id: number | string | undefined, is_ok: 1 | 2, message: string }) => changeLetterIsOk(vals),
    onSuccess: async (res) => {
      if(res?.data?.status === 1){
        refetch();
        Notification("success", "update", res?.message);
        setOpen(undefined);
      }
    },
    onError: (error: AxiosError<any>) => {
      message.error(error?.response?.data?.message);
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
      name: t("File"),
      value: data?.data?.file ? <a href={FILE_URL + data?.data?.file} target="_blank">Xat faylini ko'rish</a> : "Fayl yuklanmagan",
    },
    {
      name: t("Tasdiqlash va kanselatiyaga jonatish"),
      value: data?.data?.is_ok === 1 ? <Tag color="success" className="py-1 text-sm">Imzolangan</Tag>
        : data?.data?.is_ok === 2 ? <Tag color="error" className="py-1 text-sm">Qaytarilgan</Tag>
          : <div className="d-f gap-2">
            <Button className="d-f" danger onClick={() => setOpen("cancle")} ><DocumentDismissFilled fontSize={16} /> &nbsp; Qaytarish</Button>
            <Button className="d-f" type="primary" onClick={() => setOpen("sign")} ><SignatureFilled fontSize={16} /> &nbsp; Imzolash</Button>
          </div>,
    },
    {
      name: t("Document weight"),
      value: data?.data?.documentWeight?.name,
      value2: t("Document type"),
      value3: data?.data?.importantLevel?.name,
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
            {data?.createdBy?.username}
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
                {data?.updatedBy?.username}
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
    <div className="">
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: '/' },
          { name: "Buyruqni imzolash", path: '/document-sign/docs' },
          { name: "View", path: '/document-sign/docs' }
        ]}
        title={t("Buyruqni imzolash")}
        isBack={true}
      />
      <div className="px-[24px] py-[20px]">
        <div className="table-none-hover">
          <Table
            columns={columns}
            bordered
            dataSource={tableData}
            showHeader={false}
            pagination={false}
            loading={isFetching}
          />
        </div>


        <Modal open={!!open} title={"Hujjatni imzolash"} footer={null} closable={false} >
          <Form
            // form={form}
            layout='vertical'
            onFinish={(val) => mutate({id, is_ok: open === "sign" ? 1 : 2, message: val?.message})}
            className="mt-4"
          >
            {open === "sign" ?
              // <Form.Item
              //   name={`password`}
              //   label={t("Tizimdagi parolingizni kiriting")}
              //   rules={[{ required: true, message: `Please input password` }]}
              // >
              //   <Input className='w-full' />

              // </Form.Item>
              <></>
              : <Form.Item
                name={`message`}
                label={t("Bekor qilish sababi")}
                rules={[{ required: true, message: `Please input description` }]}
              >
                <Input.TextArea rows={6} className='w-full' />

              </Form.Item>
            }
            <div className="text-end pt-4" >
              <Button htmlType="reset" onClick={() => setOpen(undefined)} >Bekor qilish</Button>
              <Button type="primary" htmlType="submit" danger={open === "cancle"} className="ms-2" >{open === "sign" ? "Imzolash" : "Qaytarish"}</Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ViewDocSigning;
