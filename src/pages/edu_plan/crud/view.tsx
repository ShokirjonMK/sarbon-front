import { ReactNode } from "react";
import { Button } from "antd";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import useGetOneData from "hooks/useGetOneData";
import Table, { ColumnsType } from "antd/es/table";
import EduSemestr from "pages/edu_semestr";
import checkPermission from "utils/check_permission";
import { IEduPlan } from "models/education";
import { StatusBadge } from "components/StatusTag";
import DeleteData from "components/deleteData";
import dayjs from "dayjs";

interface DataType {
  name: string;
  value: ReactNode;
  value2?: ReactNode;
  value3?: ReactNode;
}

const EduPlanView = () => {

  const { t } = useTranslation();
  const navigate = useNavigate()
  const { id } = useParams()

  const sharedOnCell = (_: DataType, index: number | undefined) => {
    if (index || index == 0) {
      if (index < 2) {
        return { colSpan: 0 };
      }
    }
    return {};
  };

  const { data } = useGetOneData<IEduPlan>({
    queryKey: ['edu-plans', id],
    url: `edu-plans/${id}?expand=createdBy,updatedBy,description,eduYear,faculty,eduType,direction,eduSemestrs,eduForm`,
    options: {
      refetchOnWindowFocus: false,
      retry: 1,
      enabled: (!!id && id != '0'),
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
        colSpan: (index == 0 || index == 1) ? 3 : 1,
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
      name: t("Description"),
      value: data?.data?.description,
    },
    {
      name: t("Edu year"),
      value: data?.data?.eduYear?.name,
      value2: t("Faculty"),
      value3: data?.data?.faculty?.name,
    },
    {
      name: t("Direction"),
      value: data?.data?.direction?.name,
      value2: t("Edu type"),
      value3: data?.data?.eduType?.name,
    },
    {
      name: t("Course duration"),
      value: data?.data?.course,
      value2: t("Semestr duration"),
      value3: data?.data?.course ? data?.data?.course * 2 : "--",
    },
    {
      name: t("Autumn semester"),
      value: data?.data?.first_start + " - " + data?.data?.first_end,
      value2: t("Spring semester"),
      value3: data?.data?.second_start + " - " + data?.data?.second_end,
    },
    {
      name: t("Edu form"),
      value: data?.data?.eduForm?.name,
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
            {data?.data?.created_at ? dayjs.unix(data?.data?.created_at).format("MM-DD-YYYY hh:mm:ss a") : null}
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
            {data?.data?.updated_at ? dayjs.unix(data?.data?.updated_at).format("MM-DD-YYYY hh:mm:ss a") : null}
          </time>
        </div>
      )
    }
  ];

  return (
    <div>
      <HeaderExtraLayout
        title={data?.data?.name ? data?.data?.name : t("Edu plan view")}
        isBack={true}
        breadCrumbData={[
          { name: "Home", path: '/' },
          { name: "Edu plans", path: '/edu-plans' },
          { name: data?.data?.name ? data?.data?.name : t("Edu plan view"), path: '/edu-plans' }
        ]}
        btn={
          <div className="flex">
            <DeleteData
              permission={"edu-plan_delete"}
              refetch={() => { }}
              url={"edu-plans"}
              id={Number(data?.data?.id)}
              navigateUrl="/edu-plans"
            >
              <Button danger>{t("Delete")}</Button>
            </DeleteData>
            {checkPermission("edu-plan_update") ? <Button onClick={() => navigate(`/edu-plans/update/${data?.data?.id}`)} className="ml-3">{t("Edit")}</Button> : ""}

          </div>
        } 
      />
      <div className="content-card">
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

      {checkPermission("edu-semestr_view") ? <EduSemestr /> : ""}
    </div>
  )
}
export default EduPlanView;