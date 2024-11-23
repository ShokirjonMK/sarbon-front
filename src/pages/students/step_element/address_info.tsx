import { Button, Divider, FormInstance, Row } from "antd";
import { useTranslation } from 'react-i18next';
import { Dispatch, FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StepType } from "../crud/update";
import FormUIBuilder, { TypeFormUIBuilder } from "components/FormUIBuilder";

export const address_form_data: TypeFormUIBuilder[] = [
    {
        name: "countries_id",
        label: "Countries",
        type: "select",
        url: "countries",
        required: false,
        span: 12,
        child_names: ["region_id", "area_id"]
    },
    {
        name: "region_id",
        label: "Regions",
        type: "select",
        url: "regions",
        required: false,
        span: 12,
        child_names: ["area_id"],
        parent_name: "countries_id"
    },
    {
        name: "area_id",
        label: "Territory",
        type: "select",
        url: "areas",
        required: false,
        span: 12,
        parent_name: "region_id"
    },
    {
        name: "address",
        label: "Address",
        type: "input",
        required: false,
        span: 24
    }
]

export const per_address_data: TypeFormUIBuilder[] = [
    {
        name: "permanent_countries_id",
        label: "Countries",
        type: "select",
        url: "countries",
        required: false,
        span: 12,
        child_names: ["permanent_region_id", "permanent_area_id"]
    },
    {
        name: "permanent_region_id",
        label: "Regions",
        type: "select",
        url: "regions",
        required: false,
        span: 12,
        child_names: ["permanent_area_id"],
        parent_name: "permanent_countries_id"
    },
    {
        name: "permanent_area_id",
        label: "Territory",
        type: "select",
        url: "areas",
        required: false,
        span: 12,
        parent_name: "permanent_region_id"
    },
    {
        name: "permanent_address",
        label: "Address",
        type: "input",
        required: false,
        span: 24
    }
]

const StudentAddressInfo: FC<{ form: FormInstance, setsaveType: Dispatch<StepType>, isLoading?: boolean }> = ({ form, setsaveType, isLoading }): JSX.Element => {
    const { t } = useTranslation();
    const navigate = useNavigate()
    const { user_id } = useParams();

    return (
        <div>
            <h3 className="text-[20px] font-medium mb-[24px]">3. {t("Residential address information")}</h3>
            <Row gutter={[24, 0]} >
                <FormUIBuilder data={address_form_data} form={form} load={!!user_id} />
            </Row>
            <Divider orientation='left' orientationMargin={0} ><p className='font-medium mt-[20px] mb-[12px]'>{t("Permanent address information")}</p></Divider>
            <Row gutter={[24, 0]} >
                <FormUIBuilder data={per_address_data} form={form} load={!!user_id} />
            </Row>
            <div className="flex justify-end mt-[24px]">
                <Button htmlType="button" onClick={() => { navigate(`/students/update/${user_id}?user-block=edu-info`) }}>{t("Back")}</Button>
                <Button loading={isLoading} className='ml-[8px]' type='primary' htmlType="button" onClick={() => { form.submit(); setsaveType("additional-info") }}>{t("Continue")}</Button>
            </div>
        </div>
    )
}
export default StudentAddressInfo;