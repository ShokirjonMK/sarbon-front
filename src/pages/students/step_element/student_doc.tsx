import { Button, Col, Form, FormInstance, Row, UploadFile } from "antd";
import { useTranslation } from 'react-i18next';
import { Dispatch, FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StepType } from "../crud/update";
import FormUIBuilder, { TypeFormUIBuilder } from "components/FormUIBuilder";
import { FILE_URL } from "config/utils";
import FileUploader from "components/fileUploader";

const span = {md: 24, lg: 12, xl: 12}

export const doc_form_data: TypeFormUIBuilder[] = [
    {
        name: "doc_type_id",
        label: "Comand type",
        type: "input",
        url: "command-type",
        span,
    },
    {
        name: "doc_date",
        label: "Command date",
        type: "date",
        span,
    },
    {
        name: "doc_description",
        label: "Description",
        type: "textarea",
        span: 24
    }
]

type StudentDocumentsPropsType = {
    form: FormInstance,
    setsaveType: Dispatch<StepType>,
    isLoading?: boolean
    document_file?: string,
}

const StudentDocuments: FC<StudentDocumentsPropsType> = ({ form, setsaveType, isLoading, document_file }): JSX.Element => {
    const { t } = useTranslation();
    const navigate = useNavigate()
    const { user_id } = useParams();

    const [docFile, setDocFile] = useState<UploadFile[]>([] as UploadFile[]);

    useEffect(() => {
        if(document_file) {
            setDocFile([{
                uid: '-1',
                name: 'diplom image',
                status: 'done',
                url: FILE_URL + document_file,
            }])
        }
    }, [document_file])

    useEffect(() => {
        if(docFile?.length){
            form.setFieldsValue({document_file: docFile[0]?.originFileObj})
        }
    }, [docFile])

    return (
        <div>
            <h3 className="text-[20px] font-medium mb-[24px]">6. {t("Student documents")}</h3>
            <Row gutter={[24, 0]} >
                <FormUIBuilder data={doc_form_data} form={form} load={!!user_id} />
                <Col>
                    <Form.Item
                        label={t("Document file")}
                        name='document_file'
                    >
                        <FileUploader passportFile={docFile} setPassportFile={setDocFile} title={t("File upload")} />
                    </Form.Item>
                </Col>
            </Row>
            <div className="flex justify-end mt-[24px]">
                <Button htmlType="button" onClick={() => { navigate(`/students/update/${user_id}?user-block=parents-info`) }}>{t("Back")}</Button>
                <Button loading={isLoading} className='ml-[8px]' type='primary' htmlType="button" onClick={() => { form.submit(); setsaveType('students') }}>{t("Continue")}</Button>
            </div>
        </div>
    )
}
export default StudentDocuments;