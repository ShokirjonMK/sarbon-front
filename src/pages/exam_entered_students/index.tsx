import HeaderUserView from "pages/users/components/vewHeader"
import React from "react"
import { useTranslation } from "react-i18next"
import EnteredExamStudents from "./component/entered_students"
import RejectExamStudents from "./component/reject_students"
import ExamMissedStudents from "./component/exam_missed_students"
import { useParams } from "react-router-dom"
import useGetOneData from "hooks/useGetOneData"
import { IFinalExam } from "models/exam"

const ExamEnteredStudents : React.FC = () : JSX.Element => {
  const {t} = useTranslation()
  const {exam_id} = useParams()

  const { data } = useGetOneData<IFinalExam>({
    queryKey: ['exams', exam_id],
    url: `exams/${exam_id}`,
  });
  return(
    <>
      <HeaderUserView
        breadCrumbData={[
          { name: "Home", path: "/" },
          { name: `Yakuniy nazorat (${data?.data?.name})`, path: `/final-exam-controls/view/${exam_id}` },
          { name: "Exam students", path: "" },
        ]}
        title={t(`Exam students`)}
        isBack={true}
        btn={
          <div></div>
        }
        tabs={[
          {
            key: "exam-entered-students",
            label: t("Exam entered students"),
            children:<>
              <EnteredExamStudents/>
            </>
          },
          {
            key: "reject-exam-students",
            label: t("Reject exam students"),
            children:<>
              <RejectExamStudents/>
            </>
          },
          {
            key: "missed-exam-students",
            label: t("Missed exam students"),
            children:<>
              <ExamMissedStudents/>
            </>
          },
        ]}
      />
    </>
  )
}

export default ExamEnteredStudents