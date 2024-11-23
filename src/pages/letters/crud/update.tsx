
import { Button, Col, Divider, Form, Input, Row, Spin, UploadFile, message } from 'antd';
import FormUIBuilder, { TypeFormUIBuilder } from 'components/FormUIBuilder';
import HeaderExtraLayout from 'components/HeaderPage/headerExtraLayout';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useGetOneData from 'hooks/useGetOneData';
import { useMutation } from '@tanstack/react-query';
import { requesrData } from './request';
import { Notification } from 'utils/notification';
import { AxiosError } from 'axios';
import { validationErrors } from 'utils/validation_error';
import { useTranslation } from 'react-i18next';
import { FILE_URL } from 'config/utils';
import { delete_data } from 'services';
import FileUploaderAndViewer from 'components/FileUploadAndViewer';

const span = {sm: 24, md: 12, lg: 12, xl: 8, xxl: 8};

const breadCrumb = (id: string | undefined) => [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Letters",
    path: "/letters",
  },
  {
    name: `${id ? "Update" : "Create"} letter`,
    path: "/letters/update/:id",
  },
]

const UpdateLetter: React.FC = (): JSX.Element => {

  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate()
  const [form] = Form.useForm();
  const [fileList, setfileList] = useState<UploadFile[]>([] as UploadFile[]);
  const [fileListIlova, setfileListIlova] = useState<UploadFile[]>([] as UploadFile[]);

  const formData: TypeFormUIBuilder[] = [
    {
      name: "document_weight_id",
      label: "Document weight",
      required: true,
      url: "document-weights",
      type: "select",
      span
    },
    {
      name: "important_level_id",
      label: "Document important level",
      required: true,
      url: "important-levels",
      type: "select",
      span
    },
  ];

  const { isFetching, refetch } = useGetOneData({
    queryKey: ['letters', id],
    url: `letters/${id}?expand=files,description`,
    options: {
      onSuccess: (res) => {
        form.setFieldsValue({
          description: res.data?.description,
          important_level_id: res?.data?.important_level_id,
          document_weight_id: res.data?.document_weight_id,
        })

        setfileList([{
          uid: res.data?.id,
          name: "Hujjat fayli",
          status: 'done',
          url: FILE_URL + res.data?.file,
        }])

        const allFiles = res.data?.files?.map((item: any, index: number) => ({
          uid: item?.id,
          name: `Ilova fayli ${index + 1}`,
          status: 'done',
          url: FILE_URL + item?.file,
        }))
        setfileListIlova(allFiles)
      },
      enabled: !!id
    },
  })

  useEffect(() => {
    if (!id) {
      form.setFieldValue("status", true);
    }
  }, []);

  const { mutate, isLoading: clicked } = useMutation({
    mutationFn: (data) => requesrData(Number(id), data, fileListIlova, fileList),
    onSuccess: async (res) => {
      if (res?.status === 1) {
        Notification("success", id ? "update" : "create", res?.message);
        navigate(`/letters/view/${res?.data?.id}`);
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

  const { mutate: deleteMutate } = useMutation({
    mutationFn: (imgId: number | string) => delete_data("letters/delete-file", imgId),
    onSuccess: () => {
      message.success("File is deleted!")
      refetch()
    }
  });  

  return (
    <div className="">
      <Form
        form={form}
        layout='vertical'
        onFinish={mutate}
      >
        <HeaderExtraLayout breadCrumbData={breadCrumb(id)} title={`${id ? "Update" : "Create"} letter`} isBack />
        <Spin spinning={isFetching && !!id} >
          <Row gutter={[24, 0]} className='px-[24px] pt-[32px]' >
            <FormUIBuilder data={formData} form={form} load={!!Number(id)} />
            <Col span={24}>
                <Form.Item
                  name={`description`}
                  label={t("Description")}
                >
                  <Input.TextArea rows={2} className='w-full' />
             
                </Form.Item>
              </Col>
          </Row>
          <Row gutter={[24, 24]} className='px-[24px] pt-[32px]'>
            <Col span={12}>
              <FileUploaderAndViewer files={fileList} setFiles={setfileList} maxCount={1} accept=".doc,.docx,.pdf"  >
                <Button className="mt-4">Asosiy faylni yuklash</Button>
              </FileUploaderAndViewer>
            </Col>
          </Row>
          <Row gutter={[24, 24]} className='px-[24px] pt-[32px]'>
            <Col span={12}>
              <FileUploaderAndViewer files={fileListIlova} setFiles={setfileListIlova} maxCount={10} accept=".doc,.docx,.pdf" onRemove={(e) => deleteMutate(e?.uid)}  >
                <Button className="mt-4">Ilova faylni yuklash</Button>
              </FileUploaderAndViewer>
            </Col>
          </Row>
          <Divider />
          <div className='flex justify-end px-6 pb-5' >
            <Button danger className='px-5' onClick={() => navigate(-1)} > {t("Cancel")} </Button>
            <Button type='primary' htmlType='submit' className='px-5 ml-2' loading={clicked} > {t("Save")} </Button>
          </div>
        </Spin>
      </Form>
    </div>
  );
};

export default UpdateLetter;
