import React, { ReactNode } from "react";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import { StatusBadge } from "components/StatusTag";
import dayjs from "dayjs";
import { IDocument } from "models/document";

interface DataType {
  name: string;
  value: ReactNode;
  value2?: ReactNode;
  value3?: ReactNode;
}

const ViewDocument: React.FC<{data: IDocument | undefined}> = ({data}): JSX.Element => {

  const { t } = useTranslation();


  const sharedOnCell = (_: DataType, index: number | undefined) => {
    if (index || index == 0) {
      if (index < 2) {
        return { colSpan: 0 };
      }
    }
    return {};
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
        colSpan: !(index == 0 || index == 1) ? 1 : 3,
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
      name: t("Title"),
      value: data?.title,
    },
    {
      name: t("Description"),
      value: data?.description,
    },
    {
      name: t("Dokument nomeri"),
      value: data?.doc_number,
      value2: t("Semestr"),
      value3: data?.document_type_id,
    },
    {
      name: t("Document weight"),
      value: data?.documentWeight?.name,
      value2: t("Document type"),
      value3: data?.documentType?.name,
    },
    {
      name: t("Start date"),
      value: data?.start_date ? dayjs(data?.start_date*1000).format("YYYY.MM.DD HH:mm:ss") : "______",
      value2: t("End date"),
      value3: data?.end_date ? dayjs(data?.end_date*1000).format("YYYY.MM.DD HH:mm:ss") : "______",
    },
    {
      name: t("CreatedBy"),
      value: (
        <div>
          <span className="text-gray-400">
            {t("name")}/{t("Last Name")}/{t("Role")} :{" "}
          </span>
          {data?.createdBy?.first_name} {data?.createdBy?.last_name}{" "}
          (
          {data?.createdBy?.role.map((item: string) => {
            return item;
          })}
          )
          {/* <p>
            <span className="text-gray-400">{t("Login")}: </span>
            {data?.createdBy?.username}
          </p> */}
          <time className="block">
            <span className="text-gray-400">{t("Date")}: </span>
            {dayjs.unix(Number(data?.created_at)).format('MM-DD-YYYY')}
          </time>
        </div>
      ),
      value2: t("UpdateBy"),
      value3: (
        <div>
          {data?.updatedBy ? (
            <>
              <span className="text-gray-400">
                {t("name")}/{t("Last Name")}/{t("Role")} :{" "}
              </span>
              {data?.updatedBy?.first_name}{" "}
              {data?.updatedBy?.last_name} (
              {data?.updatedBy?.role.map((item: string) => {
                return item;
              })}
              )
              {/* <p>
                <span className="text-gray-400">{t("Login")}: </span>
                {data?.updatedBy?.username}
              </p> */}
              <time className="block">
                <span className="text-gray-400">{t("Date")}: </span>
                {dayjs.unix(Number(data?.updated_at)).format('MM-DD-YYYY')}
              </time>
            </>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div className="">
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

export default ViewDocument;
