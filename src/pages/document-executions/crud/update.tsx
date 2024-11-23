
import { Button, Col, DatePicker, Divider, Drawer, Form, Row, Spin } from 'antd';
import FormUIBuilder, { TypeFormUIBuilder } from 'components/FormUIBuilder';
import { Dispatch } from 'react';
import useGetOneData from 'hooks/useGetOneData';
import { useMutation } from '@tanstack/react-query';
import { requesrData } from './request';
import { Notification } from 'utils/notification';
import { AxiosError } from 'axios';
import { validationErrors } from 'utils/validation_error';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const {RangePicker} = DatePicker

const dateParserToDatePicker = (second: number) => dayjs(dayjs((new Date(Number(second)*1000))).format('YYYY-MM-DD HH:mm'), 'YYYY-MM-DD HH:mm');

const UpdateDocumentExecution = ({open, setOpen, refetch}: {open:boolean, setOpen: Dispatch<boolean>, refetch: any}) => {

  const { t } = useTranslation();
  const [form] = Form.useForm();
  const id = undefined;

  const formData: TypeFormUIBuilder[] = [
    {
      name: "title",
      label: "Title",
      required: true,
      type: "input",
      span: {sm: 24, md: 24, lg: 12, xl: 12}
    },
    {
      name: "description",
      label: "Description",
      required: true,
      type: "textarea",
      span: {sm: 24, md: 24, lg: 12, xl: 12}
    },
    {
      name: "doc_number",
      label: "Document number",
      required: true,
      type: "number",
      span: {sm: 24, md: 24, lg: 12, xl: 12}
    },
    {
      name: "document_type_id",
      label: "Document type",
      required: true,
      url: "document-types",
      type: "select",
      span: {sm: 24, md: 24, lg: 12, xl: 12}
    },

  ];

  const { isFetching } = useGetOneData({
    queryKey: ['document-executions', id],
    url: `document-executions/${id}?expand=description`,
    options: {
      onSuccess: (res) => {
        form.setFieldsValue({
          title: res.data?.title,
          description: res.data?.description,
          doc_number: res?.data?.doc_number,
          document_type_id: res.data?.document_type_id,
          date: [dateParserToDatePicker(res.data?.start_date), dateParserToDatePicker(res.data?.end_date)],
        })
      },
      enabled: !!id
    },
  })

  const { mutate, isLoading: clicked } = useMutation({
    mutationFn: (data) => requesrData(Number(id), data),
    onSuccess: async (res) => {
      if (res?.status === 1) {
        Notification("success", id ? "update" : "create", res?.message);
        refetch()
        setOpen(false)
      } else {
        Notification("error", id ? "update" : "create", res?.message);
      }
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", id ? "update" : "create", error?.response?.data ? error?.response?.data?.message : "");
      validationErrors(form, error?.response?.data);
    },
    retry: 0,
  });

  return (
    <Drawer title="Basic Drawer" placement="right" width={1000} onClose={() => setOpen(false)} open={open}>
      <Form
        form={form}
        layout='vertical'
        onFinish={mutate}
      >
        <Spin spinning={isFetching && !!id} >
          <Row gutter={[24, 0]} >
            <FormUIBuilder data={formData} form={form} load={!!Number(id)} />
            <Col span={24} md={12} >
              <Form.Item
                label={t("Topshiriq muddati")}
                name={`date`}
                shouldUpdate
                rules={[{ required: true, message: `Please input date` }]}
              >
                <RangePicker
                  className="w-[100%]"
                  showTime={{ format: 'HH:mm' }}
                  format="DD-MM-YYYY HH:mm"
                />
              </Form.Item>
            </Col>
          </Row>
          <Divider />
          <div className='flex justify-end px-6' >
            <Button danger className='px-5' onClick={() => setOpen(false)} > {t("Cancel")} </Button>
            <Button type='primary' htmlType='submit' className='px-5 ml-2' loading={clicked} > {t("Save")} </Button>
          </div>
        </Spin>
      </Form>
    </Drawer>
  );
};

export default UpdateDocumentExecution;
