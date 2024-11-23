import { Button, Divider, Form, FormInstance, Row } from "antd";
import { useTranslation } from 'react-i18next';
import { Dispatch, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserAccess from "pages/users/components/user_access";
import TeacherAccess from "../components/teacherAccess";
import FormUIBuilder, { TypeFormUIBuilder } from "components/FormUIBuilder";
import { StepType } from "../crud/update";

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

const TeacherProfessionInfo = ({form, setsaveType, userAccessdata, teacherAccessdata, isLoading}: {form: FormInstance, setsaveType: Dispatch<StepType>, userAccessdata: any, teacherAccessdata: any, isLoading?: boolean}) => {

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
            <Row gutter={[24, 0]} >
              <FormUIBuilder data={second_data} form={form} />
            </Row>
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
                <Button htmlType="button" onClick={() => {navigate(`/teachers/update/${user_id}?user-block=address-info`)}}>{t("Back")}</Button>
                <Button loading={isLoading} className='ml-[8px]' type='primary' htmlType="button" onClick={() => {form.submit(); setsaveType('teachers')}}>{t("Submit")}</Button>
            </div>
        </div>
    )
}
export default TeacherProfessionInfo;