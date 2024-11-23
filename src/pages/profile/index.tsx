import React from "react";
import HeaderUserView from "pages/users/components/vewHeader";
import { useTranslation } from "react-i18next";
import PersonalInfo from "./personal_info";
import PassportInfo from "./passport_info";
import AddressInfo from "./address_info";
import JobInfo from "./job_info";
import DocInfo from "./doc_info";
import PasswordInfo from "./password_info";
import useGetOneData from "hooks/useGetOneData";

const Profile : React.FC = () : JSX.Element => {
  const {t} = useTranslation()

  // const user = useAppSelector(s => s.auth?.user);
  
  // console.log('userMe==>>', user);

  const { data:user, isLoading, refetch } = useGetOneData({
    queryKey: ["profile"],
    url: `users/me?expand=profile`,
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  });

  
  return(
    <>
      <HeaderUserView
                breadCrumbData={[
                    {name: "Home", path: '/'},
                    {name: "Profile", path: '/profile'}
                ]}
                title={t("Profile")}
                isBack={false}
                // btn={
                //     <DeleteData permission={'user_delete'} refetch={refetch} url={"users"} id={Number(user_id)} navigateUrl='/users'>
                //         <Button danger >{t("Delete")}</Button>
                //     </DeleteData>
                // }
                tabs={[
                    {key: "main-info", label: t("Basic information"), children: 
                      <>
                        <PersonalInfo data={user?.data}/>
                        <PassportInfo data={user?.data}/>
                        <AddressInfo data={user?.data}/>
                      </>
                    },
                    {key: 'prefession-info', label: t("Professional information"), children: 
                        <>
                          <JobInfo data={user?.data}/>
                        </>
                    },
                    {key: 'docs-info', label: t("Documents"), children: 
                        <>
                            <DocInfo data={user?.data} refetch/>
                        </>
                    },
                    {key: 'auth-info', label: t("Login information"), children: 
                        <>
                            <PasswordInfo data={user?.data}/>
                        </>
                    }
                ]}
            />
    </>
  )
}

export default Profile 