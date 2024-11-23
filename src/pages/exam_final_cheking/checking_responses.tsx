
import { Alert, Spin, Switch } from 'antd';
import HeaderExtraLayout from 'components/HeaderPage/headerExtraLayout';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { IExamStudent } from 'models/exam';
import useGetOneData from 'hooks/useGetOneData';
import StudentResponseCheckingCollapse from './collapse';
import { useMutation } from '@tanstack/react-query';
import { Notification } from 'utils/notification';
import { AxiosError } from 'axios';
import { submitRating } from './requests';

const StudentResponseChecking : React.FC = () : JSX.Element => {
  
  const { t } = useTranslation()
  const {exam_id, student_exam_id} = useParams()
  const [totalBall, settotalBall] = useState<number>(0)

  const { data, isLoading, refetch } = useGetOneData<IExamStudent>({
    queryKey: ['exam-students', student_exam_id],
    url: `exam-students/${student_exam_id}`,
    urlParams: {expand: 'examStudentQuestion,exam'},
    options: {
        onSuccess: res => {
            settotalBall(0)
            res?.data?.examStudentQuestion?.map((item, index) => {                
                settotalBall(p => p = p + item?.student_ball)
            })
        },
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!student_exam_id
    },
  }); 
  
  const { mutate, isLoading: submitLoading } = useMutation({
    mutationFn: (status : 2 | 3) => submitRating(student_exam_id, status),
    onSuccess: async (res) => {
      Notification("success", "update", res?.message);
      refetch()
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", "create", error?.response?.data ? error?.response?.data?.message : "");
    },
    retry: 0,
  });

  const headerTitle = data?.data?.exam?.name ? data?.data?.exam?.name : "Talabalar jaboblari";
  
  return(
    <Spin spinning={isLoading}>
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: "/" },
          { name: "Final exam checking", path: `/final-exam-checking` },
          { name: "Final exam view", path: `/final-exam-checking/${exam_id}` },
          { name: headerTitle, path: "" },
        ]}
        isBack={true}
        title={headerTitle}
        btn={
            <>
                {data?.data?.type == 1 ?<Switch onChange={(e) => mutate(e ? 3 : 2) } checked={data?.data?.status === 3} disabled={data?.data?.exam?.status !== 4} loading={submitLoading} checkedChildren="Tasdiqlangan" unCheckedChildren="Tasdiqlanmagan"  /> : ""}
            </>
        }
      />
      <div className='py-3 px-6'>
        {
          data?.data?.type == 1 ?
          <Alert className='mb-3 text-[16px]' message={`Maksimal ball: ${data?.data?.max_ball}. Har bir savolning ballari yig'indisi ${data?.data?.max_ball} dan oshmasligi kerak!`} type="warning" />
          : ""
        }
        {
            data?.data?.examStudentQuestion?.map((item, index) => (
                <StudentResponseCheckingCollapse item={item} key={index} data={data?.data} index={index} refetch={refetch} balls={{totalBall, max_ball: data?.data?.max_ball}} />
            ))
        }
      </div>
    </Spin>
  )
}

export default StudentResponseChecking;