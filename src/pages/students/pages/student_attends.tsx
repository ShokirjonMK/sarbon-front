import React, { useState, useMemo } from 'react';
import { Drawer, Segmented, Tag } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import HeaderExtraLayout from 'components/HeaderPage/headerExtraLayout';
import { TitleModal } from 'components/Titles';
import { globalConstants } from 'config/constants';
import useGetAllData from 'hooks/useGetAllData';
import { IAttend } from 'models/student';
import { useTranslation } from 'react-i18next';
import { IoClose } from 'react-icons/io5';
import { useParams } from 'react-router-dom';
import useUrlQueryParams from 'hooks/useUrlQueryParams';

type TypeSubjectAttend = {
  subject_id: number
  subject_name: string,
  cause: number,
  uncause: number,
  count: number,
  attends: IAttend[],
}

const StudentAttends: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { student_id } = useParams();
  const [acttiveSubject, setActtiveSubject] = useState<number>()
  const { urlValue, writeToUrl } = useUrlQueryParams({});

  // const { data, isFetching } = useGetAllData<IAttend>({
  //   queryKey: ["student-attends", student_id],
  //   url: "/student-attends?expand=timeTable.teacher,timeTable.para,timeTable.week,subjectCategory,subject,student,student.profile",
  //   urlParams: {
  //     "per-page": 0,
  //     filter: { student_id }
  //   }
  // });

  const { data: studentGroups, isLoading } = useGetAllData({
    queryKey: ["student-groups", student_id],
    url: "student-groups",
    urlParams: {
      "per-page": 0,
      filter: JSON.stringify({ student_id: student_id }),
    },
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
      onSuccess(data) {
        const lastSem = data?.items?.sort((a: any, b: any) => a?.semestr_id - b?.semestr_id)[data?.items?.length - 1]
        writeToUrl({ name: "semestr_id", value: lastSem?.semestr_id })
      },
    }
  })



  const { data, isFetching } = useGetAllData<IAttend>({
    queryKey: ["timetable-attends", student_id, urlValue.filter?.semestr_id],
    url: "/timetable-attends?expand=timeTableDate.para,timeTableDate.week,subjectCategory,subject,student,student.profile",
    urlParams: {
      "per-page": 0,
      filter: { student_id, semestr_id: urlValue.filter?.semestr_id }
    },
    options: {
      enabled: !!urlValue.filter?.semestr_id
    }
  });

  const subject_attends = useMemo(() => {
    let attends: TypeSubjectAttend[] = []

    data?.items?.forEach(e => {
      const i = attends?.findIndex(a => a?.subject_id === e?.subject?.id)
      if (attends[i]) {
        attends[i].attends.push(e);
        attends[i].count++;
        if (e?.reason) attends[i].cause++;
        else attends[i].uncause++;
      } else {
        attends.push({
          subject_id: e?.subject?.id ?? 0,
          subject_name: e?.subject?.name ?? "",
          cause: e?.reason ? 1 : 0,
          uncause: e?.reason ? 0 : 1,
          count: 1,
          attends: [e]
        })
      }
    })

    return attends
  }, [data?.items])

  const subject_columns: ColumnsType<TypeSubjectAttend> = React.useMemo(
    () => [
      {
        title: "№",
        dataIndex: "order",
        render: (_, __, i) => i + 1,
        width: 45,
      },
      {
        title: t("Subject"),
        render: (e) => <span className='text-blue-600 cursor-pointer' onClick={() => { setActtiveSubject(e?.subject_id) }} >{e?.subject_name}</span>,
      },
      {
        title: t("Sababli(soat)"),
        render: (e) => <span style={{ opacity: e?.cause ? 1 : 0.25 }} >{Number(e?.cause) * 2}</span>,
        align: "center",
      },
      {
        title: t("Sababsiz(soat)"),
        render: (e) => <span style={{ opacity: e?.uncause ? 1 : 0.25 }} >{Number(e?.uncause) * 2}</span>,
        align: "center",
      },
      {
        title: t("Umumiy(soat)"),
        render: (e) => <span style={{ opacity: e?.count ? 1 : 0.25 }} >{Number(e?.count) * 2}</span>,
        align: "center",
      },
    ],
    [data?.items]
  );

  const attend_columns: ColumnsType<IAttend> = React.useMemo(
    () => [
      {
        title: t("Date"),
        render: (_, e, i) => <span>{i + 1}.&nbsp;{e?.date}&nbsp;&nbsp;<span className='text-black text-opacity-40' >({e?.subjectCategory?.name}) {e?.timeTableDate?.para?.name} / {e?.timeTableDate?.week?.name}</span></span>,
      },
      {
        title: t("Status"),
        render: (e) => e?.reason ? <Tag color='success' >Sababli</Tag> : <Tag color='error' >Sababsiz</Tag>,
        align: "right"
      },
    ],
    [subject_attends]
  );

  return (
    <div className="">
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: '/' },
          { name: "Students", path: '/students' },
          { name: `${data?.items?.length ? `${data?.items[0]?.student?.profile?.last_name} ${data?.items[0]?.student?.profile?.first_name} ${data?.items[0]?.student?.profile?.middle_name}` : t("Student view")}`, path: `/students/view/${student_id}` },
          { name: `Student attends`, path: `/students/${student_id}/attends` },
        ]}
        title={t(`Student attends`)}
        isBack={true}
      />

      <div className="flex justify-end items-center p-4">
        <span className="text-black text-opacity-40 text-sm font-normal leading-snug max-sm:hidden">Semestr:</span>&nbsp;&nbsp;
        <Segmented
          value={urlValue.filter?.semestr_id}
          options={(studentGroups?.items ?? [])?.sort((a: any, b: any) => a?.semestr_id - b?.semestr_id)?.map(e => ({ label: e?.semestr_id, value: e?.semestr_id }))}
          onChange={(e) => { writeToUrl({ name: "semestr_id", value: e }) }}
        />
      </div>

      <div className="px-6 pt-3">
        <Table
          columns={subject_columns}
          dataSource={subject_attends}
          pagination={false}
          loading={isFetching}
          size="middle"
          className="mt-3"
          rowClassName="py-[12px]"
          scroll={{ x: 576 }}
        />
      </div>

      <Drawer
        title={
          <div className="flex items-center justify-between">
            <TitleModal>{"Qoldirilgan darslar"}</TitleModal>
            <IoClose
              onClick={() => setActtiveSubject(undefined)}
              className="text-[24px] cursor-pointer text-[#00000073]"
            />
          </div>
        }
        open={!!acttiveSubject}
        onClose={() => setActtiveSubject(undefined)}
        closable={false}
        placement="right"
        width={globalConstants.antdDrawerWidth}
        headerStyle={{ backgroundColor: "#F7F7F7" }}
        footerStyle={{ boxShadow: 'inset 0px 1px 0px #F0F0F0' }}
      >
        <div className="w-[432px] text-black text-opacity-90 text-xl font-medium leading-7">{subject_attends?.find(e => e?.subject_id === acttiveSubject)?.subject_name}</div>
        <Table
          columns={attend_columns}
          dataSource={subject_attends?.find(e => e?.subject_id === acttiveSubject)?.attends}
          pagination={false}
          loading={isFetching}
          size="small"
          className="mt-3"
          showHeader={false}
        />
      </Drawer>

    </div>
  );
};

export default StudentAttends;