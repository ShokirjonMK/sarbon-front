import { Dispatch, FC, useState } from 'react'
import { Alert, Button, Divider, FormInstance, Row } from "antd";
import { useTranslation } from 'react-i18next';
import PersonalElements from 'pages/users/form_elements/personal_elements';
import { StepType } from '../crud/update';
import PassportElements from 'pages/users/form_elements/passport_elements';
import FormUIBuilder, { TypeFormUIBuilder } from 'components/FormUIBuilder';
import { useParams } from 'react-router-dom';

const span = { lg: 12, xl: 12 };



const StudentMainInfo: FC<{ form: FormInstance, setsaveType: Dispatch<StepType>, avatar: string | undefined, passport_file?: string, }> = ({ form, setsaveType, avatar, passport_file }): JSX.Element => {
  const { t } = useTranslation();
  const { user_id } = useParams();
  const [eduPlanAndEduSemestr, seteduPlanAndEduSemestr] = useState<{edu_plan: string, edu_semestr: string}>({} as {edu_plan: string, edu_semestr: string})

  const edu_form_data: TypeFormUIBuilder[] = [
    {
      name: "faculty_id",
      label: "Faculty",
      type: "select",
      required: true,
      url: "faculties",
      child_names: ["direction_id", "edu_plan_id", "group_id"],
      onchange(e, obj) {
        seteduPlanAndEduSemestr({edu_semestr: '', edu_plan: ''});
      },
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
      onchange(e, obj) {
        seteduPlanAndEduSemestr({edu_semestr: '', edu_plan: ''});
      },
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
      onchange(e, obj) {
        seteduPlanAndEduSemestr({edu_semestr: '', edu_plan: obj?.name});
      },
      span
    },
    {
      name: "group_id",
      label: "Group",
      type: "select",
      required: true,
      url: "groups",
      expand: "activeEduSemestr,activeEduSemestr.semestr",
      parent_name: "edu_plan_id",
      render: (e) => e?.unical_name ?? "",
      onchange(e, obj) {
        seteduPlanAndEduSemestr({edu_semestr: obj?.activeEduSemestr.semestr?.name, edu_plan: eduPlanAndEduSemestr?.edu_plan});
      },
      span
    },
  ]  

  return (
    <div>
      <h3 className="text-[20px] font-medium mb-[24px]">1. {t("Basic information")}</h3>
      <PersonalElements form={form} avatar={avatar} is_student={true} />
      <Divider orientation='left' orientationMargin={0} ><p className='font-medium mt-[20px] mb-[12px]'>{t("Passport information")}</p></Divider>
      <PassportElements form={form} passport_file={passport_file} />
      {!user_id ? 
        <div>
          <Divider orientation='left' orientationMargin={0} ><p className='font-medium mt-[20px] mb-[12px]'>{t("Education information")}</p></Divider>
          <Row gutter={[24, 0]} >
            <FormUIBuilder data={edu_form_data} form={form} load={!!user_id} />
          </Row>
          {(eduPlanAndEduSemestr?.edu_plan && eduPlanAndEduSemestr?.edu_semestr) ? <Alert className='mb-4' message={`Talaba ${eduPlanAndEduSemestr?.edu_plan} ${eduPlanAndEduSemestr?.edu_semestr} dan o'qishni davom ettiradi!`} type="warning"  /> : ""}
        </div>
      : ""}
      <div className="flex justify-end">
        <div className="flex">
          <Button htmlType="button" onClick={() => { form.submit(); setsaveType('students') }}>{t("Save and finish")}</Button>
          <Button className='ml-[8px]' type='primary' htmlType="button" onClick={() => { form.submit(); setsaveType('edu-info') }}>{t("Save and continue")}</Button>
        </div>
      </div>
    </div>
  )
}

export default StudentMainInfo;