import { ArrowLeft20Filled } from "@fluentui/react-icons";
import { Tabs, TabsProps } from "antd";
import CustomBreadcrumb from "components/Breadcrumb";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

type THeaderProps = {
  title: string,
  btn?: React.ReactNode,
  breadCrumbData?: Array<{
    name: string,
    path: string
  }>,
  isBack?: boolean,
  menuType?: "menu" | 'tab',
  tabs?: TabsProps['items']
}

const HeaderUserView: FC<THeaderProps> = ({ title, btn, breadCrumbData, isBack = false, menuType = "menu", tabs }): JSX.Element => {

  const navigate = useNavigate()
  const { urlValue, writeToUrl } = useUrlQueryParams({});

  const initialBreadCrumbData = [
    {
      name: "Home",
      path: "/"
    },
    {
      name: title,
      path: "/"
    },
  ]

  return (
    <div className={`${menuType == "menu" ? "pb-[22px]" : "pb-[8px]"} m-6  rounded-2xl e-card-shadow bg-white`} >
        <div className="pt-[16px] px-[24px] ">
            <CustomBreadcrumb arr={breadCrumbData ?? initialBreadCrumbData} />
            <div className="flex justify-between items-center mt-[14px]">
                <div className="flex items-center">
                {
                    isBack ? <ArrowLeft20Filled onClick={() => breadCrumbData?.length ? navigate(breadCrumbData[breadCrumbData?.length - 2]?.path ) : navigate(-1)} className="mr-[18px] cursor-pointer" /> : ""
                }
                <p className="text-[24px] font-bold capitalize">{title}</p>
                </div>
                {btn}
            </div>
        </div>
      <Tabs defaultActiveKey="main-info"  activeKey={urlValue.filter_like['user-block']} onChange={(e) => writeToUrl({name: "user-block", value: e})} tabBarStyle={{  paddingLeft: "24px", paddingTop: "10px" }} items={tabs} />
    </div>
  )
}

export default HeaderUserView