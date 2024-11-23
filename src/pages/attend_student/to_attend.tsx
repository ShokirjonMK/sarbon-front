import React, { } from 'react';
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { useParams } from 'react-router-dom';
import useGetOneData from 'hooks/useGetOneData';
import AttendanceTable from 'pages/attendance/attendance_table';

const ToAttend: React.FC = (): JSX.Element => {
  const { time_table_id } = useParams();

  const { data, isFetching, refetch } = useGetOneData({
    queryKey: ["time-table", time_table_id],
    url: `time-tables/${time_table_id}?expand=student,student.profile,student.group,attendanceDates,week,subject,subjectCategory,teacherAccess,para,now,group,patok.group`,
    urlParams: {
      "per-page": 0,
      // filter: { week_id: activeWeek }
    },
    options: {
      enabled: !!time_table_id,
    }
  });

  // / ${data?.data?.teacherAccess?.teacher?.first_name} ${data?.data?.teacherAccess?.teacher?.last_name}
  return (
    <div className="">
      <HeaderExtraLayout title={`${data?.data?.week?.name} / ${data?.data?.para?.start_time} - ${data?.data?.para?.end_time} / ${data?.data?.subjectCategory?.name} / ${data?.data?.subject?.name}`} isBack
        breadCrumbData={[
          { name: "Home", path: '/' },
          { name: "Attend", path: `time_table/${time_table_id}to_attend` }
        ]}
      // btn={<CreateBtn onClick={() => {}} permission={" attend_create"} />}
      />
      <div className="px-2">
        <AttendanceTable data={data?.data} refetch={refetch} isFetching={isFetching} teacher={true} />
      </div>
    </div>
  );
};

export default ToAttend;


/**
  *  attend_index
  *  attend_delete
  *  attend_update
  *  attend_view
*/