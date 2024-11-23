import { Table } from "antd";
import { useTranslation } from "react-i18next";
import { DeleteFilled } from "@fluentui/react-icons";
import dayjs from "dayjs";
import { number_order } from "utils/number_orders";
import { ColumnsType } from "antd/es/table";
import DeleteData from "components/deleteData";
import { FILE_URL } from "config/utils";

const DocInfo = ({data, refetch} : {data: any, refetch:boolean}) => {

    const { t } = useTranslation();
    const all_files = data?.profile?.all_file && JSON.parse(data?.profile?.all_file)?.map((file:Array<{url: string, size: number, name: string}>) => file[0])

    const columns : ColumnsType<any> = [
        {
          title: t("№"),
          dataIndex: "name",
          width: 45,
          render: (_, __, i) => number_order(1, 100, Number(i), false),
        },
        {
          title: t("Name"),
          dataIndex: "name",
          render: (_, __) => <a href={FILE_URL + __?.url} className="text-neutral-950 underline" target="_blank">{_}</a>,
        },
        {
          title: t("Size"),
          dataIndex: "size",
          render: (i:any, e: any) => {
            return `${Math.floor(e?.size / 1024)} KB`
          },
        },
        {
          title: t("Upload date"),
          dataIndex: "url",
          render: (i:any, e: any) => {
            const arr = e?.url?.split("/")
            return dayjs.unix(arr[arr?.length - 1]?.split("_")[0]).format("MM-DD-YYYY HH:mm:ss")
          },
        },
        {
          dataIndex: "url",
          render: (i:any, e: any) => {
            const formdata = new FormData()
            formdata.append("url", e?.url)
            return <DeleteData permission={'access-control_delete-role'} refetch={refetch} data={formdata} url={"users"} id={Number(data?.id)}>
              <DeleteFilled className="text-[20px]" />
            </DeleteData>
          },
        },
    ];

    return (
        <div className="px-[24px] pt-[15px] pb-[10px]">
            <div className="flex justify-between items-center mb-[12px]">
                <p className="font-medium text-[16px]">{t("Professional information")}</p>
            </div>
            <Table
                columns={columns}
                dataSource={all_files}
                showHeader={true}
                pagination={false}
            />
        </div>
    )
}
export default DocInfo;