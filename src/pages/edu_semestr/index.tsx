import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import useGetAllData from "hooks/useGetAllData";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import CustomPagination from "components/Pagination";
import { number_order } from "utils/number_orders";
import { Switch, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { Link, useNavigate, useParams } from "react-router-dom";
import Actions from "components/Actions";
import { globalConstants } from "config/constants";
import checkPermission from "utils/check_permission";
import { changeEduSemestr } from "./crud/request";
import UpdateEduSemestr from "./crud/update";
import { useMutation } from "@tanstack/react-query";

const EduSemestr = () => {

  const { t } = useTranslation();

  const [id, setId] = useState<number | undefined>();
  const [selectedItem, setselectedItem] = useState<{ id: number | undefined, type: string }>();
  const [isOpenForm, setisOpenForm] = useState<boolean>(false);
  const [allData, setAllData] = useState<any[]>([]);
  const { urlValue } = useUrlQueryParams({ currentPage: 1, perPage: 15 });
  const navigate = useNavigate()
  const { id: edu_plan_id } = useParams()

  const { data, refetch, isLoading, isFetching } = useGetAllData({
    queryKey: ["edu-semestrs", urlValue.perPage, urlValue.currentPage, edu_plan_id],
    url: "edu-semestrs?expand=description,eduYear,course,eduPlan,semestr",
    urlParams: { "per-page": urlValue.perPage, page: urlValue.currentPage, filter: { edu_plan_id } },
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
      onSuccess: (res) => {
        setAllData(res?.items);
      }
    }
  })

  const { mutate, isLoading: muatationLoader } = useMutation({
    mutationFn: (newVals: any) => changeEduSemestr(newVals?.id, newVals?.obj),
    onSuccess: async (res) => {
      refetch();
    },
    retry: 0,
  });

  const columns: ColumnsType<any> = React.useMemo(() => [
    {
      title: '№',
      dataIndex: 'order',
      render: (_, __, i) => number_order(urlValue.currentPage, urlValue.perPage, Number(i), isLoading),
      width: 45,
    },
    {
      title: t('Name'),
      dataIndex: 'name',
      render: (name, e) => checkPermission("edu-semestr_view") ? <Link to={`/edu-plans/semestrs/view/${edu_plan_id}/${e?.id}`} className="text-[#000] underline">{name}</Link> : name
    },
    {
      title: t('Course'),
      dataIndex: 'course',
      render: (e) => e?.name
    },
    {
      title: t('Semestr'),
      dataIndex: 'semestr',
      render: (e) => e?.name
    },
    {
      title: t('Edu year'),
      dataIndex: 'eduYear',
      render: (e) => e?.name
    },
    {
      title: t('Duration'),
      dataIndex: 'duration',
      render: (i, e) => e?.start_date?.slice(0, 10) + " - " + e?.end_date?.slice(0, 10)
    },
    {
      title: t('Confirmation'),
      dataIndex: "is_checked",
      render: (i, e) => <Switch onChange={(event) => { mutate({ id: e?.id, obj: { is_checked: event } }); setselectedItem({ id: e?.id, type: "checked" }) }} loading={(muatationLoader || isFetching) && selectedItem?.id === e?.id && selectedItem?.type === 'checked'} checkedChildren="on" unCheckedChildren="Off" checked={i === 1} disabled={!checkPermission("edu-semestr_update")} />,
      align: "center",
    },
    {
      title: t('Status'),
      dataIndex: "status",
      render: (i, e) => <Switch onChange={(event) => { mutate({ id: e?.id, obj: { status: event } }); setselectedItem({ id: e?.id, type: "status" }) }} loading={(muatationLoader || isFetching) && selectedItem?.id === e?.id && selectedItem?.type === 'status'} checkedChildren="on" unCheckedChildren="Off" checked={i === 1} disabled={!checkPermission("edu-semestr_update")} />,
      align: "center",
    },
    {
      title: t("Actions"),
      dataIndex: 'actions',
      width: 120,
      align: "center",
      render: (i, e) => <Actions
        id={e?.id}
        url={'edu-plans'}
        refetch={refetch}
        onClickEdit={() => { setisOpenForm(true); setId(e?.id) }}
        onClickView={() => navigate(`/edu-plans/semestrs/view/${edu_plan_id}/${e?.id}`)}
        viewPermission={'edu-semestr_view'}
        editPermission={"edu-semestr_update"}
        deletePermission={"none"}
      />
    },
  ], [data?.items, muatationLoader, isFetching]);

  return (
    <div className="">
      <div className="px-[24px] py-[20px]">
        <h3 className="text-[16px] font-medium mb-[24px]">{t('Educational semesters')}</h3>
        <Table
          columns={columns}
          dataSource={data?.items.length ? data?.items : allData}
          pagination={false}
          loading={isLoading}
          size="middle"
          className="mt-3"
          rowClassName="py-[12px]"
          scroll={globalConstants?.tableScroll}
        />
        {(data?._meta?.totalCount ?? 0) > 10 ? <CustomPagination totalCount={data?._meta.totalCount} currentPage={urlValue.currentPage} perPage={urlValue.perPage} /> : undefined}
      </div>

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

export default EduSemestr;
