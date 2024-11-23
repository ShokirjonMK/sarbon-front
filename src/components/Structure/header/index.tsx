import React, { FC } from "react";
import { Home16Regular } from '@fluentui/react-icons'
import { Avatar } from "antd";
import { AlertRegular } from "@fluentui/react-icons";
import LanguageDropdown from "./components/selectLanguages";
import "./style.scss";
import UserDropdown from "./components/userDropdown";
import AllowFullScreenButton from "./components/fullscreenButton";
import SearchComponent from "./components/SearchComponent";
import { LuBookmark } from "react-icons/lu";
import { IoMoonOutline } from "react-icons/io5";
import { useAppSelector } from "store";
import CustomBreadcrumbHeader from "components/Breadcrumb/index-header";
import { useTranslation } from "react-i18next";

const Header: FC = (): JSX.Element => {

  const { t } = useTranslation();
  const {pageTitle, breadcrumb} = useAppSelector(state => state.ui);

  return (
    <div className="header-wrapper bg-white">
      <div className="left">
        <div>
          <h4 className="font-bold text-xl text-[#3D434A]">{t(pageTitle)}</h4>
          {/* <div className="flex items-center">
            <Home16Regular /> <span className="text-[rgba(61,67,74,0.9)] font-medium text-sm"><span className="mx-1">/</span>Widgets <span className="mx-1">/</span>General</span> 
          </div> */}
          <CustomBreadcrumbHeader arr={breadcrumb} />
        </div>
      </div>
      <div className="right">
        <SearchComponent />
        <AllowFullScreenButton />
        <Avatar className="cursor-pointer max-md:hidden" size={44} style={{background: "#F4F7F9"}} icon={<AlertRegular className="text-[20px] text-[rgba(61,67,74,0.9)]" />} />
        <Avatar className="cursor-pointer max-md:hidden" size={44} style={{background: "#F4F7F9"}} icon={<LuBookmark className="text-[18px] text-[rgba(61,67,74,0.9)]" />} />
        <Avatar className="cursor-pointer max-md:hidden" size={44} style={{background: "#F4F7F9"}} icon={<IoMoonOutline className="text-[18px] text-[rgba(61,67,74,0.9)]" />} />
        <LanguageDropdown />
        <UserDropdown />
      </div>
    </div>
  )
}

export default React.memo(Header);