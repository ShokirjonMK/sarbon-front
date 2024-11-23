
import { Button, Col, Divider, Form, Input, Row, Spin, Upload, UploadFile, UploadProps, message } from 'antd';
import HeaderExtraLayout from 'components/HeaderPage/headerExtraLayout';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useGetOneData from 'hooks/useGetOneData';
import { useMutation } from '@tanstack/react-query';
import { Notification } from 'utils/notification';
import { AxiosError } from 'axios';
import { validationErrors } from 'utils/validation_error';
import { useTranslation } from 'react-i18next';
import { DocumentAddRegular } from '@fluentui/react-icons';
import FileUploaderAndViewer from 'components/FileUploadAndViewer';
import { requesrData } from './crud/request';

const breadCrumb = (id: string | undefined) => [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Come Letters",
    path: "/come-letters",
  },
  {
    name: `${id ? "Update " : "Create"} reply letter`,
    path: "/letters/update/:id",
  },
]

const ReplyLetter: React.FC = (): JSX.Element => {

  const { t } = useTranslation();
  const { letter_id, letter_forward_item_id, id } = useParams();
  const navigate = useNavigate()
  const [form] = Form.useForm();
  const [fileList, setfileList] = useState<UploadFile[]>([] as UploadFile[]);
  const [fileListIlova, setfileListIlova] = useState<UploadFile[]>([] as UploadFile[]);

  const { isFetching, refetch } = useGetOneData({
    queryKey: ['letter-replies', id],
    url: `letter-replies/${id}?expand=files,description`,
    options: {
      onSuccess: (res) => {
        form.setFieldsValue({
          description: res.data?.description,
          important_level_id: res?.data?.important_level_id,
          document_weight_id: res.data?.document_weight_id,
        })

        if (res.data?.file)
          setfileList([{
            uid: res.data?.id,
            name: res.data?.file?.split("/")?.reverse()[0],
            status: 'done',
            url: res.data?.file,
          }])

        const allFiles = res.data?.files?.map((item: any, index: number) => ({
          uid: item?.id,
          name: `Ilova fayli ${index + 1}`,
          status: 'done',
          url: item?.file,
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
    mutationFn: (data) => requesrData(Number(id), letter_forward_item_id, data, fileList),
    onSuccess: async (res: any) => {
      if (res?.status === 1) {
        Notification("success", id ? "update" : "create", res?.message);
        navigate(-1);
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
    <div className="">
      <Form
        form={form}
        layout='vertical'
        onFinish={mutate}
      >
        <HeaderExtraLayout breadCrumbData={breadCrumb(id)} title={`${id ? "Update" : "Create"} reply letter`} isBack />
        <Spin spinning={isFetching && !!id} >
          <Row gutter={[24, 24]} className='px-[24px] pt-[32px]'>
            <Col xs={24} sm={24} md={24} lg={24} xl={10} xxl={10}>
              <Row gutter={[24, 0]} >
                <Col span={24}>
                  <Form.Item
                    name={`description`}
                    label={t("Description")}
                    rules={[{ required: true, message: `Please input descrription` }]}
                  >
                    <Input.TextArea rows={6} className='w-full' />

                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={14} xxl={14}>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <Form.Item
                    name={`file`}
                    label={t("Asosiy fayli")}
                  >
                    <FileUploaderAndViewer files={fileList} setFiles={setfileList} maxCount={1} >
                      <div className="ant-upload-drag p-4 w-full">
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
                  </Form.Item>
                </Col>
              </Row>

            </Col>
          </Row>

          <Divider />
          <div className='flex justify-end px-6' >
            <Button danger className='px-5' onClick={() => navigate(-1)} > {t("Cancel")} </Button>
            <Button type='primary' htmlType='submit' className='px-5 ml-2' loading={clicked} > {t("Save")} </Button>
          </div>
        </Spin>
      </Form>
    </div>
  );
};

export default ReplyLetter;
