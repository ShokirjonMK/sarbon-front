import { Form, FormInstance, Row, Select, Switch } from "antd"
import FormUIBuilder, { TypeFormUIBuilder } from "components/FormUIBuilder"
import { USERSTATUS } from "config/constants/staticDatas"
import useGetData from "hooks/useGetData"
import { IRole } from "models/role_permissions"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { useState } from 'react'

const AuthElements = ({ form }: { form: FormInstance }) => {

    const { user_id } = useParams();
    const [isPassword, setisPassword] = useState<boolean>(!user_id)


    const auth_data: TypeFormUIBuilder[] = [
        {
            name: "username",
            label: "Username (Login)",
            type: "input",
            required: true,
            span: 12
        },
        {
            name: "status",
            label: "Status",
            type: "select",
            required: true,
            span: 12,
            data: USERSTATUS
        }
    ]

    const passwords: TypeFormUIBuilder[] = [
        {
            name: "password",
            label: "Password",
            type: "password",
            // required: !user_id,
            span: 12
        },
        {
            name: "password_again",
            label: "Re-enter the password",
            type: "password",
            // required: !user_id,
            span: 12
        }
    ]
    const { t } = useTranslation();

    const { data: roles } = useGetData<IRole>({
        queryKey: ["roles"],
        url: `roles`,
        options: {
            refetchOnWindowFocus: false,
            retry: 0,
        }
    })

    return (
        <>
            <Row gutter={[24, 0]} >
                <FormUIBuilder data={auth_data} form={form} load={!!Number(user_id)} />
            </Row>
            <label htmlFor="" className="mr-3">{t("Change password")}</label>
            <Switch checked={isPassword} onChange={(e) => setisPassword(e)} />
            <Row gutter={[24, 0]} className="mt-4" >
                {
                    isPassword ? <FormUIBuilder data={passwords} form={form} load={!!Number(user_id)} /> : ""
                }
            </Row>

            <Form.Item
                label={t("Roles")}
                name='role'
                tooltip="This is a required field"
                rules={[{ required: true, message: `Please input roles !` }]}
            >
                <Select
                    allowClear
                    showSearch
                    mode='multiple'
                    placeholder={t("Select a role")}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={roles?.items?.map(role => ({ value: role?.name, label: role?.name }))}
                />
            </Form.Item>
        </>
    )
}
export default AuthElements;