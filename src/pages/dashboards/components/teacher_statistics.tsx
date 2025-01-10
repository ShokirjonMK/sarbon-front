import { Alert, Col, Drawer, Row, Table, Tabs, Tag, Tooltip } from "antd"
import { ColumnsType } from "antd/es/table"
import CustomPagination from "components/Pagination"
import useUrlQueryParams from "hooks/useUrlQueryParams"
import { useTranslation } from "react-i18next"
import { number_order } from "utils/number_orders"
import React, { useState } from 'react'
import useGetAllData from "hooks/useGetAllData"
import { renderFullName } from "utils/others_functions"
import SearchInput from "components/SearchInput"
import { globalConstants } from "config/constants"
import dayjs from "dayjs"
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout"
import FilterSelect, { TypeFilterSelect } from "components/FilterSelect"
import useGetData from "hooks/useGetData"
import type { TabsProps } from 'antd';
import instance from "config/_axios"
import { excelExport } from "utils/excelExport"
import { ExcelBtn } from "components/Buttons"

const selectData: TypeFilterSelect[] = [
  {
    name: "kafedra_id",
    label: "Kafedra",
    url: "kafedras",
    permission: "kafedra_index",
    span: { xl: 8 }
  },
  {
    name: "edu_year_id",
    label: "Edu year",
    url: "edu-years",
    filter: { status: "all" },
    all: true,
    permission: "edu-year_index",
    render: (e) => <div>{e?.name}{e?.status ? <Tag color="success" className="ml-2" >Active</Tag> : null}</div>,
    span: { xl: 8 }
  },
]

const TeacherStatistics = () => {

  const { t } = useTranslation();
  const [allData, setallData] = useState<any[]>();
  const [searchVal, setSearchVal] = useState<string>("");
  const [selectedDate, setselectedDate] = useState<string | number | undefined>(undefined);
  const [selectedTeacherAccessId, setselectedTeacherAccessId] = useState<number | undefined>(undefined);
  const [changedtimetable, setchangedtimetable] = useState<any>({});
  const [userAttendPercent, setuserAttendPercent] = useState<{ [user_id: number]: { percent: number | string, tag: any } }>();
  const [loading, setLoading] = useState(false);

  const { urlValue } = useUrlQueryParams({
    currentPage: 1,
    perPage: 10,
  });


  const { data: weeks } = useGetData({
    queryKey: ["weeks"],
    url: `weeks`,
    urlParams: {
      filter: JSON.stringify({ status: 1 })
    }
  })

  const { data: timetableDates } = useGetData({
    queryKey: ["timetable-dates/get-date", urlValue?.filter?.edu_year_id, selectedDate],
    url: `timetable-dates/get-date`,
    urlParams: {
      expand: "group,building,room,subject,subjectCategory,para,week",
      edu_year_id: urlValue?.filter?.edu_year_id,
      teacher_access_id: selectedTeacherAccessId,
      date: selectedDate,
    },
    options: {
      onSuccess: (res) => {
        const obj: any = {}

        for (const item of res?.items) {

          // dars jadvalini ids_id boyicha yigish
          if (Object.keys(obj).includes(String(item?.ids_id))) {
            obj[item?.ids_id] = [...obj[item?.ids_id], item]
          } else {
            obj[item?.ids_id] = [item]
          }

        }
        setchangedtimetable(obj)
      },
      enabled: !!selectedDate
    }
  })

  // dars jadvalini ids_id boyicha yigish
  const calcAttendPercent = (items: any) => {
    const userAttend: any = {}

    for (const user of items) {
      const userAttendArr: any[] = []

      for (const tAccess of user?.teacherAccess) {
        for (const tDate of tAccess?.timeTableDates) {

          const dateStr = tDate?.date;
          const dateObj = dayjs(dateStr, "YYYY-MM-DD");
          const dateTime = dateObj.unix();

          const now = dayjs().format("YYYY-MM-DD");
          const nowObj = dayjs(now, "YYYY-MM-DD");
          const currentUnixTime = nowObj.unix();;

          if (dateTime < currentUnixTime) userAttendArr.push(tDate?.attendStatus);

        }
      }

      let percentObj: { percent: number | string, tag: any } = { percent: '', tag: <></> };

      if (userAttendArr?.length) {
        const realPer = (userAttendArr?.filter((i: any) => i === 2)?.length / userAttendArr?.length) * 100
        percentObj.percent = realPer
        percentObj.tag = <>
          <p className={realPer <= 60 ? "text-red-600" : realPer <= 80 ? "text-orange-300" : "text-green-500"}>{(realPer).toFixed(2)} %</p>
        </>
      } else {
        percentObj.percent = "Darsi yo'q";
        percentObj.tag = <p className={"text-orange-300"}>Darsi yo'q</p>
      }
      userAttend[user?.id] = percentObj
    }
    setuserAttendPercent(userAttend)
    return userAttend
  }

  const { data, isLoading } = useGetAllData<any>({
    queryKey: ["users", urlValue.perPage, urlValue.currentPage, searchVal, urlValue?.filter],
    url: `users?sort=-id&expand=teacherAccess.timeTableDates,teacherAccess.subject,teacherAccess.subjectCategory,teacherAccess.timeTableDates.attendStatus`,
    urlParams: {
      "per-page": urlValue.perPage,
      page: urlValue.currentPage,
      filter: { "role_name": ["teacher"] },
      "filter-like": { first_name: searchVal },
      kafedra_id: urlValue?.filter?.kafedra_id,
      edu_year_id: urlValue?.filter?.edu_year_id,
    },
    options: {
      refetchOnWindowFocus: false,
      retry: 1,
      onSuccess: (res) => {
        setallData(res?.items);
        calcAttendPercent(res?.items)
      },
    },
  });

  const renderTabsItems = (dates: any, teacher_access_id: number): TabsProps['items'] => {
    return weeks?.items?.filter((e: any) => !!dates?.find((d: any) => d?.week_id == e?.id))?.map((i: any) => {

      const current_dates = dates?.filter((date: { date: string, week_id: string | number }) => date?.week_id == i?.id);

      return {
        key: i?.id,
        label: i?.name,
        children: current_dates?.length ? current_dates?.map((i: { date: string, week_id: string | number, attendStatus: 0 | 1 | 2 }, idx: number) => (
          <Tag
            key={idx}
            onClick={() => { setselectedDate(i?.date); setselectedTeacherAccessId(teacher_access_id) }}
            color={i?.attendStatus === 0 ? "error" : i?.attendStatus === 1 ? "warning" : "success"}
            className="mb-2 cursor-pointer"
          >
            {i?.date}
          </Tag>
        )) : "Haftaning bu kunida o'qituvchining darsi yo'q!"
      }
    })
  };

  const expandedRowRender = (user: any) => {

    return (
      <div className="pl-10">
        {
          user?.teacherAccess?.length ? user?.teacherAccess?.map((item: any) => (
            <table key={item?.id} className='responsiveTableSm w-full mb-2 bg-white text-[13px]' >
              <tbody>
                <tr>
                  <th className="text-left w-[300px]">{item?.subject?.name} ({item?.subjectCategory?.name})</th>
                  {
                    item?.timeTableDates?.length
                      ? <Tabs defaultActiveKey="1" className="mx-4" items={renderTabsItems(item?.timeTableDates, item?.id)} />
                      : <Alert message="Bu fandan dars jadvali kiritilmagan!" className="m-1" type="warning" />
                  }
                </tr>
              </tbody>
            </table>
          ))
            : <Alert message="O'qituvchiga fan biriktirilmagan!" type="warning" />}
      </div>
    )
  };


  const columns: ColumnsType<any> = React?.useMemo(() => [
    {
      title: "№",
      dataIndex: "order",
      width: 60,
      render: (_, __, i) =>
        number_order(urlValue.currentPage, urlValue.perPage, Number(i), isLoading),
    },
    {
      title: t("FullName"),
      key: "first_name",
      render: (i, e) => renderFullName(e)
    },
    {
      title: t("Davomat foizda (%)"),
      key: "percent",
      rowSpan: 3,
      render: (i) => {
        const percent = userAttendPercent?.[i?.id]?.tag ?? ""
        return percent
      },
    },
    // {
    //   title: `${t("Content")} (Mavzular soni)`,
    //   key: "content",
    //   align: "center",
    //   render: (i) => {
    //     return <>
    //     {
    //         i?.allTeacherAccess?.map((item: any, index: number) => (
    //             item?.statisticAttend?.length > 0 ?
    //             <p key={index} className="py-3 statistics-table-item-border">{item?.contentCount?.teacher_topic_count} / {item?.contentCount?.subject_topic_count}</p> : null
    //         ))
    //     }
    //     </>
    //   },
    // },
  ], [data?.items, userAttendPercent])

  console.log("userAttendPercent", userAttendPercent);



  const calcContentPercent = (item: any) => {
    const allcontentCount = item?.teacherAccess?.reduce((acc: number, cur: any) => acc += cur?.contentCount?.subject_topic_count, 0);
    const teachercontentCount = item?.teacherAccess?.reduce((acc: number, cur: any) => acc += cur?.contentCount?.teacher_topic_count, 0);


    if (allcontentCount == 0) return { tag: <span className="text-orange-400">Mavzu qo'shilmagan</span>, percent: "Mavzu qo'shilmagan" }

    const percent = Math.round((teachercontentCount / allcontentCount) * 100)

    if (percent > 80) return { tag: <span className="text-green-600">{percent} %</span>, percent: percent }
    if (percent > 40) return { tag: <span className="text-blue-600">{percent} %</span>, percent: percent }
    return { tag: <span className="text-red-500">{percent} %</span>, percent: percent }
  }


  const exportExcel = async () => {
    const arr: any = [];
    setLoading(true);
    const res = await instance({
      method: "GET",
      url: `users?sort=-id&expand=teacherAccess.timeTableDates,teacherAccess.subject,teacherAccess.subjectCategory,teacherAccess.timeTableDates.attendStatus,teacherAccess.contentCount,userAccessKafedra`,
      params: {
        "per-page": 0,
        filter: { "role_name": ["teacher"] },
        "filter-like": { first_name: searchVal },
        kafedra_id: urlValue?.filter?.kafedra_id,
        edu_year_id: urlValue?.filter?.edu_year_id,
      }
    });

    const calculatedPercent = calcAttendPercent(res?.data?.data?.items);

    if (res?.data?.data?.items?.length === Object.keys(calculatedPercent ? calculatedPercent : {}).length) {
      res?.data?.data?.items?.forEach((element: any) => {
        arr.push({
          ["F.I.SH"]: renderFullName(element),
          ["Kafedra"]: element?.userAccessKafedra?.map((i: any) => i?.name).join(", "),
          ["Davomat foizda (%)"]: calculatedPercent ? calculatedPercent[element?.id]?.percent : "",
          ["Kontent (%)"]: calcContentPercent(element)?.percent || "",
        })
      })
    }
    setLoading(false);
    excelExport(arr, `O'qituvchilar ishlari bo'yicha statistika`);

  }

  return (
    <>
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: "/" },
          { name: "Teacher works statistic", path: "" },
        ]}
        title={'Teacher works statistic'}
        btn={
          <div>
            <ExcelBtn onClick={exportExcel} loading={loading} />
          </div>
        }
      />
      <div className="p-4">
        <Row gutter={[12, 12]} className="mb-4">
          <Col xl={6} lg={6} md={12} span={24}>
            <SearchInput className="w-[100%] mr-4" placeholder="Serach by first name" duration={globalConstants.debounsDuration} setSearchVal={setSearchVal} />
          </Col>
          {selectData?.map((e, i) => (
            <FilterSelect
              key={i}
              url={e.url}
              name={e.name}
              label={e.label}
              permission={e.permission}
              parent_name={e?.parent_name}
              child_names={e?.child_names}
              value_name={e?.value_name}
              render={e?.render}
              filter={e?.filter}
            />
          ))}
        </Row>
        <Table
          columns={columns}
          dataSource={(data?.items.length ? data?.items : allData)?.map(e => ({ ...e, key: e?.id }))}
          expandable={{ expandedRowRender, defaultExpandAllRows: false }}
          locale={{ emptyText: "Ma'lumotni olish uchun ta'lim yilini tanlang!" }}
          pagination={false}
          loading={isLoading}
          scroll={{ x: 1200 }}
        />

        <CustomPagination
          totalCount={data?._meta.totalCount}
          currentPage={urlValue.currentPage}
          perPage={urlValue.perPage}
        />
        <Drawer title="Davomat" width={600} onClose={() => { setselectedDate(undefined); setselectedTeacherAccessId(undefined) }} open={!!selectedDate}>
          {
            Object.keys(changedtimetable)?.map((id: any, index: number) => (
              <div key={index} className="bg rounded-lg p-4 mb-4">
                <div className="flex justify-between mb-3">
                  <strong>Fan: </strong>
                  <p>{changedtimetable[id][0]?.subject?.name}</p>
                </div>
                <div className="flex justify-between mb-3">
                  <strong>Fan kategoriyasi: </strong>
                  <p>{changedtimetable[id][0]?.subjectCategory?.name}</p>
                </div>
                <div className="flex justify-between mb-3">
                  <strong>Juftlik: </strong>
                  <p>{changedtimetable[id][0]?.para?.name}</p>
                </div>
                <div className="flex justify-between mb-3">
                  <strong>Bino va Xona: </strong>
                  <p>{changedtimetable[id][0]?.building?.name}, {changedtimetable[id][0]?.room?.name} - {changedtimetable[id][0]?.room?.capacity} ({changedtimetable[id][0]?.room?.room_type?.name})</p>
                </div>
                <div className="flex justify-between">
                  <strong>Guruh: </strong>
                  <div>
                    {changedtimetable[id]?.map((i: any) => (
                      <Tooltip key={i?.group?.id} title={i?.attend_status === 0 ? "Davomat qilinmagan!" : "Davomat qilingan!"}>
                        <Tag color={i?.attend_status === 0 ? "error" : "success"} >{i?.group?.unical_name}</Tag>
                      </Tooltip>
                    )
                    )}
                  </div>
                </div>
              </div>
            ))
          }
        </Drawer>
      </div>
    </>
  )
}
export default TeacherStatistics;