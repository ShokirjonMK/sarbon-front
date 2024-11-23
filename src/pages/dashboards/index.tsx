import { FC } from "react";
import AdminDashboard from "./dashboards/admin";
// import TeacherDashboard from "./dashboards/teacher";
import OtherDashboard from "./dashboards/other";
import { useAppSelector } from "store";
import './style.scss'
import DeanDashboard from "./dashboards/dean";
import MudirDashboard from "./dashboards/mudir";
import TeacherDashboard from "./dashboards/new_teacher";
import useBreadCrumb from "hooks/useBreadCrumb";

const Dashboard: FC = (): JSX.Element => {
  
  const role = useAppSelector(state => state.auth.user?.active_role); 

  useBreadCrumb({pageTitle: "Home", breadcrumb: [
    {name: "Home", path: '/'},
  ]})

  if (role === "admin" || role === "edu_admin" || role === "rector" || role === "prorector") {
    return <AdminDashboard />
  }

  if (role === "teacher") {
    return <TeacherDashboard />
  }

  if (role === "dean") {
    return <DeanDashboard />
  }

  if (role === "mudir") {
    return <MudirDashboard />
  }

  return <OtherDashboard />
}

export default Dashboard;