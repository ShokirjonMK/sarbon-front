import { FC } from "react";
import { useTranslation } from "react-i18next";
import UserCountStatistika from "../components/user_count_statistics";
import FacultyStatistcs from "../components/faculty_statistcs";
import '../style.scss'
import { Pie } from "@ant-design/charts";
import { Fade } from "react-awesome-reveal";

const AdminDashboard: FC = (): JSX.Element => {
  const { t } = useTranslation();

  const config = {
    data: [
      { type: 'Qatnashganlar', talabalar: 85 },
      { type: 'Qatnashganlaar', talabalar: 85 },
      { type: 'Sababli', talabalar: 10 },
      { type: 'Sababsiz', talabalar: 5 },
    ],
    angleField: 'talabalar',
    colorField: 'type',
    paddingRight: 80,
    innerRadius: 0.6,
    label: {
      text: 'talabalar',
      style: {
        fontWeight: 'bold',
      },
    },
    legend: {
      color: {
        title: false,
        position: 'right',
        rowPadding: 5,
      },
    },
    annotations: [
      {
        type: 'text',
        style: {
          text: 'Davomat',
          x: '50%',
          y: '50%',
          textAlign: 'center',
          fontSize: 40,
          fontStyle: 'bold',
        },
      },
    ],
  };

  return (
    <div className="dashboard bg-[#F4F7F9] min-h-full p-6">
      <Fade damping={1} duration={5 * 100} direction='down'>
        <UserCountStatistika />
      </Fade>
      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="lg:col-span-4 col-span-12">
          <Fade damping={1} duration={5 * 100} direction='left'>
            <div className="bg-white rounded-2xl">
              <Pie {...config} />
            </div>
          </Fade>
        </div>
        <div className="lg:col-span-8 col-span-12">
          <div className="lg:col-span-6 col-span-12">
            <Fade damping={1} duration={5 * 100} direction='right'>
              <FacultyStatistcs />
            </Fade>
          </div>
        </div>

      </div>
    </div>
  )
}

export default AdminDashboard;