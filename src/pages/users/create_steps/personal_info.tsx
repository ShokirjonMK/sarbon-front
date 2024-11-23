import { Button, FormInstance } from "antd";
import { useTranslation } from 'react-i18next';
import { Dispatch } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PassportElements from '../form_elements/passport_elements';

const UserPersonalInfo = ({form, setsaveType, passport_file, isLoading}: {form: FormInstance, setsaveType: Dispatch<"address-info" | "main-info" | "personal-info" | "job-info">, passport_file?: string, isLoading?: boolean}) => {

    const { t } = useTranslation();
    const navigate = useNavigate()
    const { user_id } = useParams();

    return (
        <div>
            <h3 className="text-[20px] font-medium mb-[24px]">2. {t("Identity document")}</h3>

            <PassportElements form={form} passport_file={passport_file} />

            <div className="flex justify-end mt-[24px]">
                <Button htmlType="button" onClick={() => {navigate(`/users/update/${user_id}?user-block=main-info`)}}>{t("Back")}</Button>
                <Button loading={isLoading} className='ml-[8px]' type='primary' htmlType="button" onClick={() => {form.submit(); setsaveType('address-info')}}>{t("Continue")}</Button>
            </div>
        </div>
    )
}
export default UserPersonalInfo;