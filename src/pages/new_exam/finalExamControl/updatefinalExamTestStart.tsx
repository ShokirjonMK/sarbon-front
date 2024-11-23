import React, { Dispatch, useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Col, Row, Form, Button, DatePicker, Modal } from "antd";
import { TypeFormUIData } from 'pages/common/types';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Notification } from 'utils/notification';
import { AxiosError } from 'axios';
import { validationErrors } from 'utils/validation_error';
import dayjs from 'dayjs';
import FormUIBuilder from 'components/FormUIBuilder';
import { changingFinalExamTestStart } from '../crud/requests';

const NewExamUpdateModal = React.memo(({ setIsModalOpen, isModalOpen, data, refetch }: {isModalOpen: boolean, setIsModalOpen: Dispatch<boolean>, data: any, refetch: any}) => {
  
  const { RangePicker } = DatePicker;

  const { t } = useTranslation(); 
  const navigate = useNavigate()
  const [form] = Form.useForm();
  const [time, settime] = useState<{start_time: string, finish_time: string}>()

  const [click, setClick] = useState(false)

  const formData: TypeFormUIData[] = [
      {
        name: "exam_form_type",
        label: "Imtihon shakli",
        url: "faculties",
        type: "select",
        data: [
          {id: 2, name: "Biriktirilgan xonada"}, 
          {id: 3, name: "Ixtiyoriy lokatsiyada"}, 
        ],
        required: true,
        span: 12,
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        data: [
          {id: 1, name: "Imtihonni boshlamagan"}, 
          {id: 2, name: "Imtihonni boshlagan"}, 
          {id: 3, name: "Imtihonni tamomlagan"}, 
        ],
        required: true,
        span: 12,
      },
  ];

  useEffect(() => {
    form.setFieldsValue({
      exam_form_type: data?.exam_form_type,
      ball: data?.ball,
      status: data?.status,
      date: data?.start_time ? [dayjs(data?.start_time * 1000), dayjs(data?.finish_time * 1000)] : undefined,
    })
  }, [data])


  const { mutate, isLoading } = useMutation({
    mutationFn: (newVals: any) => changingFinalExamTestStart(data?.id, {...newVals}),
    onSuccess: async (res) => {
      Notification("success", "update", res?.message)
      setIsModalOpen(false)
      refetch()
      if(click) navigate(-1);
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", "update", error?.response?.data ? error?.response?.data?.message : "");
      validationErrors(form, error?.response?.data)
    },
    retry: 0,
  });

  return (
    <Modal 
      title="Ma'lumotni o'zgartirish" 
      open={isModalOpen} 
      onCancel={() => setIsModalOpen(false)}
      footer={false}
      width={800}
    >
      <Form
          initialValues={{ status: true }}
          form={form}
          layout="vertical"
          onFinish={(values) => mutate({...values, date: time})}
        >
          <Row gutter={24} className="mb-5">
            <Col xxl={24} lg={24}>
              <Row gutter={24}>
                <FormUIBuilder data={formData} form={form} load={true} />
                <Col span={24}>
                  <Form.Item label={t("Leader")} name="date">
                    <RangePicker
                      className='w-full'
                      showTime={{ format: 'HH:mm' }}
                      format="YYYY-MM-DD HH:mm"
                      onChange={(value, dateString) => {
                        settime({start_time: dateString[0], finish_time: dateString[1]});
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>

          <div className="flex justify-end">
            <Button htmlType="button" onClick={() => setIsModalOpen(false)}>{t("Cancel")}</Button>
            <Button type="primary" loading={isLoading} className="ml-3" htmlType="submit" onClick={() => setClick(false)} >{t("Submit")}</Button>
          </div>
        </Form>  
    </Modal>
  );
})

export default NewExamUpdateModal;