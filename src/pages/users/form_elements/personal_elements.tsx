import { Form, FormInstance, Row, UploadFile } from "antd"
import FormUIBuilder, { TypeFormUIBuilder } from "components/FormUIBuilder"
import SingleImageUploader from "components/ImageUploader/single_image"
import { USERSTATUS } from "config/constants/staticDatas";
import { FILE_URL } from "config/utils"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

const first_data: TypeFormUIBuilder[] = [
    {
        name: "last_name",
        label: "Last name",
        type: "input",
        required: true,
        span: 24
    },
    {
        name: "first_name",
        label: "First name",
        type: "input",
        required: true,
        span: 24
    },
    {
        name: "middle_name",
        label: "Middle name",
        type: "input",
        required: true,
        span: 24
    }
]

const second_data: TypeFormUIBuilder[] = [
    {
        name: "phone",
        label: "Main phone number",
        type: "phone",
        required: true,
        span: 12,
    },
    {
        name: "phone_secondary",
        label: "Additional phone number",
        type: "phone",
        required: false,
        span: 12,
    },
    {
        name: "email",
        label: "Email",
        type: "input",
        required: false,
        span: 12
    },
]

const PersonalElements = ({ form, avatar, is_student = false }: { form: FormInstance, avatar?: string, is_student?: boolean }) => {

    const { user_id } = useParams();
    const { t } = useTranslation();
    const [fileList, setFileList] = useState<UploadFile[]>([] as UploadFile[]);

    useEffect(() => {
        if (avatar) {
            setFileList([{
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: FILE_URL + avatar,
            }])
        }
    }, [avatar])

    useEffect(() => {
        form.setFieldsValue({ avatar: fileList[0]?.originFileObj })
    }, [fileList])

    return (
        <>
            <div className="grid grid-cols-12 gap-[24px]">
                <div className="col-span-6">
                    <FormUIBuilder data={first_data} form={form} load={!!Number(user_id)} />
                </div>
                <div className="col-span-6">
                    <Form.Item
                        label={t("Upload image")}
                        name="avatar"
                    >
                        <SingleImageUploader fileList={fileList} setFileList={setFileList} />
                    </Form.Item>
                </div>
            </div>
            <Row gutter={[24, 0]} >
                <FormUIBuilder data={second_data} form={form} load={!!Number(user_id)} />
                {is_student ? <FormUIBuilder data={[{
                    name: "status",
                    label: "Status",
                    type: "select",
                    required: true,
                    span: 12,
                    data: USERSTATUS,
                },]} form={form} load={!!Number(user_id)} /> : null}
            </Row>
        </>
    )
}
export default PersonalElements;