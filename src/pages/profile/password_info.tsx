import { ReactNode,useState } from "react";
import { Button, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import UserStatusBadge from "components/StatusTag/userStatusTagView";
import { CLIENT_API } from "services/client.request";
import UpdatePassword from "./change_password";
import checkPermission from "utils/check_permission";

interface DataType {
    name: string;
    value: ReactNode;
    value2?: ReactNode;
    value3?: ReactNode;
}

const PasswordInfo = ({data} : {data: any}) => {

    const { t } = useTranslation();
    const [password, setpassword] = useState<string>('');
    const [isOpenForm, setisOpenForm] = useState<boolean>(false);
    const [id, setId] = useState<number | undefined>();

    const sharedOnCell = (_: DataType, index: number | undefined) => {
        if(index || index == 0 ){
            if (index < 2) {
                return { colSpan: 0, rowSpan: 0 };
            }
        }
        return {};
    };

    const passwordView = () => {
      if(!password){
        CLIENT_API.getOne({ url:  `passwords/${data?.profile?.id}` }).then((res: any) => {
          setpassword(res?.data?.password)
        })
      }
    }

    const columns: ColumnsType<DataType> = [
        {
          title: t("Surname"),
          dataIndex: "name",
          rowScope: "row",
        },
        {
          title: t("Value"),
          dataIndex: "value",
          onCell: (_, index) => ({
            colSpan: (index == 0 || index == 1 ) ? 3 : 1
          }),
        },
        {
          title: t("Name2"),
          dataIndex: "value2",
          onCell: (_, index) => sharedOnCell(_, index),
          className: "bg-[#FAFAFA]"
        },
        {
          title: t("Name3"),
          dataIndex: "value3",
          onCell: (_, index) => sharedOnCell(_, index),
        },
    ];

    const tableData: DataType[] = [
      {
        name: t("Username (Login)"),
        value: <span className="selected-text">{data?.username}</span>
      },
      // {
      //   name: t("Password"),
      //   value: <><span className="inline-block mr-2 selected-text">{password ? password : '**********'}</span> <a href="#" onClick={passwordView}>{t("Show password")}</a></>,
      // },
      {
        name: t("Roles"),
        value: data?.role?.map((role: string) => <Tag key={role} bordered={false}>{role}</Tag>)
      },
	  {
        name: t("Status"),
        value: <UserStatusBadge status={data?.status} />,
        value2: t("Last login"),
        value3: data?.lastIn?.created_on ? data?.lastIn?.created_on : t("Unaccounted!")
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
			{/* <p>
			  <span className="text-gray-400">{t("Login")}: </span>
			  {data?.createdBy?.username}
			</p> */}
			<time>
			  <span className="text-gray-400">{t("Date")}: </span>
			  {data?.createdAt}
			</time>
		  </div>
		),
		value2: t("UpdateBy"),
		value3: (
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
			{/* <p>
			  <span className="text-gray-400">{t("Login")}: </span>
			  {data?.updatedBy?.username}
			</p> */}
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
            <Table
                columns={columns}
                bordered
                dataSource={tableData}
                showHeader={false}
                pagination={false}
            />
            <UpdatePassword id={data?.user_id} setisOpenForm={setisOpenForm} isOpenForm={isOpenForm} setId={setId} />
        </div>
    )
}
export default PasswordInfo;