import React, { FC, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { prived_routes, public_routes } from "routes";
import { useAppDispatch, useAppSelector } from "store";
import checkPermission from "utils/check_permission";
import { Menu, MenuProps, Tag } from "antd";
import IconComponent from "components/Icon";
import { TypeRoutes } from "routes/types";
import logo from "assets/images/sarbon_wh_logo.svg";
import logoKv from "assets/images/sarbon_icon_wt.svg";
import { useTranslation } from "react-i18next";
import './style.scss';
import checkOnlyForRoles from "utils/check_only_for_roles";
import checkAllowedRole from "utils/check_allowed_roles";
import { FaChevronRight } from "react-icons/fa";
import { changeSidebar } from "store/ui";
import { PiSquaresFour } from "react-icons/pi";

type MenuItem = Required<MenuProps>['items'][number];

const SidebarByAntMenu: FC = (): JSX.Element => {

  const dispatch = useAppDispatch();

  const { t, i18n } = useTranslation();
  const location = useLocation()
  const { auth, ui } = useAppSelector(state => state);
  const [ishoverSidebar, setisHoverSidebar] = useState<boolean>(false)
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const navigate = useNavigate()

  const selectTheme = React.useMemo(() => {
    if (ui.sidebar === "large") return "small";
    if (ui.sidebar === "small") return "large";
    return "large"
  }, [ui.sidebar]);


  const createMenuItems = (data: TypeRoutes[]) => {
    const items: MenuProps['items'] = [];
    data.forEach(item => {
      const childItems: MenuItem[] = []
      if ((checkPermission(item.config.permission) || item.config.permission === "*") && item.config.isMenu) {
        if (item?.submenu?.length) {
          item.submenu.forEach(childItem => {
            if(childItem.config?.for_roles?.length){
              if(checkOnlyForRoles(childItem.config?.for_roles)){
                if ((checkPermission(childItem.config.permission) || childItem.config.permission === "*") && childItem.config.isMenu)
                  childItems.push({
                    key: childItem.path.split("/")[1],
                    className: "sarbon-sidebar-menu",
                    onClick: () => navigate(childItem?.path),
                    label: <Link to={childItem?.path} className="sidebar-name font-medium">{t(childItem?.name)}</Link>,
                  })
              }
            } else {
              if(checkAllowedRole(childItem.config?.not_allowed_roles)){
                if ((checkPermission(childItem.config.permission) || childItem.config.permission === "*") && childItem.config.isMenu)
                  childItems.push({
                    key: childItem.path.split("/")[1],
                    className: "sarbon-sidebar-menu",
                    onClick: () => navigate(childItem?.path),
                    label: <Link to={childItem?.path} className="sidebar-name font-medium">{t(childItem?.name)}</Link>,
                  })
              }
            }
          })
        }
        if(item.config?.for_roles?.length){
          if(checkOnlyForRoles(item.config?.for_roles)){
            items.push({
              key: item.path,
              className: "sarbon-sidebar-menu",
              label: !item?.submenu?.length ? <Link to={item.path} className="sidebar-name font-medium">{t(item?.name)}</Link> : <span className="sidebar-name font-medium">{t(item?.name)}</span>,
              icon: IconComponent(item?.config?.icon),
              children: childItems.length ? childItems : undefined,
            })
          }
        } else {
          if(checkAllowedRole(item.config?.not_allowed_roles)){
            items.push({
              key: item.path,
              className: !item?.submenu?.length ? "sarbon-sidebar-menu" : "",
              label: !item?.submenu?.length ? <Link to={item.path} className="sidebar-name font-medium">{t(item?.name)}</Link> : <span className="sidebar-name font-medium">{t(item?.name)}</span>,
              icon: IconComponent(item?.config?.icon),
              children: childItems.length ? childItems : undefined,
            })
          }
        }
      }
    })
    return items
  }

  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey) {
      setOpenKeys([latestOpenKey]);
    } else {
      setOpenKeys([]);
    }
  };

  useEffect(() => {
    onOpenChange([location.pathname])
  }, []);

  const menuItems = React.useMemo(() => {
    if (auth.isAuthenticated) {
      return createMenuItems(prived_routes)
    } else {
      return createMenuItems(public_routes)
    }
  }, [i18n.language, ui.sidebar])  

  let isHoverAndSmall = ui.sidebar === "small" && !ishoverSidebar;

  return (
    <>
      <div onMouseOver={() => setisHoverSidebar(true)} onMouseLeave={() => setisHoverSidebar(false)} className={`container-sidebar-ant sidebar-wrapper p-0 ${ui.sidebar == "small" ? "hover:fixed w-[265px] left-0 top-0 bottom-0 container-sidebar-ant-closed-hover" : ""}`}>
        <div className={`sidebar-logo ${(isHoverAndSmall) ? "small" : "large"}`}>
          <div className={`flex  w-full items-center ${(!isHoverAndSmall) ? "px-[22px] justify-between" : "justify-center"}`} >
            <img src={(isHoverAndSmall) ? logoKv : logo} className={(isHoverAndSmall) ? "" : ""} alt="" />
            {
              (!isHoverAndSmall) && 
              <div className="burger group bg-[#0d3f46] p-[7px] pb-[3px] rounded-[6px] cursor-pointer" onClick={() => dispatch(changeSidebar(selectTheme))}>
                <PiSquaresFour className="text-[23px] group-hover:rotate-[360deg] text-white" style={{transition: "all 0.6s ease-in-out"}} />
              </div>
            }
          </div>
        </div>
        <div className="container-menu mt-[28px] mx-0">
          {!isHoverAndSmall ? <Tag className="ml-5 mb-3 text-sm font-semibold px-2 py-[2px]" color="#0d3f46" >GENERAL</Tag> : ""}
          <Menu
            selectedKeys={[location.pathname, location.pathname.split("/")[1]]}
            defaultOpenKeys={[location.pathname, ...openKeys]}
            openKeys={openKeys}
            items={menuItems}
            mode="inline"
            inlineCollapsed={(isHoverAndSmall)}
            onOpenChange={onOpenChange}
            style={{ width: (isHoverAndSmall) ? "100%" : ""}}
            expandIcon={(e) => <FaChevronRight className={`ml-auto mr-5 transition-all text-[10px] text-[rgba(155,155,155,0.8)] ${(e?.isOpen || e?.isSelected) ? "rotate-90 text-[#fff]" : "rotate-0"}`} />}
          />
        </div>
      </div>
    </>
  )
}

export default React.memo(SidebarByAntMenu)