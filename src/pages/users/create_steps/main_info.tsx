import { Dispatch } from 'react'
import { Button, FormInstance } from "antd";
import { useTranslation } from 'react-i18next';
import PersonalElements from '../form_elements/personal_elements';
import AuthElements from '../form_elements/auth_elements';

const UserMainInfo = ({form, setsaveType, avatar, isLoading}: {form: FormInstance, setsaveType: Dispatch<"address-info" | "main-info" | "personal-info" | "job-info" | "users">, avatar: string | undefined, isLoading?: boolean}) => {

    const { t } = useTranslation();

    return (
        <div>
            <h3 className="text-[20px] font-medium mb-[24px]">1. {t("Basic information")}</h3>

            <PersonalElements form={form} avatar={avatar} />

            <p className='font-medium mt-[20px] mb-[12px]'>{t("Login information")}</p>

            <AuthElements form={form} />

            <div className="flex justify-end">
              <div className="flex">
                <Button loading={isLoading} htmlType="button" onClick={() => {form.submit(); setsaveType('users')}}>{t("Save and finish")}</Button>
                <Button loading={isLoading} className='ml-[8px]' type='primary' htmlType="button" onClick={() => {form.submit(); setsaveType('personal-info')}}>{t("Save and continue")}</Button>
              </div>
            </div>
        </div>
    )
}
export default UserMainInfo;