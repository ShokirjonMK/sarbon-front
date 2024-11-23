import { Button, FormInstance } from "antd";
import { useTranslation } from 'react-i18next';
import { Dispatch, FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StepType } from "../crud/update";
import PassportElements from "pages/users/form_elements/passport_elements";

const TeacherPassportInfo: FC<{form: FormInstance, setsaveType: Dispatch<StepType>, passport_file?: string, isLoading?: boolean}> = ({form, setsaveType, passport_file, isLoading}): JSX.Element => {
    const { t } = useTranslation();
    const navigate = useNavigate()
    const { user_id } = useParams();

    return (
        <div>
            <h3 className="text-[20px] font-medium mb-[24px]">3. {t("Identity document")}</h3>
            <PassportElements form={form} passport_file={passport_file} />
            <div className="flex justify-end mt-[24px]">
                <Button htmlType="button" onClick={() => {navigate(`/teachers/update/${user_id}?user-block=main-info`)}}>{t("Back")}</Button>
                <Button loading={isLoading} className='ml-[8px]' type='primary' htmlType="button" onClick={() => {form.submit(); setsaveType('address-info')}}>{t("Continue")}</Button>
            </div>
        </div>
    )
}
export default TeacherPassportInfo;