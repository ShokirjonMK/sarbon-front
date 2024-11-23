import { Form, InputNumber } from "antd"
import { DatePicker } from 'antd';
import { useTranslation } from "react-i18next";

const UpdateFormUI = ({ id } : { id: number | undefined }) => {
    const {t} = useTranslation()
    
    return (
        <div>
            <Form.Item
                label={t('Year')}
                name="year"
                rules={[{ required: true, message: `${t('Please input year')}!` }]}
                >
                <DatePicker picker={'year'} className="w-full" />
            </Form.Item>
            <Form.Item
                label={t('Type')}
                name="type"
                rules={[{ required: true, message: `${t('Please input type')}!` }]}
                >
                <InputNumber max={9} min={0}  placeholder={`${t("Type")}`} className="w-full" />
            </Form.Item>
        </div>
    )
}

export  default UpdateFormUI