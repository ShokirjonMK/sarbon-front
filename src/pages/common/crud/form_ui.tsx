import { Form, FormInstance, Input } from "antd";
import FormUIBuilder from "components/FormUIBuilder";
import MultipleInput from "components/MultipleInput";
import { useTranslation } from "react-i18next";
import { TypeFormUIData } from "../types";

type TypeSimpleFormUI = {
  type: "create" | "update",
  formUIData: TypeFormUIData[],
  form: FormInstance<any>,
}

const SimpleFormUI: React.FC<TypeSimpleFormUI> = ({ type, formUIData, form }): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      {
        type === "create" ? (
          <MultipleInput layout='vertical' />
        ) : (
          <>
            <Form.Item
              label={t("Name")}
              name="name"
              shouldUpdate
              rules={[{ required: true, message: `${t("Please input name")}!` }]}
            >
              <Input placeholder={t("Enter name") + " ..."} />
            </Form.Item>
            <Form.Item
              label={t("Description")}
              name="description"
              shouldUpdate
              rules={[{ required: false, message: `${t("Please input name")}!` }]}
            >
              <Input.TextArea placeholder={t("Enter description") + " ..."} />
            </Form.Item>
          </>
        )
      }
      <FormUIBuilder data={formUIData} form={form} />
    </>
  )
}

export default SimpleFormUI;