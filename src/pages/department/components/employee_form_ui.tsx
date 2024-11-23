import { Form, FormInstance, Select, Tag } from "antd";
import { useTranslation } from "react-i18next";
import useGetAllData from "hooks/useGetAllData";

const EmployeeFormUi = ({form,id,}: {form: FormInstance;id: number | undefined;}) => {
  const { t } = useTranslation();

  const { data } = useGetAllData({
    queryKey: ["users"],
    url: `users`,
  });

  return (
    <>
      <Form.Item
        label={t("Employee")}
        name="user_id"
        rules={[
          {
            required: false,
            message: `${t("Please select employee")}!`,
          },
        ]}
      >
        <Select placeholder={t("Select employee")} allowClear>
          {data?.items.map((item, i) => (
            <Select.Option value={item?.id}>
              <div key={i}>
                {item?.first_name} {item?.last_name} &nbsp;{" "}
                {item?.role?.map((e: string, idx: number) => (
                  <Tag key={idx}>{e}</Tag>
                ))}
              </div>
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label={t("Leader")} name="is_leader">
        <Select placeholder={t("Leader or employee")} allowClear>
          <Select.Option value={1}>{t("Leader")}</Select.Option>
          <Select.Option value={0}>{t("Employee")}</Select.Option>
        </Select>
      </Form.Item>
    </>
  );
};

export default EmployeeFormUi;
