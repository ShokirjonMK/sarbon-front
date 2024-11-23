import { FormInstance, Row } from "antd"
import FormUIBuilder, { TypeFormUIBuilder } from "components/FormUIBuilder"


const second_data: TypeFormUIBuilder[] = [
    {
        name: "diploma_type_id",
        label: "Diplom type",
        type: "select",
        url: "diploma-types",
        required: false,
        span: 12
    },
    {
        name: "degree_id",
        label: "Degree",
        type: "select",
        url: "degrees",
        required: false,
        span: 12
    },
    {
        name: "academic_degree_id",
        label: "Academic degree",
        type: "select",
        url: "academic-degrees",
        required: false,
        span: 12
    },
    {
        name: "degree_info_id",
        label: "Degree infos",
        type: "select",
        url: "degree-infos",
        required: false,
        span: 12
    },
    {
        name: "partiya_id",
        label: "Party membership",
        type: "select",
        url: "partiyas",
        required: false,
        span: 24
    }
]

const PrefessionElements = ({form} : {form: FormInstance}) => {

    return (
        <>
            <Row gutter={[24, 0]} >
              <FormUIBuilder data={second_data} form={form} />
            </Row>
        </>
    )
}
export default PrefessionElements;