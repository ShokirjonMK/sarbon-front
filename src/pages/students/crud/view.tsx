import { Button, Divider, Form } from "antd";
import { useTranslation } from "react-i18next";
import useGetOneData from "hooks/useGetOneData";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { submitData } from "./request";
import { Notification } from "utils/notification";
import { AxiosError } from "axios";
import { validationErrors } from "utils/validation_error";
import dayjs from "dayjs";
import DeleteData from "components/deleteData";
import HeaderUserView from "pages/users/components/vewHeader";
import MainInfoUserView from "pages/users/view_steps/main_info/personal_info";
import PassportInfoUserView from "pages/users/view_steps/main_info/passport_info";
import EduInfoView from "../view_element/edu_info_view";
import AuthInfoView from "../view_element/auth_info_view";
import { IStudent } from "models/student";
import AddressInfoView from "../view_element/address_info_view";
import LastEduInfoView from "../view_element/last_edu_view";
import AdditionInfoView from "../view_element/additional_info_view";
import ParentInfoView from "../view_element/parent_info_view";
import checkPermission from "utils/check_permission";
import StudentGroups from "../view_element/student_groups";
import { renderFullName } from "utils/others_functions";
import useBreadCrumb from "hooks/useBreadCrumb";

const ViewStudent = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user_id } = useParams();
  const [form] = Form.useForm();

  const { data, refetch } = useGetOneData<IStudent>({
    queryKey: ["students", user_id],
    url: `students/${user_id}?expand=profile,user,updatedBy,createdBy,updatedAt,createdAt,tutor,citizenship,nationality,country,region,area,permanentCountry,permanentRegion,permanentArea,lastIn,loginHistory,faculty,direction,eduPlan,group,eduType,eduForm,eduYear,course,eduLang,residenceStatus,categoryOfCohabitant,socialCategory`,
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
          gender: profile?.gender ? profile?.gender : 1,
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

  useBreadCrumb({pageTitle: "Student view", breadcrumb: [
    {name: "Home", path: '/'},
    {name: "Students", path: '/students'},
    {name: renderFullName(data?.data?.profile), path: '/students'},
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
                <div className="d-f">
                  {true ? <Link to={`/students/${user_id}/student-study-sheet?edu_plan_id=${data?.data?.edu_plan_id}`}><Button className="me-2" onClick={() => { navigate(`/students/${user_id}/student-study-sheet?edu_plan_id=${data?.data?.edu_plan_id}`) }} >{t("Study sheet")}</Button></Link> : null}
                  {checkPermission("student-mark_index") ? <Link to={`/students/${user_id}/${data?.data?.edu_plan_id}/mark`}><Button className="me-2" onClick={() => { navigate(`/students/${user_id}/${data?.data?.edu_plan_id}/mark`) }} >{t("Grades")}</Button></Link> : null}
                  {checkPermission("student-attend_index") ? <Link to={`/students/${user_id}/attends`}><Button className="me-2" onClick={() => { navigate(`/students/${user_id}/attends`) }} >{t("Attendance")}</Button></Link> : null}
                  {checkPermission("time-table_index") ? <Link to={`/students/${user_id}/${data?.data?.user_id}/time-table?group_id=${data?.data?.group_id}&type=${data?.data?.type}`}><Button className="me-2">{t("Time table")}</Button></Link> : null}
                  <DeleteData placement="top" permission={'student_delete'} refetch={refetch} url={"students"} id={Number(user_id)} navigateUrl='/students'>
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
          {
            key: "main-info", label: t("Basic information"), children:
              <>
                <AddressInfoView data={data?.data} form={form} saveMutation={saveMutation} />
              </>
          },
          {
            key: 'prefession-info', label: t("Educational information"), children:
              <>
                <EduInfoView data={data?.data} form={form} saveMutation={saveMutation} />
                <LastEduInfoView data={data?.data} form={form} saveMutation={saveMutation} />
                <div className="px-[24px] pt-[15px] pb-[10px]">
                  <strong>Talaba tutori:</strong> {data?.data?.tutor ? renderFullName(data?.data?.tutor) : "Talabaga tutor biriktirilmagan!"}
                </div>
                {checkPermission("student-group_index") ? <StudentGroups refetch={refetch} /> : ""}
              </>
          },
          {
            key: 'addional-info', label: t("Additional information"), children:
              <>
                <AdditionInfoView data={data?.data} form={form} saveMutation={saveMutation} />
                <ParentInfoView data={data?.data} form={form} saveMutation={saveMutation} />
              </>
          },
          {
            key: 'auth-info', label: t("Login information"), children:
              <>
                <AuthInfoView data={data?.data} form={form} saveMutation={saveMutation} user_id={data?.data?.user_id ?? ""} />
              </>
          },
        ]}
      />
    </div>
  )
}

export default ViewStudent