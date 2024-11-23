import { FC } from "react";
import StudentMarks from ".";
import TeacherStudentMarks from "./teacher_student_mark";
import { useAppSelector } from "store";

const MainStudentMark: FC = (): JSX.Element => {
  const role = useAppSelector(state => state.auth.user?.active_role); 

  if (role === "teacher") {
    return <TeacherStudentMarks />
  }

  return <StudentMarks />
}

export default MainStudentMark;