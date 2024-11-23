import { Button, Divider, Spin, Switch, Tag } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import HeaderExtraLayout from 'components/HeaderPage/headerExtraLayout';
import useGetOneData from 'hooks/useGetOneData';
import React, { ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { IFinalExam } from 'models/exam';
import checkPermission from 'utils/check_permission';
import { useMutation } from '@tanstack/react-query';
import { Notification } from 'utils/notification';
import { finalExamStatusCheck } from './requests';
import { AxiosError } from 'axios';
import { checkRole } from 'utils/others_functions';
import { useAppSelector } from 'store';
import { dateParserToDatePicker } from 'utils/second_to_date';
import ExamStudentsControl from '../finalExamControl';
import { FaRegEdit } from 'react-icons/fa';
import UpdateExamFormType from '../finalExamControl/updateExamFormType';

interface DataType {
  name: ReactNode;
  value: ReactNode;
  value2?: ReactNode;
  value3?: ReactNode;
}

const sharedOnCell = (_: DataType, index: number | undefined) => {
  if (index || index == 0) {
    if (index < 2) {
      return { colSpan: 0 };
    }
  }
  return {};
};

const NewExamView: React.FC = (): JSX.Element => {

  const { t } = useTranslation()
  const { id } = useParams()
  const user = useAppSelector(p => p?.auth?.user)
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, refetch } = useGetOneData<IFinalExam>({
    queryKey: ['final-exams', id],
    url: `final-exams/${id}`,
    urlParams: {
      sort: "-id",
      expand: "eduPlan.faculty,groups.group,eduSemestr.semestr,user,eduSemestrSubject.subject,building,room,para"
    },
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
      name: <>{t("Faculty")} / {t("Edu semestr")}</>,
      value: data?.data?.eduPlan?.faculty?.name + " / " + data?.data?.eduSemestr?.name,
    },
    {
      name: t("Status"),
      value: <div className='d-f gap-2' >
        <div className="flex flex-col gap-1">
          <span>Faollashtirish:</span>
          <Switch checkedChildren="Active" unCheckedChildren="InActive" checked={(data?.data?.status ?? 0) >= 2} onChange={(a) => mutate({ id: data?.data?.id, status: a ? 1 : 0, type: 2 })} disabled={!(checkPermission("final-exam_confirm") && (data?.data?.status === 2 || data?.data?.status === 1))} />
        </div>
        <div className="flex flex-col gap-1">
          <span>Tasdiqlash:</span>
          <Switch checkedChildren="Active" unCheckedChildren="InActive" checked={(data?.data?.status ?? 0) >= 3} onChange={(a) => mutate({ id: data?.data?.id, status: a ? 1 : 0, type: 3 })} disabled={!(checkPermission("final-exam_confirm-two") && (data?.data?.status === 3 || data?.data?.status === 2))} />
        </div>
        <div className="flex flex-col gap-1">
          <span>Mas'ul:</span>
          <Switch checkedChildren="Active" unCheckedChildren="InActive" checked={(data?.data?.status ?? 0) >= 4} onChange={(a) => mutate({ id: data?.data?.id, status: a ? 1 : 0, type: 4 })} disabled={!(checkPermission("final-exam_in-charge") && (data?.data?.status === 4 || data?.data?.status === 3) && (checkRole("admin") || checkRole("edu_admin") || checkRole("test_department") || data?.data?.user_id === user?.user_id))} />
        </div>
        <div className="flex flex-col gap-1">
          <span>Mudir:</span>
          <Switch checkedChildren="Active" unCheckedChildren="InActive" checked={(data?.data?.status ?? 0) >= 5} onChange={(a) => mutate({ id: data?.data?.id, status: a ? 1 : 0, type: 5 })} disabled={!(checkPermission("final-exam_confirm-mudir") && (data?.data?.status === 5 || data?.data?.status === 4))} />
        </div>
        <div className="flex flex-col gap-1">
          <span>Dekan:</span>
          <Switch checkedChildren="Active" unCheckedChildren="InActive" checked={(data?.data?.status ?? 0) >= 6} onChange={(a) => mutate({ id: data?.data?.id, status: a ? 1 : 0, type: 6 })} disabled={!(checkPermission("final-exam_confirm-dean") && (data?.data?.status === 6 || data?.data?.status === 5))} />
        </div>
        <div className="flex flex-col gap-1">
          <span>Yakunlash:</span>
          <Switch checkedChildren="Active" unCheckedChildren="InActive" checked={(data?.data?.status ?? 0) >= 7} onChange={(a) => mutate({ id: data?.data?.id, status: a ? 1 : 0, type: 7 })} disabled={!(checkPermission("final-exam_last-confirm") && (data?.data?.status === 7 || data?.data?.status === 6))} />
        </div>
      </div>
    },
    // {
    //   name: t("Status"),
    //   value: <div className='d-f flex-wrap gap-4' >
    //     <div>
    //       <p>Mas'ul</p>
    //       <Switch checked={(data?.data?.status ?? 0) >= 2} onChange={(a) => mutate({ id, status: a ? 1 : 0, type: 2 })} disabled={!(checkPermission("final-exam_in-charge") && (data?.data?.status === 2 || data?.data?.status === 1) && (checkRole("admin") || checkRole("edu_admin") || data?.data?.user_id === user?.user_id))} />
    //     </div>
    //     <div>
    //       <p>Mudir</p>
    //       <Switch checked={(data?.data?.status ?? 0) >= 3} onChange={(a) => mutate({ id, status: a ? 1 : 0, type: 3 })} disabled={!(checkPermission("final-exam_confirm-mudir") && (data?.data?.status === 3 || data?.data?.status === 2))} />
    //     </div>
    //     <div>
    //       <p>Dekan</p>
    //       <Switch checked={(data?.data?.status ?? 0) >= 4} onChange={(a) => mutate({ id, status: a ? 1 : 0, type: 4 })} disabled={!(checkPermission("final-exam_confirm-dean") && (data?.data?.status === 4 || data?.data?.status === 3))} />
    //     </div>
    //   </div>,
    // },
    {
      name: t("Imtihon turi"),
      value: [
        {id: 1, name: "Test"}, 
        {id: "0", name: "Yozma"}, 
      ]?.find((item) => item?.id == data?.data?.exam_type)?.name,
      value2: t("Imtihon shakli"),
      value3: [
        {id: 2, name: "Biriktirilgan xonada"}, 
        {id: 3, name: "Ixtiyoriy lokatsiyada"}, 
      ]?.find((item) => item?.id == data?.data?.exam_form_type)?.name,
    },
    {
      name: t("Subject"),
      value: data?.data?.eduSemestrSubject?.subject?.name,
      value2: t("Groups"),
      value3: data?.data?.groups?.map((e: any, i: number) => <Tag key={i} color='blue' className='border-0'>{e?.group?.unical_name}</Tag>),
    },
    {
      name: t("Vaqti"),
      value: dateParserToDatePicker(data?.data?.start_time) + " / " + dateParserToDatePicker(data?.data?.finish_time),
      value2: <div className='flex justify-between items-center'>
                  {t("Imtihon joyi")} 
                  {
                    checkPermission("final-exam_edu-type-update") ? 
                    <FaRegEdit 
                      className='text-[20px] cursor-pointer text-green-600' 
                      onClick={() => setIsModalOpen(true)}
                    /> : ""
                  }
              </div>,
      value3: <> {data?.data?.building ? `${data?.data?.building?.name} / ${data?.data?.room?.name}` : "Ixtiyoriy joyda"}</>,
    },
    {
      name: t("Mas'ul"),
      value: <span>{data?.data?.user?.last_name} &nbsp; {data?.data?.user?.first_name} &nbsp; {data?.data?.user?.middle_name}</span>,
      value2: t("Students"),
      value3: data?.data?.exam_type !== 1 ? <Link to={`/exams/${id}/students`}>Ko'rish</Link> : "",
    },
  ];

  const { mutate, isLoading: click } = useMutation({
    mutationFn: ({ id, status, type }: { id: number | string | undefined, status: number, type: number }) => finalExamStatusCheck(id, status, type),
    onSuccess: async (res) => {
      Notification("success", "update", res?.message);
      refetch()
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", "update", error?.response?.data ? error?.response?.data?.message : "");
    },
    retry: 0,
  });

  const headerTitle = data?.data?.name ? data?.data?.name : "Yakuniy imtihonni ko'rish";
  
  return (
    <Spin spinning={isLoading}>
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: "/" },
          { name: "Final exam", path: "/exams" },
          { name: headerTitle, path: "" },
        ]}
        isBack={true}
        title={headerTitle}
        btn={<div>
          {(data?.data?.status ?? 0) >= 6 && (checkRole("admin") || checkRole("edu_admin") || checkRole("dean") || checkRole("rector") || checkRole("prorector") || checkRole("mudir") || checkRole("student_internship_department")) ? <Link to={`/exams/${id}/sheet`}><Button >Baholash qaydnomasi</Button></Link> : null}
          {checkPermission("exam_update") && data?.data?.status === 0 ? <Link to={`/final-exam-controls/update/${id}`}><Button>{t("Update")}</Button></Link> : null}
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
        
        <Divider />
        <ExamStudentsControl data={data?.data} />
        {/* <ExamViewTab examView={data?.data} /> */}
      </div>
      
      <UpdateExamFormType setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} data={data?.data} refetch={refetch} />
    
    </Spin>
  )
}

export default NewExamView;