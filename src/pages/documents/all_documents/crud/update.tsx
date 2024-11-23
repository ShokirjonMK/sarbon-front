
import { Button, Checkbox, Col, DatePicker, Divider, Form, Input, Modal, Row, Spin, Upload, UploadFile, UploadProps, message } from 'antd';
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
import { DeleteRegular, DocumentAddRegular } from '@fluentui/react-icons';
import dayjs from 'dayjs';
import { FILE_URL } from 'config/utils';
import FileUploader from 'components/fileUploader';
import { delete_data } from 'services';
import FileUploaderAndViewer from 'components/FileUploadAndViewer';

const { Dragger } = Upload;
const { RangePicker } = DatePicker
const span = 24;

const props: UploadProps = {
  name: 'file',
  multiple: true,
  maxCount: 1,
  accept: ".pdf",
  action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

const breadCrumb = (id: string | undefined) => [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "My documents",
    path: "/documents",
  },
  {
    name: `${id ? "Update" : "Create"} document`,
    path: "/documents/update/:id",
  },
]

const dateParserToDatePicker = (second: number) => dayjs(dayjs((new Date(Number(second) * 1000))).format('YYYY-MM-DD HH:mm'), 'YYYY-MM-DD HH:mm');

const UpdateDocument: React.FC = (): JSX.Element => {

  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate()
  const [form] = Form.useForm();
  const [fileList, setfileList] = useState<UploadFile[]>([] as UploadFile[]);
  const [fileListIlova, setfileListIlova] = useState<UploadFile[]>([] as UploadFile[]);
  const [fileListIlova2, setfileListIlova2] = useState<UploadFile[]>([] as UploadFile[]);
  const [visible, setVisible] = useState<boolean>(false);
  const [file_id, setfile_id] = useState<number>();

  const formData: TypeFormUIBuilder[] = [
    {
      name: "doc_number",
      label: "Document number",
      required: true,
      type: "input",
      span
    },
    {
      name: "document_type_id",
      label: "Document type",
      required: true,
      url: "document-types",
      type: "select",
      span
    },
    {
      name: "document_weight_id",
      label: "Document weight",
      required: true,
      url: "document-weights",
      type: "select",
      span
    },
  ];

  const { isFetching, refetch } = useGetOneData({
    queryKey: ['documents', id],
    url: `documents/${id}?expand=files,description`,
    options: {
      onSuccess: (res) => {
        form.setFieldsValue({
          title: res.data?.title,
          description: res.data?.description,
          doc_number: res?.data?.doc_number,
          document_type_id: res.data?.document_type_id,
          document_weight_id: res.data?.document_weight_id,
          coming_type: res.data?.coming_type == 1,
          qr_type: res.data?.qr_type == 1,
          date: [dateParserToDatePicker(res.data?.start_date), dateParserToDatePicker(res.data?.end_date)],
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
        setfileListIlova2(allFiles)

      },
      enabled: !!id
    },
  })

  useEffect(() => {
    if (!id) {
      form.setFieldValue("status", true);
    }
  }, []);

  useEffect(() => {
    setfileListIlova(fileListIlova2)
  }, [visible]);


  const { mutate, isLoading: clicked } = useMutation({
    mutationFn: (data) => requesrData(Number(id), data, fileListIlova),
    onSuccess: async (res) => {
      if (res?.status === 1) {
        Notification("success", id ? "update" : "create", res?.message);
        // navigate("/documents");
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

  const { mutate: deleteMutate, isLoading } = useMutation({
    mutationFn: (imgId: number | string) => delete_data("documents/delete-file", imgId),
    onSuccess: () => {
      message.success("File is deleted!")
      setVisible(false)
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
        <HeaderExtraLayout breadCrumbData={breadCrumb(id)} title={`${id ? "Update" : "Create"} document`} isBack />
        <Spin spinning={isFetching && !!id} >
          <Row gutter={[24, 24]} className='px-[24px] pt-[32px]'>
            <Col xs={24} sm={24} md={24} lg={24} xl={10} xxl={10}>
              <Row gutter={[12, 0]} >
                <Col span={24}>
                  <Form.Item
                    name={`title`}
                    label={t("Title")}
                  >
                    <Input className='w-full' />
                  </Form.Item>
                </Col>
                <Col span={24} >
                  <Form.Item
                    name={`description`}
                    label={t("Description")}
                  >
                    <Input.TextArea rows={2} className='w-full' />
                  </Form.Item>
                </Col>
                <FormUIBuilder data={formData} form={form} load={!!Number(id)} />
                <Col span={24} >
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
                <Col span={8} className='mt-10'>
                  <Form.Item
                    name={`qr_type`}
                    valuePropName="checked"
                    rules={[{ required: false, message: `Please input date` }]}
                  >
                    <Checkbox>QR kod orqali imzolash</Checkbox>
                  </Form.Item>
                </Col>
                <Col span={16} className='mt-10'>
                  <Form.Item
                    name={`coming_type`}
                    valuePropName="checked"
                    rules={[{ required: false, message: `Please input date` }]}
                  >
                    <Checkbox>Imzodan so'ng kelishuvchilar ro'yxatini shakllantirish</Checkbox>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={14} xxl={14}>
              <Form.Item
                name={`file`}
                label={t("Buyruq fayli")}
              >
                <Dragger {...props} fileList={fileList}>
                  <p className="ant-upload-drag-icon mt-5">
                    <DocumentAddRegular fontSize={42} color='blue' />
                  </p>
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                  <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                    banned files.
                  </p>
                </Dragger>
              </Form.Item>

              <FileUploader onRemove={(e: any) => { setVisible(true); setfile_id(e?.uid) }} accept="application/pdf" maxCount={20} passportFile={fileListIlova} setPassportFile={setfileListIlova} title={t("Ilova faylini yuklash")} />

              <FileUploaderAndViewer files={fileListIlova} setFiles={setfileListIlova} maxCount={3} >
                <div className="ant-upload-drag p-4 w-full mt-4">
                <p className="ant-upload-drag-icon mt-5">
                  <DocumentAddRegular fontSize={42} color='blue' />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                  banned files.
                </p>
              </div>
              </FileUploaderAndViewer>
            </Col>
          </Row>
          <Divider />
          <div className='flex justify-end px-6' >
            <Button danger className='px-5' onClick={() => navigate(-1)} > {t("Cancel")} </Button>
            <Button type='primary' htmlType='submit' className='px-5 ml-2' loading={clicked} > {t("Save")} </Button>
          </div>
        </Spin>
      </Form>

      <Modal
        open={visible}
        footer={null}
        title={null}
        closable={false}
        centered
        width={416}
      >
        <div className="flex">
          <div className="me-[20px]" ><DeleteRegular color="#FF4D4F" fontSize={24} display={"inline-block"} /></div>
          <div className="" >
            <h5 className="text-[16px] font-medium" >{t("Do you want to delete information?")}</h5>
            <span className="text-[14px] font-light opacity-75" >{t("Once the data is deleted, it cannot be recovered.")}</span>
          </div>
        </div>
        <div className="flex flex-end justify-end mt-[24px]">
          <Button className="me-2" onClick={() => setVisible(false)} >{t("No")}</Button>
          <Button type="primary" danger loading={isLoading} onClick={() => deleteMutate(Number(file_id))} >{t("Yes")}</Button>
        </div>
      </Modal>

    </div>
  );
};

export default UpdateDocument;
