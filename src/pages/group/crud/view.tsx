import React, { useState } from 'react'
import useGetOneData from 'hooks/useGetOneData';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import checkPermission from 'utils/check_permission';
import { Button, Tooltip } from 'antd';
import DeleteData from 'components/deleteData';
import UpdateGroup from './update';
import HeaderUserView from 'pages/users/components/vewHeader';
import GroupInfo from '../components/group_info';
import StudentInfo from '../components/student_info';
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import GroupTimeTable from '../components/group_time_table';
import GroupStudentsTransfer from '../components/students_transfer';
import SemesrtRegistration from '../components/semestrovka';

const ViewGroup: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { urlValue } = useUrlQueryParams({ currentPage: 1, perPage: 15 });
  const [searchVal, setSearchVal] = useState<string>("");
  const [departId, setId] = useState<number | undefined>();
  const [isOpenForm, setisOpenForm] = useState<boolean>(false);
  const [allStudent, setAllStudent] = useState<any[]>([])

  const { data, refetch, isLoading } = useGetOneData({
    queryKey: ["groups", id],
    url: `groups/${id}?expand=faculty,direction,eduPlan,student,student.profile,student.user,course,createdBy,updatedBy,activeEduSemestr,activeEduSemestr.weeks`,
    urlParams: { "per-page": urlValue.perPage, page: urlValue.currentPage, query: searchVal },
    options: {
      onSuccess: (res) => {
        setAllStudent(res?.data?.student)
      },
      refetchOnWindowFocus: false,
      retry: 0,
    },
  });

  return (
    <div>
      <HeaderUserView
        breadCrumbData={[
          { name: "Home", path: "/" },
          { name: "Group", path: "/group" },
          { name: "Group view", path: "" },
        ]}
        title={t(`${data?.data?.unical_name}`)}
        isBack={true}
        btn={
          <div>
            {checkPermission("group_delete") ? (
              <Tooltip placement="left" title={t("Delete")}>
                <DeleteData permission={"group_delete"} refetch={refetch} url={"groups"} id={Number(id)} className="mr-4" navigateUrl="/group">
                  <Button danger > {t("Delete")} </Button>
                </DeleteData>
              </Tooltip>
            ) : null}

            {
              checkPermission("group_update") ?
              <Button onClick={() => { setisOpenForm(true); setId(Number(id)) }}>
                {t("Edit")}
              </Button> : ""
            }
          </div>
        }
        tabs={[
          {
            key: "group-view",
            label: t("Group information"),
            children:<>
              <GroupInfo data={data?.data} isLoading={isLoading} />
              <StudentInfo data={data} urlValue={urlValue} isLoading={isLoading} refetch={refetch} allStudent={allStudent} />
            </>
          },
          {
            key: "group-student",
            label: t("Group composition"),
            children:
            <>
              <GroupStudentsTransfer data={data} isLoading={isLoading} refetch={refetch} />
            </>
          },
          {
            key: "group-time_table", label: t("Time table"), children:
              <GroupTimeTable dates={data?.data?.activeEduSemestr?.weeks} />
          },
          {
            key: "semester-registration", label: t("Semester registration"), children:
              <SemesrtRegistration data={data} isLoading={isLoading} />
          },
        ]}
      />

      <UpdateGroup
        id={departId}
        isOpenForm={isOpenForm}
        setisOpenForm={setisOpenForm}
        setId={setId}
        refetch={refetch}
      />
    </div>
  )
}

export default ViewGroup