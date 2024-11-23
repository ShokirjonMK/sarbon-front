import { Form, Steps } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitData } from "./request";
import { AxiosError } from "axios";
import { validationErrors } from "utils/validation_error";
import { Notification } from "utils/notification";
import useGetOneData from "hooks/useGetOneData";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { useTranslation } from "react-i18next";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from 'react'
import dayjs from "dayjs";
import { _generateUserAccess, generateTeacherAccess } from "utils/generate_access";
import TeacherMainInfo from "../step_element/main_info";
import TeacherPassportInfo from "../step_element/passport_info";
import TeacherAddressInfo from "../step_element/address_info";
import TeacherProfessionInfo from "../step_element/profession_info";
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

export type StepType = "address-info" | "main-info" | "personal-info" | "job-info" | "teachers";

const UpdateTeacher = () => {

  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { urlValue, writeToUrl } = useUrlQueryParams({});
  const navigate = useNavigate();
  const [saveType, setsaveType] = useState<StepType>()
  const { user_id } = useParams();
  const [userAccessdata, setUserAccessData] = useState<any>()
  const [teacherAccessdata, setTeacherAccessData] = useState<any>()

  const { data } = useGetOneData({
    queryKey: ["users", user_id],
    url: `users/${user_id}?expand=profile,userAccess,teacherAccess,userAccess.loadRate.workLoad,userAccess.loadRate.workRate`,
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
          countries_id: res?.data?.profile?.countries_id,
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

  useEffect(() => {
    if (!user_id) {
      form.setFieldValue("role", ["teacher"])
    }
  }, []);

  const { mutate, isLoading } = useMutation({
    mutationFn: (data) => submitData(user_id, data),
    onSuccess: async (res) => {
      queryClient.setQueryData(["students"], res);
      if (res?.status === 1) {
        Notification("success", "update", res?.message);
        if (saveType == "teachers") {
          navigate("/teachers")
        } else {
          navigate(`/teachers/update/${res?.data?.id}?user-block=${saveType}`)
        }
      } else {
        Notification("error", "update", res?.message);
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

  useBreadCrumb({pageTitle: t(`Teacher ${user_id ? "update" : "create"}`), breadcrumb: [
    { name: "Home", path: '/' },
    { name: "Teachers", path: '/teachers' },
    { name: `Teacher ${user_id ? "update" : "create"}`, path: '/teachers/create' }
  ]})

  return (
    <div className="user-update content-card">
      <div className="flex">
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
                  navigate(`/teachers/update/${user_id}?user-block=${item?.key}`)
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
            initialValues={{ status: 10, gender: 1 }}
            onFinish={onFinish}
          >
            {
              urlValue?.filter_like["user-block"] === "main-info" || !urlValue?.filter_like["user-block"] ?
                <TeacherMainInfo form={form} setsaveType={setsaveType} avatar={data?.data?.avatar} />
                : urlValue?.filter_like["user-block"] === "personal-info" ?
                  <TeacherPassportInfo form={form} setsaveType={setsaveType} passport_file={data?.data?.profile?.passport_file} />
                  : urlValue?.filter_like["user-block"] === "address-info" ?
                    <TeacherAddressInfo form={form} setsaveType={setsaveType} />
                    : urlValue?.filter_like["user-block"] === "job-info" ?
                      <TeacherProfessionInfo form={form} setsaveType={setsaveType} userAccessdata={userAccessdata} teacherAccessdata={teacherAccessdata} /> : ""
            }
          </Form>
        </div>
      </div>
    </div>
  )
}

export default UpdateTeacher;