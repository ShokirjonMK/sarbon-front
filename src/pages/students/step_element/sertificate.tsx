import { Button, FormInstance, Row } from "antd";
import { useTranslation } from 'react-i18next';
import { Dispatch, FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StepType } from "../crud/update";
import FormUIBuilder, { TypeFormUIBuilder } from "components/FormUIBuilder";

export const sertificate_form_data: TypeFormUIBuilder[] = [
    {
        name: "permanent_countries_id",
        label: "Countries",
        type: "select",
        url: "countries",
        required: false,
        span: 12,
    },
    {
        name: "permanent_address",
        label: "Address",
        type: "input",
        required: false,
        span: 24
    }
]

const StudentSertificate: FC<{ form: FormInstance, setsaveType: Dispatch<StepType>, isLoading?: boolean }> = ({ form, setsaveType, isLoading }): JSX.Element => {
    const { t } = useTranslation();
    const navigate = useNavigate()
    const { user_id } = useParams();

    return (
        <div>
            <h3 className="text-[20px] font-medium mb-[24px]">3. {t("")}</h3>
            <Row gutter={[24, 0]} >
                <FormUIBuilder data={sertificate_form_data} form={form} load={!!user_id} />
            </Row>
            <div className="flex justify-end mt-[24px]">
                <Button htmlType="button" onClick={() => { navigate(`/students/update/${user_id}?user-block=edu-info`) }}>{t("Back")}</Button>
                <Button loading={isLoading} className='ml-[8px]' type='primary' htmlType="button" onClick={() => { form.submit(); setsaveType('address-info') }}>{t("Continue")}</Button>
            </div>
        </div>
    )
}
export default StudentSertificate;