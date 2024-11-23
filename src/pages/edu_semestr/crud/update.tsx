import { Button, Drawer, Form, Row } from "antd";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeEduSemestr } from "./request";
import { Notification } from "utils/notification";
import { AxiosError } from "axios";
import { validationErrors } from "utils/validation_error";
import useGetOneData from "hooks/useGetOneData";
import { TypeFormUIData } from "pages/common/types";
import FormUIBuilder from "components/FormUIBuilder";
import dayjs from "dayjs";
import React from 'react'
import { globalConstants } from "config/constants";

type TypeFormProps = {
    id: number | undefined;
    refetch: Function;
    isOpenForm: boolean;
    setisOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
    setId: React.Dispatch<React.SetStateAction<number | undefined>>
}
const formDataNotChanging: TypeFormUIData[] = [
      {
      name: "name",
      label: "Name",
      required: true,
      type: "number",
      disabled: true,
      span: 24,
      max: 5,
  },
  {
      name: "course",
      label: "Course",
      required: true,
      type: "input",
      disabled: true,
      span: 24,
  },
  {
      name: "edu_plan",
      label: "Edu plan",
      required: true,
      type: "input",
      disabled: true,
      span: 24,
  },
  {
    name: "edu_year",
    label: "Edu year",
    required: true,
    type: "input",
    disabled: true,
    span: 24,
  },
  {
      name: "start_date",
      label: "Start date",
      required: true,
      type: "date",
      span: 24,
  },
  {
      name: "end_date",
      label: "Edn date",
      required: true,
      type: "date",
      span: 24,
  },
  {
    name: "status",
    label: "Status",
    required: true,
    type: "switch",
    span: 12,
},
{
  name: "is_checked",
  label: "Confirmation",
  required: true,
  type: "switch",
  span: 12,
},
  ];

const UpdateEduSemestr = ({ id, setId, refetch, isOpenForm, setisOpenForm }: TypeFormProps) => {
    
    const {t} = useTranslation();
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

  React.useEffect(() => {
    if (!id) {
      form.resetFields()
    }
  }, [isOpenForm])


  const { data } = useGetOneData({
    queryKey: ["edu-semestr", id],
    url: `edu-semestrs/${id}?expand=course,eduPlan,eduYear`,
    options: {
      onSuccess: (res) => {
        form.setFieldsValue({
          name: res?.data?.name,
          course: res?.data?.course?.name,
          edu_plan: res?.data?.eduPlan?.name,
          edu_year: res?.data?.eduYear?.name,
          start_date: dayjs(res?.data?.start_date),
          end_date: dayjs(res?.data?.end_date),
          status: res?.data?.status === 1,
          is_checked: res?.data?.is_checked === 1,
        })
      },
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: (isOpenForm && !!id),
    }
  })

  const { mutate, isLoading } = useMutation({
    mutationFn: (newVals) => changeEduSemestr(id, newVals),
    onSuccess: async (res) => {
      queryClient.setQueryData(["edu-semestr"], res);
      refetch();
      Notification("success", id ? "update" : "create", res?.message)
      if (id) setisOpenForm(false)
    },
    onError: (error: AxiosError) => {
      validationErrors(form, error?.response?.data)
    },
    retry: 0,
  });

    return(
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
                onFinish={(values) => mutate(values)}
                autoComplete="off"
            >
              <Row >
                <FormUIBuilder data={formDataNotChanging} form={form} load={!!Number(id)} />
                {/* <DatePicker    
                  disabledDate={(current) => {
                    return current && current.valueOf() <= Date.now();      //<------
                  }} 
                /> */}
              </Row>
                <div className="flex justify-end">
                  <Button htmlType="button" onClick={() => { setisOpenForm(false); setId(undefined) }}>{t("Cancel")}</Button>
                  <Button type="primary" loading={isLoading} className="ml-3" htmlType="submit">{t("Submit")}</Button>
                </div>
            </Form>
        </Drawer>
    )
}
export default UpdateEduSemestr;