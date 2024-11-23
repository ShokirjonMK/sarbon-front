import { ReactNode} from "react";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";

interface DataType {
    name: string;
    value: ReactNode;
    value2?: ReactNode;
    value3?: ReactNode;
}

const JobInfo = ({data} : {data: any}) => {

    const { t } = useTranslation();

    const sharedOnCell = (_: DataType, index: number | undefined, type?: "last") => {
        if(index || index == 0){
            if (index >= 2) {
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
            colSpan: (index == 2) ? 3 : 1
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
        name: t("Diplom type"),
        value: data?.diplomaType?.name,
        value2: t("Degree"),
        value3: data?.degree?.name
      },
      {
        name: t("Academic degree"),
        value: data?.academikDegree?.name,
        value2: t("Degree information"),
        value3: data?.degreeInfo?.name
      },
      {
        name: t("Membership party"),
        value: data?.partiya?.name
      }
    ];

    return (
        <div className="px-[24px] pt-[15px] pb-[10px]">
            <div className="flex justify-between items-center mb-[12px]">
                <p className="font-medium text-[16px]">{t("Professional information")}</p>
            </div>
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
export default JobInfo;