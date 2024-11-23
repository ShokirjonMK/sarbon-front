import React, { ReactNode } from "react";
import { ISubject } from "models/subject";
import { useTranslation } from "react-i18next";
import { StatusBadge } from "components/StatusTag";
import useGetAllData from "hooks/useGetAllData";
import dayjs from "dayjs";
import useBreadCrumb from "hooks/useBreadCrumb";

interface DataType {
  name: string;
  value: ReactNode;
  name2: string;
  value2: ReactNode;
}

const ViewSubject: React.FC<{data: ISubject | undefined}> = ({data}): JSX.Element => {
  const { t } = useTranslation();

  const { data: subjectCategories } = useGetAllData<{
    id: number;
    name: string;
    status: number;
  }>({
    queryKey: ["subject-categories"],
    url: `subject-categories`,
    urlParams: { "per-page": 0 },
  });

  const { data: examTypes } = useGetAllData<{
    id: number;
    name: string;
    status: number;
  }>({
    queryKey: ["exams-types"],
    url: `exams-types`,
    urlParams: { "per-page": 0 },
  });

  useBreadCrumb({pageTitle: "Fanni ko'rish", breadcrumb: [{name: "Subjects", path: "/subjects"}, {name: "Fanni ko'rish", path: "/subjects"}]})

  const getName = (id: number | string, type: "ball" | "hour") => {
    if (type === "ball") {
      return examTypes?.items?.find((e) => e?.id == id)?.name;
    }
    if (type === "hour") {
      return subjectCategories?.items?.find((e) => e?.id == id)?.name;
    }
  };

  const getSillabus = (_data: string, type: "ball" | "hour") => {
    let a = 0;
    return (
      <>
        {Object.entries(JSON.parse(_data ?? "{}"))?.map(([key, value]: any) => {
          const name = getName(key, type);
          if (name) {
            a += value;
            return (
              <p>
                <span className="text-slate-400">{name}: </span>
                {value ?? ""} {t(type)}
              </p>
            );
          }
        })}
        <p>
          <span className="text-slate-400">{t("total " + type)}: </span>
          {a} {t(type)}
        </p>
      </>
    );
  };


  const tableData: DataType[] = [
    {
      name: t("Name"),
      value: data?.name,
      name2: t("Description"),
      value2: data?.description,
    },
    {
      name: t("Kafedra"),
      value: data?.kafedra?.name,
      name2: t("Semestr"),
      value2: data?.semestr?.name,
    },
    {
      name: t("Edu form"),
      value: data?.eduForm?.name,
      name2: t("Edu type"),
      value2: data?.eduType?.name,
    },
    {
      name: t("Credit"),
      value: data?.credit,
      name2: t("Status"),
      value2: <StatusBadge status={data?.status} />,
    },
    {
      name: t("Score distribution"),
      value: getSillabus(data?.edu_semestr_exams_types ?? "{}", "ball"),
      name2: t("Distribution of hours"),
      value2: getSillabus(
        data?.edu_semestr_subject_category_times ?? "{}",
        "hour"
      ),
    },
    {
      name: t("CreatedBy"),
      value: (
        <div>
          <span className="text-gray-400">
            {t("name")}/{t("Last Name")}/{t("Role")} :{" "}
          </span>
          {data?.createdBy?.first_name} {data?.createdBy?.last_name}{" "}
          (
          {data?.createdBy?.role.map((item: string) => {
            return item;
          })}
          )
          {/* <p>
            <span className="text-gray-400">{t("Login")}: </span>
            {data?.createdBy?.username}
          </p> */}
          <time className="block">
            <span className="text-gray-400">{t("Date")}: </span>
            {dayjs.unix(Number(data?.created_at)).format('MM-DD-YYYY')}
          </time>
        </div>
      ),
      name2: t("UpdateBy"),
      value2: (
        <div>
          {data?.updatedBy ? (
            <>
              <span className="text-gray-400">
                {t("name")}/{t("Last Name")}/{t("Role")} :{" "}
              </span>
              {data?.updatedBy?.first_name}{" "}
              {data?.updatedBy?.last_name} (
              {data?.updatedBy?.role.map((item: string) => {
                return item;
              })}
              )
              {/* <p>
                <span className="text-gray-400">{t("Login")}: </span>
                {data?.updatedBy?.username}
              </p> */}
              <time className="block">
                <span className="text-gray-400">{t("Date")}: </span>
                {dayjs.unix(Number(data?.updated_at)).format('MM-DD-YYYY')}
              </time>
            </>
          ) : null}
        </div>
    ),
    },
  ];

  return (
    <div className="p-4">
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
        <div className="border-[2px] border-solid border-gray-200 rounded-lg overflow-hidden p-3">
          {
            tableData?.map((item, index) => (
              <div key={index} className={`flex justify-between py-2 px-4 rounded-md ${index % 2 === 0 ? "bg-gray-50" : ""}`}>
                <h3>{item?.name}</h3>
                <p className="font-medium">{item.value}</p>
              </div>
            ))
          }
        </div>
        <div className="border-[2px] border-solid border-gray-200 rounded-lg overflow-hidden p-3">
          {
            tableData?.map((item, index) => (
              <div key={index} className={`flex justify-between py-2 px-4 rounded-md ${index % 2 === 0 ? "bg-gray-50" : ""}`}>
                <h3>{item?.name2}</h3>
                <p className="font-medium">{item.value2}</p>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default ViewSubject;
