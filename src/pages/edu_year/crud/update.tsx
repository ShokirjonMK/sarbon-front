import { Button, Drawer, Form, Switch } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import UpdateFormUI from "./form_ui";
import React from "react";
import { submitData } from "./request";
import { AxiosError } from "axios";
import { validationErrors } from "utils/validation_error";
import { Notification } from "utils/notification";
import useGetOneData from "hooks/useGetOneData";
import dayjs from "dayjs";
import { globalConstants } from "config/constants";
import { IEduYear } from "models/education";
import { t } from "i18next";

type TypeFormProps = {
  id: number | undefined;
  refetch: Function;
  isOpenForm: boolean;
  setisOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
  setId: React.Dispatch<React.SetStateAction<number | undefined>>
}

const UpdateData = ({ id, setId, refetch, isOpenForm, setisOpenForm }: TypeFormProps) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (!id) {
      form.resetFields()
    }
  }, [isOpenForm])


  const { data } = useGetOneData<IEduYear>({
    queryKey: ["edu-years", id],
    url: `edu-years/${id}`,
    options: {
      onSuccess: (res) => {
        form.setFieldsValue({
          type: res?.data?.type,
          year: dayjs(String(res?.data?.year)),
          status: res?.data?.status === 1,
        })
      },
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: (isOpenForm && !!id),
    }
  })

  const { mutate, isLoading } = useMutation({
    mutationFn: (newVals) => submitData(id, newVals),
    onSuccess: async (res) => {
      queryClient.setQueryData(["edu-years"], res);
      refetch();
      Notification("success", id ? "update" : "create", res?.message)
      if (id) setisOpenForm(false)
    },
    onError: (error: AxiosError) => {
      validationErrors(form, error?.response?.data)
    },
    retry: 0,
  });

  const onFinish2 = (values: any) => {
    values.year = dayjs(values?.year)?.year()
    mutate(values)
  }

  return (
    <Drawer
      title={<h3 className=" font-bold">{id ? data?.data?.name : t("Create edu year")}</h3>}
      placement="right"
      onClose={() => { setisOpenForm(false); setId(undefined) }}
      open={isOpenForm}
      width={globalConstants.antdDrawerWidth}
    >
      <Form
        form={form}
        name="basic"
        layout="vertical"
        initialValues={{ status: true }}
        onFinish={(values) => onFinish2(values)}
        autoComplete="off"
      >
        <UpdateFormUI id={id} />
        <div className="flex justify-between">
          <Form.Item name="status" valuePropName="checked" >
            <Switch
              checkedChildren="Active"
              unCheckedChildren="InActive"
            />
          </Form.Item>
          <div className="flex">
            <Button htmlType="button" onClick={() => form.resetFields()}>Reset</Button>
            <Button type="primary" loading={isLoading} className="ml-3" htmlType="submit">Submit</Button>
          </div>
        </div>
      </Form>
    </Drawer>
  )
}

export default UpdateData