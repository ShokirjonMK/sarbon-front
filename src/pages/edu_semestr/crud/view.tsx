import { ReactNode, useState } from "react";
import { Button } from "antd";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import useGetOneData from "hooks/useGetOneData";
import Table, { ColumnsType } from "antd/es/table";
import checkPermission from "utils/check_permission";
import { IEduSemestr } from "models/education";
import { StatusBadge } from "components/StatusTag";
import EduSemestrSubject from "pages/edu_semestr_subjects";
import UpdateEduSemestr from "./update";
import dayjs from "dayjs";

interface DataType {
  name: string;
  value: ReactNode;
  value2?: ReactNode;
  value3?: ReactNode;
}

const EduSemestrView = () => {

  const { t } = useTranslation();
  const { edu_semestr_id } = useParams()
  const [isOpenForm, setisOpenForm] = useState<boolean>(false);
  const [id, setId] = useState<number | undefined>();

  const sharedOnCell = (_: DataType, index: number | undefined) => {
    if (index || index == 0) {
      if (index < 1) {
        return { colSpan: 0 };
      }
    }
    return {};
  };

  const { data, refetch, isFetching } = useGetOneData<IEduSemestr>({
    queryKey: ['edu-semestrs', edu_semestr_id],
    url: `edu-semestrs/${edu_semestr_id}?expand=createdBy,updatedBy,description,eduYear,eduType,eduPlan,semestr,course,eduSemestrSubjects,eduSemestrSubjects.subject,eduSemestrSubjects.subjectType`,
    options: {
      refetchOnWindowFocus: false,
      retry: 1,
      enabled: (!!edu_semestr_id && edu_semestr_id != '0'),
    }
  })

  const columns: ColumnsType<DataType> = [
    {
      title: t("Name"),
      dataIndex: "name",
      rowScope: "row",
    },
    {
      title: t("Value"),
      dataIndex: "value",
      onCell: (_, index) => ({
        colSpan: (index == 0) ? 3 : 1,
      }),
    },
    {
      title: t("Name2"),
      dataIndex: "value2",
      onCell: (_, index) => sharedOnCell(_, index),
      className: "bg-[#FAFAFA]"
    },
    {
      title: t("Name3"),
      dataIndex: "value3",
      onCell: (_, index) => sharedOnCell(_, index),
    },
  ];

  const tableData: DataType[] = [
    {
      name: t("Name"),
      value: data?.data?.name
    },
    {
      name: t("Semestr"),
      value: data?.data?.semestr?.name,
      value2: t("Course"),
      value3: data?.data?.course?.name,
    },
    {
      name: t("Edu year"),
      value: data?.data?.eduYear?.name,
      value2: t("Edu plan"),
      value3: data?.data?.eduPlan?.name,
    },
    {
      name: t("Start time"),
      value: data?.data?.start_date?.slice(0, 10),
      value2: t("End time"),
      value3: data?.data?.end_date?.slice(0, 10),
    },
    {
      name: t("Confirmation"),
      value: data?.data?.is_checked === 1 ? <p className="text-[#52C41A]">Tasdiqlangan</p> : <p className="text-[#ffc069]">Tasdiqlanmagan</p>,
      value2: t("Status"),
      value3: <StatusBadge status={data?.data?.status} />,
    },
    {
      name: t("CreatedBy"),
      value: (
        <div>
          <span className="text-gray-400">
            {t("name")}/{t("Last Name")}/{t("Role")} :{" "}
          </span>
          {data?.data?.createdBy?.first_name} {data?.data?.createdBy?.last_name}{" "}
          (
          {data?.data?.createdBy?.role.map((item: string) => {
            return item;
          })}
          )
          {/* <p>
            <span className="text-gray-400">{t("Login")}: </span>
            {data?.data?.createdBy?.username}
          </p> */}
          <time className="block">
            <span className="text-gray-400">{t("Date")}: </span>
            {/* {data?.data?.created_at} */}
            {data?.data?.created_at ? dayjs.unix(data?.data?.created_at).format("DD-MM-YYYY hh:mm:ss a") : "--"}
          </time>
        </div>
      ),
      value2: t("UpdateBy"),
      value3: (
        <div>
          <span className="text-gray-400">
            {t("name")}/{t("Last Name")}/{t("Role")} :{" "}
          </span>
          {data?.data?.updatedBy?.first_name} {data?.data?.updatedBy?.last_name}{" "}
          (
          {data?.data?.updatedBy?.role.map((item: string) => {
            return item;
          })}
          )
          {/* <p>
            <span className="text-gray-400">{t("Login")}: </span>
            {data?.data?.updatedBy?.username}
          </p> */}
          <time className="block">
            <span className="text-gray-400">{t("Date")}: </span>
            {data?.data?.updated_at ? dayjs.unix(data?.data?.updated_at).format("DD-MM-YYYY hh:mm:ss a") : "--"}
          </time>
        </div>
      )
    }
  ];

  return (
    <div>
      <HeaderExtraLayout
        title={data?.data?.name ? data?.data?.name : t("Edu semestr view")}
        isBack={true}
        breadCrumbData={[
          { name: "Home", path: '/' },
          { name: "Edu plans", path: '/edu-plans' },
          { name: data?.data?.name ? data?.data?.name : t("Edu semestr view"), path: '/edu-plans/semestrs' }
        ]}
        btn={checkPermission("edu-semestr_update") ? <Button onClick={() => { setisOpenForm(true); setId(Number(edu_semestr_id)) }} className="ml-3">{t("Edit")}</Button> : ""}
      />
      <div className="px-[24px] py-[20px]">
        <div className="table-none-hover">
          <Table
            columns={columns}
            bordered
            dataSource={tableData}
            showHeader={false}
            pagination={false}
          />
        </div>
      </div>

      {checkPermission("edu-semestr-subject_view") ? <EduSemestrSubject eduSemestrs={data?.data} eduSemestrRefetch={refetch} isEduSemestrFetching={isFetching} /> : ""}

      <UpdateEduSemestr
        id={id}
        isOpenForm={isOpenForm}
        setId={setId}
        setisOpenForm={setisOpenForm}
        refetch={refetch}
      />
    </div>
  )
}
export default EduSemestrView;