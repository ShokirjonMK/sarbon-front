import { Form, Switch, Button, Drawer, Divider, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { Notification } from "utils/notification";
import useGetOneData from "hooks/useGetOneData";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requesrData } from "./request";
import { AxiosError } from "axios";
import { validationErrors } from "utils/validation_error";
import { TitleModal } from "components/Titles";
import { globalConstants } from "config/constants";
import SimpleFormUI from "./form_ui";
import { TypeSimpleUpdateModalProps } from "../types";
import { expandData } from "../utils";
import { IoClose } from "react-icons/io5";

const SimpleUpdateModal: React.FC<TypeSimpleUpdateModalProps> = ({
  id,
  url,
  visible,
  setVisible,
  refetch,
  title,
  formUIData,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { isFetching } = useGetOneData<any>({
    queryKey: [url, id],
    url: `${url}/${id}?expand=description${expandData(formUIData)}`,
    options: {
      onSuccess: (res) => {
        let obj = {};
        formUIData?.filter((e) => !e.onlyTable)?.forEach((e) => {
            if (e?.type === "date" || e.type === "time") {
            } else
              obj = {
                ...obj,
                [e?.name]: res?.data ? res?.data[e?.name] : undefined,
              };
          });

        form.setFieldsValue({
          name: res?.data?.name,
          description: res?.data?.description,
          status: res?.data?.status === 1,
          ...obj,
        });
      },
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: visible && !!id,
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: (newVals) => requesrData(url, id, newVals, formUIData ?? []),
    onSuccess: async (res) => {
      queryClient.setQueryData([url, id], res);
      if (res?.status === 1) {
        Notification("success", "update", res?.message);
        setVisible(false);
        form.resetFields();
        refetch();
      } else {
        Notification("error", "update", res?.message);
      }
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", "update", error?.response?.data ? error?.response?.data?.message : "");
      validationErrors(form, error?.response?.data);
    },
    retry: 0,
  });

  return (
    <>
      <Drawer
        title={
          <div className="flex items-center justify-between">
            <TitleModal>{title}</TitleModal>
            <IoClose
              onClick={() => setVisible(false)}
              className="text-[24px] cursor-pointer text-[#888888]"
            />
          </div>
        }
        open={visible}
        onClose={() => setVisible(false)}
        placement="right"
        width={globalConstants.antdDrawerWidth}
        closable={false}
        headerStyle={{ backgroundColor: "#F7F7F7" }}
      >
        <Spin spinning={isFetching}>
          <Form form={form} layout="vertical" onFinish={mutate}>
            <SimpleFormUI
              type="update"
              formUIData={formUIData ?? []}
              form={form}
            />
            <Divider />
            <div className="flex justify-between">
              <Form.Item name="status" valuePropName="checked">
                <Switch checkedChildren="Active" unCheckedChildren="InActive" />
              </Form.Item>
              <div>
                {/* <Button danger onClick={() => form.resetFields()}>
                {t("Reset")}
              </Button> */}
                <Button
                  onClick={() => setVisible((prevState) => !prevState)}
                  className="mx-2"
                >
                  {t("Cancel")}
                </Button>
                <Button type="primary" loading={isLoading} htmlType="submit">
                  {t("Submit")}
                </Button>
              </div>
            </div>
          </Form>
        </Spin>
      </Drawer>
    </>
  );
};

export default SimpleUpdateModal;
