import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Drawer, Form, Input, message } from "antd";
import { submitData } from "./request";
import { Notification } from "utils/notification";
import { AxiosError } from "axios";
import { globalConstants } from "config/constants";
import { useTranslation } from "react-i18next";
import { TitleModal } from "components/Titles";
import { IoClose } from "react-icons/io5";

type TypeFormProps = {
  id: number | undefined;
  isOpenForm: boolean;
  setisOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
  setId: React.Dispatch<React.SetStateAction<number | undefined>>;
};

const UpdatePassword = ({ id, setId, isOpenForm, setisOpenForm}: TypeFormProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: (newVals) => submitData(id, newVals),
    onSuccess: async (res) => {
      queryClient.setQueryData(["passwords"], res);
      Notification("success", id ? "update" : "create", res?.message);
      if (id) setisOpenForm(false);
      if(res?.status === 1){
        form.resetFields()
      }  
    },
    onError: (error: AxiosError<any>) => {
      message.error(error?.response?.data?.message);
    },
    retry: 0,
  });

  const onFinish = (values: any) => {
    const { old_password, new_password, re_password } = values;

    if (new_password !== re_password) {
      message.error(t("Verification password error"));
      return;
    }

    mutate(values)

  };

  return (
    <>
      <Drawer
        title={
          <div className="flex items-center justify-between">
            <TitleModal>{t("Update Password")}</TitleModal>
            <IoClose
              onClick={() => {
                setisOpenForm(false);
                setId(undefined);
                form.resetFields()
              }}
              className="text-[24px] cursor-pointer text-[#00000073]"
            />
          </div>
        }
        placement="right"
        closable={false}
        open={isOpenForm}
        onClose={() => {
          setisOpenForm(false);
          setId(undefined);
          form.resetFields()
        }}
        width={globalConstants.antdDrawerWidth}
        headerStyle={{ backgroundColor: "#F7F7F7" }}
      >
        <Form
          form={form}
          name="basic"
          layout="vertical"
          initialValues={{ status: true }}
          autoComplete="off"
          onFinish={(values) => { onFinish(values)}}
        >
          <Form.Item
            label={t("Current Password")}
            name="old_password"
            rules={[
              { required: true, message: `${t("Please input old password")}!` },
            ]}
          >
            <Input.Password placeholder={`${t("current password")}...`} />
          </Form.Item>
          <Form.Item
            label={t("New password")}
            name="new_password"
            rules={[
              { required: true, message: `${t("Please input new password")}!` },
            ]}
          >
            <Input.Password placeholder={`${t("New password")}...`} />
          </Form.Item>
          <Form.Item
            label={t("Re-enter password")}
            name="re_password"
            rules={[
              { required: true, message: `${t("Please input re password")}!` },
            ]}
          >
            <Input.Password placeholder={`${t("re-enter password")}`} />
          </Form.Item>

          <div className="flex justify-between">
            <div className="flex">
              {/* <Button htmlType="button" danger onClick={() => form.resetFields()}>{t('Reset')}</Button> */}
              <Button type="primary" loading={isLoading} htmlType="submit">
                {t("Change")}
              </Button>
            <Button className='ml-3' onClick={() => {setisOpenForm(false); form.resetFields()}}>{t('Cancel')}</Button>
            </div>
          </div>
        </Form>
      </Drawer>
    </>
  );
};

export default UpdatePassword;
