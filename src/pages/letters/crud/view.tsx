import React, { ReactNode, useState } from "react";
import { Button, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { IDocument } from "models/document";
import { FILE_URL } from "config/utils";
import OpenFileByModal from "components/openFileByModal";
import { DocumentText24Regular } from "@fluentui/react-icons";

interface DataType {
  name: string;
  value: ReactNode;
  value2?: ReactNode;
  value3?: ReactNode;
}

const ViewLetter: React.FC<{data: IDocument | undefined, refetch: any}> = ({data, refetch}): JSX.Element => {
  const { t } = useTranslation();
  const [open, setOpen] = useState<any>()

  const sharedOnCell = (_: DataType, index: number | undefined) => {
    if (index || index == 0) {
      if (index < 3) {
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
      value: data?.description,
    },
    {
      name: t("Asosiy fayl"),
      value: data?.file ? <DocumentText24Regular color='blue' cursor="pointer" onClick={() => setOpen(data?.file)} /> : <Tag color="red" className='border-0' >File yuklanmagan</Tag>
    },
    {
      name: t("Ilova fayllari"),
      value: data?.files?.length ? <div className="inline-flex flex-col gap-1" >
        {
          data?.files?.map((f, index) => <Button type="link" size="small" onClick={() => setOpen(data?.file)} >{f?.file?.split("/")[f?.file?.split("/")?.length-1]}</Button>)
        }
      </div> : <Tag color="red" className="border-0" >Fayl yuklanmagan</Tag>,
    },
    // {
    //   name: t("Tasdiqlash va kanselatiyaga jonatish"),
    //   value: <Switch disabled={!checkPermission("letter_update")} onChange={(a) => { mutate({id: data?.id, isTrue: a}) }} checked={data?.status === 1} />,
    // },
    {
      name: t("Document weight"),
      value: data?.documentWeight?.name,
      value2: t("Document type"),
      value3: data?.importantLevel?.name,
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
        <OpenFileByModal setVisible={setOpen} visible={open} file={open} width={"100%"} />
      </div>
    </div>
  );
};

export default ViewLetter;
