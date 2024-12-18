import { Button, Divider, Form } from "antd";
import { useTranslation } from "react-i18next";
import useGetOneData from "hooks/useGetOneData";
import HeaderUserView from "../components/vewHeader";
import MainInfoUserView from "../view_steps/main_info/personal_info";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { submitData } from "./request";
import { Notification } from "utils/notification";
import { AxiosError } from "axios";
import { validationErrors } from "utils/validation_error";
import dayjs from "dayjs";
import PassportInfoUserView from "../view_steps/main_info/passport_info";
import DocsUserView from "../view_steps/docs_step/all_files_info";
import AuthInfoUserView from "../view_steps/auth_step/auth_info";
import DeleteData from "components/deleteData";
import { renderFullName } from "utils/others_functions";
import TutorGroupsView from "../view_steps/groups_step/tutor_groups";
import useBreadCrumb from "hooks/useBreadCrumb";
import checkPermission from "utils/check_permission";
import UserAccessInfoUserViewNew from "../view_steps/profession_step/user_access_info_new";
import TeacherAccessInfoUserViewNew from "../view_steps/profession_step/teacher_access_info_new";
import JobInfoUserView from "../view_steps/profession_step/job_info";
import AddressInfoUserView from "../view_steps/main_info/address_info";

const UserView = () => {

    const { t } = useTranslation();
    const { user_id } = useParams();
    const [form] = Form.useForm();
    
    const { data, refetch } = useGetOneData({
        queryKey: ["users", user_id],
        url: `users/${user_id}?expand=profile,userAccess.loadRate.workLoad,userAccess.loadRate.workRate,teacherAccess,teacherAccess,updatedBy,createdBy,updatedAt,createdAt,citizenship,nationality,country,region,area,diplomaType,degree,academikDegree,degreeInfo,partiya,lastIn,loginHistory,tutorGroups,tutorGroups.faculty,tutorGroups.eduPlan`,
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

    useBreadCrumb({pageTitle: renderFullName(data?.data), breadcrumb: [
        { name: "Home", path: '/' },
        { name: "Users", path: '/users' },
        { name: renderFullName(data?.data), path: '/users' }
    ]})

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
                        <div className="d-f">
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
                title={""}
                isBack={false}
                tabs={[
                    {key: "main-info", label: t("Basic information"), children:
                    <>
                        <AddressInfoUserView data={data?.data} form={form} saveMutation={saveMutation} />
                    </>},
                    {key: 'prefession-info', label: t("Professional information"), children:
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
                    {key: 'docs-info', label: t("Documents"), children:
                        <>
                            <DocsUserView data={data?.data} form={form} saveMutation={saveMutation} refetch={refetch} />
                        </>
                    },
                    {key: 'auth-info', label: t("Login information"), children:
                        <>
                            <AuthInfoUserView data={data?.data} form={form} saveMutation={saveMutation} />
                        </>
                    },
                    
                    data?.data?.role?.includes("tutor") ? {key: 'tutor-groups', label: t("Tutor guruhlari"), children:
                        <>
                            <TutorGroupsView data={data?.data} refetch={refetch} />
                        </>
                    } : {} as any
                ]}
            />
        </div>
    )
}

export default UserView