
import { Button, Col, DatePicker, Divider, Drawer, Form, Row, Select, Spin } from 'antd';
import FormUIBuilder, { TypeFormUIBuilder } from 'components/FormUIBuilder';
import { Dispatch, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { requesrData } from './request';
import { Notification } from 'utils/notification';
import { AxiosError } from 'axios';
import { validationErrors } from 'utils/validation_error';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { DOCUSERROLES } from 'config/constants/staticDatas';
import useGetAllData from 'hooks/useGetAllData';
import { renderFullName } from 'utils/others_functions';
import dayjs from 'dayjs';
import useGetOneData from 'hooks/useGetOneData';

const formData: TypeFormUIBuilder[] = [
  {
    name: "description",
    label: "Description",
    required: true,
    type: "textarea",
    span: {sm: 24, md: 24, lg: 12, xl: 12}
  },
];

const filterOption = (input: string, option?: { label: string; value: string }) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const dateParserToDatePicker = (second: number) => dayjs(dayjs((new Date(Number(second)*1000))).format('YYYY-MM-DD HH:mm'), 'YYYY-MM-DD HH:mm');


const UpdateLetterForwar = ({open, setOpen, refetch, setselectedItem, selectedItem}: {open:boolean, setOpen: Dispatch<boolean>, refetch: any, setselectedItem: Dispatch<any>, selectedItem: any}) => {

  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { id } = useParams();

  const { data: users, isLoading: userLoading } = useGetAllData({
    queryKey: ["users", DOCUSERROLES?.map(r => r?.id)],
    url: `users?sort=-id&expand=user,user.profile`,
    urlParams: { "per-page": "0", filter: {role_name: DOCUSERROLES?.map(r => r?.id)} },
  });

  const { data, isFetching, refetch: _refetch } = useGetOneData({
    queryKey: ['letter-forwards', selectedItem?.id],
    url: `letter-forwards/${selectedItem?.id}?expand=description,user,user.profile,createdBy,updatedBy,letterForwardItem,letterForwardItem.user,letterForwardItem.user.profile,letterForwardItem.letterReply`,
    options: {
      onSuccess: (res) => {
        form.setFieldsValue({})
        const ids = res?.data?.letterForwardItem?.map((item: any) => item?.user_id)      
        form.setFieldsValue({
          user_ids: res?.data?.letterForwardItem?.map((item: any) => item?.user_id),
          user_id: res?.data?.user_id,
          description: res?.data?.description,
          date: dateParserToDatePicker(res?.data?.end_date)
        })
      },
      enabled: !!selectedItem?.id
    },
  })

  const { mutate, isLoading: clicked } = useMutation({
    mutationFn: (data) => requesrData(selectedItem?.id, data, id),
    onSuccess: async (res) => {
      if (res?.status === 1) {
        Notification("success", selectedItem?.id ? "update" : "create", res?.message);
        refetch()
        setOpen(false)
        form.resetFields()
        setselectedItem(undefined)
      } else {
        Notification("error", selectedItem?.id ? "update" : "create", res?.message);
      }
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", selectedItem?.id ? "update" : "create", error?.response?.data ? error?.response?.data?.message : "");
      validationErrors(form, error?.response?.data);
    },
    retry: 0,
  });

  return (
    <Drawer title="Fishkani o'zgartirish" placement="right" width={1000} onClose={() => {setOpen(false); form.resetFields(); setselectedItem(undefined)}} open={open}>
      <Spin spinning={isFetching}>
        <Form
          form={form}
          layout='vertical'
          onFinish={mutate}
        >
          <Row gutter={[24, 0]} >
            <FormUIBuilder data={formData} form={form} load={!!Number(selectedItem?.id)} />
            <Col span={24} md={12} >
              <Form.Item
                label={t("Topshiriq muddati")}
                name={`date`}
                shouldUpdate
                rules={[{ required: true, message: `Please input date` }]}
              >
                <DatePicker
                  className="w-[100%]"
                  showTime={{ format: 'HH:mm' }}
                  format="DD-MM-YYYY HH:mm"
                />
              </Form.Item>
            </Col>
            <Col span={24} md={12} >
              <Form.Item
                label={t("Asosiy ijrochi")}
                name={`user_id`}
                shouldUpdate
                rules={[{ required: true, message: `Please select user` }]}
              >
                  <Select
                    showSearch
                    loading={userLoading}
                    placeholder="Select a user"
                    optionFilterProp="children"
                    filterOption={filterOption}
                    options={users?.items?.map((item) => ({value: item?.id, label: renderFullName(item)}))}
                  />
              </Form.Item>
            </Col>
            <Col span={24} md={12} >
              <Form.Item
                label={t("Ijrochilar")}
                name={`user_ids`}
                shouldUpdate
                rules={[{ required: true, message: `Please select user` }]}
              >
                  <Select
                    mode='multiple'
                    showSearch
                    loading={userLoading}
                    placeholder="Select a user"
                    optionFilterProp="children"
                    filterOption={filterOption}
                    options={users?.items?.map((item) => ({value: item?.id, label: renderFullName(item)}))}
                  />
              </Form.Item>
            </Col>
          </Row>
          <Divider />
          <div className='flex justify-end px-6' >
            <Button danger className='px-5' onClick={() => setOpen(false)} > {t("Cancel")} </Button>
            <Button type='primary' htmlType='submit' className='px-5 ml-2' loading={clicked} > {t("Save")} </Button>
          </div> 
        </Form>
      </Spin>
    </Drawer>
  );
};

export default UpdateLetterForwar;
