import React, {  } from 'react';
import { PersonFilled } from "@fluentui/react-icons";
import { useTranslation } from 'react-i18next';
import { Tag } from 'antd';

const Notifications: React.FC = (): JSX.Element => {
  const {t} = useTranslation();

  return (
    <>
            <h4 className="mb-3">{t("Appeals")}</h4>

            <div className="box h_36 p-4 e-card-shadow flex justify-between items-center mb-3" style={{height:'auto'}}>
              <div className="flex items-center">
                <img src="https://www.wilsoncenter.org/sites/default/files/styles/large/public/media/images/person/james-person-1.jpg" alt="person" className="w-11 h-11 rounded-full" />
                <span className="text-gray-400 ml-2">John Adams</span>
              </div>
              <div className="flex items-center">
                <PersonFilled fontSize={18} color="#D6E4FF"/>
                <span className="text-gray-400 ml-1">Male</span>
              </div>
              <span className="text-gray-400">Teacher</span>
              <Tag className="bg-[#D6E4FF] text-sm hover:cursor-pointer py-1 px-2  hover:bg-[#D6E4FF] hover:text-blue-400" color="processing">{t("View message")}</Tag>
            </div>

            <div className="box h_36 p-4 e-card-shadow flex justify-between items-center mb-3" style={{height:'auto'}}>
              <div className="flex items-center">
                <img src="https://engineering.unl.edu/images/gradstudents/Screenshot%202023-01-05%20at%209.35.33%20AM.png" alt="person" className="w-11 h-11 rounded-full" />
                <span className="text-gray-400 ml-2">Mary Adams</span>
              </div>
              <div className="flex items-center">
                <PersonFilled fontSize={18} color="#D6E4FF"/>
                <span className="text-gray-400 ml-1">Famale</span>
              </div>
              <span className="text-gray-400">Mentor</span>
              <Tag className="bg-[#D6E4FF] text-sm hover:cursor-pointer py-1 px-2  hover:bg-[#D6E4FF] hover:text-blue-400" color="processing">{t("View message")}</Tag>
            </div>

            <div className="box h_36 p-4 e-card-shadow flex justify-between items-center mb-3" style={{height:'auto'}}>
              <div className="flex items-center">
                <img src="https://www.vhv.rs/dpng/d/124-1246728_stock-photography-businessperson-small-business-management-business-man.png" alt="person" className="w-11 h-11 rounded-full" />
                <span className="text-gray-400 ml-2">Jack Lion</span>
              </div>
              <div className="flex items-center">
                <PersonFilled fontSize={18} color="#D6E4FF"/>
                <span className="text-gray-400 ml-1">Male</span>
              </div>
              <span className="text-gray-400">Admin</span>
              <Tag className="bg-[#D6E4FF] text-sm hover:cursor-pointer py-1 px-2  hover:bg-[#D6E4FF] hover:text-blue-400" color="processing">{t("View message")}</Tag>
            </div>

            <div className="box h_36 p-4 e-card-shadow flex justify-between items-center mb-3" style={{height:'auto'}}>
              <div className="flex items-center">
                <img src="https://engineering.unl.edu/images/gradstudents/Screenshot%202023-01-05%20at%209.35.33%20AM.png" alt="person" className="w-11 h-11 rounded-full" />
                <span className="text-gray-400 ml-2">Mary Adams</span>
              </div>
              <div className="flex items-center">
                <PersonFilled fontSize={18} color="#D6E4FF"/>
                <span className="text-gray-400 ml-1">Famale</span>
              </div>
              <span className="text-gray-400">Mentor</span>
              <Tag className="bg-[#D6E4FF] text-sm hover:cursor-pointer py-1 px-2  hover:bg-[#D6E4FF] hover:text-blue-400" color="processing">{t("View message")}</Tag>
            </div>

            <div className="box h_36 p-4 e-card-shadow flex justify-between items-center mb-3" style={{height:'auto'}}>
              <div className="flex items-center">
                <img src="https://www.wilsoncenter.org/sites/default/files/styles/large/public/media/images/person/james-person-1.jpg" alt="person" className="w-11 h-11 rounded-full" />
                <span className="text-gray-400 ml-2">John Adams</span>
              </div>
              <div className="flex items-center">
                <PersonFilled fontSize={18} color="#D6E4FF"/>
                <span className="text-gray-400 ml-1">Male</span>
              </div>
              <span className="text-gray-400">Teacher</span>
              <Tag className="bg-[#D6E4FF] text-sm hover:cursor-pointer py-1 px-2  hover:bg-[#D6E4FF] hover:text-blue-400" color="processing">{t("View message")}</Tag>
            </div>

        </>
  );
};

export default Notifications;