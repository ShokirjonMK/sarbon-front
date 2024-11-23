import { Dispatch } from 'react'
import { Button, FormInstance } from "antd";
import { useTranslation } from 'react-i18next';
import PersonalElements from 'pages/users/form_elements/personal_elements';
import { StepType } from '../crud/update';
import AuthElements from 'pages/users/form_elements/auth_elements';

const TeacherMainInfo = ({ form, setsaveType, avatar }: { form: FormInstance, setsaveType: Dispatch<StepType>, avatar: string | undefined }) => {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="text-[20px] font-medium mb-[24px]">1. {t("Basic information")}</h3>
      <PersonalElements form={form} avatar={avatar} />
      <p className='font-medium mt-[20px] mb-[12px]'>{t("Login information")}</p>
      <AuthElements form={form} />
      <div className="flex justify-end">
        <div className="flex">
          <Button htmlType="button" onClick={() => { form.submit(); setsaveType('teachers') }}>{t("Save and finish")}</Button>
          <Button className='ml-[8px]' type='primary' htmlType="button" onClick={() => { form.submit(); setsaveType('personal-info') }}>{t("Save and continue")}</Button>
        </div>
      </div>
    </div>
  )
}
export default TeacherMainInfo;