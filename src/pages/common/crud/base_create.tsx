import { FC } from "react";
import { Form, Button, Switch, Drawer, Divider } from "antd";
import { Notification } from "utils/notification";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requesrData } from "./request";
import { AxiosError } from "axios";
import { validationErrors } from "utils/validation_error";
import { TitleModal } from "components/Titles";
import { globalConstants } from "config/constants";
import SimpleFormUI from "./form_ui";
import { TypeSimpleCreateModalProps } from "../types";
import { IoClose } from "react-icons/io5";
import React from "react";

const SimpleCreateModal: FC<TypeSimpleCreateModalProps> = ({
  url,
  visible,
  setVisible,
  refetch,
  title,
  formUIData,
}): JSX.Element => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: (newVals) =>
      requesrData(url, undefined, newVals, formUIData ?? []),
    onSuccess: async (res) => {
      queryClient.setQueryData([url], res);
      if (res.status === 1) {
        Notification("success", "create", res.message);
        setVisible(false);
        resetFields();
        refetch();
      } else {
        Notification("error", "create", res.message);
      }
    },
    onError: (error: AxiosError<any>) => {
      Notification(
        "error",
        "create",
        error?.response?.data ? error?.response?.data?.message : ""
      );
      validationErrors(form, error?.response?.data);
    },
    retry: 0,
  });

  const resetFields = React.useCallback(() => form.resetFields(), []);

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between">
          <TitleModal>{title}</TitleModal>
          <IoClose
            onClick={() => setVisible(false)}
            className="text-[24px] cursor-pointer text-[#00000073]"
          />
        </div>
      }
      headerStyle={{ background: "#F7F7F7" }}
      open={visible}
      onClose={() => setVisible(false)}
      width={globalConstants.antdDrawerWidth}
      closable={false}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={mutate}
        initialValues={{
          status: true,
        }}
      >
        <SimpleFormUI type="create" formUIData={formUIData ?? []} form={form} />
        <Divider />
        <div className="flex justify-between items-center">
          <Form.Item name="status" className="mb-0" valuePropName="checked">
            <Switch
              checkedChildren="Active"
              unCheckedChildren="InActive"
              defaultChecked
            />
          </Form.Item>
          <div>
            {/* <Button danger htmlType="reset" className="me-2" onClick={() => { resetFields() }}>{t("Reset")}</Button> */}
            <Button
              htmlType="button"
              className="me-2"
              onClick={() => {
                setVisible((prevState) => !prevState);
                resetFields();
              }}
            >
              {t("Cancel")}
            </Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              {t("Submit")}
            </Button>
          </div>
        </div>
      </Form>
    </Drawer>
  );
};

export default SimpleCreateModal;
