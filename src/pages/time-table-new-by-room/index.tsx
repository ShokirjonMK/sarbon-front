import React, { useState } from "react";
import { Col,DatePicker,Row, Tag } from "antd";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import { useTranslation } from "react-i18next";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import FilterSelect, { TypeFilterSelect } from "components/FilterSelect";
import { IGroup } from "models/education";
import Table, { ColumnsType } from "antd/es/table";
import { number_order } from "utils/number_orders";
import useGetAllData from "hooks/useGetAllData";
import CustomPagination from "components/Pagination";
import dayjs from "dayjs";
import { renderFullName } from "utils/others_functions";
import useBreadCrumb from "hooks/useBreadCrumb";

const selectData: TypeFilterSelect[] = [
  {
    name: "building_id",
    label: "Building",
    url: "buildings",
    permission: "building_index",
    child_names: ["room_id"],
    span: { xs: 24, sm: 24, md: 12, lg: 6, xl: 6 }
  },
  {
    name: "room_id",
    label: "Room",
    url: "rooms",
    permission: "room_index",
    parent_name: "building_id",
    render(e) {
        return `${e?.name}, ${e?.room_type?.name} ${e?.capacity}`
    },
    span: { xs: 24, sm: 24, md: 12, lg: 6, xl: 6 }
  },
  {
    name: "attend_status",
    label: "Davomat statusi",
    permission: "room_index",
    parent_name: "building_id",
    staticData: [{id: "0", name: "Davomat qilinmagan"}, {id: "1", name: "Davomat qilingan"}],
    span: { xs: 24, sm: 24, md: 12, lg: 6, xl: 6 }
  },
];

const TimeTableNewByRoom: React.FC = (): JSX.Element => {

  const { t } = useTranslation();
  
  const { urlValue, writeToUrl } = useUrlQueryParams({
    currentPage: 1,
    perPage: 10,
  });

  const [allData, setallData] = useState();

  const { data, isFetching } = useGetAllData({
    queryKey: ["timetable-dates/filter", urlValue.filter_like?.date, urlValue.filter, urlValue.filter_like?.attend_status],
    url: `timetable-dates/filter`,
    urlParams: {
      expand: "subject,subjectCategory,week,para,user,user.profile,building,room,all,all.group,secondGroup,secondGroup.user,secondGroup.user.profile,secondGroup.building,secondGroup.room",
      "per-page": urlValue.perPage,
      page: urlValue.currentPage, 
      filter: JSON.stringify({...urlValue.filter, date: urlValue.filter_like?.date, attend_status: urlValue.filter_like?.attend_status}),
    },
    options: {
      refetchOnWindowFocus: false,
      enabled: !!urlValue.filter_like?.date && (!!urlValue.filter?.room_id || !!urlValue.filter?.building_id),
      retry: 1,
      // onSuccess: (res) => {
      //   setallData(res?.items);
      // },
    },
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
          isFetching
        ),
    },
    {
      title: t("Para"),
      dataIndex: "para",
      render: (e) => e?.name,
    },
    {
      title: t("Group"),
      dataIndex: "all",
      render: (e) => e?.map((i: any) => <Tag className="my-1">{i?.group?.unical_name}</Tag>),
    },
    {
      title: t("Subject"),
      key: "subject",
      render: (i, e) => `${e?.subject?.name}, ${e?.subjectCategory?.name}`,
    },
    {
      title: t("Teacher"),
      dataIndex: "user",
      render: (e) => renderFullName(e?.profile),
    },
    {
      title: t("Week"),
      dataIndex: "week",
      render: (e) => e?.name,
    },
    {
      title: t("Building"),
      dataIndex: "building",
      render: (e) => e?.name,
    },
    {
      title: t("Room"),
      dataIndex: "room",
      render: (e) => `${e?.name}, ${e?.room_type?.name} ${e?.capacity}`,
    },
    {
      title: t("Attend"),
      dataIndex: "attend_status",
      render: (e) => <Tag color={e === 0 ? "error" : "success"} >{e === 0 ? "Davomat qilinmagan!" : "Davomat qilingan!"}</Tag>,
    },


    // {
    //   title: t("Edu plan"),
    //   dataIndex: "edu_plan_id",
    //   key: "edu_plan_id",
    //   render: (i, e) => <span>{e?.eduPlan?.name}</span>,
    // },
    // {
    //   title: t("Actions"),
    //   dataIndex: "actions",
    //   key: "actions",
    //   render: (i, e) => (
    //     <Actions
    //       id={e?.id}
    //       url={"groups"}
    //       refetch={refetch}
    //       onClickEdit={() => { setId(e?.id);}}
    //       onClickView={() => navigate(`/group/view/${e?.id}`)}
    //       viewPermission={"group_view"}
    //       editPermission={"group_update"}
    //       deletePermission={"group_delete"}
    //     />
    //   ),
    // },
  ]

  useBreadCrumb({pageTitle: "Time table", breadcrumb: [
    { name: "Home", path: "/" },
    { name: "Time table", path: "" },
  ]})

  return (
    <div className="content-card">

      <div>
        <Row gutter={[12, 12]}>
          {
            selectData?.map((e, i) => (
              <FilterSelect key={i} {...e}/>
            ))
          }
          {/* {selectData?.map((e, i) => (
            <Col key={i} xs={24} sm={24} md={12} lg={8} xl={6}>
              <FilterSelect
                url={e.url}
                name={e.name}
                label={e.label}
                permission={e.permission}
                parent_name={e?.parent_name}
                child_names={e?.child_names}
                value_name={e?.value_name}
                span={{ xs: 24, sm: 24, xl: 24, lg: 24 }}
                render={e?.render}
              />
              


            </Col>
          ))} */}
          <Col xs={24} sm={24} md={12} lg={8} xl={6}>
            <DatePicker value={urlValue.filter_like?.date ? dayjs(urlValue.filter_like?.date, "YYYY-MM-DD") : undefined} allowClear={false} className="w-full" format={'YYYY-MM-DD'} onChange={(e) => writeToUrl({name: "date", value: dayjs(e).format("YYYY-MM-DD")})} />
          </Col>
        </Row>

        <div className="mt-4">
          <Table
            columns={columns}
            dataSource={data?.items.length ? data?.items?.sort((a, b) => a?.para_id - b?.para_id) : allData}
            pagination={false}
            loading={isFetching}
          />

          <CustomPagination
            totalCount={data?._meta.totalCount}
            currentPage={urlValue.currentPage}
            perPage={urlValue.perPage}
          />
        </div>
      </div>
    </div>
  )
}

export default TimeTableNewByRoom;