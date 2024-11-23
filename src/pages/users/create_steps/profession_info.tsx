import { Button, Divider, Form, FormInstance, Row } from "antd";
import { useTranslation } from 'react-i18next';
import { Dispatch, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TeacherAccess from "pages/teacher/components/teacherAccess";
import UserAccess from "../components/user_access";
import PrefessionElements from "../form_elements/profession_elements";

const UserProfessionInfo = ({form, setsaveType, userAccessdata, teacherAccessdata, isLoading}: {form: FormInstance, setsaveType: Dispatch<"address-info" | "main-info" | "personal-info" | "job-info" | "users">, userAccessdata: any, teacherAccessdata: any, isLoading?: boolean}) => {

    const { t } = useTranslation();
    const navigate = useNavigate()
    const { user_id } = useParams();
    const [teacher_access_list, setTeacherAccessList] = useState<any>();
    const [userAccess, setUresAccess] = useState<any>();    

    useEffect(() => {
        setUresAccess(userAccessdata)
        setTeacherAccessList(teacherAccessdata)
    }, [userAccessdata, teacherAccessdata])
    
    useEffect(() => {
        form.setFieldsValue({
            teacher_access: JSON.stringify(teacher_access_list),
            user_access: JSON.stringify(userAccess)
        })
    }, [userAccess, teacher_access_list])
    
    return (
        <div>
            <h3 className="text-[20px] font-medium mb-[24px]">4. {t("Professional information")}</h3>
            <PrefessionElements form={form} />
            <Divider />
            <Form.Item
                name="user_access"
            >
                <UserAccess edit={true} userAccess={userAccess} setUserAccess={setUresAccess} />
            </Form.Item>
            <br />
            {
                form.getFieldValue("role")?.includes("teacher") ? 
                <>
                    <p className='font-medium mt-[20p x] pb-2'>{t("Fan biriktirish")}</p>
                    <Form.Item
                        name="teacher_access"
                    >
                        <TeacherAccess edit={true} teacher_access_list={teacher_access_list} setTeacherAccessList={setTeacherAccessList} />
                    </Form.Item>
                </> : ""
            }

            
            
            <div className="flex justify-end mt-[24px]">
                <Button htmlType="button" onClick={() => {navigate(`/users/update/${user_id}?user-block=address-info`)}}>{t("Back")}</Button>
                <Button loading={isLoading} className='ml-[8px]' type='primary' htmlType="button" onClick={() => {form.submit(); setsaveType('users')}}>{t("Submit")}</Button>
            </div>
        </div>
    )
}
export default UserProfessionInfo;