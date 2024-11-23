import { Button, Col, Divider, Form, FormInstance, Row, UploadFile } from "antd";
import { useTranslation } from 'react-i18next';
import { Dispatch, FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StepType } from "../crud/update";
import FormUIBuilder, { TypeFormUIBuilder } from "components/FormUIBuilder";
import FileUploader from "components/fileUploader";
import { FILE_URL } from "config/utils";

export const addition_form_data: TypeFormUIBuilder[] = [
    {
        name: "partners_count",
        label: "Cohabitant number",
        type: "number",
        span: 12
    },
    {
        name: "category_of_cohabitant_id",
        label: "Cohabitant category",
        type: "select",
        url: "category-of-cohabitants",
        span: 12
    },
    {
        name: "residence_status_id",
        label: "Residence status",
        type: "select",
        url: "residence-statuses",
        span: 12
    },
    {
        name: "live_location",
        label: "Geolocation of residence",
        type: "input",
        span: 12
    },
    {
        name: "social_category_id",
        label: "Social Category",
        type: "select",
        url: "social-categories",
        span: 12,
    },
    {
        name: "is_work",
        label: "Employment type",
        type: "select",
        span: 12,
        data: [
            { id: 0, name: "Not work" },
            { id: 1, name: "Works (for work study)" },
            { id: 2, name: "Works (to earn money)" }
        ]
    },
]

export const last_edu_form_data: TypeFormUIBuilder[] = [
    {
        name: "last_education",
        label: "Last education name",
        type: "input",
        span: 24
    },
    {
        name: "diplom_seria",
        label: "Diplom seria",
        type: "input",
        span: 12
    },
    {
        name: "diplom_number",
        label: "Diplom number",
        type: "number",
        span: 12
    },
]

type StudentAdditonInfoPropsType = {
    form: FormInstance,
    setsaveType: Dispatch<StepType>,
    isLoading?: boolean
    diplom_file?: string,
}

const StudentAdditionInfo: FC<StudentAdditonInfoPropsType> = ({ form, setsaveType, isLoading, diplom_file }): JSX.Element => {
    const { t } = useTranslation();
    const navigate = useNavigate()
    const { user_id } = useParams();

    const [diplomFile, setDiplomFile] = useState<UploadFile[]>([] as UploadFile[]);

    useEffect(() => {
        if(diplom_file) {
            setDiplomFile([{
                uid: '-1',
                name: 'diplom image',
                status: 'done',
                url: FILE_URL + diplom_file,
            }])
        }
    }, [diplom_file])

    useEffect(() => {
        if(diplomFile?.length){
            form.setFieldsValue({diplom_file: diplomFile[0]?.originFileObj})
        }
    }, [diplomFile])

    return (
        <div>
            <h3 className="text-[20px] font-medium mb-[24px]">4. {t("Additional information")}</h3>
            <Row gutter={[24, 0]} >
                <FormUIBuilder data={addition_form_data} form={form} load={!!user_id} />
            </Row>
            <Divider orientation='left' orientationMargin={0} ><p className='font-medium mt-[20px] mb-[12px]'>{t("Last Education information")}</p></Divider>
            <Row gutter={[24, 0]} >
                <FormUIBuilder data={last_edu_form_data} form={form} load={!!user_id} />
                <Col>
                    <Form.Item
                        label={t("Diplom file")}
                        name='diplom_file'
                        rules={[{ required: false, message: `Please input passport seria number` }]}
                    >
                        <FileUploader passportFile={diplomFile} setPassportFile={setDiplomFile} title={t("Diplom file upload")} />
                    </Form.Item>
                </Col>
            </Row>
            <div className="flex justify-end mt-[24px]">
                <Button htmlType="button" onClick={() => { navigate(`/students/update/${user_id}?user-block=address-info`) }}>{t("Back")}</Button>
                <Button loading={isLoading} className='ml-[8px]' type='primary' htmlType="button" onClick={() => { form.submit(); setsaveType('parents-info') }}>{t("Continue")}</Button>
            </div>
        </div>
    )
}
export default StudentAdditionInfo;