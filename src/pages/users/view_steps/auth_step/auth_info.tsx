import { Button, Form, FormInstance, Modal, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import AuthElements from "pages/users/form_elements/auth_elements";
import UserStatusBadge from "components/StatusTag/userStatusTagView";
import { CLIENT_API } from "services/client.request";
import { useParams } from "react-router-dom";
import checkPermission from "utils/check_permission";
import ViewInput from "components/ViewInput";

interface DataType {
    name: string;
    value: ReactNode;
    value2?: ReactNode;
    value3?: ReactNode;
}

const AuthInfoUserView = ({data, form, saveMutation} : {data: any, form: FormInstance, saveMutation: UseMutationResult<any, AxiosError<any, any>, void, unknown>}) => {

    const { t } = useTranslation();
    const { user_id } = useParams();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [password, setpassword] = useState<string>('');

    const sharedOnCell = (_: DataType, index: number | undefined) => {
        if(index || index == 0){
            if (index < 3) {
                return { colSpan: 0, rowSpan: 0 };
            }
        }
        return {};
    };

    const passwordView = () => {
      if(!password){
        CLIENT_API.getOne({ url:  `passwords/${user_id}` }).then((res: any) => {
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
            colSpan: (index == 0 || index == 1 || index == 2) ? 3 : 1
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
      {
        name: t("Password"),
        value: <><span className="inline-block mr-2 selected-text">{password ? password : '**********'}</span> <a href="#" onClick={passwordView}>{t("Show password")}</a></>,
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
      }
    ];

    const tableData2: DataType[] = [
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
          <time className="block">
            <span className="text-gray-400">{t("Date")}: </span>
            {data?.createdAt}
          </time>
          </div>
        )
      },
      {
        name: t("UpdateBy"),
        value: (
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
          <time className="block">
            <span className="text-gray-400">{t("Date")}: </span>
            {data?.updatedAt}
          </time>
          </div>
        )
      },
    ];

    useEffect(() => {
      if(saveMutation.isSuccess) setIsModalOpen(false)
    }, [saveMutation.isSuccess])

    return (
        <div className="px-[24px] pt-[15px] pb-[10px]">
            <div className="flex justify-between items-center mb-[12px]">
                <p className="font-medium text-[16px]">{t("Login information")}</p>
                { checkPermission("user_update") ? <Button onClick={() => setIsModalOpen(true)}>{t("Edit")}</Button> : null}
            </div>

            <div className="grid xl:grid-cols-3 grid-cols-2 gap-x-4">
              {
                tableData?.map((item, index) => (
                  <ViewInput
                    key={index}
                    label={item?.name} 
                    value={item?.value} 
                    placeholder={item?.name}
                  />
                ))
              }
            </div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-4">
              {
                tableData2?.map((item, index) => (
                  <ViewInput
                    key={index}
                    label={item?.name} 
                    value={item?.value} 
                    placeholder={item?.name}
                  />
                ))
              }
            </div>

            {/* edit form */}
            <Modal
              title={t("Login information")}
              okText={t("Submit")}
              cancelText={t("Cancel")}
              width={1000}
              open={isModalOpen}
              onOk={() => form.submit()}
              onCancel={() => setIsModalOpen(false)}
            >
              <Form
                  form={form}
                  name="basic"
                  layout="vertical"
                  onFinish={(values) => saveMutation.mutate(values)}
              >
                  <AuthElements form={form} />
              </Form>
          </Modal>
        </div>
    )
}
export default AuthInfoUserView;