import { Button, Divider, Form, Row, UploadFile } from "antd";
import SingleImageUploader from "components/ImageUploader/single_image";
import { editor_buttonList } from "config/constants/suneditor";
import { useTranslation } from "react-i18next";
import SunEditor from "suneditor-react";
import { useState, useEffect, Dispatch } from "react";
import { useMutation } from "@tanstack/react-query";
import { submitExamTest } from "./request";
import { useNavigate, useParams } from "react-router-dom";
import { Notification } from "utils/notification";
import { AxiosError } from "axios";
import { validationErrors } from "utils/validation_error";
import { Dismiss20Filled } from "@fluentui/react-icons";
import { FILE_URL } from "config/utils";
import { IRefetch } from "models/base";
import { ITestQuestion } from "models/test";
import { TypeFormUIData } from "pages/common/types";
import FormUIBuilder from "components/FormUIBuilder";

const span = { xs: 24, sm: 24, md: 12, lg: 8, xl: 6 }

const formData: (is_subject: boolean) => TypeFormUIData[] = (is_subject) => ([
  ...( is_subject ? [
    {
      name: "kafedra_id",
      label: "kafedras",
      type: "select",
      url: `kafedras`,
      required: true,
      span: { xs: 24, sm: 24, md: 12, lg: 8, xl: 8 },
      render: (e:any) => e?.name,
      child_names: ["subject_id"],
    },
    {
    name: "subject_id",
    label: "Subject",
    type: "select",
    url: `subjects`,
    required: true,
    expand: 'semestr, eduForm',
    span: { xs: 24, sm: 24, md: 12, lg: 16, xl: 16 },
    render: (e:any) => `${e?.name} / ${e?.eduForm?.name} / ${e?.semestr?.name} / ${e?.credit} kredit`,
    parent_name: "kafedra_id",
  }] as TypeFormUIData[] : []),
  {
    name: "exam_type_id",
    label: "Exam types",
    url: "exams-types",
    required: true,
    type: "select",
    span: span,
  },
  {
    name: "lang_id",
    label: "Language",
    required: true,
    type: "select",
    url: "langs",
    span: span,
  },
]);

const FormExamTestQuestionUI = ({ data, refetch, setisEdit, isEdit, isSubject }: { data: ITestQuestion | undefined; refetch: IRefetch, setisEdit: Dispatch<boolean>, isEdit: boolean, isSubject?: boolean }) => {

  const { t } = useTranslation();
  const navigate = useNavigate()
  const [form] = Form.useForm();
  const { subject_id, test_id } = useParams()
  const [fileList, setFileList] = useState<UploadFile[]>([] as UploadFile[]);

  useEffect(() => {
    form.setFieldsValue({
      "kafedra_id": data?.subject?.kafedra_id,
      "subject_id": data?.subject_id,
      "lang_id": data?.lang_id ?? 1,
      "exam_type_id": data?.exam_type_id
    })
    if (data?.testBody?.file) {
      setFileList([{
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: FILE_URL + data?.testBody?.file,
      }])
    }
  }, [data]);

  const { mutate, isLoading } = useMutation({
    mutationFn: (newVals: any) => submitExamTest(test_id, {subject_id, ...newVals, upload: fileList[0]?.originFileObj, type: 1 }),
    onSuccess: async (res) => {
      setisEdit(false)
      Notification("success", (test_id && test_id !== "0") ? "update" : "create", res?.message)
      isSubject ? navigate(`/tests/view/${res?.data?.id}`) : navigate(`/subject/${subject_id}/exam-tests/update/${res?.data?.id}`)
      if ((test_id && test_id !== "0")) {
        refetch()
      }
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", "update", error?.response?.data ? error?.response?.data?.message : "");
      validationErrors(form, error?.response?.data)
    },
    retry: 0,
  });

  return (
    <Form
      initialValues={{ status: true, type: true }}
      form={form}
      layout="vertical"
      onFinish={(values) => mutate(values)}
    >
      <div className="grid grid-cols-12 gap-5 rounded-xl bg-[#fafafa] p-4 mb-5 hover:shadow-sm">
        <div className="lg:col-span-8 col-span-12 lg:col-start-3">
          {isEdit ? (
            <>
              <div className="flex-between">
                <Row gutter={12} className="w-full">
                <FormUIBuilder data={formData(!!isSubject)} form={form} />
                <div className="d-f" >
                  {
                    (test_id && test_id !== "0") ?
                      <Button type="primary" onClick={() => setisEdit(false)} className="mr-2" danger ghost>
                        <Dismiss20Filled className="text-red-500" />
                      </Button> : ""
                  }
                  <Button type="primary" loading={isLoading} htmlType="submit" >{t("Submit")}</Button>
                </div>
                </Row>
              </div>
              <Divider className="mb-2 mt-2" />
              <div className="sm:flex gap-4 pt-4">
                <Form.Item
                  name={"text"}
                  label={"Question title"}
                  className="w-full m-0 p-0"
                  rules={[
                    { required: false, message: `Please input content text!!!` },
                  ]}
                >
                  <SunEditor
                    setContents={data?.testBody?.text}
                    height="100px"
                    autoFocus={true}
                    placeholder={t("Enter content text") ?? ""}
                    setOptions={{
                      fontSize: [12, 14, 16, 18, 20, 24, 32],
                      fontSizeUnit: "px",
                      defaultStyle: "font-size: 17px;",
                      buttonList: editor_buttonList,
                    }}
                  />
                </Form.Item>
                <Form.Item label={t("Upload image")} className={`${fileList?.length ? "mr-3 " : ""} w-[122px]`} name="file">
                  <SingleImageUploader
                    fileList={fileList}
                    setFileList={setFileList}
                    istest={true}
                  />
                </Form.Item>
              </div>
            </>
          ) : (
            <div>
              <div className="sm:flex justify-between">
                <p dangerouslySetInnerHTML={{ __html: data?.testBody?.text ?? "" }} />
                <img
                  width={122}
                  className="rounded-md"
                  src={FILE_URL + data?.testBody?.file}
                  alt=""
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Form>
  );
};

export default FormExamTestQuestionUI;

// test_delete
// test_update
// test_index
// test_create
// test_view