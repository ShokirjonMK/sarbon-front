import React, { useState } from "react";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { Button, Col, Form, Row, Select, UploadFile } from "antd";
import { useTranslation } from "react-i18next";
import { TypeFormUIData } from "pages/common/types";
import FormUIBuilder from "components/FormUIBuilder";
import FileUploader from "components/fileUploader";
import { useMutation } from "@tanstack/react-query";
import { Notification } from "utils/notification";
import { AxiosError } from "axios";
import { validationErrors } from "utils/validation_error";
import { submitExamQuestions } from "./request";
import { useNavigate, useParams } from "react-router-dom";
import SunEditor from "suneditor-react";
import { editor_buttonList } from "config/constants/suneditor";
import useGetOneData from "hooks/useGetOneData";
import { FILE_URL } from "config/utils";
import useGetData from "hooks/useGetData";
import { cf_filterOption } from "utils/others_functions";



const ExamQuestionsCreate: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [fileList, setfileList] = useState<UploadFile[]>([] as UploadFile[]);
  const { id } = useParams();
  const navigate = useNavigate();

  const formData: TypeFormUIData[] = [
    {
      name: "kafedra_id",
      label: "Kafedra",
      required: false,
      type: "select",
      url: "kafedras",
      child_names: ['subject_id'],
      span: 8,
    },
    {
      name: "subject_id",
      label: "Subject",
      type: "select",
      url: `subjects`,
      required: true,
      parent_name: 'kafedra_id',
      expand: 'semestr, eduForm',
      filter: {['kafedra_id']:1},
      span: 8,
      render: (e) => <span>{e?.name} {e?.eduForm?.name} {e?.semestr?.name}</span>
    },
    {
      name: "language_id",
      label: "Language",
      required: true,
      type: "select",
      url: "languages",
      span: 8,
    },
  ];
  

  const { mutate, isLoading } = useMutation({
    mutationFn: (newVals) => submitExamQuestions(id, newVals),
    onSuccess: async (res) => {
      Notification("success", id ? "update" : "create", res?.message);
      navigate(-1);
    },
    onError: (error: AxiosError<any>) => {
      Notification(
        "error",
        id ? "update" : "create",
        error?.response?.data ? error?.response?.data?.message : ""
      );
      validationErrors(form, error?.response?.data);
    },
    retry: 0,
  });

  const { data } = useGetOneData({
    queryKey: ['tests', id],
    url: `tests/${id}?expand=subject,subject.kafedra`,
    options: {
      onSuccess: (res) => {
        form.setFieldsValue({
          kafedra_id: res?.data?.subject?.kafedra?.id,
          subject_id: res?.data?.subject?.id,
          language_id: res?.data?.language_id,
          file: res?.data?.file,
          type: res?.data?.type,
          text: res?.data?.text,
          exam_type_id: res?.data?.exam_type_id
        })
        if(res?.data?.file){
          setfileList([{
            uid: '-1',
            name: 'Exam questions',
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

  const { data: examTypes, isFetching } = useGetData({
    queryKey: ["exams-types"],
    url: "exams-types"
  });

  return (
    <>
      <HeaderExtraLayout
        title={id ? `Exam question update` : `Exam questions create`}
        breadCrumbData={[
          { name: "Home", path: "/" },
          { name: "Exam questions", path: "/exam-questions" },
          { name: id ? "Exam question update" : "Exam questions create", path: "" },
        ]}
        isBack={true}
        btn={
          <div className="flex">
            {/* <CreateBtn onClick={() => { navigate("/exam-questions/create") }} permission={"test_create"} /> */}
          </div>
        }
      />
      <div className="px-5 py-6">
        <Form
          form={form}
          name="basic"
          layout="vertical"
          initialValues={{ status: true }}
          autoComplete="off"
          onFinish={(values) => mutate({ ...values, upload: fileList[0]?.originFileObj })}
          className="gap-6"
        >
          <Row gutter={24}>
          <FormUIBuilder data={formData} form={form} load={!!Number(id)} />
            <Col span={8}>
              <Form.Item
                  name="exam_type_id"
                  label={t('Exam type')}
                  shouldUpdate
                  className="mb-4"
                  rules={[{ required: true, message: `Please select exam type` }]}
                >
                  <Select
                    loading={isFetching}
                    placeholder={t(`Select exam types`) + " ..."}
                    allowClear
                    showSearch
                    filterOption={cf_filterOption}
                  >
                    {
                      examTypes?.items?.map((item, i) => (
                        <Select.Option key={i} value={item?.id} >{item?.name}</Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
            </Col>
            <Col span={8} className="hidden">
              <Form.Item
                label={t("Question type")}
                name={`type`}
                hidden
                initialValue={1}
                shouldUpdate
                rules={[
                  { required: false, message: `Please select question type` },
                ]}>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
              label={t("File")}
              name={`upload`}
              shouldUpdate
              rules={[{ required: false, message: `Please input question` }]}>
                <FileUploader passportFile={fileList} setPassportFile={setfileList} title={t("File upload")}/>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label={t("Question")}
            name={`text`}
            shouldUpdate
            rules={[{ required: true, message: `Please input question` }]}
          >
            <SunEditor
              setContents={data?.data?.text}
              height='240px'
              autoFocus={false}
              placeholder={t("Enter question text") ?? ""}
              setOptions={{
                fontSize: [12, 14, 16, 18, 20],
                fontSizeUnit: "px",
                buttonList: editor_buttonList
            }} />
          </Form.Item>
          <div className="flex justify-end fixed bottom-0 right-0 bg-white w-[100%] px-[24px] py-[16px] shadow-2xl">
            <Button htmlType="button" onClick={() => form.resetFields()}> {t("Reset")} </Button>
            <Button type="primary" loading={isLoading} className="ml-3" htmlType="submit"> {t("Submit")} </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default ExamQuestionsCreate;
