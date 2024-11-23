
import { Button, Divider, Empty, Spin, Tag } from 'antd';
import HeaderExtraLayout from 'components/HeaderPage/headerExtraLayout';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { IFinalExam } from 'models/exam';
import { ArrowRight20Regular } from '@fluentui/react-icons';
import useGetOneData from 'hooks/useGetOneData';

const StudentResponses : React.FC = () : JSX.Element => {
  
  const { t } = useTranslation()
  const {exam_id} = useParams()
  const navigate = useNavigate()

  const { data: viewData, isLoading: viewLoading, refetch: viewRefetch } = useGetOneData<IFinalExam>({
    queryKey: ['exams', exam_id],
    url: `exams/${exam_id}`,
    urlParams: {expand: 'examStudents,examStudents.student'},
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!exam_id
    },
  });  


  const headerTitle = viewData?.data?.name ? viewData?.data?.name : "Talabalar jaboblari";
  
  return(
    <Spin spinning={viewLoading}>
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: "/" },
          { name: "Final exam checking", path: "/final-exam-checking" },
          { name: headerTitle, path: "" },
        ]}
        isBack={true}
        title={headerTitle}
      />
      <div className='py-3 px-6'>
        <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-3">
            {
              viewData?.data?.examStudents?.map(item => (
                  <div key={item?.id} className="rounded-md p-3" style={{border: "1px solid #f0f0f0"}}>
                      <p className='text-[16px]'>{item?.id} - {item?.student?.id} - Javob</p>
                      <Tag className='text-[16px] py-1 my-3' color={item?.student_ball ? 'success' : "warning" }>{item?.student_ball ? item?.student_ball : "baholanmagan"} - ball</Tag>
                      <Divider className='my-2' />
                      <Button onClick={() => navigate(`/final-exam-checking/${exam_id}/${item?.id}`)} className='items-center justify-center flex w-[100%]' type={item?.status === 2  ? 'default' : item?.status === 3 ? "primary" : "default"} danger={item?.status === 2}>{item?.status === 2  ? 'Tekshirilmagan' : item?.status === 3 ? "Tekshirilgan" : ""} <ArrowRight20Regular className='ml-2' /></Button>
                  </div>
              ))
            }
        </div>
          {viewData?.data?.examStudents?.length === 0 ? <Empty className='w-[100%] my-5' /> : ""}
      </div>
    </Spin>
  )
}

export default StudentResponses;