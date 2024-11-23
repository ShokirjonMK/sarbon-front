import { Alert, Button, Col, Divider, Form, Input, Row, Spin, Switch, Tag } from "antd";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { useTranslation } from "react-i18next";
import { useState } from 'react'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitEduPlan } from "./request";
import { Notification } from "utils/notification";
import { AxiosError } from "axios";
import { validationErrors } from "utils/validation_error";
import { useNavigate, useParams } from "react-router-dom";
import useGetOneData from "hooks/useGetOneData";
import { TypeFormUIData } from "pages/common/types";
import FormUIBuilder from "components/FormUIBuilder";
import MultipleInput from "components/MultipleInput";
import dayjs from "dayjs";
import useBreadCrumb from "hooks/useBreadCrumb";

const formData: TypeFormUIData[] = [
    {
        name: "edu_year_id",
        label: "Edu year",
        required: true,
        type: "select",
        url: "edu-years",
        filter: {status: "all"},
        render: e => {
            return <p>{e?.name} {e?.status === 1 ? <Tag className="ml-4" color="success">Aktiv yil</Tag> : ""}</p>
        },
        span: 12,
    },
    {
        name: "faculty_id",
        label: "Faculty",
        required: true,
        type: "select",
        url: "faculties",
        span: 12,
        child_names: ["direction_id"]
    },
    {
        name: "direction_id",
        label: "Direction",
        required: true,
        type: "select",
        url: "directions",
        span: 12,
        parent_name: "faculty_id"
    },
    {
      name: "edu_type_id",
      label: "Edu type",
      required: true,
      type: "select",
      url: "edu-types",
      span: 12,
    },
    {
        name: "edu_form_id",
        label: "Edu form",
        required: true,
        type: "select",
        url: "edu-forms",
        span: 12,
    },
    {
        name: "status",
        label: "Status",
        required: true,
        type: "switch",
        span: 12,
    }
  ];

  const UpdateEduPlan = () => {

    const {id} = useParams()

    const formDataNotChanging: TypeFormUIData[] = [
        {
            name: "course",
            label: "Course ( Course duration )",
            required: true,
            type: "number",
            span: 12,
            max: 5,
            disabled: id != "0"
        },
        {
            name: "first_start",
            label: "The beginning of the first semester",
            required: true,
            type: "date",
            span: 12,
            disabled: id != "0"
        },
        {
            name: "first_end",
            label: "End of first semester",
            required: true,
            type: "date",
            span: 12,
            disabled: id != "0"
        },
        {
            name: "second_start",
            label: "The beginning of the second semester",
            required: true,
            type: "date",
            span: 12,
            disabled: id != "0"

        },
        {
            name: "second_end",
            label: "End of the second semester",
            required: true,
            type: "date",
            span: 12,
            disabled: id != "0"
        },
    ];


    const { t } = useTranslation();
    const navigate = useNavigate()
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const [isClose, setIsClose] = useState<boolean>(false)

    const { mutate, isLoading } = useMutation({
        mutationFn: (newVals) => submitEduPlan(id, newVals),
        onSuccess: async (res) => {
          queryClient.setQueryData(["edu-plans"], res);
          Notification("success", id != "0" ? "update" : "create", res?.message)
          if(isClose) navigate(-1)
        //   navigate(-1)
        },
        onError: (error: AxiosError) => {
          validationErrors(form, error?.response?.data)
        },
        retry: 0,
      });

    const { data, isLoading: getIsLoading } = useGetOneData({
        queryKey: ['edu-plans', id],
        url: `edu-plans/${id}?expand=description`,
        options: {
            onSuccess: (res) => {
                form.setFieldsValue({
                    name: res?.data?.name,
                    description: res?.data?.description,
                    edu_year_id: res?.data?.edu_year_id,
                    faculty_id: res?.data?.faculty_id,
                    direction_id: res?.data?.direction_id,
                    edu_type_id: res?.data?.edu_type_id,
                    edu_form_id: res?.data?.edu_form_id,
                    first_start: dayjs(res?.data?.first_start),
                    first_end: dayjs(res?.data?.first_end),
                    second_start: dayjs(res?.data?.second_start),
                    second_end: dayjs(res?.data?.second_end),
                    type: res?.data?.type == 1,
                    course: res?.data?.course,
                    status: res?.data?.status == 1,
                })
            },
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: (!!id && id != '0'),
        }
    })

    function saveAndAnother() {
        form.submit()
        setTimeout(() => {
            form.resetFields();
            form.setFieldsValue({
                is_active: true,
                is_archive: false,
                is_free: false,
                is_verified: true,
                is_for_child: false,
                translations:[{title:"", desc:"", sub_title:""}]
            })
        }, 300);
    }

    function saveAndEdit() {
        form.submit()
        setIsClose(false)
    }

    function saveAndClose() {
        form.submit()
        setIsClose(true)
    }

    const pageTitle = (!!id && id != '0') ? data?.data?.name : t("Add edu plan")

    useBreadCrumb({pageTitle: pageTitle, breadcrumb: [
        {name: "Home", path: '/'},
        {name: "Edu plans", path: '/edu-plans'},
        {name: pageTitle, path: '/edu-plans'},
    ]})

    return(
        <Spin spinning={getIsLoading && id != "0"} size="small">
            <div className="content-card">
                <Form
                    initialValues={{status: true, type: true}}
                    form={form}
                    layout="vertical"
                    onFinish={(values) => mutate(
                        id == "0" ? values :
                        {
                            ...values,
                            type: data?.data?.type ? 1 : 2,
                            course: data?.data?.course,
                            first_start: data?.data?.first_start,
                            first_end: data?.data?.first_end,
                            second_start: data?.data?.second_start,
                            second_end: data?.data?.second_end,
                        })}
                >
                    <Row gutter={24} className="mb-[50px]">
                        <Col xxl={16} lg={20}>
                            <Row gutter={24}>
                                {
                                    id === "0" ? (
                                    <MultipleInput layout='vertical' inputSpan={24} textAreaSpan={24} textAreaRows={3} />
                                    ) : (
                                    <>
                                    <Col span={12}>
                                        <Form.Item
                                        label={t("Name")}
                                        name="name"
                                        shouldUpdate
                                        rules={[{ required: true, message: `${t("Please input name")}!` }]}
                                        >
                                        <Input placeholder={t("Enter name") + " ..."} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                        label={t("Description")}
                                        name="description"
                                        shouldUpdate
                                        rules={[{ required: false, message: `${t("Please input name")}!` }]}
                                        >
                                        <Input.TextArea rows={1} placeholder={t("Enter description") + " ..."} />
                                        </Form.Item>
                                    </Col>
                                    </>
                                    )
                                }
                                <FormUIBuilder data={formData} form={form} load={!!Number(id)} />
                            </Row>
                        </Col>
                        <Col span={24} className="mb-[20px]">
                            <Divider className="my-[12px]" />
                            {
                                id == "0" ?
                                <Alert
                                    description={`${t("You will be given one attempt to fill in the fields below. Once the data is saved, it is not possible to edit it. Make sure the values in the fields are correct!")}`}
                                    type="warning"
                                    showIcon
                                /> : ""
                            }
                        </Col>
                        <Col xxl={16} lg={20}>
                            <Row gutter={24}>
                                <Col span={12}>
                                    <Form.Item
                                        label={t("Acceptance")}
                                        name="type"
                                        valuePropName="checked"
                                        rules={[{ required: true, message: `${t("Please selact type")}!` }]}
                                    >
                                        <Switch disabled={id != "0"} checkedChildren="Kuzgi" unCheckedChildren="Qishgi" />
                                    </Form.Item>
                                </Col>
                                <FormUIBuilder data={formDataNotChanging} form={form} load={!!Number(id)} />
                            </Row>
                        </Col>
                    </Row>

                </Form>
                <div className="flex justify-end fixed bottom-0 right-0 bg-white w-[100%] px-[24px] py-[16px] shadow-2xl">
                    <Button htmlType="button" onClick={() => form.resetFields()}>{t("Reset")}</Button>
                    <Button onClick={saveAndEdit} type="primary" loading={isLoading} className="ml-3" htmlType="submit">{t("Submit and edit")}</Button>
                    <Button onClick={saveAndClose} type="primary" loading={isLoading} className="ml-3" htmlType="submit">{t("Submit and close")}</Button>
                </div>
            </div>
        </Spin>
    )
}
export default UpdateEduPlan;