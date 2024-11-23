import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Drawer, Form } from "antd";
import { AxiosError } from "axios";
import { TitleModal } from "components/Titles";
import { globalConstants } from "config/constants";
import useGetOneData from "hooks/useGetOneData";
import { IGroup } from "models/education";
import React from "react";
import { useTranslation } from "react-i18next";
import { IoClose } from "react-icons/io5";
import { Notification } from "utils/notification";
import { validationErrors } from "utils/validation_error";
import { submitData } from "./request";
import VedmostFormUI from "./form_ui";

type TypeFormProps = {
  id: number | undefined;
  refetch: Function;
  isOpenForm: boolean;
  setisOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
  setId: React.Dispatch<React.SetStateAction<number | undefined>>
}

const UpdateVedmost = ({id, setId, refetch, isOpenForm, setisOpenForm}: TypeFormProps) => {
  const {t} = useTranslation()
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (!id) {
      form.resetFields()
    }
  }, [isOpenForm])

  const { data } = useGetOneData<IGroup>({
    queryKey: ["groups", id],
    url: `groups/${id}?expand=description,`,
    options: {
      onSuccess: (res) => {
        form.setFieldsValue({
          unical_name: res?.data?.unical_name,
          faculty_id: res?.data?.faculty_id,
          direction_id: res?.data?.direction_id, 
          edu_plan_id: res?.data?.edu_plan_id,
          language_id: res?.data?.language_id
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
      queryClient.setQueryData(["groups"], res);
      refetch();
      Notification("success", id ? "update" : "create", res?.message)
      if (id) setisOpenForm(false)
    },
    onError: (error: AxiosError) => {
      validationErrors(form, error?.response?.data)
    },
    retry: 0,
  });


  return (
    
      <Drawer
      title={
        <div className="flex items-center justify-between">
          <TitleModal>{id ? t("Update vedmost") : t("Create vedmost")}</TitleModal>
          <IoClose
            onClick={() => {setisOpenForm(false); setId(undefined) }}
            className="text-[24px] cursor-pointer text-[#00000073]"
          />
        </div>
      }
      placement="right"
      closable={false}
      open={isOpenForm}
      onClose={() => {setisOpenForm(false); setId(undefined)}}
      width={globalConstants.antdDrawerWidth}
      headerStyle={{ backgroundColor: "#F7F7F7" }}
    >
      <Form
        form={form}
        name="basic"
        layout="vertical"
        initialValues={{ status: true }}
        autoComplete="off"
        onFinish={(values) => mutate(values)}
      >
        <VedmostFormUI id={id} form={form}/>

          <div className = "flex">
            <Button htmlType="button" danger onClick={() => form.resetFields()}>{t('Reset')}</Button>
            <Button className='mx-3' onClick={() => setisOpenForm(false)}>{t('Cancel')}</Button>
            <Button type="primary" loading={isLoading} htmlType="submit">{t("Submit")}</Button>
          </div>
      </Form>

    </Drawer>
    
  )
}

export default UpdateVedmost