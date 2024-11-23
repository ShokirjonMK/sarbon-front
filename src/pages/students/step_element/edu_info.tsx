import React, { Dispatch } from 'react';
import { useTranslation } from "react-i18next";
import { Row, FormInstance, Button } from "antd";
import { StepType } from '../crud/update';
import FormUIBuilder, { TypeFormUIBuilder } from 'components/FormUIBuilder';
import { useNavigate, useParams } from 'react-router-dom';
import { ISCONTRACT } from 'config/constants/staticDatas';

const span = { lg: 12, xl: 12 };

export const edu_form_data: TypeFormUIBuilder[] = [
  {
    name: "edu_type_id",
    label: "Education type",
    type: "select",
    required: true,
    url: "edu-types",
    span
  },
  {
    name: "edu_form_id",
    label: "Education form",
    type: "select",
    required: true,
    url: "edu-forms",
    span
  },
  {
    name: "faculty_id",
    label: "Faculty",
    type: "select",
    required: true,
    url: "faculties",
    child_names: ["direction_id", "edu_plan_id", "group_id"],
    span
  },
  {
    name: "direction_id",
    label: "Direction",
    type: "select",
    required: true,
    url: "directions",
    parent_name: "faculty_id",
    child_names:['edu_plan_id'],
    span
  },
  {
    name: "edu_plan_id",
    label: "Education plan",
    type: "select",
    required: true,
    url: "edu-plans",
    parent_name: "direction_id",
    child_names: ["group_id"],
    span
  },
  {
    name: "group_id",
    label: "Group",
    type: "select",
    required: true,
    url: "groups",
    parent_name: "edu_plan_id",
    render: (e) => e?.unical_name ?? "",
    span
  },
  {
    name: "edu_year_id",
    label: "Education year",
    type: "select",
    required: true,
    url: "edu-years",
    span
  },
  {
    name: "course_id",
    label: "Course",
    type: "select",
    required: true,
    url: "courses",
    span
  },
  {
    name: "edu_lang_id",
    label: "Education language",
    type: "select",
    required: true,
    url: "languages",
    span
  },
  {
    name: "is_contract",
    label: "Form of payment",
    type: "select",
    required: true,
    url: "form-of-payment",
    data: ISCONTRACT,
    span
  },
  // {
  //   name: "edu_category_id",
  //   label: "Education category",
  //   type: "select",
  //   required: true,
  //   url: "edu-categories",
  //   span
  // },
]

const StudentEduInfo: React.FC<{ form: FormInstance, setsaveType: Dispatch<StepType>, isLoading: boolean }> = ({ form, setsaveType, isLoading }): JSX.Element => {
  const { t } = useTranslation();
  const { user_id } = useParams();
  const navigate = useNavigate()

  return (
    <div className="">
      <h3 className="text-[20px] font-medium mb-[24px]">2. {t("Education information")}</h3>
      <Row gutter={[24, 0]} >
        <FormUIBuilder data={edu_form_data} form={form} load={!!user_id} />
      </Row>
      <div className="flex justify-end mt-[24px]">
        <Button htmlType="button" onClick={() => { navigate(`/students/update/${user_id}?user-block=main-info`) }}>{t("Back")}</Button>
        <Button className='ml-[8px]' loading={isLoading} type='primary' htmlType="button" onClick={() => { form.submit(); setsaveType('address-info') }}>{t("Continue")}</Button>
      </div>
    </div>
  );
};

export default StudentEduInfo;