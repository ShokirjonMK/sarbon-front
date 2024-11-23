import { Form, FormInstance, Input, Switch } from "antd";
import FormUIBuilder from "components/FormUIBuilder";
import { useTranslation } from "react-i18next";
import { TypeFormUIData } from "pages/common/types";

const formData: TypeFormUIData[] = [
  // {
  //   name: "unical_name",
  //   label: "Unical name",
  //   required: false,
  //   type: "select",
  //   // url: "faculties",
  //   span: 24,
  // },
  {
    name: "faculty_id",
    label: "Faculty",
    required: true,
    type: "select",
    url: "faculties",
    child_names: ["direction_id"],
    span: 24,
  },
  {
    name: "direction_id",
    label: "Direction",
    url: "directions",
    type: "select",
    parent_name: "faculty_id",
    child_names: ["edu_plan_id"],
    required: true,
    span: 24,
  },
  {
    name: "edu_plan_id",
    label: "Edu plan",
    url: "edu-plans",
    type: "select",
    parent_name: "direction_id",
    child_names: ["language_id"],
    required: true,
    span: 24,
  },
  {
    name: "language_id",
    label: "Edu language",
    required: true,
    type: "select",
    url: "languages",
    parent_name: "edu_plan_id",
    span: 24,
  },
];

const GroupFormUI  = ({id, form}: {id:number | undefined; form: FormInstance})  => {
  const {t} = useTranslation()

  return(
    <>
      <Form.Item label={t("Name")} name="unical_name" rules={[{ required: true, message: `${t("Please input unical name")}!` }]}>
        <Input placeholder={`${t("unical name")}...`} />
      </Form.Item>
      <FormUIBuilder data={formData} form={form} load={!!id ? true : false} />
      <Form.Item name="status" valuePropName="checked" >
        <Switch
          checkedChildren="Active"
          unCheckedChildren="InActive"
        />
      </Form.Item>
    </>
  )
}

export default GroupFormUI