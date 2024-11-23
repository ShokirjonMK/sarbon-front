import { Button, Form, Input, Select, Spin } from "antd";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import useGetAllData from "hooks/useGetAllData";
import { IPermission, IRole } from "models/role_permissions";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import PermissionCollapse from "./permission_collapse";
import useGetData from "hooks/useGetData";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitRole } from "./request";
import { Notification } from "utils/notification";
import { AxiosError } from "axios";
import { validationErrors } from "utils/validation_error";
import { useNavigate, useParams } from "react-router-dom";
import useGetOneData from "hooks/useGetOneData";

const UpdateRole = () => {

    const {t} = useTranslation();
    const navigate = useNavigate()
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const {role_name} = useParams()
    const pageTitle = (!!role_name && role_name != '0') ? role_name : t("Add new role")
    const [parentRoles, setparentRoles] = useState<string[]>()
    const [childRoles, setchildRoles] = useState<string[]>()
    const [checkedPermissions, setcheckedPermissions] = useState<string[]>()
    const [defaultVals, setdefaultVals] = useState()

    const { data: roles } = useGetAllData<IRole>({
        queryKey: ["roles"],
        url: "roles",
        options: { refetchOnWindowFocus: false, retry: 0 },
    });

    const { data: permissions } = useGetData<IPermission>({
        queryKey: ["permissions"],
        url: "permissions",
        options: { staleTime: Infinity, refetchOnWindowFocus: false, retry: 0 },
    });

    const { mutate, isLoading } = useMutation({
        mutationFn: (newVals) => submitRole(role_name, newVals, checkedPermissions),
        onSuccess: async (res) => {
          queryClient.setQueryData(["roles"], res);
          Notification("success", role_name != "0" ? "update" : "create", res?.message)
          navigate(-1)
        },
        onError: (error: AxiosError) => {
          validationErrors(form, error?.response?.data)
        },
        retry: 0,
      });

      const { isFetching: getIsLoading } = useGetOneData({
        queryKey: ['roles', role_name],
        url: `roles/${role_name}/permissions?expand=permissions,parent,child`,
        options: {
            onSuccess: (res) => {
                const  parents = res?.data?.parent?.map((i: {child: string, parent: string}) => i?.parent)
                const  childs = res?.data?.child?.map((i: {child: string, parent: string}) => i?.child)

                form.setFieldsValue({
                    role: res?.data?.name,
                    description: res?.data?.description,
                    parents,
                    childs,
                })
                setparentRoles(parents)
                setchildRoles(childs)
                setdefaultVals(res?.data?.permissions)
            },
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: (!!role_name && role_name != '0'),
        }
    })


    return(
        <Spin spinning={getIsLoading} size="small">
            <div>
                <HeaderExtraLayout
                    title={pageTitle}
                    isBack={true}
                    breadCrumbData={[
                        {name: "Home", path: '/'},
                        {name: "Roles", path: '/roles'},
                        {name: pageTitle, path: '/roles'}
                    ]}
                />
                <div className="px-[24px] py-[20px]">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={mutate}
                    >
                        <div className="grid grid-cols-12 gap-x-4">
                            <div className="xl:col-span-4 lg:col-span-6 col-span-12">
                                <Form.Item
                                    label={t('Role name')}
                                    name="role"
                                    rules={[{ required: true, message: `${t('Please input role name')}!` }]}
                                >
                                    <Input readOnly={role_name != "0"} />
                                </Form.Item>
                            </div>
                            <div className="col-span-12"></div>
                            <div className="xl:col-span-8 col-span-12">
                                <Form.Item
                                    label={t('Description')}
                                    name="description"
                                    rules={[{ required: true, message: `${t('Please input description')}!` }]}
                                >
                                    <Input.TextArea rows={3} />
                                </Form.Item>
                            </div>
                            <div className="col-span-12"></div>
                            <div className="xl:col-span-4 lg:col-span-6 col-span-12">
                            <Form.Item
                                label={t('Parent roles')}
                                name="parents"
                                tooltip="This is a required field"
                                rules={[{ required: false, message: `${t('Please input type')}!` }]}
                            >
                                <Select
                                    allowClear
                                    onChange={(e) => setparentRoles(e)}
                                    mode="multiple"
                                    options={roles?.items?.map(item => {
                                        return {
                                            value: item?.name,
                                            label: item?.name,
                                            disabled: childRoles?.includes(item?.name)
                                        }
                                    })}
                                />
                            </Form.Item>
                            </div>
                            <div className="xl:col-span-4 lg:col-span-6 col-span-12">
                                <Form.Item
                                    label={t('Child roles')}
                                    name="childs"
                                    tooltip="This is a required field"
                                    rules={[{ required: false, message: `${t('Please input type')}!` }]}
                                >
                                    <Select
                                        allowClear
                                        mode="multiple"
                                        onChange={(e) => setchildRoles(e)}
                                        options={roles?.items?.map(item => {
                                        return {
                                            value: item?.name,
                                            label: item?.name,
                                            disabled: parentRoles?.includes(item?.name)
                                        }
                                    })}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                        <h3>{t("Permissions")}</h3>
                        <PermissionCollapse permissions={permissions} setcheckedPermissions={setcheckedPermissions} defaultVals={defaultVals} type="update" />
                        <div className="flex justify-end fixed bottom-0 right-0 bg-white w-[100%] px-[24px] py-[16px] shadow-2xl">
                            <Button htmlType="button" onClick={() => form.resetFields()}>{t("Reset")}</Button>
                            <Button type="primary" loading={isLoading} className="ml-3" htmlType="submit">{t("Submit")}</Button>
                        </div>
                    </Form>
                </div>
            </div>
        </Spin>
    )
}
export default UpdateRole;