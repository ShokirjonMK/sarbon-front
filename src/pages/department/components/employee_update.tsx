import React, { FC, useState } from "react";
import { Button, Divider, Drawer, Form, Select, Spin, Tag } from "antd";
import { TitleModal } from "components/Titles";
import { globalConstants } from "config/constants";
import { useTranslation } from "react-i18next";
import { IoClose } from "react-icons/io5";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Notification } from "utils/notification";
import { validationErrors } from "utils/validation_error";
import { AxiosError } from "axios";
import { submitData } from "./employee_request";
import useGetOneData from "hooks/useGetOneData";
import { IUserAccess } from "models/edu_structure";
import { useParams } from "react-router-dom";
import useGetAllData from "hooks/useGetAllData";
import TeacherAccess from "pages/teacher/components/teacherAccess";
import { generateTeacherAccess } from "utils/generate_access";
import { TypeFormUIData } from "pages/common/types";
import { cf_filterOption } from "utils/others_functions";
import LoadRate from "./load_rate";

type TypeFormProps = {
  id: number | undefined;
  refetch: Function;
  isOpenForm: boolean;
  userAccessTypeId: number,
  setisOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
  setId: React.Dispatch<React.SetStateAction<number | undefined>>;
};

const formData: TypeFormUIData[] = [
  {
    name: "work_rate_id",
    label: "Work rate",
    url: "work-rates",
    type: "select",
    render: (e) => e?.type,
    required: true,
    span: 24,
  },
  {
    name: "work_load_id",
    label: "Work load",
    url: "work-loads",
    type: "select",
    required: true,
    span: 24,
  },
];

const EmployeeUpdate: FC<TypeFormProps> = ({ id, setId, refetch, isOpenForm, setisOpenForm, userAccessTypeId }): JSX.Element => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { id: table_id } = useParams();
  const [teacherAccess, setTeacherAccess] = useState<any>();
  const [is_teacher, setIsTeacher] = useState<boolean>()

  const { data: users, refetch: refetchUser, isFetching: loading } = useGetAllData({
    queryKey: ["users", {id}],
    url: `users?expand=teacherAccess`,
    urlParams: { "per-page": 0, filter: { "-role_name": ["student"] } },
    options: {
      enabled: (isOpenForm && !!id)
    }
  });

  const { isFetching } = useGetOneData<IUserAccess>({
    queryKey: ["user-access", id],
    url: `user-accesses/${id}?expand=user.teacherAccess,loadRate`,
    options: {
      onSuccess: (res) => {
        form.setFieldsValue({
          user_id: res?.data?.user_id,
          is_leader: res?.data?.is_leader,
          load_rate: JSON.stringify([...(res?.data?.loadRate?.map(e => `${e?.work_load_id}-${e?.work_rate_id}`) ?? [])])
        });
        setIsTeacher(checkTeacher(res?.data?.user_id));
        setTeacherAccess(generateTeacherAccess(res?.data?.user?.teacherAccess));
      },
      enabled: (isOpenForm && !!id),
    }
  })

  const checkTeacher = (id: number) => {
    const teacher = users?.items?.find(e => e?.id === id);
    setTeacherAccess(generateTeacherAccess(teacher?.teacherAccess));

    return teacher?.role?.includes("teacher")
  }

  const { mutate, isLoading } = useMutation({
    mutationFn: (newVals) => submitData(id, newVals, table_id, userAccessTypeId, teacherAccess),
    onSuccess: async (res) => {
      queryClient.setQueryData(["user-accesses"], res);
      refetch();
      Notification("success", id ? "update" : "create", res?.message)
      if (id) setisOpenForm(false);
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
              {id ? t("Update employee") : t("Create employee")}
            </TitleModal>
            <IoClose
              onClick={() => {
                setisOpenForm(false);
                setId(undefined);
                setIsTeacher(false);
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
          setId(undefined);
          setIsTeacher(false);
          form.resetFields();
        }}
        width={globalConstants.antdDrawerWidth + 150}
        headerStyle={{ backgroundColor: "#F7F7F7" }}
      >
        <Spin spinning={isFetching && !!Number(id)}>
          <Form
            form={form}
            name="basic"
            layout="vertical"
            initialValues={{ status: true }}
            autoComplete="off"
            onFinish={(values) => { mutate(values) }}
          >
            <Form.Item
              label={t("Employee")}
              name="user_id"
              rules={[
                {
                  required: true,
                  message: `${t("Please select employee")}!`,
                },
              ]}
            >
              <Select
                placeholder={t("Employee")}
                allowClear
                showSearch
                loading={loading}
                filterOption={cf_filterOption}
                onChange={(e) => userAccessTypeId === 2 && setIsTeacher(checkTeacher(e))}
                onFocus={() => !users?.items?.length && refetchUser()}
              >
                {users?.items.map((item, i) => (
                  <Select.Option value={item?.id}>
                    {item?.first_name} {item?.last_name} &nbsp;{" "} <div className="inline-flex gap-1">{item?.role?.map((e: string, idx: number) => (<Tag key={idx}>{e}</Tag>))}</div>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={t("Leader")}
              name="is_leader"
              rules={[
                {
                  required: true,
                  message: `${t("Please select employee")}!`,
                },
              ]}
            >
              <Select placeholder={t("Leader or employee")} allowClear>
                <Select.Option value={1}>{t("Leader")}</Select.Option>
                <Select.Option value={0}>{t("Employee")}</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="load_rate" className="hidden" />

            <LoadRate form={form} edit={true} />

            {is_teacher && (userAccessTypeId === 2) ? <div className="my-2 p-2 border border-solid border-blue-500 rounded-xl" >
                <TeacherAccess teacher_access_list={teacherAccess} setTeacherAccessList={setTeacherAccess} edit={true} />
              </div> : null}

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
