import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import useGetAllData from "hooks/useGetAllData";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import CustomPagination from "components/Pagination";
import { number_order } from "utils/number_orders";
import { Switch, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useParams } from "react-router-dom";
import { globalConstants } from "config/constants";
import checkPermission from "utils/check_permission";
import StatusTag from "components/StatusTag";
import { attachSubject } from "./request";
import { useMutation } from "@tanstack/react-query";
import useGetOneData from "hooks/useGetOneData";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import SearchInput from "components/SearchInput";

const AttachEduSemestrSubject = (): JSX.Element => {

  const { t } = useTranslation();

  const [allData, setAllData] = useState<any[]>([]);
  const [subject_id, setSubjectId] = useState<number>();
  const { urlValue } = useUrlQueryParams({ currentPage: 1, perPage: 15 });
  const { edu_semestr_id, edu_plan_id } = useParams()

  const [searchVal, setsearchVal] = useState<string>("");

  const { data: eduSemestrs, refetch: eduSemestrRefetch, isFetching: isEduSemestrFetching } = useGetOneData({
    queryKey: ["edu-semestrs", urlValue.perPage, urlValue.currentPage, searchVal, edu_semestr_id],
    url: `edu-semestrs/${edu_semestr_id}?expand=createdBy,updatedBy,description,eduYear,eduType,eduPlan,semestr,course,eduSemestrSubjects`,
    urlParams: { "per-page": urlValue.perPage, page: urlValue.currentPage, query: searchVal },
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!edu_semestr_id
    }
  })

  const { data, isLoading } = useGetAllData({
    queryKey: ["subjects", urlValue.perPage, urlValue.currentPage, searchVal,],
    url: "subjects?expand=description,subjectType,eduForm",
    urlParams: { "per-page": urlValue.perPage, page: urlValue.currentPage, query: searchVal, filter: {semestr_id: eduSemestrs?.data?.semestr_id, edu_form_id: eduSemestrs?.data?.eduPlan?.edu_form_id} },
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
      onSuccess: (res) => {
        setAllData(res?.items);
      },
      enabled: !!eduSemestrs?.data
    },
  })

  const { mutate, isLoading: mutateLoading } = useMutation({
    mutationFn: (values: { event: boolean, subject_id: any, edu_semestr_subject_id: any }) => attachSubject(values?.event, edu_semestr_id, values?.subject_id, values?.edu_semestr_subject_id),
    onSuccess: () => {
      eduSemestrRefetch()
    }
  });

  const switchVal = (subject_id: number) => {
    const isCheck = eduSemestrs?.data?.eduSemestrSubjects?.map((i: any) => i?.subject_id)?.includes(subject_id)
    return isCheck
  }

  const columns: ColumnsType<any> = React.useMemo(() => [
    {
      title: '№',
      dataIndex: 'order',
      render: (_, __, i) => number_order(urlValue.currentPage, urlValue.perPage, Number(i), isLoading),
      width: 45,
    },
    {
      title: t('Name'),
      // dataIndex: 'name',
      render(e) {
        return <span>{e?.name} <span className="text-blue-900 font-bold"> - {e?.eduForm?.name}</span></span>
      },
    },
    {
      title: t('Description'),
      dataIndex: 'description'
    },
    {
      title: t('Subject type'),
      dataIndex: 'subjectType',
      render: (e) => e?.name
    },
    {
      title: t('Credit'),
      dataIndex: 'credit'
    },
    {
      title: t('Total score'),
      dataIndex: 'max_ball'
    },
    {
      title: t('Total hour'),
      dataIndex: 'auditory_time'
    },
    {
      title: t('Status'),
      render: (e) => <StatusTag status={e?.status} />,
      align: "center",
    },
    {
      title: t('Attachment'),
      dataIndex: "status",
      render: (i, e) => {
        const edu_semestr_subject_id = eduSemestrs?.data?.eduSemestrSubjects?.find((i: any) => i?.subject_id == e?.id)?.id
        return <Switch
          onChange={(event) => { mutate({ event, subject_id: e?.id, edu_semestr_subject_id }); setSubjectId(e?.id) }}
          checked={switchVal(e?.id)}
          checkedChildren="on"
          unCheckedChildren="Off"
          loading={(mutateLoading || isEduSemestrFetching) && (e?.id === subject_id)}
          disabled={!checkPermission("edu-semestr_update")}
        />
      },
      align: "center",
    }
  ], [data?.items, eduSemestrs, mutateLoading, isEduSemestrFetching, subject_id]);


  return (
    <div className="">
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: '/' },
          { name: "Edu plans", path: '/edu-plans' },
          { name: "Edu semestrs", path: `/edu-plans/semestrs/view/${edu_plan_id}/${edu_semestr_id}` },
          { name: "Attach subject to edu semester", path: '/edu-plans' },
        ]}
        title={t("Attach subject to edu semester")}
        isBack={true}
      />
      <div className="px-[24px] py-[20px]">
        <SearchInput className="w-[320px]" setSearchVal={setsearchVal} duration={globalConstants.debounsDuration} />
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
    </div>
  )
}

export default AttachEduSemestrSubject;
