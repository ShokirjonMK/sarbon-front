import { Spin } from "antd";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import useGetOneData from 'hooks/useGetOneData';
import HeaderUserView from "pages/users/components/vewHeader";
import TimeTableNewViewFirstTab from "./view";
import TimeTableStudentsTransfer from "./students_transfer";
import useBreadCrumb from "hooks/useBreadCrumb";

const TimeTableNewView = () => {
    
  const { t } = useTranslation();

  const {time_table_id} = useParams()

  const timetableQuery = useGetOneData({
      queryKey: ['timetables', time_table_id],
      url: `timetables/${time_table_id}?expand=std.profile,allGroup,allGroup.group,timeTableDate,timeTableDate.user.profile,timeTableDate.building,timeTableDate.room,timeTableDate.para,timeTableDate.week,timeTableDate,timeTableDate.group,subjectCategoryTime,freeHour,secondGroup,secondGroup.timetableDate,secondGroup.timeTableDate.building,secondGroup.timeTableDate.room,secondGroup.timeTableDate.para,secondGroup.timeTableDate.week,secondGroup.timeTableDate.user.profile,secondGroup.std.profile,subject,subjectCategory,faculty,direction,eduPlan,semestr,createdBy,updatedBy`,
      options: {
          refetchOnWindowFocus: false,
          retry: 0,
          enabled: !!time_table_id,
      }
  })

  useBreadCrumb({pageTitle: timetableQuery.data?.data?.subject?.name, breadcrumb: [
    {name: "Home", path: '/'},
    {name: "Time tables", path: `/time-tables-new/${timetableQuery.data?.data?.course_id}/${timetableQuery.data?.data?.edu_form_id}`},
    {name: timetableQuery.data?.data?.subject?.name, path: `/time-tables-new`},
  ]})

  return(
    <Spin spinning={timetableQuery.isLoading} size="small">
      <div>
      <HeaderUserView
            title={timetableQuery.data?.data?.subject?.name}
            isBack={true}
            breadCrumbData={[
                {name: "Home", path: '/'},
                {name: "Time tables", path: `/time-tables-new/${timetableQuery.data?.data?.course_id}/${timetableQuery.data?.data?.edu_form_id}`},
                {name: timetableQuery.data?.data?.subject?.name, path: `/time-tables-new`},
            ]}
            tabs={[
              {
                key: "time-table",
                label: t("Dars jadval"),
                children: <TimeTableNewViewFirstTab timetableQuery={timetableQuery} />
              },
              timetableQuery.data?.data?.two_group ? 
              {
                key: "group-student",
                label: t("Talabalar taqsimoti"),
                children: <TimeTableStudentsTransfer data={timetableQuery.data} isLoading={timetableQuery.isLoading} refetch={timetableQuery.refetch} />
              } : {} as any,
            ]}
        />
      </div>
    </Spin>
  )
}
export default TimeTableNewView;