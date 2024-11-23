import React from "react";
import HeaderUserView from "pages/users/components/vewHeader";
import { useTranslation } from "react-i18next";
import useGetOneData from "hooks/useGetOneData";
import AddressInfo from "./address_info";
import JobInfo from "./job_info";
import DocInfo from "./doc_info";
import PasswordInfo from "./password_info";
import { Avatar, Divider } from "antd";
import { FILE_URL } from "config/utils";
import { renderFullName } from "utils/others_functions";
import { AiOutlineUser } from "react-icons/ai";
import useBreadCrumb from "hooks/useBreadCrumb";
import ViewInput from "components/ViewInput";

const ProfileNew: React.FC = (): JSX.Element => {
  const { t } = useTranslation();

  useBreadCrumb({pageTitle: "Profile", breadcrumb: [{name: "Profile", path: "/profile"}]})

  const {
    data: user,
    isLoading,
    refetch,
  } = useGetOneData({
    queryKey: ["profile"],
    url: `users/me?expand=profile`,
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  });

  return (
    <div className="text-[#21259] text-[14px]">
      <div className="grid grid-cols-12 gap-6 m-6 mt-8">
        <div className="lg:col-span-4 col-span-12">
          <div className="e-card-shadow bg-white rounded-2xl">
            <div className="px-6 py-4">
              <h3 className="text-[20px] font-semibold" style={{letterSpacing: '0.6px'}}>My Profile</h3>
            </div>
            <Divider
              className="m-0"
              style={{ borderColor: "rgba(106, 113, 133, 0.3)" }}
              dashed
            />
            <div className="px-6 py-4">
              <div className="flex gap-3 items-center mb-4">
                {user?.data?.profile?.image ? (
                  <a
                    href={FILE_URL + user?.data?.profile?.image}
                    target="_blank"
                  >
                    <img
                      src={FILE_URL + user?.data?.profile?.image}
                      className="w-[70px] h-[70px] rounded-full"
                      alt="User image"
                    />
                  </a>
                ) : (
                  <Avatar size={70} icon={<AiOutlineUser />} />
                )}
                <div>
                  <h4 className="text-[20px] font-semibold text-[#3D434A]">
                    {renderFullName(user?.data?.profile)}
                  </h4>
                  <p>{user?.data?.role.join(",")}</p>
                </div>
              </div>
              <ViewInput 
                label={t("Bio")} 
                value={user?.data?.profile?.description} 
                placeholder={t("Bio")}
                className="min-h-[80px]"
              />
              <ViewInput 
                label={t("Main phone number")} 
                value={user?.data?.profile?.phone} 
                placeholder={t("Main phone number")}
              />
              <ViewInput 
                label={t("Additional phone number")} 
                value={user?.data?.profile?.phone_secondary} 
                placeholder={t("Additional phone number")}
              />
              <ViewInput 
                label={t("Email")} 
                value={user?.data?.email} 
                placeholder={t("Email")}
              />
            </div>
          </div>
        </div>
        <div className="lg:col-span-8 col-span-12">
          <div className="e-card-shadow bg-white rounded-2xl">
            <div className="px-6 py-4">
              <h3 className="text-[20px] font-semibold" style={{letterSpacing: '0.6px'}}>{t("Identity document")}</h3>
            </div>
            <Divider
              className="m-0"
              style={{ borderColor: "rgba(106, 113, 133, 0.3)" }}
              dashed
            />
            <div className="px-6 py-4">
              <div className="grid grid-cols-3 gap-4">
                <ViewInput 
                  label={t("Birthday")} 
                  value={user?.data?.profile?.birthday} 
                  placeholder={t("Birthday")}
                />
                <ViewInput 
                  label={t("Gender")} 
                  value={user?.data?.profile?.gender == 1 ? t("Male") : user?.data?.profile?.gender === 0 ? t("Female") : ""}
                  placeholder={t("Gender")}
                />
                <ViewInput 
                  label={t("Citizenship")} 
                  value={user?.data?.citizenship?.name}
                  placeholder={t("Citizenship")}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <ViewInput 
                  label={t("Nationality")} 
                  value={user?.data?.nationality?.name}
                  placeholder={t("Nationality")}
                />
                <div></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <ViewInput 
                  label={t("Document series and number")} 
                  value={`${user?.data?.profile?.passport_serial ? user?.data?.profile?.passport_serial : ""}${user?.data?.profile?.passport_number ? user?.data?.profile?.passport_number : ""}`}
                  placeholder={t("Document series and number")}
                />
                <ViewInput 
                  label={t("JSHSHIR")} 
                  value={user?.data?.profile?.passport_pin}
                  placeholder={t("JSHSHIR")}
                />
                <div></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <ViewInput 
                  label={t("Date of issue of the document")} 
                  value={user?.data?.profile?.passport_given_date}
                  placeholder={t("Date of issue of the document")}
                />
                <ViewInput 
                  label={t("Validity period")} 
                  value={user?.data?.profile?.passport_issued_date}
                  placeholder={t("Validity period")}
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <ViewInput 
                  label={t("Address")} 
                  value={user?.data?.profile?.passport_given_by}
                  placeholder={t("Address")}
                />
              </div>
              <ViewInput 
                label={t("Document file")} 
                value={user?.data?.profile?.passport_file ? <a href={FILE_URL + user?.data?.profile?.passport_file} target="_blank">{t("Download")}</a> : "----"}
                placeholder={t("Document file")}
              />
            </div>
          </div>
        </div>
      </div>
      <HeaderUserView
        breadCrumbData={[]}
        title={t("")}
        isBack={false}
        tabs={[
          {
            key: "main-info",
            label: t("Basic information"),
            children: (
              <>
                <AddressInfo data={user?.data} />
              </>
            ),
          },
          {
            key: "prefession-info",
            label: t("Professional information"),
            children: (
              <>
                <JobInfo data={user?.data} />
              </>
            ),
          },
          {
            key: "docs-info",
            label: t("Documents"),
            children: (
              <>
                <DocInfo data={user?.data} refetch />
              </>
            ),
          },
          {
            key: "auth-info",
            label: t("Login information"),
            children: (
              <>
                <PasswordInfo data={user?.data} />
              </>
            ),
          },
        ]}
      />
    </div>
  );
};

export default ProfileNew;
