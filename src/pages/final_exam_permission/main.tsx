import { FC } from "react";
import FinalExamPermission from ".";
import TeacherStudentExamPermission from "./teacher_student_mark";
import { useAppSelector } from "store";

const MainFinalExamPermission: FC = (): JSX.Element => {
  const role = useAppSelector(state => state.auth.user?.active_role); 

  if (role === "teacher") {
    return <TeacherStudentExamPermission />
  }

  return <FinalExamPermission />
}

export default MainFinalExamPermission;