import { Form, Steps } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitData } from "./request";
import { AxiosError } from "axios";
import { validationErrors } from "utils/validation_error";
import { Notification } from "utils/notification";
import useGetOneData from "hooks/useGetOneData";
import { useTranslation } from "react-i18next";
import UserMainInfo from "../create_steps/main_info";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from 'react'
import UserPersonalInfo from "../create_steps/personal_info";
import dayjs from "dayjs";
import UserAddressInfo from "../create_steps/address_info";
import UserProfessionInfo from "../create_steps/profession_info";
import { _generateUserAccess, generateTeacherAccess } from "utils/generate_access";
import { renderFullName } from "utils/others_functions";
import useBreadCrumb from "hooks/useBreadCrumb";

const stepsData = [
  {
    id: 0,
    title: 'Basic information',
    description: <p className="h-[25px]"></p>,
    key: "main-info",
  },
  {
    id: 1,
    title: 'Identity document',
    description: <p className="h-[25px]"></p>,
    key: "personal-info",
  },
  {
    id: 2,
    title: "Residential address information",
    description: <p className="h-[25px]"></p>,
    key: "address-info",
  },
  {
    id: 3,
    title: "Professional information",
    description: <p className="h-[25px]"></p>,
    key: "job-info",
  },
]

const UpdateUser = () => {

  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { urlValue } = useUrlQueryParams({});
  const navigate = useNavigate();
  const [saveType, setsaveType] = useState<"address-info" | "main-info" | "personal-info" | "job-info" | "users">()
  const { user_id } = useParams();
  const [userAccessdata, setUserAccessData] = useState<any>()
  const [teacherAccessdata, setTeacherAccessData] = useState<any>()

  const { data } = useGetOneData({
    queryKey: ["users", user_id],
    url: `users/${user_id}?expand=profile,userAccess.loadRate.workLoad,userAccess.loadRate.workRate,teacherAccess`,
    options: {
      onSuccess: (res) => {
        form.setFieldsValue({
          first_name: res?.data?.first_name,
          last_name: res?.data?.last_name,
          middle_name: res?.data?.middle_name,
          phone: res?.data?.profile?.phone,
          phone_secondary: res?.data?.profile?.phone_secondary,
          gender: res?.data?.profile?.gender ? res?.data?.profile?.gender : 1,
          birthday: res?.data?.profile?.birthday ? dayjs(res?.data?.profile?.birthday) : undefined,
          passport_given_date: res?.data?.profile?.passport_given_date ? dayjs(res?.data?.profile?.passport_given_date) : undefined,
          passport_issued_date: res?.data?.profile?.passport_issued_date ? dayjs(res?.data?.profile?.passport_issued_date) : undefined,
          nationality_id: res?.data?.profile?.nationality_id,
          citizenship_id: res?.data?.profile?.citizenship_id,
          countries_id: res?.data?.profile?.countries_id ? res?.data?.profile?.countries_id : 229,
          region_id: res?.data?.profile?.region_id,
          area_id: res?.data?.profile?.area_id,
          address: res?.data?.profile?.address,
          description: res?.data?.profile?.description,
          passport_pin: res?.data?.profile?.passport_pin,
          passport_given_by: res?.data?.profile?.passport_given_by,
          email: res?.data?.email,
          username: res?.data?.username,
          role: res?.data?.role,
          status: res?.data?.status,
          passport_seria_and_number: res?.data?.profile?.passport_serial + res?.data?.profile?.passport_number,
          diploma_type_id: res?.data?.profile?.diploma_type_id,
          degree_id: res?.data?.profile?.degree_id,
          academic_degree_id: res?.data?.profile?.academic_degree_id,
          degree_info_id: res?.data?.profile?.degree_info_id,
          partiya_id: res?.data?.profile?.partiya_id,
          user_access: res?.data?.userAccess,
        })
        if (Array.isArray(res?.data?.userAccess)) {
          setUserAccessData(_generateUserAccess(res?.data?.userAccess));
        }
        if (Array.isArray(res?.data?.teacherAccess)) {
          setTeacherAccessData(generateTeacherAccess(res?.data?.teacherAccess));
        }
      },
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!user_id,
    }
  })


  const { mutate, isLoading, data: response } = useMutation({
    mutationFn: (data) => submitData(user_id, data),
    onSuccess: async (res) => {
      queryClient.setQueryData(["students"], res);
      if (res?.status === 1) {
        Notification("success", "update", res?.message);
      } else {
        Notification("error", "update", res?.message);
      }
      if (saveType == "users") {
        navigate("/users");
      } else {
        navigate(`/users/update/${res?.data?.id}?user-block=${saveType}`);
      }
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", "update", error?.response?.data ? error?.response?.data?.message : "");
      validationErrors(form, error?.response?.data);
    },
    retry: 0,
  });

  const onFinish = (values: any) => {
    if (!form.getFieldValue("password") || form.getFieldValue("password") === form.getFieldValue("password_again")) {
      mutate(values)
    } else {
      form.setFields([{
        name: "password_again",
        errors: ["Parolda moslik yo'q!"]
      }])
    }
  }

  useBreadCrumb({pageTitle: !user_id ? t("User create") : renderFullName(data?.data), breadcrumb: [
    { name: "Home", path: '/' },
    { name: "Users", path: '/users' },
    { name: !user_id ? "Users" : renderFullName(data?.data), path: '/users/create' }
  ]})

  return (
    <div className="user-update">
      <div className="flex content-card">
        <div className="p-[24px] min-h-[85vh]" style={{ borderRight: "1px solid #F0F0F0", width: "max-content" }}>
          <Steps
            className="w-[289px]"
            direction="vertical"
            current={stepsData.find(i => i?.key === urlValue?.filter_like["user-block"])?.id || 0}
            items={stepsData.map(item => ({
              title: t(item.title),
              description: item.description,
              onClick: () => {
                if (!!user_id) {
                  navigate(`/users/update/${user_id}?user-block=${item?.key}`)
                }
              },
              className: !!user_id ? "cursor-pointer" : ""
            }))}
          />
        </div>
        <div className="w-[100%] p-[24px]">
          <Form
            form={form}
            name="basic"
            layout="vertical"
            initialValues={{ status: 10, gender: 1, countries_id: 229 }}
            onFinish={onFinish}
          >
            {
              urlValue?.filter_like["user-block"] === "main-info" || !urlValue?.filter_like["user-block"] ?
                <UserMainInfo form={form} setsaveType={setsaveType} avatar={data?.data?.avatar} isLoading={isLoading} />
                : urlValue?.filter_like["user-block"] === "personal-info" ?
                  <UserPersonalInfo form={form} setsaveType={setsaveType} passport_file={data?.data?.profile?.passport_file ? data?.data?.profile?.passport_file : response?.data?.profile?.passport_file} isLoading={isLoading} />
                  : urlValue?.filter_like["user-block"] === "address-info" ?
                    <UserAddressInfo form={form} setsaveType={setsaveType} isLoading={isLoading} />
                    : urlValue?.filter_like["user-block"] === "job-info" ?
                      <UserProfessionInfo form={form} setsaveType={setsaveType} userAccessdata={userAccessdata} teacherAccessdata={teacherAccessdata} isLoading={isLoading} /> : ""
            }
          </Form>
        </div>
      </div>
    </div>
  )
}

export default UpdateUser;