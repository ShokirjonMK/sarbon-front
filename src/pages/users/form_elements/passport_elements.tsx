import { DatePicker, Form, FormInstance, Radio, Row, UploadFile } from "antd"
import FormUIBuilder, { TypeFormUIBuilder } from "components/FormUIBuilder"
import { FILE_URL } from "config/utils"
import { ChangeEvent, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import InputMask from 'react-input-mask';
import FileUploader from "components/fileUploader"
import { GENDERS } from "config/constants/staticDatas"

const second_data: TypeFormUIBuilder[] = [
    {
        name: "citizenship_id",
        label: "Citizenship",
        type: "select",
        url: "citizenships",
        required: false,
        span: 12
    },
    {
        name: "nationality_id",
        label: "Nationality",
        type: "select",
        url: "nationalities",
        required: false,
        span: 12
    }
]

const date_data: TypeFormUIBuilder[] = [
    {
        name: "passport_given_date",
        label: "Date of issue of the document",
        type: "date",
        required: true,
        span: 12
    },
    // {
    //     name: "passport_issued_date",
    //     label: "Validity period",
    //     type: "date",
    //     required: true,
    //     span: 12
    // },
    {
        name: "passport_given_by",
        label: "Who issued the document?",
        type: "input",
        required: true,
        span: 12
    }
]

const PassportElements = ({form, passport_file} : {form: FormInstance, passport_file?: string}) => {

    const { user_id } = useParams();
    const { t } = useTranslation();

    const [passportFile, setPassportFile] = useState<UploadFile[]>([] as UploadFile[]);

    useEffect(() => {
        if(passport_file) {
            setPassportFile([{
                uid: '-1',
                name: 'passport image',
                status: 'done',
                url: FILE_URL + passport_file,
            }])
        }
    }, [passport_file])

    useEffect(() => {
        if(passportFile?.length){
            form.setFieldsValue({passport_file: passportFile[0]?.originFileObj})
        }
    }, [passportFile])


    return (
        <>
            <div className="grid grid-cols-12 gap-x-[24px]">
                <div className="col-span-6">
                    <Form.Item
                        label={t("Birthday")}
                        name='birthday'
                        rules={[{ required: true, message: `Please select birthday` }]}
                    >
                        <DatePicker className='w-[100%]' />
                    </Form.Item>
                </div>
                <div className="col-span-6">
                    <Form.Item
                        label={t("Gender")}
                        name='gender'
                        rules={[{ required: true, message: `Please select gender` }]}
                    >
                        <Radio.Group>
                            {
                                GENDERS?.map( item => <Radio key={item?.id} value={item?.id}>{t(item?.name)}</Radio>)
                            }
                        </Radio.Group>
                    </Form.Item>
                </div>
            </div>
            <Row gutter={[24, 0]} >
              <FormUIBuilder data={second_data} form={form} load={!!Number(user_id)} />
            </Row>

            <div className="grid grid-cols-12 gap-x-[24px]">
                <div className="col-span-6">
                    <Form.Item
                        label={t("Document series and number")}
                        name='passport_seria_and_number'
                        rules={[{ required: true, message: `Please input passport seria number` }]}
                    >
                        <InputMask mask="aa 9999999" className='input-mask' placeholder='AA 1234567' onChange={(e: ChangeEvent<HTMLInputElement>) => { form.setFieldsValue({ passport_seria_and_number: e.target.value?.toUpperCase() }) }} />
                    </Form.Item>
                </div>
                <div className="col-span-6">
                    <Form.Item
                        label={t("JSHIR")}
                        name='passport_pin'
                        rules={[{ required: true, message: `Please input passport JSHIR` }]}
                    >
                        <InputMask mask="99999999999999" maskChar={"_"} className='input-mask' placeholder='_ _ _ _ _ _ _ _ _ _ _ _ _ _' />
                    </Form.Item>
                </div>
            </div>

            <Row gutter={[24, 0]} >
              <FormUIBuilder data={date_data} form={form} load={!!Number(user_id)} />
            </Row>
            <Form.Item
                label={t("Document file")}
                name='passport_file'
                rules={[{ required: false, message: `Please upload file` }]}
            >
                <FileUploader passportFile={passportFile} setPassportFile={setPassportFile} title={t("Passport file download")} />
            </Form.Item>
        </>
    )
}
export default PassportElements;