import { Tabs, TabsProps } from "antd";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TypeRoutesSubmenu } from "routes/types";
import "./style.scss";
import checkPermission from "utils/check_permission";

const ExtraLayout: FC<{ children: React.ReactNode, menus:TypeRoutesSubmenu[] | undefined, title: string, type: "menu" | "tab" | undefined }> = ({ children, menus, title, type = "menu" }): JSX.Element => {

    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const pathname = window.location.pathname;

    const items = useMemo(() => {
        const data: TabsProps['items'] = [];

        menus?.forEach(item => {
            if(checkPermission(item.config.permission) || item.config.permission === "*"){
                data.push({
                    key: item.path,
                    label: t(item?.name),
                });
            }
       })

       return data
    }, [menus, type])    

    const itemsTab = useMemo(() => {
        const data: TabsProps['items'] = [];

        menus?.forEach(item => {
            if(checkPermission(item.config.permission) || item.config.permission === "*"){
                data.push({
                    key: item?.path,
                    label: <p onClick={() => navigate(item?.path)} className="sidebar-name">{t(item?.name)}</p>,
                });
            }
       })

       return data
    }, [menus, type])

    return (
        <div className="extra-layout content-card pb-0 px-0" >
            <HeaderExtraLayout
                breadCrumbData={[
                    {name: "Home", path: "/"},
                    {name: title, path: "/"},
                ]}
                title={t(title)}
                menuType={type}
                className="p-0 m-0"
            />

            {
                type == "menu" ?
                <div className="flex ">
                    <div className="p-[24px] pr-[16px] min-h-[85vh]" style={{borderRight: "1px solid #F0F0F0", width:"max-content"}}>
                        <p className="font-medium text-[16px] mt-0 mb-[16px]">{t("Categories")}</p>
                        <div className="w-[250px]">
                            {
                                items?.map((item, index) => (
                                    <Link key={index} to={item?.key} className={`sidebar-name no-underline block my-2 py-3 px-4 bg-zinc-50 rounded-md text-black hover:bg-zinc-100 ${item?.key === pathname ? "bg-zinc-200 hover:bg-zinc-200" : ""}`}>{item?.label}</Link>
                                ))
                            }
                        </div>

                    </div>
                    <div className="px-[24px] pt-[20px] w-[100%]" >
                        {children}
                    </div>
                </div> :
                <div className="content-card">
                    <Tabs tabBarStyle={{paddingLeft:"24px"}} activeKey={location.pathname} defaultActiveKey={location.pathname} size="middle" items={itemsTab} />
                    <div className="px-[24px] pt-[0px] w-[100%]" >
                        {children}
                    </div>
                </div>
            }

        </div>
    )
}
export default ExtraLayout;