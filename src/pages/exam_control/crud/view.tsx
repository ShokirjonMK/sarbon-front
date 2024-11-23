import { Button,Tag } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import HeaderExtraLayout from 'components/HeaderPage/headerExtraLayout';
import { EXAMCONTROLTYPES } from 'config/constants/staticDatas';
import dayjs from 'dayjs';
import useGetOneData from 'hooks/useGetOneData';
import { IStudent } from 'models/student';
import React, {ReactNode, useState} from 'react'
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { renderFullName } from 'utils/others_functions';

interface DataType {
  name: string;
  value: ReactNode;
  value2?: ReactNode;
  value3?: ReactNode;
}

const sharedOnCell = (_: DataType, index: number | undefined) => {
  if(index || index == 0){
    if (index < 3) {
        return { colSpan: 0 };
    }
  }
  return {};
};

const dateParserToDatePicker = (second: number | undefined) => dayjs((new Date(Number(second)*1000))).format('DD-MM-YYYY HH:mm')

const ExamControlView : React.FC = () : JSX.Element => {
  
  const {t} = useTranslation()
  const {id} = useParams()
  const [allData, setallData] = useState<any>();

  const { data, isLoading } = useGetOneData({
    queryKey: ['exam-controls', id],
    url: `exam-controls/${id}?expand=examControlStudents,examControlStudents.student,examControlStudents.student.profile,subject,group,subjectCategory`,
    options: {
      onSuccess: (res) => {
        setallData(res?.data?.examControlStudents)
      },
      refetchOnWindowFocus: false,
      retry: 0,
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
        colSpan: (index == 4 || index == 3 || index == 5) ? 1 : 3,
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
      name: t("Group"),
      value: data?.data?.group?.unical_name,
    },
    {
      name: t("Subject category"),
      value: data?.data?.subjectCategory?.name,
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
        value3: <p>{data?.data?.user_status === 0 ? "Talaba hali topshiriqni bajarmagan!" : data?.data?.user_status === 1 ? "Talaba topshiriqni bajargan, hali baholanmagan" : data?.data?.user_status === 2 ? "Talaba baholandi" : ""}</p>,
    },
  ];


  const columns: ColumnsType<IStudent> = React.useMemo(() =>  [
    {
      title: '№',
      width: 45,
      render: (_, __, i) => i + 1
    },
    {
      title: t('FullName'),
      dataIndex: 'name',
      key: 'name',
      render: (i,e: any) =><Link to={`/exam-controls/student/response/${e?.id}`} >{renderFullName(e?.student?.profile)}</Link>
    },
    {
      title: t('Type'),
      dataIndex: 'task_completed',
      render: (i, e) => <Tag>{EXAMCONTROLTYPES?.find(i => i?.id === e?.type)?.name}</Tag>
    },
    {
      title: t('Intermediate grade'),
      dataIndex: 'intermediate_grade',
      key: 'intermediate_grade',
      render: (i,e:any) =><span>{e?.student_ball !== null ? e?.student_ball : "_"} / {e?.max_ball}</span>
    },
    {
      title: t('Status'),
      render: (i, e:any) => e?.user_status === 0 ? <Tag color="error">Talaba hali imtihon topshirmagan</Tag> : e?.user_status === 1 ? <Tag color="warning">Talaba baholanmagan!</Tag> : <Tag color="success">Talaba baholandi!</Tag>
    },
  ], [data?.data]);

  

  return(
    <>
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: "/" },
          { name: "Exam control", path: "/exam-controls" },
          { name: data?.data?.name, path: "" },
        ]}
        isBack={true}
        title={data?.data?.name}
      />
      <div className='py-3 px-6'>
        <Table
            columns={columnsviewTable}
            bordered
            dataSource={tableData}
            showHeader={false}
            pagination={false}
        />
        <Table
          className='mt-4'
          columns={columns}
          dataSource={data?.data?.examControlStudents?.length? data?.data?.examControlStudents : allData}
          pagination={false}
          loading={isLoading}
        />
      </div>
    </>
  )
}

export default ExamControlView;