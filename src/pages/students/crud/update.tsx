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
import { useState } from 'react'
import dayjs from "dayjs";
import { IStudent } from "models/student";
import StudentMainInfo from "../step_element/main_info";
import StudentEduInfo from "../step_element/edu_info";
import StudentAddressInfo from "../step_element/address_info";
import StudentAdditionInfo from "../step_element/addition_info";
import StudentParentInfo from "../step_element/parent_info";
import StudentDocuments from "../step_element/student_doc";
import useBreadCrumb from "hooks/useBreadCrumb";
import { renderFullName } from "utils/others_functions";

const stepsData = [
  {
    id: 0,
    title: 'Basic information',
    description: <p className="h-[25px]"></p>,
    key: "main-info",
  },
  // {
  //   id: 1,
  //   title: 'Education information',
  //   description: <p className="h-[25px]"></p>,
  //   key: "edu-info",
  // },
  {
    id: 1,
    title: "Residential address information",
    description: <p className="h-[25px]"></p>,
    key: "address-info",
  },
  {
    id: 2,
    title: 'Additional information',
    description: <p className="h-[25px]"></p>,
    key: "additional-info",
  },
  {
    id: 3,
    title: 'Parents information',
    description: <p className="h-[25px]"></p>,
    key: "parents-info",
  },
  // {
  //   id: 5,
  //   title: 'Sertificates',
  //   description: <p className="h-[25px]"></p>,
  //   key: "sertificate-info",
  // },
  {
    id: 4,
    title: 'Student documents',
    description: <p className="h-[25px]"></p>,
    key: "student_doc-info",
  },
]

export type StepType = "address-info" | "main-info" | "address-info" | "additional-info" | "edu-info" | "parents-info" | "sertificate-info" | "student_doc-info" | "students";

const UpdateStudent = () => {

  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { urlValue, writeToUrl } = useUrlQueryParams({});
  const navigate = useNavigate();
  const [saveType, setsaveType] = useState<StepType>()
  const { user_id } = useParams();

  const { data, refetch } = useGetOneData<IStudent>({
    queryKey: ["users", user_id],
    url: `students/${user_id}?expand=profile,user`,
    options: {
      onSuccess: (res) => {
        const data = res.data;
        const profile = res.data?.profile;

        form.setFieldsValue({
          first_name: res?.data?.user?.first_name,
          last_name: res?.data?.user?.last_name,
          middle_name: res?.data?.user?.middle_name,
          status: data?.status,

          phone: profile?.phone,
          phone_secondary: profile?.phone_secondary,
          gender: profile?.gender ? profile?.gender : 0,
          birthday: profile?.birthday ? dayjs(profile?.birthday) : undefined,
          passport_given_date: profile?.passport_given_date ? dayjs(profile?.passport_given_date) : undefined,
          passport_issued_date: profile?.passport_issued_date ? dayjs(profile?.passport_issued_date) : undefined,
          nationality_id: profile?.nationality_id,
          citizenship_id: profile?.citizenship_id,
          description: profile?.description,
          passport_pin: profile?.passport_pin,
          passport_given_by: profile?.passport_given_by,
          passport_seria_and_number: (profile?.passport_serial ?? "__") + profile?.passport_number,

          countries_id: profile?.countries_id,
          region_id: profile?.region_id,
          area_id: profile?.area_id,
          address: profile?.address,
          permanent_countries_id: profile?.permanent_countries_id,
          permanent_region_id: profile?.permanent_region_id,
          permanent_area_id: profile?.permanent_area_id,
          permanent_address: profile?.permanent_address,

          faculty_id: data?.faculty_id,
          direction_id: data?.direction_id,
          edu_plan_id: data?.edu_plan_id,
          group_id: data?.group_id,
          edu_type_id: data?.edu_type_id,
          edu_form_id: data?.edu_form_id,
          edu_year_id: data?.edu_year_id,
          course_id: data?.course_id,
          edu_lang_id: data?.edu_lang_id,
          form_of_payment_id: data?.form_of_payment_id,
          is_contract: data?.is_contract,

          category_of_cohabitant_id: data?.category_of_cohabitant_id,
          diplom_date: data?.diplom_date,
          diplom_number: data?.diplom_number,
          diplom_seria: data?.diplom_seria,
          last_education: data?.last_education,
          live_location: data?.live_location,
          parent_phone: data?.parent_phone,
          partners_count: data?.partners_count,
          res_person_phone: data?.res_person_phone,
          residence_status_id: data?.residence_status_id,
          social_category_id: data?.social_category_id,
          student_category_id: data?.student_category_id,

        })
      },
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!user_id,
    }
  })

  useBreadCrumb({pageTitle: "Student update", breadcrumb: [
    {name: "Home", path: '/'},
    {name: "Students", path: '/students'},
    {name: user_id ? renderFullName(data?.data?.profile) : "Student create", path: '/students'},
  ]})

  const { mutate, isLoading } = useMutation({
    mutationFn: (data) => submitData(user_id, data),
    onSuccess: async (res) => {
      queryClient.setQueryData(["students"], res);
      if (res?.status === 1) {
        Notification("success", "update", res?.message);
        if(user_id){
          refetch();
        }
      } else {
        Notification("error", "update", res?.message);
      }

      if (saveType == "students") {
        navigate("/students")
      } else {
        navigate(`/students/update/${res?.data?.student?.id}?user-block=${saveType}`)
      }
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", "update", error?.response?.data ? error?.response?.data?.message : "");
      validationErrors(form, error?.response?.data);
    },
    retry: 0,
  });

  const onFinish = (values: any) => {
    if (form.getFieldValue("password") === form.getFieldValue("password_again")) {
      mutate(values)
    } else {
      form.setFields([{
        name: "password_again",
        errors: ["Parolda moslik yo'q!"]
      }])
    }
  }

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
                  navigate(`/students/update/${user_id}?user-block=${item?.key}`)
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
                <StudentMainInfo form={form} setsaveType={setsaveType} avatar={data?.data?.user?.avatar} passport_file={data?.data?.profile?.passport_file ?? undefined}  />
                : urlValue?.filter_like["user-block"] === "edu-info" ?
                  <StudentEduInfo form={form} setsaveType={setsaveType} isLoading={isLoading} />
                  : urlValue?.filter_like["user-block"] === "address-info" ?
                  <StudentAddressInfo form={form} setsaveType={setsaveType} isLoading={isLoading} />
                  : urlValue?.filter_like["user-block"] === "additional-info" ?
                    <StudentAdditionInfo form={form} isLoading={isLoading} setsaveType={setsaveType} diplom_file={data?.data?.diplom_file ?? ""} />
                  : urlValue?.filter_like["user-block"] === "parents-info" ?
                    <StudentParentInfo form={form} isLoading={isLoading} setsaveType={setsaveType} />
                  // : urlValue?.filter_like["user-block"] === "sertificate-info" ?
                  //   <StudentSertificate form={form} isLoading={isLoading} setsaveType={setsaveType} />
                  : urlValue?.filter_like["user-block"] === "student_doc-info" ?
                    <StudentDocuments form={form} isLoading={isLoading} setsaveType={setsaveType} />
                      // : urlValue?.filter_like["user-block"] === "job-info" ?
                      //   <UserProfessionInfo form={form} setsaveType={setsaveType} userAccessdata={userAccessdata} teacherAccessdata={teacherAccessdata} />
                      : ""
            }
          </Form>
        </div>
      </div>
    </div>
  )
}

export default UpdateStudent