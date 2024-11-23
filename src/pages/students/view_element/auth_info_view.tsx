import { FormInstance} from "antd";
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import UserStatusBadge from "components/StatusTag/userStatusTagView";
import { CLIENT_API } from "services/client.request";
import ViewInput from "components/ViewInput";

interface DataType {
  name: string;
  value: ReactNode;
}

type TypeAuthInfoView = {
  data: any,
  form: FormInstance,
  saveMutation: UseMutationResult<any, AxiosError<any, any>, void, unknown>,
  user_id: number | string,
}

const AuthInfoView: React.FC<TypeAuthInfoView> = ({ data, form, saveMutation, user_id }) => {

  const { t } = useTranslation();
  const [password, setpassword] = useState<string>('');

  const passwordView = () => {
    if (!password) {
      CLIENT_API.getOne({ url: `passwords/${user_id}` }).then((res: any) => {
        setpassword(res?.data?.password)
      })
    }
  }

  const tableDataforInputs: DataType[] = [
    {
      name: t("Username (Login)"),
      value: data?.user?.username ? <span className="selected-text">{data?.user?.username}</span> : "-"
    },
        {
      name: t("Password"),
      value: <>
        <span className="inline-block mr-2 selected-text" >{password ? password : '**********'}</span> <a href="#" onClick={passwordView}>{t("Show password")}</a>
      </>,
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
    </div>
  )
}
export default AuthInfoView;