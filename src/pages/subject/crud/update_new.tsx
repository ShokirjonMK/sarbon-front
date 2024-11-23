import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Col, Drawer, Form, Input, Row, Spin } from "antd";
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
import { updateData } from "./request";
import MultipleInput from "components/MultipleInput";

type TypeFormProps = {
  id: number | undefined;
  refetch: Function;
  isOpenForm: boolean;
  setisOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
  setId: React.Dispatch<React.SetStateAction<number | undefined>>
}

const UpdateSubjectNew = ({id, setId, refetch, isOpenForm, setisOpenForm}: TypeFormProps) => {

  const {t, i18n} = useTranslation()
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (!id) {
      form.resetFields()
    }
  }, [isOpenForm])

  useGetOneData<IGroup>({
    queryKey: ["subjects", id],
    url: `subjects/${id}?expand=description,`,
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
    mutationFn: (newVals) => updateData(id, newVals),
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
          <TitleModal>{id ? t("Update group") : t("Create group")}</TitleModal>
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
        <Spin spinning={false && !!id} >
          <Row>
            <Row gutter={[12, 12]} >
                {!id ? <MultipleInput />
                  : <>
                    <Col span={24}>
                      <Form.Item
                        name={`name[${i18n?.language}]`}
                        label={t("Name")}
                        rules={[
                          {
                            required: true,
                            message: "Please input name"
                          }
                        ]}
                      >
                        <Input className='w-full' />
                      </Form.Item>
                    </Col>
                    <Col span={24} >
                      <Form.Item
                        name={`description[${i18n?.language}]`}
                        label={t("Description")}
                      >
                        <Input.TextArea rows={2} className='w-full' />
                      </Form.Item>
                    </Col>
                  </>
                }
              </Row>'
          </Row>
        </Spin>

          <div className = "flex">
            <Button htmlType="button" danger onClick={() => form.resetFields()}>{t('Reset')}</Button>
            <Button className='mx-3' onClick={() => setisOpenForm(false)}>{t('Cancel')}</Button>
            <Button type="primary" loading={isLoading} htmlType="submit">{t("Submit")}</Button>
          </div>
      </Form>

    </Drawer>
    
  )
}

export default UpdateSubjectNew