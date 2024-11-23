import React, { ReactNode } from "react";
import { Switch, Table, message } from "antd";
import { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { FILE_URL } from "config/utils";
import checkPermission from "utils/check_permission";
import { useMutation } from "@tanstack/react-query";
import { changeLetterIsOk } from "./request";
import { AxiosError } from "axios";
import { Notification } from "utils/notification";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { useParams } from "react-router-dom";
import useGetOneData from "hooks/useGetOneData";

interface DataType {
  name: string;
  value: ReactNode;
  value2?: ReactNode;
  value3?: ReactNode;
}

const ViewLetterConfirmation: React.FC = (): JSX.Element => {

  const { t } = useTranslation();
  const sharedOnCell = (_: DataType, index: number | undefined) => {
    if (index || index == 0) {
      if (index < 3) {
        return { colSpan: 0 };
      }
    }
    return {};
  };

  const { id } = useParams();

  const { data, refetch } = useGetOneData({
    queryKey: ["letters", id],
    url: `letters/${id}?expand=description,updatedBy,createdBy`,
    options: {
      enabled: !!id
    },
  });

  const { mutate } = useMutation({
    mutationFn: (vals: {id: number | undefined, is_ok: any}) => changeLetterIsOk({id: vals?.id, is_ok: vals?.is_ok}),
    onSuccess: async (res) => {
      Notification("success","update", res?.message)
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
      value: <Switch disabled={!checkPermission("letter_update")} onChange={(a) => { mutate({id: data?.data?.id, is_ok: a}) }} checked={data?.status === 1} />,
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
          { name: "Tasdiqlash xatlari", path: '/document-confirmations/letters' },
          { name: "Tasdiqlash xatlari", path: '/document-confirmations/letters' }
        ]}
        title={t("Tasdiqlash xatlari")}
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
          />
        </div>
      </div>
    </div>
  );
};

export default ViewLetterConfirmation;
