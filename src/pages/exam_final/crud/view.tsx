import { Button, Spin, Tag } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import HeaderExtraLayout from 'components/HeaderPage/headerExtraLayout';
import StatusTag from 'components/StatusTag';
import { EXAMCONTROLTYPES } from 'config/constants/staticDatas';
import dayjs from 'dayjs';
import useGetOneData from 'hooks/useGetOneData';
import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import ExamViewTab from '../tabs';
import { IFinalExam } from 'models/exam';
import checkPermission from 'utils/check_permission';

interface DataType {
  name: string;
  value: ReactNode;
  value2?: ReactNode;
  value3?: ReactNode;
}

const sharedOnCell = (_: DataType, index: number | undefined) => {
  if(index || index == 0){
    if (index < 2) {
        return { colSpan: 0 };
    }
  }
  return {};
};

const dateParserToDatePicker = (second: number | undefined) => dayjs((new Date(Number(second)*1000))).format('DD-MM-YYYY HH:mm')

const FinalExamControlView : React.FC = () : JSX.Element => {
  
  const {t} = useTranslation()
  const {id} = useParams()
  const navigate = useNavigate()

  const { data, isLoading } = useGetOneData<IFinalExam>({
    queryKey: ['exams', id],
    url: `exams/${id}?expand=examStudents,examStudents.student,examStudents.student.profile,subject,eduPlan,subjectCategory,faculty,direction,timeTableGroup`,
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!id
    },
  });

  const columnsviewTable: ColumnsType<DataType> = [
    {
      title: t("Name"),
      dataIndex: "name",
      rowScope: "row",
    },
    {
      title: t("Value"),
      dataIndex: "value",
      onCell: (_, index) => ({
        colSpan: (index == 4 || index == 3 || index == 5 || index == 2) ? 1 : 3,
      }),
    },
    {
      title: t("Name2"),
      dataIndex: "value2",
      onCell: (_, index) => sharedOnCell(_, index),
      className: "bg-[#FAFAFA]"
    },
    {
      title: t("Name3"),
      dataIndex: "value3",
      onCell: (_, index) => sharedOnCell(_, index),
    },
  ];

  const tableData: DataType[] = [
    {
      name: t("Name"),
      value: data?.data?.name
    },
    {
      name: t("Edu plan"),
      value: data?.data?.eduPlan?.name,
    },
    {
      name: t("Faculty"),
      value: data?.data?.faculty?.name,
      value2: t("Direction"),
      value3: data?.data?.direction?.name,
    },
    {
      name: t("Start time"),
      value: dateParserToDatePicker(data?.data?.start_time),
      value2: t("End time"),
      value3: dateParserToDatePicker(data?.data?.start_time),
    },
    {
        name: t("Duration"),
        value: <>{data?.data?.duration} (minut)</>,
        value2: t("Max ball"),
        value3: data?.data?.max_ball,
    },
    {
        name: t("Type"),
        value: EXAMCONTROLTYPES?.find(i => i?.id === data?.data?.type)?.name,
        value2: t("Status"),
        value3: <Tag className='text-[16px] p-1' color={
          data?.data.status === 0 ? "error" 
          : data?.data.status === 1 ? "warning"
          : data?.data.status === 2 ? "success"
          : data?.data.status === 3 ? "success"
          : data?.data.status === 4 ? "error"
          : data?.data.status === 5 ? "error"  :"" 
            }>{data?.data.status === 0 ? "Tasdiqlanmagan" 
                  : data?.data.status === 1 ? "Tasdiqlangan"
                  : data?.data.status === 2 ? "E'lon qilingan"
                  : data?.data.status === 3 ? "Imtihon yakunlangan"
                  : data?.data.status === 4 ? "Talaba ishlari O'qituvchilarga taqsimlangan"
                  : data?.data.status === 5 ? "Natijalar e'lon qilingan"  :"" }
          </Tag>,
    },
  ];

  const headerTitle = data?.data?.name ? data?.data?.name : "Yakuniy imtihonni ko'rish"
  return(
    <Spin spinning={isLoading}>
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: "/" },
          { name: "Final exam control", path: "/final-exam-controls" },
          { name: headerTitle, path: "" },
        ]}
        isBack={true}
        title={headerTitle}
        btn={<div>
          {checkPermission("exam_update") && data?.data?.status === 0 ? <Button onClick={() => navigate(`/final-exam-controls/update/${id}`)} >{t("Update")}</Button>: null}
        </div>}
      />
      <div className='py-3 px-6'>
        <Table
            columns={columnsviewTable}
            bordered
            dataSource={tableData}
            showHeader={false}
            pagination={false}
            className='mb-4'
        />

        <ExamViewTab examView={data?.data} />
      </div>
    </Spin>
  )
}

export default FinalExamControlView;