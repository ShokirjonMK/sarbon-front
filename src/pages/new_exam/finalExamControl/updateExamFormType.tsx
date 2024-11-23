import React, { Dispatch, useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Col, Row, Form, Button, Modal } from "antd";
import { TypeFormUIData } from 'pages/common/types';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Notification } from 'utils/notification';
import { AxiosError } from 'axios';
import { validationErrors } from 'utils/validation_error';
import FormUIBuilder from 'components/FormUIBuilder';
import { changingExamFormType, changingFinalExamTestStart } from '../crud/requests';
import { dateParserToDatePicker } from 'utils/second_to_date';
import useUrlQueryParams from 'hooks/useUrlQueryParams';

const UpdateExamFormType = React.memo(({ setIsModalOpen, isModalOpen, data, refetch }: {isModalOpen: boolean, setIsModalOpen: Dispatch<boolean>, data: any, refetch: any}) => {
  
  const { t } = useTranslation(); 
  const [form] = Form.useForm();
  const [formstate, setformstate] = useState<any>({})
  const {writeToUrl, urlValue} = useUrlQueryParams({})  

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
        onchange: (e) => setformstate((prev: any) => ({...prev, exam_form_type: e})),
        required: true,
        span: 12,
      },
      formstate?.exam_form_type == "2" ?
      {
        name: "building_id",
        label: "Building",
        url: "/buildings",
        type: "select",
        child_names: ["room_id"],
        onchange: (e) => setformstate((prev: any) => ({...prev, building_id: e})),
        required: true,
        span: 12,
      } : {} as TypeFormUIData,
      (formstate?.exam_form_type == "2" && !!data?.start_time && !!data?.finish_time) ? 
      {
        name: "room_id",
        label: "Rooms",
        url: `/rooms/free-exam?building_id=${formstate?.building_id}&start_time=${dateParserToDatePicker(data?.start_time)}&finish_time=${dateParserToDatePicker(data?.finish_time)}`,
        type: "select",
        parent_name: "building_id",
        filter: {status: 1},
        required: true,
        render: (e) => `${e?.name} ${e?.room_type?.name}`,
        span: 12,
      } : {} as TypeFormUIData,
  ];

  useEffect(() => {
    if(data){
      setformstate((e: any) => ({...e, exam_form_type: data?.exam_form_type}))
      setformstate((e: any) => ({...e, building_id: data?.building_id}))
      form.setFieldsValue({
        exam_form_type: data?.exam_form_type,
        building_id: data?.building_id,
        room_id: data?.room_id,
      })
    }
  }, [data])


  const { mutate, isLoading } = useMutation({
    mutationFn: (newVals: any) => changingExamFormType(data?.id, newVals),
    onSuccess: async (res) => {
      Notification("success", "update", res?.message)
      setIsModalOpen(false)
      refetch()
      writeToUrl({name: "changed", value: urlValue?.filter_like?.changed ? (Number(urlValue?.filter_like?.changed) + 1) : 1})
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", "update", error?.response?.data ? error?.response?.data?.message : "");
      validationErrors(form, error?.response?.data)
    },
    retry: 0,
  });

  return (
    <Modal 
      title="Imtihon joyini o'zgartirish" 
      open={isModalOpen} 
      onCancel={() => setIsModalOpen(false)}
      footer={false}
      width={800}
    >
      <Form
          initialValues={{ status: true }}
          form={form}
          layout="vertical"
          onFinish={(values) => mutate(values)}
        >
          <Row gutter={24} className="mb-5">
            <FormUIBuilder data={formData} form={form} load={true} />
          </Row>

          <div className="flex justify-end">
            <Button htmlType="button" onClick={() => setIsModalOpen(false)}>{t("Cancel")}</Button>
            <Button type="primary" loading={isLoading} className="ml-3" htmlType="submit" >{t("Submit")}</Button>
          </div>
        </Form>  
    </Modal>
  );
})

export default UpdateExamFormType;