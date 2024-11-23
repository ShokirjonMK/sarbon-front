import { Button, FormInstance } from "antd";
import { useTranslation } from 'react-i18next';
import { Dispatch } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AddressElements from "../form_elements/address_elements";

const UserAddressInfo = ({form, setsaveType, isLoading}: {form: FormInstance, setsaveType: Dispatch<"address-info" | "main-info" | "personal-info" | "job-info">, isLoading?: boolean}) => {

    const { t } = useTranslation();
    const navigate = useNavigate()
    const { user_id } = useParams();
    
    return (
        <div>
            <h3 className="text-[20px] font-medium mb-[24px]">3. {t("Residential address information")}</h3>

            <AddressElements form={form} />

            <div className="flex justify-end mt-[24px]">
                <Button htmlType="button" onClick={() => {navigate(`/users/update/${user_id}?user-block=personal-info`)}}>{t("Back")}</Button>
                <Button loading={isLoading} className='ml-[8px]' type='primary' htmlType="button" onClick={() => {form.submit(); setsaveType('job-info')}}>{t("Continue")}</Button>
            </div>
        </div>
    )
}
export default UserAddressInfo;