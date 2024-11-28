import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Drawer, Form } from 'antd';
import { TitleModal } from 'components/Titles';
import { globalConstants } from 'config/constants';
import useGetOneData from 'hooks/useGetOneData';
import { ISubjectTopic } from 'models/subject';
import { useTranslation } from 'react-i18next';
import { IoClose } from 'react-icons/io5';
import { submitData } from './request';
import { Notification } from 'utils/notification';
import { AxiosError } from 'axios';
import { validationErrors } from 'utils/validation_error';
import { useParams } from 'react-router-dom';
import { TypeFormUIData } from 'pages/common/types';
import FormUIBuilder from 'components/FormUIBuilder';

type TypeFormProps = {
  topic_id: number | undefined;
  refetch: Function;
  isOpenForm: boolean;
  setisOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
  setId: React.Dispatch<React.SetStateAction<number | undefined>>;
};


const formData: TypeFormUIData[] = [
  {
    name: "name",
    label: "Name",
    required: true,
    type: "input",
    maxLength: 200,
    span: 24,
  },
  {
    name: "hours",
    label: "Hour",
    required: true,
    type: "number",
    max: 10,
    span: 24,
  },
  {
    name: "lang_id",
    label: "Ta'lim tili",
    render: (e) => e?.name ?? "",
    required: true,
    type: "select",
    expand_name:"lang",
    url: "langs",
    span: 24,
  },
  {
    name: "subject_category_id",
    label: "Occupation category",
    expand_name: "subjectCategory",
    render: (e) => e?.name ?? "",
    expand: "subjectCategory",
    url: "subject-categories",
    type: "select",
    required: true,
    span: 24,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    maxLength: 500,
    span: 24,
  },
];

const UpdateTopic = ({topic_id, setId,refetch,isOpenForm,setisOpenForm}: TypeFormProps) => {

  const { t } = useTranslation();
  const {id} = useParams();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (!topic_id) {
      form.resetFields();
    }
  }, [isOpenForm]);

  const { data } = useGetOneData<ISubjectTopic>({
    queryKey: ["subject-topics", topic_id],
    url: `subject-topics/${topic_id}?expand=description,teacherAccess,subject,subjectCategory,lang`,
    options: {
      onSuccess: (res) => {
        form.setFieldsValue({
          name: res?.data?.name,
          description: res?.data?.description,
          hours: res?.data?.hours,
          teacher_access_id: res?.data?.teacher_access_id,
          subject_id: res?.data?.subject_id,
          lang_id: res?.data?.lang_id,
          subject_category_id: res?.data?.subjectCategory?.id,
          parent_id: res?.data?.parent_id,
        });
      },
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: isOpenForm && !!topic_id,
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: (newVals) => submitData(topic_id, newVals, Number(id)),
    onSuccess: async (res) => {
      queryClient.setQueryData(["subject-topics"], res);
      refetch();
      Notification("success", topic_id ? "update" : "create", res?.message)
      if (topic_id) setisOpenForm(false)
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", "update", error?.response?.data ? error?.response?.data?.message : "");
      validationErrors(form, error?.response?.data)
    },
    retry: 0,
  }); 
  

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between">
          <TitleModal>
            {topic_id ? t("Update topic") : t("Create topic")}
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
        onFinish={(values) => mutate(values)}
      >
          <FormUIBuilder data={formData} form={form} load={id ? true : false} />
          
          <div className="flex">
            <Button htmlType="button" danger onClick={() => form.resetFields()}>{t('Reset')}</Button>
            <Button className='mx-3' onClick={() => setisOpenForm(false)}>{t('Cancel')}</Button>
            <Button type="primary" loading={isLoading} htmlType="submit">{t("Submit")}</Button>
          </div>
      </Form>
    </Drawer>
  );
};

export default UpdateTopic;