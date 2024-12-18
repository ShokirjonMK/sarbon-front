import React, { FC, useState } from "react";
import { Button, Divider, Drawer, Form, Select, Spin } from "antd";
import { TitleModal } from "components/Titles";
import { globalConstants } from "config/constants";
import { useTranslation } from "react-i18next";
import { IoClose } from "react-icons/io5";
import { useMutation } from "@tanstack/react-query";
import { Notification } from "utils/notification";
import { validationErrors } from "utils/validation_error";
import { AxiosError } from "axios";
import { submitData } from "./employee_request";
import useGetOneData from "hooks/useGetOneData";
import { IUserAccess } from "models/edu_structure";
import { useParams } from "react-router-dom";
import useGetAllData from "hooks/useGetAllData";
import { generateTeacherAccess } from "utils/generate_access";
import TeacherAccessInfoUserViewNew from "pages/users/view_steps/profession_step/teacher_access_info_new";
import checkPermission from "utils/check_permission";
import UserAccessInfoUserViewNew from "pages/users/view_steps/profession_step/user_access_info_new";

type TypeFormProps = {
  employee: any;
  refetch: Function;
  isOpenForm: boolean;
  userAccessTypeId: number,
  setisOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
  setEmployee: React.Dispatch<any>;
};

const EmployeeUpdate: FC<TypeFormProps> = ({ employee, setEmployee, refetch, isOpenForm, setisOpenForm, userAccessTypeId }): JSX.Element => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { id: table_id } = useParams();
  const [teacherAccess, setTeacherAccess] = useState<any>();

  const { data: users, isFetching: loading } = useGetAllData({
    queryKey: ["users", {id: employee?.id}],
    url: `users?expand=teacherAccess`,
    urlParams: { "per-page": 0, filter: { "-role_name": ["student"], "role_name": ['dekan'] } },
    options: {
      enabled: (isOpenForm && !!employee?.id)
    }
  });

  const { isFetching } = useGetOneData<IUserAccess>({
    queryKey: ["user-access", employee?.id],
    url: `user-accesses/${employee?.id}?expand=user.teacherAccess,loadRate`,
    options: {
      onSuccess: (res) => {
        form.setFieldsValue({
          user_id: res?.data?.user_id,
          is_leader: res?.data?.is_leader,
          load_rate: JSON.stringify([...(res?.data?.loadRate?.map(e => `${e?.work_load_id}-${e?.work_rate_id}`) ?? [])])
        });
        setTeacherAccess(generateTeacherAccess(res?.data?.user?.teacherAccess));
      },
      enabled: (isOpenForm && !!employee?.id),
    }
  })

  const checkTeacher = (id: number) => {
    const teacher = users?.items?.find(e => e?.id === id);
    setTeacherAccess(generateTeacherAccess(teacher?.teacherAccess));

    return teacher?.role?.includes("teacher")
  }

  const { mutate, isLoading } = useMutation({
    mutationFn: (newVals) => submitData(employee?.id, newVals, table_id, userAccessTypeId, teacherAccess),
    onSuccess: async (res) => {
      refetch();
      Notification("success", employee?.id ? "update" : "create", res?.message)
      if (employee?.id) setisOpenForm(false);
      form.resetFields();
    },
    onError: (error: AxiosError) => {
      validationErrors(form, error?.response?.data)
    },
    retry: 0,
  });

  return (
    <>
      <Drawer
        title={
          <div className="flex items-center justify-between">
            <TitleModal>
              {employee?.id ? t("Update employee") : t("Create employee")}
            </TitleModal>
            <IoClose
              onClick={() => {
                setisOpenForm(false);
                setEmployee(undefined);
                form.resetFields();
              }}
              className="text-[24px] cursor-pointer text-[#00000073]"
            />
          </div>
        }
        placement="right"
        closable={false}
        open={isOpenForm}
        onClose={() => {
          setisOpenForm(false);
          setEmployee(undefined);
          form.resetFields();
        }}
        width={globalConstants.antdDrawerWidth + 350}
        headerStyle={{ backgroundColor: "#F7F7F7" }}
      >
        <Spin spinning={isFetching && !!Number(employee?.id)}>
          <Form
            form={form}
            name="basic"
            layout="vertical"
            initialValues={{ status: true }}
            autoComplete="off"
            onFinish={(values) => { mutate(values) }}
          >
            {
                checkPermission("user-access_index") ? 
                <UserAccessInfoUserViewNew user_id={employee?.user_id} roles={employee?.user?.role}/> : ""
            }
            {
              employee?.user?.role?.includes("teacher") && checkPermission("teacher-access_get") ?
              <TeacherAccessInfoUserViewNew user_id={employee?.user_id} /> : ""
            }
            <Divider />
            <div className="flex justify-end">
              <Button htmlType="button" danger onClick={() => form.resetFields()}>
                {t("Reset")}
              </Button>
              <Button className="mx-3" onClick={() => { setisOpenForm(false); form.setFieldValue('user_id', undefined); form.setFieldValue('is_leader', undefined) }}>
                {t("Cancel")}
              </Button>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                {t("Submit")}
              </Button>
            </div>
          </Form>
        </Spin>
      </Drawer>
    </>
  );
};

export default EmployeeUpdate;


//user_access_type_id
// user_access_type_id = 1 => faculty
// user_access_type_id = 2 => kafedras
// user_access_type_id = 3 => department
