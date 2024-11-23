import Table, { ColumnsType } from 'antd/es/table';
import React, {ReactNode}  from 'react'
import { useTranslation } from 'react-i18next';

interface DataType {
  name: string;
  value: ReactNode;
  value2?: ReactNode;
  value3?: ReactNode;
}

const AddressInfo = ({data}:{data:any}) : JSX.Element => {
  const { t } = useTranslation();

  const sharedOnCell = (_: DataType, index: number | undefined, type?: "last") => {
    if(index || index == 0){
        if (index != 1) {
            return { colSpan: 0 };
        }
    }
    return {};
};

const columns: ColumnsType<DataType> = [
  {
    title: t("Value"),
    dataIndex: "name",
    rowScope: "row",
  },
  {
    title: t("Value"),
    dataIndex: "value",
    onCell: (_, index) => ({
      colSpan: (index == 1) ? 1 : 3
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
  name: t("Country"),
  value: data?.country?.name,
},
{
  name: t("Region"),
  value: data?.region?.name,
  value2: t("Area"),
  value3: data?.area?.name
},
{
  name: t("Address"),
  value: data?.profile?.address
},
{
  name: t("Additional Information"),
  value: data?.profile?.description
},
];

  return(
    <div className="px-[24px] pt-[30px] pb-[10px]">
      <p className="font-medium text-[16px] mb-4">{t("Residential address information")}</p>
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

export default AddressInfo