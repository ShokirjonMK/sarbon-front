import { Form, FormInstance, Input, Tag } from "antd";
import FormUIBuilder from "components/FormUIBuilder";
import { useTranslation } from "react-i18next";
import { TypeFormUIData } from "pages/common/types";

const formData: TypeFormUIData[] = [
  {
    name: "edu_plan_id",
    label: "Edu plan",
    url: "edu-plans",
    type: "select",
    child_names: ["edu_semestr_id", "group_id"],
    required: true,
    span: 24,
  },
  {
    name: "edu_semestr_id",
    label: "Edu semestr",
    url: "/edu-semestrs",
    type: "select",
    parent_name: "edu_plan_id",
    child_names: ["edu_semestr_subject_id"],
    render: (e) => <div>{e?.name} {e?.status == 1 ? <Tag color="green" className="ml-3">Active</Tag>: ""}</div>,
    required: true,
    span: 24,
  },
  {
    name: "edu_semestr_subject_id",
    label: "Edu semestr subject",
    url: "/edu-semestr-subjects",
    type: "select",
    expand: "subject",
    parent_name: "edu_semestr_id",
    required: true,
    span: 24,
  },
  {
    name: "group_id",
    label: "Group",
    url: "/groups",
    type: "select",
    parent_name: "edu_plan_id",
    render: (e) => <span>{e?.unical_name}</span>,
    required: true,
    span: 24,
  },
  {
    name: "user_id",
    label: "Responsible employee",
    url: "/teacher-accesses",
    render: (e) => <span>{e?.teacher?.first_name}</span>,
    type: "select",
    required: true,
    span: 24,
  },
  {
    name: "para_id",
    label: "Para",
    url: "/paras",
    type: "select",
    required: true,
    span: 24,
  },
  {
    name: "building_id",
    label: "Building",
    url: "/buildings",
    type: "select",
    child_names: ["room_id"],
    required: true,
    span: 24,
  },
  {
    name: "room_id",
    label: "Rooms",
    url: "/rooms",
    type: "select",
    parent_name: "building_id",
    required: true,
    span: 24,
  },
  {
    name: "exam_form_type",
    label: "Exam form type",
    type: "number",
    parent_name: "building_id",
    required: true,
    span: 24,
  },
  {
    name: "date",
    label: "Date",
    type: "date",
    parent_name: "date",
    required: true,
    span: 24,
  },
];

const VedmostFormUI  = ({id, form}: {id:number | undefined; form: FormInstance})  => {
  const {t} = useTranslation()

  return(
    <>
      <Form.Item label={t("Name")} name="vedomst" rules={[{ required: true, message: `${t("Please input vedmost")}!` }]}>
        <Input placeholder={`${t("vedmost")}...`} type="number" />
      </Form.Item>
      <FormUIBuilder data={formData} form={form} load={!!id ? true : false} />
    </>
  )
}

export default VedmostFormUI