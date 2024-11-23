import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { Col, Row, Form, Spin, Divider, Button } from "antd";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { CreateBtn } from "components/Buttons";
import FormUIBuilder, { TypeFormUIBuilder } from 'components/FormUIBuilder';
import useGetOneData from 'hooks/useGetOneData';
import { useNavigate, useParams } from 'react-router-dom';
import { Notification } from 'utils/notification';
import { validationErrors } from 'utils/validation_error';
import { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import { generateAntdColSpan } from 'utils/others_functions';
import { requesrData } from './request';
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import FileUploader from 'components/fileUploader';
import SunEditor from 'suneditor-react';
import { editor_buttonList } from 'config/constants/suneditor';
import { FILE_URL } from 'config/utils';

const span = { md: 24, lg: 12, xl: 8 };
const formData: TypeFormUIBuilder[] = [
  {
    name: "language_id",
    label: "Language",
    required: true,
    type: "select",
    url: "languages",
    span
  },
  {
    name: "exam_type_id",
    label: "Exam type",
    required: true,
    type: "select",
    url: "exams-types",
    span
  },
  {
    name: "level",
    label: "Degree",
    type: "select",
    data: [
      {
        id: 0,
        name: "Oson"
      },
      {
        id: 1,
        name: "O'rta"
      },
      {
        id: 2,
        name: "Qiyin"
      }
    ],
    span
  },
];

const SubjectExamQuestionUpdate: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { urlValue } = useUrlQueryParams({});
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [file, setFile] = useState<any>();


  const { data: test, isFetching } = useGetOneData({
    queryKey: ['tests', id],
    url: `tests/${id}`,
    options: {
      onSuccess: (res) => {
        form.setFieldsValue({
          language_id: res?.data?.language_id,
          level: res.data?.level,
          exam_type_id: res?.data?.exam_type_id,
          text: res.data?.text
        });
        if(res?.data?.file){
          setFile([{
            uid: '-1',
            name: 'Exam questions',
            status: 'done',
            url: FILE_URL + res?.data?.file,
          }])
        }
      },
      enabled: !!id
    },
  });

  const { mutate, isLoading: clicked } = useMutation({
    mutationFn: (data) => requesrData(id, urlValue?.filter?.subject_id, data, file),
    onSuccess: async (res) => {
      if (res?.status === 1) {
        Notification("success", id ? "update" : "create", res?.message);
        navigate(-1);
      } else {
        Notification("error", id ? "update" : "create", res?.message);
      }
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", id ? "update" : "create", error?.response?.data ? error?.response?.data?.message : "");
      validationErrors(form, error?.response?.data);
    },
    retry: 0,
  });

  return (
    <div >
      <HeaderExtraLayout title={`Subject exam question update`} isBack
        breadCrumbData={[
          { name: "Home", path: '/' },
          { name: "Subject view", path: `/subjects/view/${urlValue?.filter?.subject_id}?user-block=exam-questions` },
          { name: "Subject exam question update", path: 'subject-exam-question/update' }
        ]}
        btn={<CreateBtn onClick={() => { }} permission={"exam-question_create"} />}
      />
      <Form
        form={form}
        layout='vertical'
        onFinish={mutate}
        className='w-full suneditor'
      >
        <Spin spinning={isFetching && !!id} >
          <Row gutter={[12, 12]} className='mt-4 px-4' >
            <FormUIBuilder data={formData} form={form} load={!!id} />
            <Col {...generateAntdColSpan(span)}>
              <Form.Item
                name={`upload`}
                label={t("File")}
                shouldUpdate
              >
                <FileUploader title={t("Click to Upload")} setPassportFile={setFile} passportFile={file} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name={`text`}
                label={t("Question")}
                shouldUpdate
                rules={[{ required: true, message: `Please input text!` }]}
              >
                  <SunEditor
                    setContents={test?.data?.text ?? undefined}
                    height='240px'
                    placeholder={t("Enter content text") ?? ""}
                    setOptions={{
                      fontSize: [12, 14, 16, 18, 20, 24, 32],
                      fontSizeUnit: "px",
                      buttonList: editor_buttonList
                    }} />
              </Form.Item>
            </Col>
          </Row>
          <Divider />
          <div className='flex justify-end px-6 pb-4' >
            <Button danger htmlType='submit' className='px-5' onClick={() => form.resetFields()} > {t("Reset")} </Button>
            <Button type='primary' htmlType='submit' className='px-5 ml-2' loading={clicked} > {t("Save")} </Button>
          </div>
        </Spin>
      </Form>
    </div>
  );
};

export default SubjectExamQuestionUpdate;


/**
  * exam-question_index
  * exam-question_delete
  * exam-question_update
  * exam-question_view
*/