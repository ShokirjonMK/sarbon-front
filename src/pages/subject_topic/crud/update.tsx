import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Drawer, Form, Switch } from 'antd';
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
import TopicFormUI from './form_ui';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';

type TypeFormProps = {
  topic_id: number | undefined;
  refetch: Function;
  isOpenForm: boolean;
  setisOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
  setId: React.Dispatch<React.SetStateAction<number | undefined>>;
};

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

const UpdateTopic = ({topic_id,setId,refetch,isOpenForm,setisOpenForm}: TypeFormProps) => {
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
          subject_category_id: res?.data?.subject_category_id,
          parent_id: res?.data?.parent_id,
          status: res?.data?.status === 1, 
          allotted_time: dayjs(formatTime(Number(res?.data?.allotted_time)), 'HH:mm:ss') ,
          duration_reading_time: dayjs(formatTime(Number(res?.data?.duration_reading_time)), 'HH:mm:ss'),
          attempts_count: res?.data?.attempts_count,
          test_count: res?.data?.test_count,
          min_percentage: res?.data?.min_percentage
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
          <TopicFormUI id={id} form={form} subject_category_id={data?.data?.subject_category_id} />
          
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
      </Form>
    </Drawer>
  );
};

export default UpdateTopic;