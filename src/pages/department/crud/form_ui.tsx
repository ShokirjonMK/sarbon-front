import React from "react";
import { Form, FormInstance, Input, Select, Tag } from "antd";
import { useTranslation } from "react-i18next";
import instance from "config/_axios";
import MultipleInput from "components/MultipleInput";
import useGetAllData from "hooks/useGetAllData";
import { cf_filterOption } from "utils/others_functions";

const UpdateFormUI = ({
  id,
  form,
}: {
  id: number | undefined;
  form: FormInstance;
}) => {
  const { t, i18n } = useTranslation();
  const [data, setData] =
    React.useState<Array<{ id: number; name: string }>>();
  const [parent, setParent] = React.useState<any[]>([]);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await instance({ url: "departments/types", method: "get" });
        setData(res.data);
      } catch (error: any) {}
    })();
  }, []);

  React.useEffect(() => {
    if(form.getFieldValue("parent_id")){
      getParent(form.getFieldValue("type"), true);
    }
  }, [form.getFieldValue("parent_id")]);

  const getParent = (key: any, load?: boolean) => {
    (async () => {
      try {
        const res = await instance({
          url: `departments?key=${key}`,
          method: "get",
        });
        setParent(res.data?.data?.items);
        if(!load){
          form.resetFields(["parent_id"]);
        }
      } catch (error: any) {}
    })();
  };

  const { data: departmentHead } = useGetAllData({
    queryKey: ["department-head"],
    url: "users",
  });

  return (
    <div>
      {!id ? (
        <MultipleInput layout="vertical" />
      ) : (
        <div>
          <Form.Item
            label={`${t("Name")} (${i18n.language})`}
            name="name"
            rules={[{ required: true, message: `${t("Please input name")}!` }]}
          >
            <Input placeholder={`${t("Name")}`} />
          </Form.Item>
          <Form.Item
            label={t("Description")}
            name="description"
            shouldUpdate
            rules={[
              {
                required: false,
                message: `${t("Please input department name")}!`,
              },
            ]}
          >
            <Input.TextArea
              placeholder={t("Enter description for department") + " ..."}
            />
          </Form.Item>
        </div>
      )}

      <Form.Item
        label={t("Type")}
        name="type"
        rules={[{ required: true, message: `${t("Please select type")}!` }]}
      >
        <Select
          placeholder={t("Select type")}
          className="w-full"
          onChange={(e) => getParent(e)}
          allowClear
        >
          {data?.map((item, i) => (
            <Select.Option value={item?.id} key={i}>
              {item?.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label={t("Parent")} name="parent_id">
        <Select
        allowClear
          placeholder={t("Select department")}
          disabled={!form.getFieldValue("type")}
        >
          {parent?.map((item, i) => (
            <Select.Option value={item?.id} key={i}>
              {item?.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label={t("Department head")} name='user_id'>
        <Select placeholder={t("Select employee")} allowClear showSearch filterOption={cf_filterOption}>
          {departmentHead?.items?.map((item, i) => (
            <Select.Option key={i} value={item?.id} className='flex items-center'>
              {item?.first_name} {item?.last_name} <div className="inline-flex gap-1">{item?.role.map((element:any, i:number )=> (<Tag className="ml-3" key={i}>{element}</Tag>))}</div>
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </div>
  );
};

export default UpdateFormUI;
