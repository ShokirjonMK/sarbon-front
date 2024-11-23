import { ReactNode,useState } from "react";
import { Button, Tag } from "antd";
import { useTranslation } from "react-i18next";
import UserStatusBadge from "components/StatusTag/userStatusTagView";
import UpdatePassword from "./change_password";
import checkPermission from "utils/check_permission";
import ViewInput from "components/ViewInput";

interface DataType {
    name: string;
    value: ReactNode;
}

const PasswordInfo = ({data} : {data: any}) => {

    const { t } = useTranslation();
    const [isOpenForm, setisOpenForm] = useState<boolean>(false);
    const [id, setId] = useState<number | undefined>();

    
    const tableDataforInputs: DataType[] = [
      {
        name: t("Username (Login)"),
        value: <span className="selected-text">{data?.username}</span>
      },
      {
        name: t("Roles"),
        value: data?.role?.map((role: string) => <Tag key={role} bordered={false}>{role}</Tag>)
      },
	  {
        name: t("Status"),
        value: <UserStatusBadge status={data?.status} />,
      },
      {
        name: t("Last login"),
        value: data?.lastIn?.created_on ? data?.lastIn?.created_on : t("Unaccounted!"),
      },
	  {
		name: t("CreatedBy"),
		value: (
		  <div>
			<span className="text-gray-400">
			  {t("name")}/{t("Last Name")}/{t("Role")} :{" "}
			</span>
			{data?.createdBy?.first_name} {data?.createdBy?.last_name}{" "}
			(
			{data?.createdBy?.role.map((item: string) => {
			  return item;
			})}
			)
			<time>
			  <span className="text-gray-400">{t("Date")}: </span>
			  {data?.createdAt}
			</time>
		  </div>
		)
	  },
    {
      name: t("UpdateBy"),
      value:  (
        <div>
        <span className="text-gray-400">
          {t("name")}/{t("Last Name")}/{t("Role")} :{" "}
        </span>
        {data?.updatedBy?.first_name} {data?.updatedBy?.last_name}{" "}
        (
        {data?.updatedBy?.role.map((item: string) => {
          return item;
        })}
        )
        <time>
          <span className="text-gray-400">{t("Date")}: </span>
          {data?.updatedAt}
        </time>
        </div>
      ),
      },
    ];

    return (
        <div className="px-[24px] pt-[15px] pb-[10px]">
            <div className="flex justify-between items-center mb-[12px]">
                <p className="font-medium text-[16px]">{t("Login information")}</p>
                {
                  checkPermission('password_update') ? (
                    <Button onClick={() => setisOpenForm(true)}>{t('Change password')}</Button>
                  ) : null
                }
            </div>
            <div className="grid grid-cols-3 gap-4">
              {
                tableDataforInputs?.map((item, index) => (
                  <ViewInput
                    key={index}
                    label={item?.name} 
                    value={item?.value} 
                    placeholder={item?.name}
                  />
                ))
              }
            </div>
            <UpdatePassword id={data?.user_id} setisOpenForm={setisOpenForm} isOpenForm={isOpenForm} setId={setId} />
        </div>
    )
}
export default PasswordInfo;