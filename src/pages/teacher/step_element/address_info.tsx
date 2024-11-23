import { Button, FormInstance } from "antd";
import { useTranslation } from 'react-i18next';
import { Dispatch, FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AddressElements from "pages/users/form_elements/address_elements";
import { StepType } from "../crud/update";

const TeacherAddressInfo: FC<{form: FormInstance, setsaveType: Dispatch<StepType>, isLoading?: boolean}> = ({form, setsaveType, isLoading}):JSX.Element => {
    const { t } = useTranslation();
    const navigate = useNavigate()
    const { user_id } = useParams();

    return (
        <div>
            <h3 className="text-[20px] font-medium mb-[24px]">4. {t("Residential address information")}</h3>
            <AddressElements form={form} />
            <div className="flex justify-end mt-[24px]">
                <Button htmlType="button" onClick={() => {navigate(`/teachers/update/${user_id}?user-block=personal-info`)}}>{t("Back")}</Button>
                <Button loading={isLoading} className='ml-[8px]' type='primary' htmlType="button" onClick={() => {form.submit(); setsaveType('job-info')}}>{t("Continue")}</Button>
            </div>
        </div>
    )
}
export default TeacherAddressInfo;