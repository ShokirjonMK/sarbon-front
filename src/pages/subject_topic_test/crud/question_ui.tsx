import { Button, Col, Divider, Form, Row, Select, Tag, UploadFile } from "antd";
import SingleImageUploader from "components/ImageUploader/single_image";
import { TESTLEVELS } from "config/constants/staticDatas";
import { editor_buttonList } from "config/constants/suneditor";
import { useTranslation } from "react-i18next";
import SunEditor from "suneditor-react";
import { useState, useEffect, Dispatch } from "react";
import { useMutation } from "@tanstack/react-query";
import { submitTest } from "./request";
import { useNavigate, useParams } from "react-router-dom";
import { Notification } from "utils/notification";
import { AxiosError } from "axios";
import { validationErrors } from "utils/validation_error";
import { Dismiss20Filled } from "@fluentui/react-icons";
import { FILE_URL } from "config/utils";
import { IRefetch } from "models/base";
import { ITestQuestion } from "models/test";
import { cf_filterOption } from "utils/others_functions";
import useGetData from "hooks/useGetData";

const FormTestQuestionUI = ({ data, refetch, setisEdit, isEdit }: { data: ITestQuestion | undefined; refetch: IRefetch, setisEdit: Dispatch<boolean>, isEdit: boolean }) => {

  const { t } = useTranslation();
  const navigate = useNavigate()
  const [form] = Form.useForm();
  const { subject_id, topic_id, test_id } = useParams()
  const [fileList, setFileList] = useState<UploadFile[]>([] as UploadFile[]);

  useEffect(() => {
    form.setFieldsValue({
      level: data?.level,
    });
    if (data?.testBody?.file) {
      setFileList([{
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: FILE_URL + data?.testBody?.file,
      }])
    }
  }, [data])

  const { mutate, isLoading } = useMutation({
    mutationFn: (newVals: any) => submitTest(test_id, { ...newVals, topic_id, file: fileList[0]?.originFileObj, subject_id }),
    onSuccess: async (res) => {
      setisEdit(false)
      Notification("success", test_id ? "update" : "create", res?.message)
      navigate(`/subject/tests/update/${subject_id}/${topic_id}/${res?.data?.id}`)
      if (test_id) {
        refetch()
      }
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", "update", error?.response?.data ? error?.response?.data?.message : "");
      validationErrors(form, error?.response?.data)
    },
    retry: 0,
  });

  const { data: Language, isFetching } = useGetData({
    queryKey: ["language"],
    url: "languages"
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
              <div className="flex justify-between items-center">
                <Row gutter={24} className="flex items-center w-[100%]">
                  <Col span={6}>
                  <Form.Item
                    name="level"
                    className="m-0"
                    rules={[
                      { required: true, message: `Please select level!!!` },
                    ]}
                  >
                    <Select
                      placeholder={t("Level")}
                      options={TESTLEVELS?.map((i) => ({
                        label: i.name,
                        value: i.id,
                      }))}
                    />
                  </Form.Item>
                  </Col>
                  <Col span={6}>
                  <Form.Item
                  name="language_id"
                  shouldUpdate
                  className="mb-0"
                >
                  <Select
                    loading={isFetching}
                    placeholder={t(`Select language`) + " ..."}
                    allowClear
                    showSearch
                    filterOption={cf_filterOption}
                  >
                    {
                      Language?.items?.map((item, i) => (
                        <Select.Option key={i} value={item?.id} >{item?.name}</Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
                  </Col>
                </Row>
                <div className="flex items-center">
                  {
                    test_id ?
                      <Button type="primary" onClick={() => setisEdit(false)} className="mr-2" danger ghost>
                        <Dismiss20Filled className="text-red-500" />
                      </Button> : ""
                  }
                  <Button type="primary" loading={isLoading} htmlType="submit" >{t("Submit")}</Button>
                </div>
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
              <p className="text-[14px] font-semibold text-neutral-400 mb-3">
                {t("Level")}{" "}
                <Tag>
                  {TESTLEVELS?.find((i) => i?.id == Number(data?.level))?.name}
                </Tag>
              </p>
              <Divider className="my-2" />
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

export default FormTestQuestionUI;

// test_delete
// test_update
// test_index
// test_create
// test_view