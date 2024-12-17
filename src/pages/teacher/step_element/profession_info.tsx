import { Button, Divider, FormInstance, Row } from "antd";
import { useTranslation } from 'react-i18next';
import { Dispatch } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormUIBuilder, { TypeFormUIBuilder } from "components/FormUIBuilder";
import { StepType } from "../crud/update";
import checkPermission from "utils/check_permission";
import TeacherAccessInfoUserViewNew from "pages/users/view_steps/profession_step/teacher_access_info_new";
import UserAccessInfoUserViewNew from "pages/users/view_steps/profession_step/user_access_info_new";

const second_data: TypeFormUIBuilder[] = [
    {
        name: "diploma_type_id",
        label: "Diplom type",
        type: "select",
        url: "diploma-types",
        required: false,
        span: 12
    },
    {
        name: "degree_id",
        label: "Degree",
        type: "select",
        url: "degrees",
        required: false,
        span: 12
    },
    {
        name: "academic_degree_id",
        label: "Academic degree",
        type: "select",
        url: "academic-degrees",
        required: false,
        span: 12
    },
    {
        name: "degree_info_id",
        label: "Degree infos",
        type: "select",
        url: "degree-infos",
        required: false,
        span: 12
    },
    {
        name: "partiya_id",
        label: "Party membership",
        type: "select",
        url: "partiyas",
        required: false,
        span: 24
    }
]

const TeacherProfessionInfo = ({form, setsaveType, isLoading, roles}: {form: FormInstance, setsaveType: Dispatch<StepType>, isLoading?: boolean, roles: string[]}) => {

    const { t } = useTranslation();
    const navigate = useNavigate()
    const { user_id } = useParams();
    
    return (
        <div>
            <h3 className="text-[20px] font-medium mb-[24px]">4. {t("Professional information")}</h3>
            <Row gutter={[24, 0]} >
              <FormUIBuilder data={second_data} form={form} />
            </Row>
            <Divider />
            {
                checkPermission("user-access_index") ? 
                <UserAccessInfoUserViewNew user_id={user_id} roles={roles}/> : ""
            }
            <br />

            {
                form.getFieldValue("role")?.includes("teacher") && checkPermission("teacher-access_get") ?
                <TeacherAccessInfoUserViewNew user_id={user_id} /> : ""
            }

            <div className="flex justify-end mt-[24px]">
                <Button htmlType="button" onClick={() => {navigate(`/teachers/update/${user_id}?user-block=address-info`)}}>{t("Back")}</Button>
                <Button loading={isLoading} className='ml-[8px]' type='primary' htmlType="button" onClick={() => {form.submit(); setsaveType('teachers')}}>{t("Submit")}</Button>
            </div>
        </div>
    )
}
export default TeacherProfessionInfo;