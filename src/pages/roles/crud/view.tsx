
import { Button, Empty, Tag } from "antd";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { IPermission, IRole, IRolePermissions } from "models/role_permissions";
import { useState, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import PermissionCollapse from "./permission_collapse";
import useGetData from "hooks/useGetData";
import { useNavigate, useParams } from "react-router-dom";
import useGetOneData from "hooks/useGetOneData";
import Table, { ColumnsType } from "antd/es/table";
import DeleteData from "components/deleteData";

interface DataType {
    name: string;
    value: ReactNode;
    value2?: ReactNode;
    value3?: ReactNode;
}

const RoleView = () => {
    
    const { t } = useTranslation();
    const navigate = useNavigate()
    const {role_name} = useParams()
    const [checkedPermissions, setcheckedPermissions] = useState<string[]>()
    const [defaultVals, setdefaultVals] = useState<IRolePermissions[]>()
    
    const sharedOnCell = (_: DataType, index: number | undefined) => {
      if(index || index == 0){
        if (index < 3) {
            return { colSpan: 0 };
        }
      }
      return {};
    };

    const { data } = useGetOneData<IRole>({
        queryKey: ['roles', role_name],
        url: `roles/${role_name}/permissions?expand=permissions,parent,child,createdBy,updatedBy`,
        options: {
            onSuccess: (res) => {
                setdefaultVals(res?.data?.permissions)
            },
            refetchOnWindowFocus: false,
            retry: 1,
            enabled: (!!role_name && role_name != '0'),
        }
    })
    
      const columns: ColumnsType<DataType> = [
        {
          title: t("Name"),
          dataIndex: "name",
          rowScope: "row",
        },
        {
          title: t("Value"),
          dataIndex: "value",
          onCell: (_, index) => ({
            colSpan: (index == 4 || index == 3) ? 1 : 3,
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
          name: t("Name"),
          value: data?.data?.name
        },
        {
          name: t("Description"),
          value: data?.data?.description,
        },
        {
          name: t("Type"),
          value: data?.data?.category,
        },
        {
          name: t("Parent roles"),
          value: data?.data?.parent?.map(i => <Tag>{i?.parent}</Tag>),
          value2: t("Child roles"),
          value3: data?.data?.child?.map(i => <Tag>{i?.child}</Tag>),
        },
        // {
        //   name: t("CreatedBy"),
        //   value: (
        //     <div>
        //       <span className="text-gray-400">
        //         {t("name")}/{t("Last Name")}/{t("Role")} :{" "}
        //       </span>
        //       {data?.data?.createdBy?.first_name} {data?.data?.createdBy?.last_name}{" "}
        //       (
        //       {data?.data?.createdBy?.role.map((item: string) => {
        //         return item;
        //       })}
        //       )
        //       <p>
        //         <span className="text-gray-400">{t("Login")}: </span>
        //         {data?.data?.createdBy?.username}
        //       </p>
        //       <time>
        //         <span className="text-gray-400">{t("Date")}: </span>
        //         {data?.data?.created_at}
        //       </time>
        //     </div>
        //   ),
        //   value2: t("UpdateBy"),
        //   value3: (
        //     <div>
        //       <span className="text-gray-400">
        //         {t("name")}/{t("Last Name")}/{t("Role")} :{" "}
        //       </span>
        //       {data?.data?.updatedBy?.first_name} {data?.data?.updatedBy?.last_name}{" "}
        //       (
        //       {data?.data?.updatedBy?.role.map((item: string) => {
        //         return item;
        //       })}
        //       )
        //       <p>
        //         <span className="text-gray-400">{t("Login")}: </span>
        //         {data?.data?.updatedBy?.username}
        //       </p>
        //       <time>
        //         <span className="text-gray-400">{t("Date")}: </span>
        //         {data?.data?.updated_at}
        //       </time>
        //     </div>
        //   )
        // }
      ];

    const { data: permissions } = useGetData<IPermission>({
        queryKey: ["permissions"],
        url: "permissions",
        options: { staleTime: Infinity, refetchOnWindowFocus: false, retry: 1 },
    });    
    


    return(
        <div>
            <HeaderExtraLayout 
                title={data?.data?.name ? data?.data?.name : t("Role view")}
                isBack={true}
                breadCrumbData={[
                    {name: "Home", path: '/'},
                    {name: "Roles", path: '/roles'},
                    {name: data?.data?.name ? data?.data?.name : t("Role view"), path: '/roles'}
                ]}
                btn={
                    <div className="flex">
                        <DeleteData permission={'access-control_delete-role'} refetch={() => {}} url={"roles"} id={String(role_name)} navigateUrl='/roles'>
                          <Button danger >{t("Delete")}</Button>
                        </DeleteData>
                        <Button onClick={() => navigate(`/roles/update/${data?.data?.name}`)} className="ml-3">{t("Edit")}</Button>
                    </div>
                } />
            <div className="px-[24px] py-[20px]">
                <div className="table-none-hover">
                    <Table
                        columns={columns}
                        bordered
                        dataSource={tableData}
                        showHeader={false}
                        pagination={false}
                    />
                </div>
                {
                  data?.data?.permissions?.length === 0 ? <Empty className="mt-[40px]" description="Permission not attached !" /> : ""
                }
                <PermissionCollapse permissions={permissions} setcheckedPermissions={setcheckedPermissions} defaultVals={defaultVals} type="view" />
            </div>
        </div>
    )
}
export default RoleView;