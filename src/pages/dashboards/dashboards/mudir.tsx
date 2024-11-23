import React from "react";
import TeacherStatistics from "../components/teacher_statistics";

const MudirDashboard : React.FC = () : JSX.Element => {
  return(
    <div className="dashboard bg-[#F7F7F7] min-h-full p-3">
      

    <div className="grid grid-cols-12 gap-4">
      <div className="xl:col-span-12 md:col-span-12 col-span-12">
        <div className="mt-4">
          <TeacherStatistics />
        </div>
      </div>
    </div>

  </div>
  )
}

export default MudirDashboard