import { FormInstance, Row } from "antd"
import FormUIBuilder, { TypeFormUIBuilder } from "components/FormUIBuilder"
import { useParams } from "react-router-dom"

const second_data: TypeFormUIBuilder[] = [
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
    },
    {
        name: "description",
        label: "Description",
        type: "textarea",
        required: false,
        span: 24
    },
]

const AddressElements = ({form} : {form: FormInstance}) => {

    const { user_id } = useParams();

    return (
        <Row gutter={[24, 0]} >
            <FormUIBuilder data={second_data} form={form} load={!!user_id} />
        </Row>
    )
}
export default AddressElements;