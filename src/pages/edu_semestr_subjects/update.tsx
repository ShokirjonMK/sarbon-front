import { useState } from 'react'
import { Button, Col, Form, Row, Spin } from "antd";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitEduSemestrSubject } from "./request";
import { Notification } from "utils/notification";
import { AxiosError } from "axios";
import { validationErrors } from "utils/validation_error";
import { useNavigate, useParams } from "react-router-dom";
import useGetOneData from "hooks/useGetOneData";
import { TypeFormUIData } from "pages/common/types";
import FormUIBuilder from "components/FormUIBuilder";
import SubjectSillabus, { TypeSillabusData } from "pages/subject/components/sillabus";
import { generateSubjectSillabus } from 'utils/generate_subject_sillabus';

const formData: TypeFormUIData[] = [
    {
        name: "name",
        label: "Subjct name",
        required: true,
        type: "input",
        disabled: true,
        span: 6,
    },
    {
        name: "subject_type_id",
        label: "Subject type",
        required: true,
        type: "select",
        url: "subject-types",
        span: 6,
      },
    {
        name: "credit",
        label: "Kredit",
        required: true,
        type: "number",
        span: 6,
    },
    {
        name: "all_ball_yuklama",
        label: "Total score",
        required: true,
        type: "input",
        disabled: true,
        span: 6,
    },
  ];

  const EduSemestrSubjectUpdate = () => {

    const {edu_subject_id: id} = useParams()

    const { t } = useTranslation();
    const navigate = useNavigate()
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const [sillabusData, setSillabusData] = useState<TypeSillabusData>({ refetch: false })

    const { mutate, isLoading } = useMutation({
        mutationFn: (newVals) => submitEduSemestrSubject(id, newVals, sillabusData),
        onSuccess: async (res) => {
          queryClient.setQueryData(["edu-plans"], res);
          Notification("success", id != "0" ? "update" : "create", res?.message)
          navigate(-1)
        },
        onError: (error: AxiosError) => {
          validationErrors(form, error?.response?.data)
        },
        retry: 0,
      });

    const { data, isFetching: getIsLoading } = useGetOneData({
        queryKey: ['edu-semestr-subjects', id],
        url: `edu-semestr-subjects/${id}?expand=subject,eduSemestrExamsTypes,eduSemestrSubjectCategoryTimes`,
        options: {
            onSuccess: (res) => {
                form.setFieldsValue({
                    name: res?.data?.subject?.name,
                    credit: res?.data?.credit,
                    all_ball_yuklama: res?.data?.all_ball_yuklama,
                    subject_type_id: res?.data?.subject_type_id
                })

                setSillabusData({
                    ...generateSubjectSillabus(res?.data?.eduSemestrExamsTypes, res?.data?.eduSemestrSubjectCategoryTimes),
                    refetch: true,
                })
            },
            enabled: (!!id && id != '0'),
        }
    });

    return(
        <Spin spinning={getIsLoading && id != "0"} size="small">
            <div>
                <HeaderExtraLayout
                    title={data?.data?.subject?.name}
                    isBack={true}
                    breadCrumbData={[
                        {name: "Home", path: '/'},
                        {name: "Edu plans", path: '/edu-plans'},
                        {name: "Edu semestr", path: `/edu-plans/semestrs/view/0/${data?.data?.edu_semestr_id}`},
                        {name: data?.data?.subject?.name, path: '/edu-plans'}
                    ]}
                />
                <div className="px-[24px] py-[20px]">
                    <Form
                        initialValues={{status: true}}
                        form={form}
                        layout="vertical"
                        onFinish={(values) => mutate(
                            id == "0" ? values :
                            {
                                ...values,
                                all_ball_yuklama: data?.data?.all_ball_yuklama,
                            })}
                    >
                        <Row gutter={24}>
                            <Col xxl={16} lg={20}>
                                <Row gutter={24}>
                                    <FormUIBuilder data={formData} form={form} load={!!Number(id)} />
                                </Row>
                            </Col>
                            <Col span={24}>
                                <SubjectSillabus sillabusData={sillabusData} setSillabusData={setSillabusData} />
                            </Col>
                        </Row>

                        <div className="flex justify-end fixed bottom-0 right-0 bg-white w-[100%] px-[24px] py-[16px] shadow-2xl">
                            <Button htmlType="button" onClick={() => form.resetFields()}>{t("Reset")}</Button>
                            <Button type="primary" loading={isLoading} className="ml-3" htmlType="submit">{t("Submit")}</Button>
                        </div>
                    </Form>
                </div>
            </div>
        </Spin>
    )
}
export default EduSemestrSubjectUpdate;