import { Anchor, Card, Col, FormInstance, Row } from "antd";
import FormUIBuilder, { TypeFormUIBuilder } from "components/FormUIBuilder";
import { t } from "i18next";
import React from "react";


const name_data: TypeFormUIBuilder[] = [
  {
    name: "last_name",
    label: "Last name",
    type: "input",
    required: true,
    span: { md: 24, lg: 12, xl: 12 }
  },
  {
    name: "firs_name",
    label: "First name",
    type: "input",
    required: true,
    span: { md: 24, lg: 12, xl: 12 }
  },
  {
    name: "middle_name",
    label: "Middle name",
    type: "input",
    required: true,
    span: { md: 24, lg: 12, xl: 12 }
  },
  {
    name: "username",
    label: "Username",
    type: "input",
    required: true,
    span: { md: 24, lg: 12, xl: 12 }
  },
]

const main_data: TypeFormUIBuilder[] = [
  // {
  //   name: "last_name",
  //   label: "Last name",
  //   type: "input",
  //   required: true,
  // },
  // {
  //   name: "firs_name",
  //   label: "Firs name",
  //   type: "input",
  //   required: true,
  // },
  // {
  //   name: "middle_name",
  //   label: "Middle name",
  //   type: "input",
  //   required: true,
  // },
  // {
  //   name: "username",
  //   label: "Username",
  //   type: "input",
  //   required: true,
  // },
  // {
  //   name: "citizenship",
  //   label: "Citizenship",
  //   type: "select",
  //   required: true,
  //   url: "citizenships"
  // },
  // {
  //   name: "nationality",
  //   label: "Nationality",
  //   type: "select",
  //   required: true,
  //   url: "nationalities"
  // },
  {
    name: "Birthday",
    label: "birthday",
    type: "date",
    required: true,
    span: { xl: 8 }
  },
  {
    name: "passport_number",
    label: "Passport number and seria",
    type: "input",
    required: true,
    span: { xl: 8 }
  },
  {
    name: "passport_pin",
    label: "JSHSHIR",
    type: "number",
    required: true,
    span: { xl: 8 }
  },
  {
    name: "passport_given_date",
    label: "Passport given date",
    type: "date",
    required: true,
    span: { xl: 8 }
  },
  {
    name: "passport_issued_date",
    label: "Passport issued date",
    type: "date",
    required: true,
    span: { xl: 8 }
  },
  {
    name: "passport_given_by",
    label: "Passport given by",
    type: "input",
    required: true,
    span: { xl: 8 }
  },
  {
    name: "permament_country_id",
    label: "Countries",
    type: "select",
    required: true,
    url: "countries",
    query_key: "permament_countries",
    child_names: ["permament_region_id", "permament_area_id"],
    span: { xl: 8 }
  },
  {
    name: "permament_region_id",
    label: "Regions",
    type: "select",
    required: true,
    url: "regions",
    query_key: "permament_regions",
    parent_name: "permament_country_id",
    child_names: ["permament_area_id"],
    span: { xl: 8 }
  },
  {
    name: "permament_area_id",
    label: "Areas",
    type: "select",
    required: true,
    url: "areas",
    query_key: "permament_areas",
    parent_name: "permament_region_id",
    span: { xl: 8 }
  },
  {
    name: "permament_address",
    label: "Address",
    type: "textarea",
    required: true,
    span: 24
  },
]

const area_data: TypeFormUIBuilder[] = [
  {
    name: "countries_id",
    label: "Countries",
    type: "select",
    required: true,
    url: "countries",
    child_names: ["region_id", "area_id"],
    child_keys: ["regions", "areas"],
    span: { xl: 8 }
  },
  {
    name: "region_id",
    label: "Regions",
    type: "select",
    required: true,
    url: "regions",
    parent_name: "countries_id",
    child_names: ["area_id"],
    child_keys: ["areas"],
    span: { xl: 8 }
  },
  {
    name: "area_id",
    label: "Areas",
    type: "select",
    required: true,
    url: "areas",
    parent_name: "region_id",
    span: { xl: 8 }
  },
  {
    name: "address",
    label: "Address",
    type: "textarea",
    required: true,
    span: 24
  },
]

const edu_data: TypeFormUIBuilder[] = [
  {
    name: "edu_type",
    label: "Education type",
    type: "select",
    required: true,
    url: "edu-types",
    span: { xl: 8 }
  },
  {
    name: "edu_form",
    label: "Education form",
    type: "select",
    required: true,
    url: "edu-forms",
    span: { xl: 8 }
  },
  {
    name: "faculty",
    label: "Faculty",
    type: "select",
    required: true,
    url: "faculties",
    child_names: ["department", "edu_plan"],
    span: { xl: 8 }
  },
  {
    name: "department",
    label: "Department",
    type: "select",
    required: true,
    url: "departments",
    parent_name: "faculty",
    span: { xl: 8 }
  },
  {
    name: "edu_year",
    label: "Education year",
    type: "select",
    required: true,
    url: "edu-years",
    span: { xl: 8 }
  },
  {
    name: "course",
    label: "Course",
    type: "select",
    required: true,
    url: "courses",
    span: { xl: 8 }
  },
  {
    name: "edu_plan",
    label: "Education plan",
    type: "select",
    required: true,
    url: "edu-plans",
    parent_name: "",
    span: { xl: 8 }
  },
  {
    name: "edu_language",
    label: "Education language",
    type: "select",
    required: true,
    url: "languages",
    span: { xl: 8 }
  },
  {
    name: "form_of_payment",
    label: "Form of payment",
    type: "select",
    required: true,
    url: "form-of-payment",
    span: { xl: 8 }
  },
  // {
  //   name: "edu_category",
  //   label: "Education category",
  //   type: "select",
  //   required: true,
  //   url: "edu-categories",
  //   span: { xl: 8 }
  // },
]

const FormUIStudent: React.FC<{ form: FormInstance<any> }> = ({ form }): JSX.Element => {

  return (
    <div className="">
      <Row gutter={[12, 12]}>
        <Col span={4}>
        <Anchor
            // targetOffset={targetOffset}
            items={[
              {
                key: 'main-info',
                href: '#main-info',
                title: 'Asosiy malumotlar',
              },
              {
                key: 'edu-info',
                href: '#edu-info',
                title: "Ta'lim malumotlar",
              },
              {
                key: 'address-info',
                href: '#address-info',
                title: 'Yashash joyi malumotlar',
              },
            ]}
          />
        </Col>
        <Col span={20} className="overflow-auto bg p-2 rounded-lg" style={{height: "calc(100vh - 160px)"}} >
          {/* <div></div> */}
          <Card size="small" id="address-info" title={<span>{t("Residence information")}</span>} className="border-0 mx-2 e-card-shadow mt-4 mb-4" >
            <Row gutter={[12, 12]}>
              <FormUIBuilder data={area_data} form={form} />
            </Row>
          </Card>
          <Card size="small" id="main-info" title={<span>{t("Basic information")}</span>} className="border-0 e-card-shadow mt-2 mx-2" >
            <Row gutter={[12, 12]}>
              <Col xs={24} sm={24} md={24} lg={6} xl={6} >
                <div className="w-48 h-48 rounded-lg bg"></div>
              </Col>
              <Col xs={24} sm={24} md={24} lg={18} xl={18}>
                <Row gutter={[12, 12]}>
                  <FormUIBuilder data={name_data} form={form} />
                </Row>
              </Col>
              <FormUIBuilder data={main_data} form={form} />
            </Row>
          </Card>
          <Card size="small" id="edu-info" title={<span>{t("Educational information")}</span>} className="border-0 e-card-shadow mx-2 mt-4" >
            <Row gutter={[12, 12]}>
              <FormUIBuilder data={edu_data} form={form} load={true} />
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default FormUIStudent;