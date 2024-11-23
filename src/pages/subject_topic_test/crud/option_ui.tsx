import { Button, Divider, Form, Switch, UploadFile } from "antd";
import SingleImageUploader from "components/ImageUploader/single_image";
import { editor_buttonList } from "config/constants/suneditor";
import { useTranslation } from "react-i18next";
import SunEditor from "suneditor-react";
import { useState, useEffect, Dispatch } from "react";
import { useMutation } from "@tanstack/react-query";
import { submitTestOption } from "./request";
import { useParams } from "react-router-dom";
import { Notification } from "utils/notification";
import { AxiosError } from "axios";
import { validationErrors } from "utils/validation_error";
import { CheckmarkCircle20Regular, Delete16Filled, Dismiss20Filled, Edit16Filled } from "@fluentui/react-icons";
import { FILE_URL } from "config/utils";
import { ITestOption } from "models/test";
import DeleteData from "components/deleteData";
import checkPermission from "utils/check_permission";

const FormTestOptionUI = ({ data, refetch, isNew = false, setOptions}: { data: ITestOption; refetch: () => void, isNew?: boolean, setOptions?: Dispatch<Array<any>> }) => {

  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { test_id } = useParams()
  const [isEdit, setisEdit] = useState<boolean>(test_id == "0" || isNew);
  const [isTrue, setisTrue] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([] as UploadFile[]);
  const [option_id, setoption_id] = useState<number | undefined>();

  useEffect(() => {
    form.setFieldsValue({
      is_correct: data?.is_correct == 1,
    });
    if (data?.file) {
      setFileList([{
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: FILE_URL + data?.file,
      }])
    }
  }, [data])

  const { mutate, isLoading } = useMutation({
    mutationFn: (newVals:any) => submitTestOption(option_id, {...newVals, test_id, file: fileList[0]?.originFileObj}),
    onSuccess: async (res) => {
      setisEdit(false)
      setisTrue(false)
      refetch()
      Notification("success", test_id ? "update" : "create", res?.message)
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", "update", error?.response?.data ? error?.response?.data?.message : "");
      validationErrors(form, error?.response?.data)
    },
    retry: 0,
  });

  const changeIsEdit = () => {
    setisEdit(false);
     if(!option_id && setOptions) setOptions([])
  }

  return (
    <Form
      initialValues={{ status: true, type: true }}
      form={form}
      layout="vertical"
      onFinish={(values) => mutate(values)}
    >
      <div className="grid grid-cols-12 gap-5 rounded-xl">
        <div className={`lg:col-span-8 col-span-12 lg:col-start-3 
          ${(data?.is_correct == 1 || isTrue) ? 
            "bg-[#f6ffed]" 
              : data?.is_correct == 0 ? 
                "bg-[#fcf3f3]" 
                  : "bg-[#fafafa]"} rounded-xl  p-4 mb-5 hover:shadow-sm`}>
          {isEdit ? (
            <>
              <div className="flex justify-between items-center">
                <div className="flex items-center">  
                  <p className="mr-3">To'g'ri javob</p>
                  <Form.Item
                      name="is_correct"
                      className="m-0"
                      rules={[
                        { required: true, message: `Please select level!!!` },
                      ]}
                      valuePropName="checked"
                  >
                    <Switch defaultChecked onChange={(e) => setisTrue(e)} />
                  </Form.Item>
                </div>
                <p className="font-semibold text-zinc-500 text-[18px]">{t("Option")}</p>
                <div className="flex items-center">
                  <Button type="primary" onClick={changeIsEdit} className="mr-2" danger ghost>
                    <Dismiss20Filled className="text-red-500" />
                  </Button>
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
                    { required: true, message: `Please input content text!!!` },
                  ]}
                >
                  <SunEditor
                    setContents={data?.text}
                    height="100px"
                    autoFocus={true}
                    placeholder={t("Enter content text") ?? ""}
                    setOptions={{
                      fontSize: [12, 14, 16, 18, 20, 24, 32],
                      fontSizeUnit: "px",
                      defaultStyle: "font-size: 16px;",
                      buttonList: editor_buttonList,
                    }}
                  />
                </Form.Item>
                <Form.Item className={`${fileList?.length ? "mr-3 " : ""} w-[122px]`} label={t("Upload image")} name="file">
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
              <div className="flex justify-between items-center">
                <p className="flex items-center text-[14px] font-semibold text-neutral-400">
                  Javob: {data?.is_correct == 1 ? <CheckmarkCircle20Regular className="text-green-600 ml-3" /> : <Dismiss20Filled className="text-red-500 ml-3" />}
                </p>
                <p className="font-semibold text-zinc-500 text-[18px]">{t("Option")}</p>
                <div className="flex items-center">
                  <DeleteData
                    permission={"option_delete"}
                    refetch={refetch}
                    url={"options"}
                    id={Number(option_id)}
                  >
                    <Button type="primary" onClick={() => {setoption_id(data?.id)}} className="mr-2" danger ghost>
                      <Delete16Filled className="text-red-500" />
                    </Button>
                  </DeleteData>
                  {
                    checkPermission("option_update") ? 
                    <Button onClick={() => {setisEdit(true); setoption_id(data?.id)}} loading={isLoading} htmlType="submit" >
                      <Edit16Filled className="cursor-pointer" />
                    </Button> : ""
                  }
                </div>
              </div>
              <Divider className="my-2" />
              <div className="sm:flex justify-between">
                <p dangerouslySetInnerHTML={{__html: data?.text ?? ""}} />
                <img
                  width={122}
                  className="rounded-md"
                  src={FILE_URL + data?.file}
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

export default FormTestOptionUI;

// option_view
// option_update
// option_index
// option_delete
// option_create
