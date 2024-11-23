
import { Button, Collapse, Divider, Form, Input, Tag } from 'antd';
import React, {useEffect} from 'react'
import { useTranslation } from 'react-i18next';
import { ArrowDownload20Regular } from '@fluentui/react-icons';
import { FILE_URL } from 'config/utils';
import { useMutation } from '@tanstack/react-query';
import { submitBall } from './requests';
import { Notification } from 'utils/notification';
import { AxiosError } from 'axios';
import { validationErrors } from 'utils/validation_error';
import { IExamStudent, IFinalExamQuestion } from 'models/exam';

const StudentResponseCheckingCollapse : React.FC<{item: IFinalExamQuestion, index: number, refetch: any, data: IExamStudent, balls: {totalBall: number, max_ball: number}}> = ({item, index, refetch, balls, data}) : JSX.Element => {
  
  const { t } = useTranslation()
  const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            ball: item?.student_ball,
            description: item?.description,
        })
    }, [])
 
  const { mutate, isLoading: submitLoading } = useMutation({
    mutationFn: (newVals: {id: number, ball: number, description: string}) => submitBall(newVals?.id, newVals?.ball, newVals?.description),
    onSuccess: async (res) => {
      Notification("success", "update", res?.message);
      refetch()
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", "create", error?.response?.data ? error?.response?.data?.message : "");
      validationErrors(form, error?.response?.data)
    },
    retry: 0,
  });
  
  return(
        <Collapse key={index} className='mb-3'>
            <Collapse.Panel 
                header={<div className='flex'>
                    <strong>{index + 1}. Savol: </strong>
                    <p className='ml-3' dangerouslySetInnerHTML={{ __html: item?.question?.text ?? "" }}></p>
                    {item?.type === 1 ? <Tag color='success' className='ml-auto h-min text-[18px] p-3'>{item?.student_ball}</Tag> : ""}
                </div>} 
                key={index+1}
            >
                {
                    item?.type === 1 ?
                    <>
                        <p dangerouslySetInnerHTML={{ __html: item?.question?.answer_text ?? "" }}></p>
                        {item?.question?.answer_file ? 
                            <a href={FILE_URL + item?.question?.answer_file} target='_blank' className='flex justify-start items-center my-4'>Faylni yuklash <ArrowDownload20Regular /></a> 
                            : <p className='my-4 underline'>Fayl yuklanmagan!</p>}
                        <Divider></Divider>
                        <Form
                            initialValues={{status: true, type: true}}
                            form={form}
                            disabled={data?.status === 3}
                            layout="vertical"
                            onFinish={(values) => {
                                if(balls?.max_ball - balls?.totalBall + item?.student_ball >= values?.ball) {
                                    mutate({...values, id: item?.id})
                                } else {                            
                                    form.setFields([{
                                        name: 'ball',
                                        errors: [`Qiymat ${balls?.max_ball - balls?.totalBall + item?.student_ball} dan kam bo'lishi kerak!`],
                                    }])
                                }
                            }}
                        >
                            <div className='md:flex gap-4'>
                                <Form.Item
                                    label={t("Description")}
                                    name={`description`}
                                    className='w-[100%] mb-0'
                                    rules={[
                                        {
                                            required: false,
                                            message: `Please write description`,
                                        },
                                    ]}
                                >
                                    <Input.TextArea placeholder='Talaba ishi uchun tavsif' rows={3}/>
                                </Form.Item>
                                <div className='w-[250px]'>
                                    <Form.Item
                                        label={`${t("Ball")} (max ball ${balls?.max_ball - balls?.totalBall + item?.student_ball})`}
                                        name={`ball`}
                                        className='w-[100%] mb-0'
                                        rules={[
                                            {
                                                required: true,
                                                message: `Please input question ball`,
                                            },
                                        ]}
                                    >
                                        <Input placeholder='Ball' type='number' max={100} min={0} />
                                    </Form.Item>
                                    <Button type='primary' loading={submitLoading} htmlType='submit' className='w-[100%] mt-3'>Baholash</Button>
                                </div>
                            </div>
                        </Form>
                    </>
                    : <>
                        {
                            item?.question?.option?.map(op => (
                                <div key={op?.id} className={`${ op?.is_correct ? "bg-[#d9f7be]" : "bg-[#f5f5f5]" } ${item?.question?.student_option === op?.id && op?.is_correct === 0 ? "bg-[#fffbe6]" : ""} rounded-md mb-3 px-4 py-2`} style={item?.question?.student_option === op?.id ? {border: '2px #ffe58f solid'} : {}} >
                                    <p dangerouslySetInnerHTML={{__html: op?.text}} />
                                </div>
                            ))
                        }
                    </>
                }
            </Collapse.Panel>
        </Collapse>
  )
}

export default StudentResponseCheckingCollapse;