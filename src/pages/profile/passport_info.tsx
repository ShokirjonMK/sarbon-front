import Table, { ColumnsType } from 'antd/es/table';
import { FILE_URL } from 'config/utils';
import React, {ReactNode} from 'react'
import { useTranslation } from 'react-i18next'

interface DataType {
  name: string;
  value: ReactNode;
  value2?: ReactNode;
  value3?: ReactNode;
}

const PassportInfo = ({data}:{data:any}) : JSX.Element => {
  const {t} = useTranslation()

  const sharedOnCell = (_: DataType, index: number | undefined, type?: "last") => {
    if(index || index == 0){
        if (index >= 4) {
            return { colSpan: 0, rowSpan: 0 };
        }
    }
    return {};
};

const columns: ColumnsType<DataType> = [
  {
    title: t("Surname"),
    dataIndex: "name",
    rowScope: "row",
  },
  {
    title: t("Value"),
    dataIndex: "value",
    onCell: (_, index) => ({
      colSpan: (index == 4 || index == 5) ? 3 : 1
    }),
  },
  {
    title: t("Name2"),
    dataIndex: "value2",
    onCell: (_, index) => sharedOnCell(_, index),
    className: "bg-[#FAFAFA]"
  },
  {
    title: t("Name3"),
    dataIndex: "value3",
    onCell: (_, index) => sharedOnCell(_, index, "last"),
  },
];

const tableData: DataType[] = [
{
  name: t("Birthday"),
  value: data?.profile?.birthday,
  value2: t("Gender"),
  value3: data?.profile?.gender == 1 ? t("Male") : data?.profile?.gender === 0 ? t("Female") : ""
},
{
  name: t("Citizenship"),
  value: data?.citizenship?.name,
  value2: t("Nationality"),
  value3: data?.nationality?.name
},
{
  name: t("Document series and number"),
  value: `${data?.profile?.passport_serial ? data?.profile?.passport_serial : ""}  ${data?.profile?.passport_number ? data?.profile?.passport_number : ""}`,
  value2: t("JSHSHIR"),
  value3: data?.profile?.passport_pin
},
{
  name: t("Date of issue of the document"),
  value: data?.profile?.passport_given_date,
  value2: t("Validity period" ),
  value3: data?.profile?.passport_issued_date
},
{
  name: t("Address"),
  value: data?.profile?.passport_given_by
},
{
  name: t("Document file"),
  value: data?.profile?.passport_file ? <a href={FILE_URL + data?.profile?.passport_file} target="_blank">{t("Download")}</a> : "----"
},
];

  return(
    <div className="px-[24px] pt-[15px] pb-[10px]">
      <p className="font-medium text-[16px] mb-4">{t("Identity document")}</p>
      <Table
        columns={columns}
        bordered
        dataSource={tableData}
        showHeader={false}
        pagination={false}
      />
    </div>
  )
} 

export default PassportInfo