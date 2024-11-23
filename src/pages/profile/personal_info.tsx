import Table, { ColumnsType } from "antd/es/table";
import { FILE_URL } from "config/utils";
import React, {ReactNode} from "react";
import { useTranslation } from "react-i18next";

interface DataType {
  name: string;
  value: ReactNode;
  value2?: ReactNode;
  value3?: ReactNode;
}

const PersonalInfo = ({data}:{data: any}) : JSX.Element => {
  const { t } = useTranslation();

  const sharedOnCell = (_: DataType, index: number | undefined, type?: "last") => {
    if(index || index == 0){
        if(index == 4){
            return { colSpan: 0 }
        }
        if(index == 3){
            return { colSpan: 1 }
        }
        if(type === "last"){
            return { colSpan: 0, rowSpan: 0 }
        }
        if (index < 3) {
            if(index == 0){
                return { colSpan: 2, rowSpan: 3 }
            }
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
      colSpan: (index == 4) ? 3 : 1
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
  name: t("Last name"),
  value: data?.profile?.last_name,
  value2: data?.profile?.image ? <a href={FILE_URL + data?.profile?.image} target="_blank"><img src={FILE_URL + data?.profile?.image} className="w-[120px] h-[120px] rounded-full" alt="User image" /></a> : t("Image not loaded!"),
},
{
  name: t("First name"),
  value: data?.profile?.first_name,
},
{
  name: t("Middle name"),
  value: data?.profile?.middle_name,
},
{
  name: t("Main phone number"),
  value: data?.profile?.phone,
  value2: t("Additional phone number" ),
  value3: data?.profile?.phone_secondary
},
{
    name: t("Email"),
    value: data?.email,
},
];

  return(
    <div className="px-[24px] pt-[15px] pb-[10px]">
      <p className="font-medium text-[16px] mb-4">{t("Personal information")}</p>
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

export default PersonalInfo