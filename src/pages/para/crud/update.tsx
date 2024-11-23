import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Drawer, Form } from "antd";
import { TitleModal } from "components/Titles";
import { globalConstants } from "config/constants";
import useGetOneData from "hooks/useGetOneData";
import { IPara } from "models/education";
import React from "react";
import { useTranslation } from "react-i18next";
import { IoClose } from "react-icons/io5";
import { submitData } from "./request";
import { Notification } from "utils/notification";
import { validationErrors } from "utils/validation_error";
import { AxiosError } from "axios";
import ParaFormUI from "./form_ui";
import dayjs from "dayjs";

type TypeFormProps = {
  id: number | undefined;
  refetch: Function;
  isOpenForm: boolean;
  setisOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
  setId: React.Dispatch<React.SetStateAction<number | undefined>>;
};

const UpdatePara = ({
  id,
  setId,
  refetch,
  isOpenForm,
  setisOpenForm,
}: TypeFormProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (!id) {
      form.resetFields();
    }
  }, [isOpenForm]);

  const { data } = useGetOneData<IPara>({
    queryKey: ["paras", id],
    url: `paras/${id}?expand=description`,
    options: {
      onSuccess: (res) => {
        form.setFieldsValue({
          name: res?.data?.name,
          start_time: dayjs(res?.data?.start_time, "HH:mm"),
          end_time: dayjs(res?.data?.end_time, "HH:mm"),
        });
      },
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: isOpenForm && !!id,
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: (newVals) => submitData(id, newVals),
    onSuccess: async (res) => {
      queryClient.setQueryData(["paras"], res);
      refetch();
      Notification("success", id ? "update" : "create", res?.message)
      if (id) setisOpenForm(false)
    },
    onError: (error: AxiosError) => {
      validationErrors(form, error?.response?.data)
    },
    retry: 0,
  });

  const onFinish = (values:any) => {
    values.start_time = dayjs(values?.start_time).format("HH:mm")
    values.end_time = dayjs(values?.end_time).format("HH:mm")
    mutate(values)
  }

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between">
          <TitleModal>
            {id ? t("Update para") : t("Create para")}
          </TitleModal>
          <IoClose
            onClick={() => {
              setisOpenForm(false);
              setId(undefined);
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
        onFinish={(values) => onFinish(values)}
      >
          <ParaFormUI id={id} form={form}/>
          <div className="flex">
            <Button htmlType="button" danger onClick={() => form.resetFields()}>{t('Reset')}</Button>
            <Button className='mx-3' onClick={() => setisOpenForm(false)}>{t('Cancel')}</Button>
            <Button type="primary" loading={isLoading} htmlType="submit">{t("Submit")}</Button>
          </div>
      </Form>
    </Drawer>
  );
};

export default UpdatePara;
