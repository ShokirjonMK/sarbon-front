import { Button, Divider, FormInstance } from "antd";
import { useTranslation } from 'react-i18next';
import { Dispatch } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PrefessionElements from "../form_elements/profession_elements";
import TeacherAccessInfoUserViewNew from "../view_steps/profession_step/teacher_access_info_new";
import checkPermission from "utils/check_permission";
import UserAccessInfoUserViewNew from "../view_steps/profession_step/user_access_info_new";

const UserProfessionInfo = ({form, setsaveType, isLoading, roles}: {form: FormInstance, setsaveType: Dispatch<"address-info" | "main-info" | "personal-info" | "job-info" | "users">, isLoading?: boolean, roles: string[]}) => {

    const { t } = useTranslation();
    const navigate = useNavigate()
    const { user_id } = useParams();
    
    return (
        <div>
            <h3 className="text-[20px] font-medium mb-[24px]">4. {t("Professional information")}</h3>
            <PrefessionElements form={form} />
            <Divider />
            {
                checkPermission("user-access_index") ? 
                <UserAccessInfoUserViewNew user_id={user_id} roles={roles}/> : ""
            }
            {
                form.getFieldValue("role")?.includes("teacher") && checkPermission("teacher-access_get") ?
                <TeacherAccessInfoUserViewNew user_id={user_id} /> : ""
            }
            
            <div className="flex justify-end mt-[24px]">
                <Button htmlType="button" onClick={() => {navigate(`/users/update/${user_id}?user-block=address-info`)}}>{t("Back")}</Button>
                <Button loading={isLoading} className='ml-[8px]' type='primary' htmlType="button" onClick={() => {form.submit(); setsaveType('users')}}>{t("Submit")}</Button>
            </div>
        </div>
    )
}
export default UserProfessionInfo;