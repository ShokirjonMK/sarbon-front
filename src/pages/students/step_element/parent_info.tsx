import { Button, FormInstance, Row } from "antd";
import { useTranslation } from 'react-i18next';
import { Dispatch, FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StepType } from "../crud/update";
import FormUIBuilder, { TypeFormUIBuilder } from "components/FormUIBuilder";

const span = {md: 24, lg: 12, xl: 12}

 export const parent_form_data: TypeFormUIBuilder[] = [
    {
        name: "father_fio",
        label: "Father F.L",
        type: "input",
        span
    },
    {
        name: "father_number",
        label: "Father number",
        type: "number",
        span
    },
    {
        name: "father_info",
        label: "Father info",
        type: "textarea",
        row: 2,
        span: 24
    },
    {
        name: "mather_fio",
        label: "Mather F.L",
        type: "input",
        span
    },
    {
        name: "mather_number",
        label: "Mather number",
        type: "number",
        span
    },
    {
        name: "mather_info",
        label: "Mather info",
        type: "textarea",
        row: 2,
        span: 24
    },
]

const StudentParentInfo: FC<{ form: FormInstance, setsaveType: Dispatch<StepType>, isLoading?: boolean }> = ({ form, setsaveType, isLoading }): JSX.Element => {
    const { t } = useTranslation();
    const navigate = useNavigate()
    const { user_id } = useParams();

    return (
        <div>
            <h3 className="text-[20px] font-medium mb-[24px]">5. {t("Parents information")}</h3>
            <Row gutter={[24, 0]} >
                <FormUIBuilder data={parent_form_data} form={form} load={!!user_id} />
            </Row>
            <div className="flex justify-end mt-[24px]">
                <Button htmlType="button" onClick={() => { navigate(`/students/update/${user_id}?user-block=addtional-info`) }}>{t("Back")}</Button>
                <Button loading={isLoading} className='ml-[8px]' type='primary' htmlType="button" onClick={() => { form.submit(); setsaveType('student_doc-info') }}>{t("Continue")}</Button>
            </div>
        </div>
    )
}
export default StudentParentInfo;