import { DocumentText24Regular } from '@fluentui/react-icons';
import { useMutation } from '@tanstack/react-query';
import { Button, Divider, Form, Input, Spin, Tag } from 'antd';
import HeaderExtraLayout from 'components/HeaderPage/headerExtraLayout';
import { EXAMCONTROLTYPES } from 'config/constants/staticDatas';
import { FILE_URL } from 'config/utils';
import dayjs from 'dayjs';
import useGetOneData from 'hooks/useGetOneData';
import React, {useState} from 'react'
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { renderFullName } from 'utils/others_functions';
import { finalExamCheckStudentMark } from '../crud/requests';
import { Notification } from 'utils/notification';
import { AxiosError } from 'axios';
import { validationErrors } from 'utils/validation_error';
import StudentTestResult from './test_result';

const dateParserToDatePicker = (second: number | undefined) => dayjs((new Date(Number(second)*1000))).format('DD-MM-YYYY HH:mm')

const StudentExamResponse : React.FC = () : JSX.Element => {
  const {t} = useTranslation()
  const [form] = Form.useForm();

  const { exam_controle_student_id } = useParams()
  const [student_ball, setstudent_ball] = useState<number>();
  const [is_show_more, setis_show_more] = useState<boolean>(false);

   const { data, refetch, isFetching } = useGetOneData({
    queryKey: ['exam-control-students', exam_controle_student_id],
    url: `/exam-control-students/${exam_controle_student_id}?expand=examControl,examControl.group,examControl.subject,examControl.subjectCategory,student,student.profile,questionCount,correctCount,user,fileInformation,examControl,studentTimes,examControlTest.test.options,examControlTest.isCorrect`,
    options: {
      refetchOnWindowFocus: false,
      enabled: !!exam_controle_student_id,
      retry: 0,
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: () => finalExamCheckStudentMark(exam_controle_student_id, student_ball),
    onSuccess: async (res) => {
        refetch()
        Notification("success", "update", res?.message)
    },
    onError: (error: AxiosError) => {
      validationErrors(form, error?.response?.data)
    },
    retry: 0,
  });


  return(
    <Spin spinning={isFetching}>
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: "/" },
          { name: "Exam controles", path: "/exam-controls" },
          { name: data?.data?.examControl?.name, path: `/exam-controls/view/${data?.data?.examControl?.id}` },
          { name: renderFullName(data?.data?.student?.profile), path: "/exam-controls" },
        ]}
        isBack={true}
        title={renderFullName(data?.data?.student?.profile)}
      />
      <div className='py-3 px-6'>
        <div className='my-5'>
            {data?.data?.examControl?.type !== 3 ? <Divider orientation="left" plain>{t("Exam question")}</Divider> : ""}
                {
                    data?.data?.type === 1 || data?.data?.type === 2 ? <>
                    <div className="flex items-top mb-4">
                        <p className='mr-3 opacity-60'>{t("Question")}: </p>
                        <p>{data?.data?.examControl?.question}</p>
                    </div>
                    <div className="flex items-center mb-4">
                        <p className='mr-3 opacity-60'>{t("Question file")}: </p>
                        {data?.data?.examControl?.file ? <a href={FILE_URL + data?.data?.examControl?.file} target='_blank'><DocumentText24Regular /></a> : <p>{t("File is not uploaded")}</p>}
                    </div>
                </> : ""}
            <Divider orientation="left" plain>{t("Student answer")}</Divider>
            <div className="grid grid-cols-12 gap-4">
                <div className="lg:col-span-4 col-span-12">
                    <div className="shadow-sm rounded-md p-4 border-solid border-2 border-slate-100">
                        <div className="flex items-center mb-4">
                            <p className='mr-3 opacity-60'>{t("Student")}: </p>
                            <p>{renderFullName(data?.data?.student?.profile)}</p>
                        </div>
                        <div className="flex items-center mb-4">
                            <p className='mr-3 opacity-60'>{t("Group")}: </p>
                            <p>{data?.data?.examControl?.group?.unical_name}</p>
                        </div>
                        <div className="flex items-center mb-4">
                            <p className='mr-3 opacity-60'>{t("Subject")}: </p>
                            <p>{data?.data?.examControl?.subject?.name}</p>
                        </div>
                        <div className="flex items-center mb-4">
                            <p className='mr-3 opacity-60'>{t("Type")}: </p>
                            <Tag><strong>{EXAMCONTROLTYPES?.find(i => i?.id === data?.data?.examControl?.type)?.name}</strong></Tag>
                        </div>
                        <div className="flex items-center mb-4">
                            <p className='mr-3 opacity-60'>{t("Start time")}: </p>
                            <p>{dateParserToDatePicker(data?.data?.examControl?.start_time)}</p>
                        </div>
                        <div className="flex items-center mb-4">
                            <p className='mr-3 opacity-60'>{t("End time")}: </p>
                            <p>{dateParserToDatePicker(data?.data?.examControl?.finish_time)}</p>
                        </div>
                        <div className="flex items-center">
                            <p className='mr-3 opacity-60'>{t("Duration")}: </p>
                            <p>{data?.data?.examControl?.duration} minut</p>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-8 col-span-12">
                    <div className="shadow-sm rounded-md p-4 border-solid border-2 border-slate-100">
                        {
                            data?.data?.type === 3 ?  // test shaklida
                                <div className="flex items-center mb-4">
                                    <p className='mr-3 opacity-60'>{t("Test answer")}: </p>
                                    <p>{data?.data?.correctCount}/{data?.data?.question_count}</p>
                                </div> : ""
                        }

                        {
                            data?.data?.type === 1 ? // yozma shaklida
                            <div className="flex items-start mb-4">
                                <p className='mr-3 opacity-60'>{t("Student answer")}: </p>
                                <div>
                                    <div className={`w-full ${is_show_more ? "": 'line-clamp-5'}`} dangerouslySetInnerHTML={{ __html: data?.data?.answer_text ?? "" }} />
                                    <Button type="text" onClick={() => setis_show_more(!is_show_more)} className='mt-3'>...{is_show_more ? "Kamroq ko'rish" : "Ko'proq ko'rish"}</Button>
                                </div>
                            </div> : ""
                        }

                        {
                            data?.data?.type === 2 ? // fayl shaklida
                            <div className="flex items-center mb-4">
                                <p className='mr-3 opacity-60'>{t("Student answer file")}: </p>
                                {data?.data?.answer_file ? <a href={FILE_URL + data?.data?.answer_file} target='_blank'><DocumentText24Regular /></a> : <p>{t("File is not uploaded")}</p>}
                            </div> : ""
                        }

                        <div className="flex items-center my-4"> 
                            <p className='mr-3 opacity-60'>{t("Student's ball")}: </p>
                            <p>{data?.data?.user_status === 2 ? data?.data?.student_ball : data?.data?.user_status === 0 ? <Tag color="error" >Talaba hali imtihon topshirmagan</Tag> : <Tag color="warning">Talaba baholanmagan!</Tag>}</p>
                        </div>
                        {
                            data?.data?.type === 1 || data?.data?.type === 2 ? // yozma yoki fayl shaklida bolsa baholash
                            <div className="">
                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={() => mutate()}
                                    className='flex my-4'
                                >
                                    <Form.Item
                                        name={`student_ball`}
                                        shouldUpdate
                                        rules={[{ required: true, message: `Please input student ball!`}]}
                                        className="w-[100%] mb-0 mr-3"
                                        label='Talabani baholash'
                                    >
                                        <Input onChange={(e) => setstudent_ball(Number(e.target.value))} placeholder={`Max ball ${data?.data?.max_ball}`} max={data?.data?.examControl?.max_ball} />
                                    </Form.Item>
                                    <Form.Item
                                        shouldUpdate
                                        className="mb-0"
                                        label={<p></p>}
                                    >
                                        <Button htmlType='submit' loading={isLoading} type='primary'>Baholash</Button>
                                    </Form.Item>
                                    
                                </Form>
                            </div> : ''
                        }
                    </div>
                    {
                      data?.data?.type === 3 && data?.data?.user_status !== 0 ?   
                      <StudentTestResult data={data?.data} /> : ""
                    }
                </div>
            </div>
        </div>
      </div>
    </Spin>
  )
}

export default StudentExamResponse;