import { Form, FormInstance, Table } from "antd";
import { useTranslation } from "react-i18next";
import { UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { AttachFilled, DeleteFilled } from "@fluentui/react-icons";
import dayjs from "dayjs";
import { number_order } from "utils/number_orders";
import { ColumnsType } from "antd/es/table";
import DeleteData from "components/deleteData";
import { useParams } from "react-router-dom";
import { FILE_URL } from "config/utils";
import checkPermission from "utils/check_permission";

const DocsUserView = ({data, form, saveMutation, refetch} : {data: any, form: FormInstance, saveMutation: UseMutationResult<any, AxiosError<any, any>, void, unknown>, refetch: any}) => {

    const { t } = useTranslation();
    const { user_id } = useParams();

    const all_files = data?.profile?.all_file && JSON.parse(data?.profile?.all_file)?.map((file:Array<{url: string, size: number, name: string}>) => file[0])

    const fileSave = (val: React.ChangeEvent<HTMLInputElement>) => {
      if(val.target.files?.length){
        form.setFieldsValue({
          all_file: val.target.files[0]
        })
        form.submit()
      }
    }

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
            return <DeleteData permission={'user_update'} refetch={refetch} data={formdata} url={"users"} id={Number(user_id)}>
              <DeleteFilled className="text-[20px]" />
            </DeleteData>
          },
        },
    ];

    return (
        <div className="px-[24px] pt-[15px] pb-[10px]">
            <div className="flex justify-between items-center mb-[12px]">
                <p className="font-medium text-[16px]">{t("Professional information")}</p>
                <Form
                  form={form}
                  name="basic"
                  layout="vertical"
                  onFinish={(values) => saveMutation.mutate(values)}
              >
                {
                  checkPermission("user_update") ?
                  <Form.Item
                        name="all_file"
                        className="m-0"
                    >
                    <input type="file" onChange={fileSave} className="hidden" style={{display: "none"}} id="allFiles" />
                    <label className="ant-btn css-dev-only-do-not-override-zclzbl ant-btn-default flex items-center" htmlFor="allFiles" ><AttachFilled className='text-[18px] mr-1' />{t("Upload file")}</label>
                  </Form.Item> : ""
                }
              </Form>
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
export default DocsUserView;