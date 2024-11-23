import React, { useState } from "react";
import { CreateBtn } from "components/Buttons";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { useTranslation } from "react-i18next";
import Table, { ColumnsType } from "antd/es/table";
import { IVedmost } from "models/vedmost";
import { number_order } from "utils/number_orders";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import useGetAllData from "hooks/useGetAllData";
import CustomPagination from "components/Pagination";
import UpdateVedmost from "./crud/update";

const Vedmost : React.FC = () : JSX.Element => {
  const {t} = useTranslation()
  const { urlValue, writeToUrl } = useUrlQueryParams({
    currentPage: 1,
    perPage: 10,
  });

  const [isOpenForm, setisOpenForm] = useState<boolean>(false);
  const [id, setId] = useState<number | undefined>();
  const [allData, setallData] = useState<IVedmost[]>();
  const [searchVal, setSearchVal] = useState<string>("");

  const { data, refetch, isLoading } = useGetAllData<IVedmost>({
    queryKey: ["final-exams",urlValue.perPage,urlValue.currentPage,searchVal,],
    url: `final-exams?expand=user,eduSemestrSubject.subject,group,para,room,examFormType`,
    urlParams: {"per-page": urlValue.perPage,page: urlValue.currentPage, query: searchVal, filter: JSON.stringify(urlValue.filter)},
    options: {
      refetchOnWindowFocus: false,
      retry: 1,
      onSuccess: (res) => {
        setallData(res?.items);
        setisOpenForm(false);
      },
    },
  });

  const columns: ColumnsType<IVedmost> = [
    {
      title: "№",
      dataIndex: "order",
      render: (_, __, i) =>
        number_order(
          urlValue.currentPage,
          urlValue.perPage,
          Number(i),
          isLoading
        ),
    },
    {
      title: t("Name"),
      dataIndex: "name",
      key: "name",
      render: (i, e) =><span>{e?.vedomst}</span>,
    },
    {
      title: t("Responsible employee"),
      dataIndex: "user_id",
      key: "user_id",
      render: (i, e) => <span>{e?.user?.first_name} {e?.user?.last_name} {e?.user?.middle_name}</span>,
    },
    {
      title: t("Edu semestr subject"),
      dataIndex: "edu_semestr_subject_id",
      key: "edu_semestr_subject_id",
      render: (i, e) => <span>{e?.eduSemestrSubject?.subject?.name}</span>,
    },
    {
      title: t("Group"),
      dataIndex: "group_id",
      key: "group_id",
      render: (i, e) => <span>{e?.group?.unical_name}</span>,
    },
    // {
    //   title: t("Exam form type"),
    //   dataIndex: "exam_form_type",
    //   key: "exam_form_type",
    //   render: (i, e) => <span>{e?.exam_form_type}</span>,
    // },
    {
      title: t("Date"),
      dataIndex: "date",
      key: "date",
      render: (i, e) => <span>{e?.date}</span>,
    },
    {
      title: t("Para"),
      dataIndex: "para_id",
      key: "para_id",
      render: (i, e) => <span>{e?.para?.name}</span>,
    },
    {
      title: t("Room"),
      dataIndex: "room_id",
      key: "room_id",
      render: (i, e) => <span>{e?.room?.name}</span>,
    },
  ]
  return(
    <>
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: "/" },
          { name: "Vedmost", path: "" },
        ]}
        title={t("Vedmost")}
        btn={
          <div className="flex items-center">
            <CreateBtn onClick={() => { setisOpenForm(true); setId(undefined); }} permission={"user_index"} />
          </div>
        }
      />

        <UpdateVedmost
          id={id}
          isOpenForm={isOpenForm}
          setisOpenForm={setisOpenForm}
          setId={setId}
          refetch={refetch}
        />

      <div className="p-6">
        <Table
          columns={columns}
          dataSource={data?.items.length ? data?.items : allData}
          pagination={false}
          loading={isLoading}
        />

        <CustomPagination
          totalCount={data?._meta.totalCount}
          currentPage={urlValue.currentPage}
          perPage={urlValue.perPage}
        />
      </div>
    </>
  )
}

export default Vedmost