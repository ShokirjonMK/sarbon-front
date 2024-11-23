import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Switch, Table } from "antd";
import checkPermission from "utils/check_permission";
import UpdateData from "./crud/update";
import ViewData from "./crud/view";
import { number_order } from "utils/number_orders";
import useGetAllData from "hooks/useGetAllData";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import CustomPagination from "components/Pagination";
import { IEduYear } from "models/education";
import HeaderPage from "components/HeaderPage";
import useDebounce from "hooks/useDebounce";
import { ColumnsType } from "antd/es/table";
import { globalConstants } from "config/constants";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Notification } from "utils/notification";
import { changeStatus } from "./crud/request";

const EduYears = () => {

  const { t } = useTranslation();
  const [itemId, setItemId] = useState<number>()
  const { urlValue, writeToUrl } = useUrlQueryParams({
    currentPage: 1,
    perPage: 10,
  });

  const [id, setId] = useState<number | undefined>();
  const [visibleView, setVisibleView] = useState<boolean>(false);
  const [isOpenForm, setisOpenForm] = useState<boolean>(false);
  const [allData, setallData] = useState<IEduYear[]>();
  const searchVal = useDebounce(urlValue.q, globalConstants.debounsDuration);

  const { data, refetch, isLoading } = useGetAllData<IEduYear>({
    queryKey: ["edu-years", urlValue.perPage, urlValue.currentPage, searchVal],
    url: "edu-years?expand=description",
    urlParams: {
      "per-page": urlValue.perPage,
      page: urlValue.currentPage,
      query: searchVal,
    },
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
      onSuccess: (res) => {
        setallData(res?.items);
        setisOpenForm(false);
      },
    },   
  });

  const { mutate, isLoading: submitLoading } = useMutation({
    mutationFn: (data: number) => changeStatus(data),
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
    },
    retry: 0,
  });

  const columns: ColumnsType<any> = [
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
      width: 45,
    },
    {
      title: t("Name"),
      render: (e) => <span>{e?.name}</span>
    },
    {
      title: t("Type"),
      dataIndex: "type",
    },
    {
      title: t("Status"),
      render: (e) => <Switch disabled={!checkPermission("edu-year_update")} loading={itemId == e?.id && submitLoading} checked={e?.status} onChange={() => {mutate(e?.id); setItemId(e?.id)}} />,
      align: "center",
    },
  ];



  return (
    <div className="">
      <HeaderPage
        title={"Edu Years"}
        create_permission={"none"}
        createOnClick={() => {
          setisOpenForm(true);
          setId(undefined);
        }}
      />

      <UpdateData
        id={id}
        isOpenForm={isOpenForm}
        setId={setId}
        setisOpenForm={setisOpenForm}
        refetch={refetch}
      />
      <ViewData
        id={id}
        visible={visibleView}
        setVisible={setVisibleView}
        url="edu-years"
        title="View edu years"
        refetch={refetch}
        setEditVisible={setisOpenForm}
        permissions={{ delete_: "edu-year_delete", update_: "edu-year_update" }}
      />
      <Table
        columns={columns}
        dataSource={data?.items.length ? data?.items : allData}
        pagination={false}
        loading={isLoading}
        size="middle"
        className="mt-3"
        rowClassName="py-[12px]"
        scroll={{ x: 576 }}
      />
      <CustomPagination
        totalCount={data?._meta.totalCount}
        currentPage={urlValue.currentPage}
        perPage={urlValue.perPage}
      />
    </div>
  );
};
export default EduYears;

/**
 * edu-year_index
 * edu-year_delete
 * edu-year_update
 * edu-year_view
 */