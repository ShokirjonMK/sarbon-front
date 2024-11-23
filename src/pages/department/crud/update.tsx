import React from 'react'
import { Button, Drawer, Form, Switch } from 'antd';
import { globalConstants } from 'config/constants';
import useGetOneData from 'hooks/useGetOneData';
import { IDepartment } from 'models/edu_structure';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Notification } from 'utils/notification';
import { AxiosError } from 'axios';
import { validationErrors } from 'utils/validation_error';
import { submitData } from './request';
import { t } from 'i18next';
import { TitleModal } from 'components/Titles';
import { IoClose } from 'react-icons/io5';
//@ts-ignore
import UpdateFormUI from './form_ui';

type TypeFormProps = {
  id: number | undefined;
  refetch: Function;
  isOpenForm: boolean;
  setisOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
  setId: React.Dispatch<React.SetStateAction<number | undefined>>
}

const DepartmentUpdate = ({id, setId, refetch, isOpenForm, setisOpenForm}: TypeFormProps) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (!id) {
      form.resetFields()
    }
  }, [isOpenForm])

  const { data } = useGetOneData<IDepartment>({
    queryKey: ["departments", id],
    url: `departments/${id}?expand=description,types,parent,leader`,
    options: {
      onSuccess: (res) => {
        form.setFieldsValue({
          name: res?.data?.name,
          description: res?.data?.description,
          type: res?.data?.type,
          parent_id: res?.data?.parent_id,
          status: res?.data?.status === 1, 
          user_id: res?.data?.leader?.id
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
      queryClient.setQueryData(["departments"], res);
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
    <>
    <Drawer
      title={
        <div className="flex items-center justify-between">
          <TitleModal>{id ? t("Update department") : t("Create department")}</TitleModal>
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
        <UpdateFormUI id={id} form={form}/>
        <div className="flex justify-between">
          <Form.Item name="status" valuePropName="checked" >
            <Switch
              checkedChildren="Active"
              unCheckedChildren="InActive"
            />
          </Form.Item>
          <div className="flex">
            <Button htmlType="button" danger onClick={() => form.resetFields()}>{t('Reset')}</Button>
            <Button className='mx-3' onClick={() => setisOpenForm(false)}>{t('Cancel')}</Button>
            <Button type="primary" loading={isLoading} htmlType="submit">{t("Submit")}</Button>
          </div>
        </div>
      </Form>
    </Drawer>
    </>
  )
}

export default DepartmentUpdate