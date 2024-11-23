import { Tabs } from "antd";
import type { TabsProps } from 'antd';
import FinalExamGroups from "./groups";
import { useTranslation } from "react-i18next";
import FinalExamAllotment from "./allotment";
import useGetAllData from "hooks/useGetAllData";
import { useParams } from "react-router-dom";
import { IExamStudent, IFinalExam } from "models/exam";
import checkPermission from "utils/check_permission";

const ExamViewTab = ({examView}: {examView: IFinalExam | undefined}) => {

    const {t} = useTranslation();
    const {id} = useParams()

    const { data: examStudents, refetch } = useGetAllData<IExamStudent>({
      queryKey: ["exam-students", id],
      url: "exam-students?sort=-id&expand=student,student.profile",
      urlParams: { "per-page": 0, filter: {exam_id: id}},
      options: {
        refetchOnWindowFocus: false,
        retry: 0,
        enabled: !!id
      }
    })

    const items: TabsProps['items'] = [
        checkPermission("group_index") ? {
          key: '1',
          label: t('Groups'),
          children: <FinalExamGroups groups={examView?.timeTableGroup} examStudents={examStudents?.items} />,
        } : {} as any,
        examView?.type === 1 ? {
          key: '2',
          label: t('Allotment'),
          children: <FinalExamAllotment examView={examView} examStudents={examStudents?.items} refetch={refetch} />,
        } : {} as any
    ];

    return <Tabs defaultActiveKey="1" items={items} />
}
export default ExamViewTab;