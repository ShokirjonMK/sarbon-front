import { Button, Divider, Form } from "antd";
import { useTranslation } from "react-i18next";
import useGetOneData from "hooks/useGetOneData";
import { Link, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { submitData } from "./request";
import { Notification } from "utils/notification";
import { AxiosError } from "axios";
import { validationErrors } from "utils/validation_error";
import dayjs from "dayjs";
import HeaderUserView from "pages/users/components/vewHeader";
import MainInfoUserView from "pages/users/view_steps/main_info/personal_info";
import PassportInfoUserView from "pages/users/view_steps/main_info/passport_info";
import AddressInfoUserView from "pages/users/view_steps/main_info/address_info";
import AuthInfoUserView from "pages/users/view_steps/auth_step/auth_info";
import DeleteData from "components/deleteData";
import useBreadCrumb from "hooks/useBreadCrumb";
import { renderFullName } from "utils/others_functions";
import checkPermission from "utils/check_permission";
import UserAccessInfoUserViewNew from "pages/users/view_steps/profession_step/user_access_info_new";
import TeacherAccessInfoUserViewNew from "pages/users/view_steps/profession_step/teacher_access_info_new";
import JobInfoUserView from "pages/users/view_steps/profession_step/job_info";

const ViewTeacher = () => {

    const { t } = useTranslation();
    const { user_id } = useParams();
    const [form] = Form.useForm();
    

    const { data, refetch } = useGetOneData({
        queryKey: ["users", user_id],
        url: `users/${user_id}?expand=profile,userAccess,userAccess.loadRate.workLoad,userAccess.loadRate.workRate,teacherAccess,updatedBy,createdBy,updatedAt,createdAt,citizenship,nationality,country,region,area,diplomaType,degree,academikDegree,degreeInfo,partiya`,
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
              },
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: !!user_id,
        }
    })

    useBreadCrumb({pageTitle: t("Teacher view"), breadcrumb: [
        {name: "Home", path: '/'},
        {name: "Teachers", path: '/teachers'},
        {name: renderFullName(data?.data), path: '/teachers/view'}
    ]})

    const saveMutation = useMutation({
        mutationFn: (data) => submitData(user_id, data),
        onSuccess: async (res) => {
          if (res?.status === 1) {
            Notification("success", "update", res?.message);
            refetch()
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

    return (
        <div>
            <div className="text-[#21259] text-[14px]">
                <div className="grid grid-cols-12 gap-6 m-6 mt-8">
                    <div className="lg:col-span-4 col-span-12">
                        <MainInfoUserView data={data?.data} form={form} saveMutation={saveMutation} />
                    </div>
                <div className="lg:col-span-8 col-span-12">
                    <div className="e-card-shadow bg-white rounded-2xl">
                    <div className="px-6 py-4 flex justify-between items-center">
                        <h3 className="text-[20px] font-semibold" style={{letterSpacing: '0.6px'}}>{t("Identity document")}</h3>
                        <div className="d-f gap-4">
                            <Link to={`/teachers/${user_id}/time-table`}><Button>{t("Time table")}</Button></Link>
                            <DeleteData permission={'user_delete'} refetch={refetch} url={"users"} id={Number(user_id)} navigateUrl='/users'>
                                <Button danger >{t("Delete")}</Button>
                            </DeleteData>
                        </div>
                    </div>
                    <Divider
                        className="m-0"
                        style={{ borderColor: "rgba(106, 113, 133, 0.3)" }}
                        dashed
                    />
                    <PassportInfoUserView data={data?.data} form={form} saveMutation={saveMutation} />
                    </div>
                </div>
                </div>
            </div>
            <HeaderUserView
                breadCrumbData={[]}
                title={``}
                isBack={false}
                tabs={[
                    {key: "1", label: t("Basic information"), children:
                    <>
                        <AddressInfoUserView data={data?.data} form={form} saveMutation={saveMutation} />
                    </>},
                    {key: '2', label: t("Professional information"), children:
                        <>
                            <JobInfoUserView data={data?.data} form={form} saveMutation={saveMutation} />
                            {
                                checkPermission("user-access_index") ? 
                                <UserAccessInfoUserViewNew user_id={user_id} roles={data?.data?.role}/> : ""
                            }
                            {
                                data?.data?.role?.includes("teacher") && checkPermission("teacher-access_get") ?
                                <TeacherAccessInfoUserViewNew user_id={user_id} /> : ""
                            }
                        </>
                    },
                    // {key: '4', label: "Hujjatlar", children:
                    //     <>
                    //         <DocsUserView data={data?.data} form={form} saveMutation={saveMutation} />
                    //     </>
                    // },
                    {key: '5', label: t("Login information"), children:
                        <>
                            <AuthInfoUserView data={data?.data} form={form} saveMutation={saveMutation} />
                        </>
                    }
                ]}
            />
        </div>
    )
}

export default ViewTeacher