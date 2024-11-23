import React, { useState, useEffect, useRef } from 'react';
import { UpdateContentType } from '..';
import { Button, Card, Col, Form, Row, Switch, Upload, UploadProps, message } from 'antd';
import { CameraAddRegular, ChevronDownFilled, ChevronUpFilled, CloudArrowUpRegular, DeleteRegular, DismissCircleFilled, DocumentCheckmarkFilled, PenOffRegular, SaveFilled } from '@fluentui/react-icons';
import FormUIBuilder, { TypeFormUIBuilder } from 'components/FormUIBuilder';
import { useTranslation } from 'react-i18next';
import { ISubjectContent, ISubjectContentTypes } from 'models/subject';
import SunEditor from 'suneditor-react';
import { editor_buttonList } from 'config/constants/suneditor';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { requesrData } from '../request';
import { validationErrors } from 'utils/validation_error';
import { Notification } from 'utils/notification';
import { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import OpenFileByModal from 'components/openFileByModal';
import DeleteData from 'components/deleteData';

const form_data: TypeFormUIBuilder[] = [
  {
    name: "description",
    type: "textarea",
    label: "Description",
    row: 5,
    span: 24
  }
]

type ContentFormPropsType = {
  id: number
  type: ISubjectContentTypes
  order: number
  content?: ISubjectContent,
  addContent: (content: UpdateContentType | undefined) => void,
  changeOrder: ({ id, order, edit }: { id: number, order: number, edit?: boolean }) => void,
  refetch: () => void,
  isLoading: boolean,
  up: boolean
  down: boolean
}

const ContentForm: React.FC<ContentFormPropsType> = ({ content, id, type, order, addContent, changeOrder, refetch, isLoading, up, down }): JSX.Element => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const content_ref = useRef<any>(null);
  const queryClient = useQueryClient();
  const { subject_id, topic_id } = useParams();
  const [fileList, setFileList] = useState<any>();
  const [fileUrl, setFileUrl] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);
  const [status, setStatus] = useState<boolean>(false);
  const [move, setMove] = useState<"up" | "down">()

  useEffect(() => {
    if (id) {
      form.setFieldsValue({
        status: content?.status ? true : false,
        description: content?.description,
        text: content?.text,
      });

    } else {
      form.setFieldValue("status", true)
    }
  }, []);

  useEffect(() => {
    setStatus(p => !p);
  }, []);

  useEffect(() => {
    content_ref.current.scrollIntoView({
      behavior: "smooth",
      block: 'center',
    });
  }, []);

  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    if (newFileList?.length) {
      if ((newFileList[0].size ?? (type?.size + 1)) < type?.size) {
        if (type?.extension?.split(",").includes(newFileList[0]?.name?.split(".")?.reverse()[0])) {
          if (newFileList[0].originFileObj)
            setFileUrl(window.URL.createObjectURL(newFileList[0].originFileObj));
          setFileList([{ ...newFileList[0], status: "success" }])
        } else message.error(`file formati ${type.extension} bo'lishi kerak`)
      } else message.error(`${type?.type} size not more then ${type?.size / 1024 / 1024}MB!`)
    }
  };

  const { mutate, isLoading: clicked } = useMutation({
    mutationFn: (data) => requesrData(id, data, order, topic_id, type?.id),
    onSuccess: async (res) => {
      queryClient.setQueryData(["students", id], res);
      if (res?.status === 1) {
        Notification("success", "update", res?.message);
        addContent(undefined)
        refetch();
      } else {
        Notification("error", "update", res?.message);
      }
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", "update", error?.response?.data ? error?.response?.data?.message : "");
      validationErrors(form, error?.response?.data);
    },
    retry: 0,
  });

  return (
    <Card
      ref={content_ref}
      className="drop-shadow-md bgu content-card"
      bodyStyle={{ padding: type?.type === "TEXT" ? 0 : "0.75rem" }}
      headStyle={{ padding: ".75rem" }}
      type='inner'
      title={
        <div className="top mb- flex-between">
          <div className='d-f'>
            {order}.&nbsp;<span className='capitalize' >{type?.type}</span>
            {/* <div className="h-8 py-1 px-3 me-2 rounded-lg bg-white border-solid border border-gray-300 items-center inline-flex">{order}</div>
            <div className="h-8 py-1 px-3 me-2 rounded-lg bg-white border-solid border border-gray-300 items-center inline-flex">{type?.type}</div> */}
            <span className='font-normal text-gray-400 ms-5 me-2' >{t("Status")}:</span>
            <Switch checkedChildren={t("Active")} unCheckedChildren={t("InActive")} checked={form.getFieldValue("status")} onChange={(e) => { setStatus(e); form.setFieldValue("status", e) }} />
          </div>
          <div className='d-f' >
            {/* <Button onClick={a} >as</Button> */}
            <Button className='rounded-md me-2 flex-center' loading={isLoading && move === "up"} icon={<ChevronUpFilled fontSize={24} />} onClick={() => {changeOrder({ id, order: order - 1, edit: true }); setMove("up")}} disabled={up} ></Button>
            <Button className='rounded-md me-2 flex-center' loading={isLoading && move === "down"} icon={<ChevronDownFilled fontSize={24} />} onClick={() => {changeOrder({ id, order: order + 1, edit: true }); setMove("down")}} disabled={down} ></Button>
            <Button danger={!id} className=" flex-center me-2" onClick={() => { addContent(undefined); form.resetFields() }} icon={<PenOffRegular fontSize={20} />} ></Button>
            {id ? <DeleteData permission='subject-content_delete' id={id} url='subject-contents' refetch={refetch} ><Button className='rounded-md me-2 flex-center' danger icon={<DeleteRegular fontSize={20} />} ></Button></DeleteData> : null}
            <Button type='primary' loading={clicked} className=" flex-center" onClick={() => { form.submit() }} icon >{t("Save")}</Button>
          </div>
        </div>
      }
    >
      {/* <Divider className='my-3' /> */}
      <Form
        form={form}
        layout='vertical'
        className='mt-'
        onFinish={mutate}
      >
        {type?.type === "TEXT" ?
          <>
            <Form.Item
              name={"text"}
              className='w-full m-0 p-0'
              rules={[{ required: true, message: `Please input content text!!!` }]}
            >
              <SunEditor
                setContents={content ? content.text ?? "" : ""}
                height='240px'
                autoFocus={true}
                placeholder={t("Enter content text") ?? ""}
                setOptions={{
                  fontSize: [12, 14, 16, 18, 20, 24, 32],
                  fontSizeUnit: "px",
                  // mathFontSize: [{text: '18', value: '18', default: true }],
                  // codeMirror: 'CodeMirror',
                  // katex: 'window.katex',
                  buttonList: editor_buttonList
                }} />
            </Form.Item>
          </>
          : <Row gutter={[24, 24]} >
            <Col xs={24} lg={12}>
              <Form.Item
                name={`file_${type?.type?.toLowerCase()}`}
                className='w-full'
                rules={[{ required: !content?.file, message: `Please upload file!!!` }]}
              >
                {
                  content?.file && !fileUrl ? <Button icon={<SaveFilled fontSize={18} />} type='link' onClick={() => { setVisible(true) }} className='ps-0 d-f mb-2 text-lg' >&nbsp;{t("View file")}{/*Saved_file.{content?.file?.split(".")?.reverse()[0]}*/}</Button> : null
                }
                {fileUrl ? <div className='relative pt-1 pl-1' >
                  {
                    type?.type === "IMAGE" ? <img src={fileUrl} alt='not' className='max-h-[240px] max-w-full' />
                      : type.type === "VIDEO" ? <video
                        src={fileUrl}
                        controls={true}
                        autoPlay={false}
                        width="360px"
                        height="240px"
                        className='ml-4'
                      />
                        : type?.type === "AUDIO" ? <audio
                          src={fileUrl}
                          controls={true}
                          autoPlay={false}
                          className='ml-4'
                        />
                          : type?.type === "FILE" ?
                            <>
                              <div className=" px-3 py-2 ml-4 bg-slate-100 rounded justify-center items-center gap-2.5 inline-flex">
                                <DocumentCheckmarkFilled fontSize={32} />
                                <div className="text-center text-gray-900 text-[13px] font-medium leading-tight">{fileList[0]?.name}</div>
                              </div>
                              {/* <div className='d-f ml-8' ><DocumentCheckmarkFilled fontSize={32} /> File </div> : null */}
                            </> : null
                  }
                  <DismissCircleFilled
                    onClick={() => { setFileUrl(''); setFileList([]) }}
                    fontSize={42}
                    className='absolute top-[-0.5rem] left-[-0.5rem] bg-[#fff] text-[#EB3737] rounded-full cursor-pointer'
                    style={{ border: "2.4px solid #fff" }}
                  />
                </div>
                  : <Upload
                    className='w-full'
                    maxCount={1}
                    fileList={fileList}
                    showUploadList={false}
                    accept={"." + type?.extension?.split(",")?.join(", .")}
                    onChange={onChange}
                    customRequest={(({ onSuccess }: any) => { onSuccess("ok") })}
                  // listType="picture-card"
                  >
                    <div className=" flex-center flex-col w-full h-[240px] p-4 cursor-pointer rounded-xl border-dashed border-2 ease-linear duration-100 border-cyan-500 bg hover:bg-[#FAFEFF] ">
                      {/* <DrawerArrowDownloadRegular fontSize={56} /> */}
                      {
                        type?.type === "IMAGE" ?
                          <CameraAddRegular fontSize={56} /> :
                          <CloudArrowUpRegular fontSize={56} />
                      }
                      <h3 className='mt-3' >Upload {type?.type} ({type?.extension})</h3>
                      <p className='mt-3' >Max size: {type?.size / 1024 / 1024} MB</p>
                    </div>
                  </Upload>}
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <FormUIBuilder data={form_data} form={form} />
            </Col>
          </Row>}
        <Form.Item name={"status"} className='m-0 p-0 w-0 h-0'></Form.Item>
      </Form>
      <OpenFileByModal visible={visible} setVisible={setVisible} file={content?.file ?? ""} />
    </Card>
  );
};

export default ContentForm;