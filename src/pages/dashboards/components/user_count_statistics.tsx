import React from 'react';
import { Avatar, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { FaChalkboardTeacher, FaUserGraduate, FaUsers } from 'react-icons/fa';

const UserCountStatistika: React.FC = (): JSX.Element => {
  const {t} = useTranslation();

  return (
    <div className="grid grid-cols-12 gap-6">
        <div className=" xl:col-span-3 md:col-span-6 col-span-12 ">
          <div className="box p-4 e-card-shadow bg-white rounded-2xl">
            <div className='flex gap-5'>
              <Avatar style={{ backgroundColor: '#36cfc9' }} size={64} icon={<FaUsers />} />
              <div>
                <h4 className="text-[#C0C0C0] mb-2 font-medium">{t("Jami talabalar soni")}</h4>
                <h2 className="text-4xl font-bold">556</h2>
              </div>
            </div>
          </div>
        </div>

        <div className=" xl:col-span-3 md:col-span-6 col-span-12 ">
          <div className="box p-4 e-card-shadow bg-white rounded-2xl">
            <div className='flex gap-5'>
              <Avatar style={{ backgroundColor: '#597ef7' }} size={64} icon={<FaUserGraduate /> } />
              <div>
                <h4 className="text-[#C0C0C0] mb-2 font-medium">{t("Magistr talabalar soni")}</h4>
                <h2 className="text-4xl font-bold">0</h2>
              </div>
            </div>
          </div>
        </div>

        <div className=" xl:col-span-3 md:col-span-6 col-span-12">
          <div className="box p-4 e-card-shadow bg-white rounded-2xl">
            <div className='flex gap-5'>
              <Avatar style={{ backgroundColor: '#b37feb' }} size={64} icon={<FaUsers /> } />
              <div>
                <h4 className="text-[#C0C0C0] mb-2 font-medium">{t("Sirtqi talabalar soni")}</h4>
                <h2 className="text-4xl font-bold">447</h2>
              </div>
            </div>
          </div>
        </div>

        <div className=" xl:col-span-3 md:col-span-6 col-span-12">
          <div className="box p-4 e-card-shadow bg-white rounded-2xl">
            <div className='flex gap-5'>
              <Avatar style={{ backgroundColor: '#faad14' }} size={64} icon={<FaChalkboardTeacher /> } />
              <div>
                <h4 className="text-[#C0C0C0] mb-2 font-medium">{t("O'qituvchilar soni")}</h4>
                <h2 className="text-4xl font-bold">47</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default UserCountStatistika;