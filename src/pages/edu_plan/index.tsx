import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import useGetAllData from "hooks/useGetAllData";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import CustomPagination from "components/Pagination";
import { number_order } from "utils/number_orders";
import { Col, Row, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { CreateBtn } from "components/Buttons";
import { Link, useNavigate } from "react-router-dom";
import Actions from "components/Actions";
import SearchInput from "components/SearchInput";
import { globalConstants } from "config/constants";
import StatusTag from "components/StatusTag";
import checkPermission from "utils/check_permission";
import { IEduPlan } from "models/education";
import FilterSelect, { TypeFilterSelect } from "components/FilterSelect";
import useBreadCrumb from "hooks/useBreadCrumb";

const selectData: TypeFilterSelect[] = [
  {
    name: "faculty_id",
    label: "Faculty",
    url: "faculties",
    permission: "faculty_index",
    child_names: ["direction_id"],
    span: { xs: 24, sm: 24, md: 12, lg: 6, xl: 4 }
  },
  {
    name: "direction_id",
    label: "Direction",
    url: "directions",
    permission: "direction_index",
    parent_name: "faculty_id",
    span: { xs: 24, sm: 24, md: 12, lg: 6, xl: 4 }
  },
  {
    name: "edu_type_id",
    label: "edu type",
    url: "edu-types",
    permission: "edu-type_index",
    span: { xs: 24, sm: 24, md: 12, lg: 6, xl: 4 }
  },
]

const EduPlan = () => {

  const { t } = useTranslation();
  const [allData, setAllData] = useState<any[]>([]);
  const { urlValue } = useUrlQueryParams({ currentPage: 1, perPage: 15 });
  const navigate = useNavigate()
  const [searchVal, setSearchVal] = useState<string>("");

  const { data, refetch, isLoading } = useGetAllData<IEduPlan>({
    queryKey: ["edu-plans", urlValue.perPage, urlValue.currentPage, searchVal, urlValue?.filter],
    url: "edu-plans?sort=-id&expand=description,eduYear,faculty,eduType,direction,eduSemestr,eduForm",
    urlParams: { "per-page": urlValue.perPage, page: urlValue.currentPage, query: searchVal, filter: JSON.stringify(urlValue?.filter) },
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
      onSuccess: (res) => {
        setAllData(res?.items);
      }
    }
  })

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
      render: (name, e) => checkPermission("edu-plan_view") ? <Link to={`/edu-plans/view/${e?.id}`} className="text-[#000] underline">{name}</Link> : name
    },
    {
      title: t('Faculty'),
      dataIndex: 'faculty',
      render: (e) => e?.name
    },
    {
      title: t('Direction'),
      dataIndex: 'direction',
      render: (e) => e?.name
    },
    {
      title: t('Edu type'),
      dataIndex: 'eduType',
      render: (e) => e?.name
    },
    {
      title: t('Edu year'),
      dataIndex: 'eduYear',
      render: (e) => e?.name
    },
    {
      title: t('Course'),
      dataIndex: 'course'
    },
    {
      title: t('Edu form'),
      dataIndex: 'eduForm',
      render: (e) => e?.name
    },
    {
      title: t('Status'),
      render: (e) => <StatusTag status={e?.status} />,
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
        onClickEdit={() => navigate(`/edu-plans/update/${e?.id}`)}
        onClickView={() => navigate(`/edu-plans/view/${e?.id}`)}
        viewPermission={'edu-plan_view'}
        editPermission={"edu-plan_update"}
        deletePermission={"edu-plan_delete"}
      />,
    },
  ], [data?.items]);

  useBreadCrumb({pageTitle: t("Edu plans"), breadcrumb: [
    {name: "Home", path: '/'},
    {name: t("Edu plans"), path: '/edu-plans'},
  ]})

  return (
    <div className="content-card">
      <div className="d-f gap-3 mb-2 justify-end" >
        <Link to={'/edu-plans/create/0'} style={{textDecoration:"none"}}><CreateBtn onClick={() => navigate('/edu-plans/create/0')} permission={"edu-plan_create"} /></Link>
      </div>
      <div>
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={24} md={12} lg={6}>
            <SearchInput setSearchVal={setSearchVal} duration={globalConstants.debounsDuration} />
          </Col>
          {
            selectData?.map((e, i) => (
              <FilterSelect key={i} {...e} />
            ))
          }
        </Row>
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

export default EduPlan;
