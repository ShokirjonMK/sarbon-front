import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { Col, Row, Form, Button, DatePicker, UploadFile, Input, Spin } from "antd";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { TypeFormUIData } from 'pages/common/types';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Notification } from 'utils/notification';
import { AxiosError } from 'axios';
import { validationErrors } from 'utils/validation_error';
import useGetOneData from 'hooks/useGetOneData';
import dayjs from 'dayjs';
import FormUIBuilder from 'components/FormUIBuilder';
import FileUploader from 'components/fileUploader';
import { EXAMCONTROLTYPES } from 'config/constants/staticDatas';
import { submitFinalExamControl } from './requests';
import { FILE_URL } from 'config/utils';
import { IFinalExam } from 'models/exam';
const { RangePicker } = DatePicker;

const dateParserToDatePicker = (second: number) => dayjs(dayjs((new Date(Number(second)*1000))).format('DD-MM-YYYY HH:mm'), 'DD-MM-YYYY HH:mm')

const FinalExamControlUpdate: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { id } = useParams()
  const [selectedType, setselectedType] = useState<number | undefined>();

  const formData: TypeFormUIData[] = [
    {
      name: "edu_plan_id",
      label: "Edu plan",
      required: true,
      type: "select",
      url: "edu-plans",
      span: 12,
      child_names: ["edu_semestr_id"],
    },
    {
      name: "edu_semestr_id",
      label: "Edu semestr",
      required: true,
      type: "select",
      url: "edu-semestrs",
      span: 12,
      child_names: ["edu_semestr_subject_id"],
      parent_name: "edu_plan_id"
    },
    {
      name: "edu_semestr_subject_id",
      label: "Subject",
      required: true,
      type: "select",
      expand: "subject",
      url: "edu-semestr-subjects",
      span: 12,
      parent_name: "edu_semestr_id"
    },
    {
      name: "type",
      label: "Exam form",
      required: true,
      type: "select",
      data: EXAMCONTROLTYPES,
      onchange(e) {
        setselectedType(e)
      },
      span: 12,
    },
  ];

  const formDataSecond: TypeFormUIData[] = [
    {
      name: "duration",
      label: `${t("Duration")} (minut)`,
      required: true,
      type: "number",
      span: 12,
    },
    {
      name: "question_count",
      label: "Question count",
      required: true,
      type: "number",
      span: 12,
    },
  ];

  const navigate = useNavigate()
  const [form] = Form.useForm();
  const [fileList, setfileList] = useState<UploadFile[]>([] as UploadFile[]);

  const { mutate, isLoading } = useMutation({
    mutationFn: (newVals) => submitFinalExamControl(id, newVals),
    onSuccess: async (res) => {
      Notification("success", id ? "update" : "create", res?.message)
      navigate(-1)
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", id ? "update" : "create", error?.response?.data ? error?.response?.data?.message : "");
      validationErrors(form, error?.response?.data)
    },
    retry: 0,
  });


  const { data, isFetching: getIsLoading } = useGetOneData<IFinalExam>({
    queryKey: ['exams', id],
    url: `exams/${id}`,
    options: {
      onSuccess: (res) => {
        form.setFieldsValue({
          edu_plan_id: res?.data?.edu_plan_id,
          edu_semestr_id: res?.data?.edu_semestr_id,
          edu_semestr_subject_id: res?.data?.edu_semestr_subject_id,
          type: res?.data?.type,
          duration: res?.data?.duration,
          question_count: res?.data?.question_count,
          date: [dateParserToDatePicker(res?.data?.start_time), dateParserToDatePicker(res?.data?.finish_time)],
          description: res?.data?.description
        })
        setselectedType(res?.data?.type)
        if(res?.data?.file){
          setfileList([{
            uid: '-1',
            name: 'Yakuniy nazorat',
            status: 'done',
            url: FILE_URL + res?.data?.file,
          }])
        }
      },
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: (!!id && id != '0'),
    }
  })

  const title = id ? (data?.data?.name ? data?.data?.name : "") : `Create final control`;

  return (
    <Spin spinning={getIsLoading} >
      <HeaderExtraLayout title={title}
        breadCrumbData={[
          { name: "Home", path: '/' },
          { name: "Final exam control", path: '/final-exam-controls' },
          { name: title, path: '/final-exam-controls/create' }
        ]}
        isBack={true}
      />
      <div className="px-[24px] py-[20px]">
        <Form
          initialValues={{ status: true }}
          form={form}
          layout="vertical"
          onFinish={(values) => mutate({...values, upload_file: fileList[0]?.originFileObj})}
        >
          <Row gutter={24} className="mb-[50px]">
            <Col xxl={16} lg={20}>
              <Row gutter={24}>
                <FormUIBuilder data={formData} form={form} load={!!Number(id)} />
                <Col md={12} span={24}>
                  <Form.Item
                    label={t("Imtihon sanasi")}
                    name={`date`}
                    shouldUpdate
                    rules={[{required: false, message: `Please input date`}]}
                  >
                    <RangePicker
                        className="w-[100%]"
                        showTime={{ format: 'HH:mm' }}
                        format="DD-MM-YYYY HH:mm"
                    />
                  </Form.Item>
                </Col>
                <FormUIBuilder data={formDataSecond} form={form} load={!!Number(id)} />
                
                {
                  selectedType === 1 ?
                  <>
                    <Col md={12} span={24}>
                        <Form.Item
                        label={t("File")}
                        name={`file`}
                        shouldUpdate
                        rules={[{required: false, message: `Please input tile`}]}
                      >
                        <FileUploader passportFile={fileList} setPassportFile={setfileList} title={t("Fayl yuklash")} />
                      </Form.Item>
                    </Col>
                    <Col md={24} span={24}>
                      <Form.Item
                        label={t("Description")}
                        name={`description`}
                        shouldUpdate
                        rules={[{required: false, message: `Please input description`}]}
                      >
                        <Input.TextArea placeholder='Time' rows={4} />
                      </Form.Item>
                    </Col>
                    </>
                   : ""
                }
              </Row>
            </Col>
          </Row>

          <div className="flex justify-end fixed bottom-0 right-0 bg-white w-[100%] px-[24px] py-[16px] shadow-2xl">
            <Button htmlType="button" onClick={() => form.resetFields()}>{t("Reset")}</Button>
            <Button type="primary" loading={isLoading} className="ml-3" htmlType="submit">{t("Submit")}</Button>
          </div>
        </Form>
      </div>
    </Spin>
  );
};

export default FinalExamControlUpdate;