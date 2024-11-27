import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import useGetAllData from "hooks/useGetAllData";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import CustomPagination from "components/Pagination";
import { number_order } from "utils/number_orders";
import { Col, Collapse, Row, Switch, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useParams } from "react-router-dom";
import { globalConstants } from "config/constants";
import checkPermission from "utils/check_permission";
import { attachSubject } from "./request";
import { useMutation } from "@tanstack/react-query";
import SearchInput from "components/SearchInput";
import useBreadCrumb from "hooks/useBreadCrumb";
import FilterSelect, { TypeFilterSelect } from "components/FilterSelect";

const selectData: TypeFilterSelect[] = [
  {
    name: "kafedra_id",
    label: "Kafedras",
    url: "kafedras",
    permission: "kafedra_index",
    child_names: ["edu_type_id"],
    span: { xs: 24, sm: 24, md: 12, lg: 6, xl: 6 }
  },
  {
    name: "edu_type_id",
    label: "Edu type",
    url: "edu-types",
    permission: "edu-type_index",
    parent_name: "kafedra_id",
    span: { xs: 24, sm: 24, md: 12, lg: 6, xl: 6 }
  },
]


const AttachEduSemestrSubject = (): JSX.Element => {

  const { t } = useTranslation();

  const [subject_id, setSubjectId] = useState<number>();
  const { urlValue } = useUrlQueryParams({ currentPage: 1, perPage: 15 });
  const { semestr_id, edu_plan_id, edu_year_id, edu_form_id, edu_semestr_id } = useParams()

  const [searchVal, setsearchVal] = useState<string>("");

  const { data: eduSemestrs, refetch: eduSemestrRefetch, isFetching: isEduSemestrFetching } = useGetAllData({
    queryKey: ["edu-semestr-subjects", semestr_id],
    url: `edu-semestr-subjects`,
    urlParams: { 
      "per-page": 0,
      filter: JSON.stringify({
        edu_semestr_id
      }) 
     },
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!semestr_id
    }
  })  

  const { data, isLoading } = useGetAllData({
    queryKey: ["subjects", urlValue.perPage, urlValue.currentPage, searchVal, urlValue?.filter?.kafedra_id, urlValue?.filter?.edu_type_id],
    url: "subjects?expand=description,eduYearSubjectSemestr,eduYearSubjectSemestr.eduYear,eduYearSubjectSemestr.semestr,eduYearSubjectSemestr.subjectType,eduYearSubjectSemestr.eduForm,eduYearSubjectSemestr.kafedra",
    urlParams: { 
      "per-page": urlValue.perPage, 
      page: urlValue.currentPage, 
      query: searchVal, 
      semestr_id,
      edu_year_id,
      edu_form_id,
      filter: JSON.stringify({
        edu_type_id: urlValue?.filter?.edu_type_id, 
        kafedra_id: urlValue?.filter?.kafedra_id,
      }) 
    },
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  })

  const { mutate, isLoading: mutateLoading } = useMutation({
    mutationFn: (values: { event: boolean, subject_semestr_id: any, edu_semestr_subject_id: any }) => attachSubject(values?.event, edu_semestr_id, values?.subject_semestr_id, values?.edu_semestr_subject_id),
    onSuccess: (res) => {
      if(res?.status == 1) {
        if(res?.data?.id) {
          window.open(`/edu-plans/semestrs/subject/update/${res?.data?.id}`, "_blank")
        }
        eduSemestrRefetch()
      }
    }
  });

  const switchVal = (subject_semestr_id: number) => {
    const isCheck = eduSemestrs?.items?.map((i: any) => i?.subject_semestr_id)?.includes(subject_semestr_id)
    return isCheck
  }

  const columns: ColumnsType<any> = React.useMemo(() => [
    {
      title: '№',
      dataIndex: 'order',
      render: (_, __, i) => i + 1,
      width: 45,
    },
    {
      title: t("Name"),
      dataIndex: 'name',
    },
    {
      title: t("Kafedra"),
      dataIndex: 'kafedra',
      render: (e) => e?.name
    },
    {
      title: t("Edu year"),
      dataIndex: 'eduYear',
      render: (e) => e?.name
    },
    {
      title: t('Edu form'),
      dataIndex: 'eduForm',
      render: (e) => e?.name
    },
    {
      title: t('Semestr'),
      dataIndex: 'semestr',
      render: (e) => e?.name
    },
    {
      title: t('subject type'),
      dataIndex: 'subjectType',
      render: (e) => e?.name
    },
    {
      title: t('Credit'),
      dataIndex: 'credit',
    },
    // {
    //   title: t('Status'),
    //   render: (e) => <StatusTag status={e?.status} />,
    //   align: "center",
    // },
    {
      title: t('Attachment'),
      dataIndex: "status",
      render: (i, e) => {
        const edu_semestr_subject_id = eduSemestrs?.items?.find((i: any) => i?.subject_semestr_id == e?.id)?.id
        return <Switch
          onChange={(event) => { mutate({ event, subject_semestr_id: e?.id, edu_semestr_subject_id }); setSubjectId(e?.id) }}
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

  useBreadCrumb({pageTitle: "Attach subject to edu semester", breadcrumb: [
    {name: "Home", path: '/'},
    {name: "Edu plans", path: '/edu-plans'},
    { name: "Edu semestrs", path: `/edu-plans/semestrs/view/${edu_plan_id}/${edu_semestr_id}` },
    { name: "Attach subject to edu semester", path: '/edu-plans' }
  ]})

  return (
    <div className="content-card">
      <div>
        <Row gutter={[12, 12]} className="mb-4">
          <Col xs={24} sm={24} md={12} lg={6}>
            <SearchInput className="w-full" setSearchVal={setsearchVal} duration={globalConstants.debounsDuration} />
          </Col>
          {
            selectData?.map((e, i) => (
              <FilterSelect key={i} {...e} />
            ))
          }
        </Row>
        {
          data?.items?.map((item, index) => (
            <Collapse key={index} className='mb-3'>
                <Collapse.Panel header={`${number_order(urlValue.currentPage, urlValue.perPage, Number(index), isLoading)}. ${item?.name}` } key={index+1}>
                  <Table
                    columns={columns}
                    dataSource={item?.eduYearSubjectSemestr?.length ? item?.eduYearSubjectSemestr : []}
                    pagination={false}
                    loading={isLoading}
                    size="middle"
                    className="mt-3"
                    rowClassName="py-[12px]"
                    scroll={globalConstants?.tableScroll}
                  />
                </Collapse.Panel>
            </Collapse>
          ))
        }
        {(data?._meta?.totalCount ?? 0) > 10 ? <CustomPagination totalCount={data?._meta.totalCount} currentPage={urlValue.currentPage} perPage={urlValue.perPage} /> : undefined}
      </div>
    </div>
  )
}

export default AttachEduSemestrSubject;
