import React, {ReactNode} from 'react'
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

interface DataType {
  name: string;
  value: ReactNode;
  value2?: ReactNode;
  value3?: ReactNode;
}

const GroupInfo =  ({data, isLoading}: {data: any, isLoading: any}) => {
  const {t} = useTranslation()

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
        colSpan: index === 4 ? 1 : 3,
      }),
    },
    {
      title: t("Name2"),
      dataIndex: "value2",
      onCell: (_, index) => ({
        colSpan: index === 4 ? 1 : 0,
        className: index === 4 ? 'bg-[#FAFAFA]' : ''
      }),
    },
    {
      title: t("Name3"),
      dataIndex: "value3",
      onCell: (_, index) => ({
        colSpan: index === 4 ? 1 : 0,
      }),
    },
  ];

  const tableData: DataType[] = [
    {
      name: t("Name"),
      value: data?.unical_name,
    },
    {
      name: t("Faculty"),
      value: data?.faculty?.name,
    },
    {
      name: t("Direction"),
      value: <div>{data?.direction?.name}</div>,
    },
    {
      name: t("Edu plan"),
      value: <div>{data?.eduPlan?.name}</div>,
    },
    {
      name: t("CreatedBy"),
      value: (
        <div>
          <span className="text-gray-400">
            {t("name")}/{t("Last Name")}/{t("Role")} :{" "}
          </span>
          {data?.createdBy?.first_name} {data?.data?.createdBy?.last_name}{" "}
          (
          {data?.createdBy?.role.map((item: string) => {
            return item;
          })}
          )
          {/* <p>
            <span className="text-gray-400">{t("Login")}: </span>
            {data?.createdBy?.username}
          </p> */}
          <time className='block'>
            <span className="text-gray-400">{t("Date")}: </span>
            {dayjs.unix(data?.created_at).format("MM-DD-YYYY hh:mm:ss a")}
          </time>
        </div>
      ),
      value2: t("UpdateBy"),
      value3: (
        <div>
          <span className="text-gray-400">
            {t("name")}/{t("Last Name")}/{t("Role")} :{" "}
          </span>
          {data?.updatedBy?.first_name} {data?.updatedBy?.last_name}{" "}
          (
          {data?.updatedBy?.role.map((item: string) => {
            return item;
          })}
          )
          {/* <p>
            <span className="text-gray-400">{t("Login")}: </span>
            {data?.updatedBy?.username}
          </p> */}
          <time className='block'>
            <span className="text-gray-400">{t("Date")}: </span>
            {dayjs.unix(data?.updated_at).format("MM-DD-YYYY hh:mm:ss a")}
          </time>
        </div>
      ),
    },
  ];

  return(
    <div className='content-card'>
        <Table
          columns={columns}
          bordered
          dataSource={tableData}
          showHeader={false}
          pagination={false}
          size="middle"
          loading={isLoading}
          className="mb-10"
        />
    </div>
  )
}

export default GroupInfo