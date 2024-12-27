import './style.scss'
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useGetAllData from "hooks/useGetAllData";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import { Button, Col, Dropdown, MenuProps, Row, Select, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { Link, useParams } from "react-router-dom";
import useGetData from "hooks/useGetData";
import { IGroup, IPara } from 'models/education';
import { Delete16Filled, Eye16Filled, MoreVertical24Filled } from '@fluentui/react-icons';
import checkPermission from 'utils/check_permission';
import DeleteData from 'components/deleteData';
import useBreadCrumb from 'hooks/useBreadCrumb';

type TtimeTable = {
  para_id: number, 
  para_name: any, 
  week_id: number, 
  week_name: any
};

const TimeTableDataNew = () => {

  const { t } = useTranslation();
  const { course_id, edu_form_id } = useParams()
  const { urlValue, writeToUrl } = useUrlQueryParams({ currentPage: 1, perPage: 15 });
  const [timetableData, settimetableData] = useState<TtimeTable[]>();

  const { data: groups } = useGetAllData<IGroup>({
    queryKey: ["groups", urlValue.filter, course_id, edu_form_id],
    urlParams: { "per-page": 0, 'group-filter': {...urlValue.filter, course_id, edu_form_id}},
    url: "groups",
    options: { 
        enabled: (!!urlValue.filter?.edu_semestr_id),
        refetchOnWindowFocus: false, 
        retry: 0 
    },
  });

  const menuItems = (i: any) => {

    const menuProps:MenuProps['items'] = [
      {
        label: checkPermission("timetable_view") ? <Link to={`/time-tables-new/view/table/${i?.timetable_id}`} className='flex justify-between items-center'>
          View
          <Eye16Filled className="view" />
          </Link> : null,
        key: '2',
      },
      {
        label: checkPermission("timetable_delete") ? 
        <DeleteData
          permission={'timetable_delete'}
          refetch={refetch}
          url={"timetables"}
          id={i?.ids_id}
          className='flex justify-between items-center'
        >
          Delete
          <Delete16Filled className="delete" />
        </DeleteData>
         : null,
        key: '1',
        danger: true
      }
    ]
    return menuProps
  };
  
  
  const { data, isFetching, refetch } = useGetAllData({
    queryKey: [ "timetable-dates", urlValue.filter, course_id, edu_form_id, urlValue.filter_like.edu_week],
    url: "timetable-dates",
    urlParams: { 
      filter: {
          edu_semestr_id: urlValue.filter?.edu_semestr_id,
          course_id, 
          edu_form_id,
      }, 
      "per-page": 0, 
      start_date: urlValue.filter_like.edu_week?.split("and")[0], 
      end_date: urlValue.filter_like.edu_week?.split("and")[1],
      expand: "subject,subjectCategory,user,user.profile,building,room,all,all.subject,all.subjectCategory,all.subjectCategory,all.user,all.user.profile,secondGroup,secondGroup.user,secondGroup.user.profile,secondGroup.building,secondGroup.room"
    },
     options: {
      refetchOnWindowFocus: false,
      retry: 1,
      enabled: !!groups?.items?.length
    }
  })

  const { data: weeks } = useGetData({
    queryKey: ["weeks"],
    url: "weeks",
    urlParams: {filter: {status: 1}},
    options: { staleTime: Infinity, refetchOnWindowFocus: false, retry: 0 },
  }); 

  const { data: eduPlans } = useGetAllData({
    queryKey: ["edu-plans", course_id, edu_form_id],
    url: "edu-plans",
    urlParams: { filter: {edu_form_id}, "per-page": 0, course_id, expand: "eduSemestrs,eduSemestrs.weeks"},
    options: { 
        onSuccess: (res) => {
          if(!urlValue?.filter?.edu_plan_id) writeToUrl({ name: "edu_plan_id", value: res?.items[0]?.id })            
        },
        refetchOnWindowFocus: false, 
        retry: 0 ,
        enabled: checkPermission("edu-plan_index")
    },
  });

  const { data: eduTypes } = useGetAllData({
    queryKey: ["edu-types"],
    url: "edu-types",
    options: {
        refetchOnWindowFocus: false, 
        retry: 0 
    },
  }); 

  const { data: paras } = useGetData<IPara>({
    queryKey: ["paras"],
    url: "paras",
    options: { staleTime: Infinity, refetchOnWindowFocus: false, retry: 0 },
  });

  useEffect(() => {

    const arr:TtimeTable[] = []
  
    if(weeks?.items?.length && paras?.items?.length){
      for (const week of weeks?.items) {
        let i = 1
        for (const para of paras?.items) {
          arr.push({week_id: week?.id, week_name: <p className='text-lg bg'>{week?.name}</p>, para_id: para?.id, para_name: <p className='text-center'><span className='font-bold text-2xl mx-auto block text-center'>{i}</span><br />{para?.start_time} - {para?.end_time}</p>})
          i++
        }
      }
    }
    settimetableData(arr)
  }, [weeks?.items?.length, paras?.items?.length])  

  const renderTeacherFullName = (teacher: any) => {
    return <>{teacher?.last_name} {teacher?.first_name?.slice(0, 1)}. {teacher?.middle_name?.slice(0, 1)}.</>
  }

  const renderData = (i: any) => {    
    
    return <div className='relative'>
      <Dropdown menu={{ items: menuItems(i) }} trigger={['click']} placement="bottomRight">
        <MoreVertical24Filled className='absolute right-[-5px] top-[-5px] cursor-pointer hover:text-neutral-500' />
      </Dropdown>
      {
        checkPermission("timetable_create") ? 
        <Link to={`/time-tables-new/view/table/${i?.timetable_id}`} className='text-black'>
          <div className='text-center'>
            <p className='mr-3 text-[13px]'>{i?.subject?.name} ({i?.subjectCategory?.name})</p>
            <p className='text-[13px]' >{renderTeacherFullName(i?.user?.profile)} {i?.two_group === 1 ? <> / {renderTeacherFullName(i?.secondGroup?.user?.profile)}</>: ""}</p>
            <p className='text-[13px]' >{i?.building?.name}  {i?.room?.name} {i?.two_group === 1 ? <> / {i?.secondGroup?.building?.name}  {i?.secondGroup?.room?.name}</> : ""}</p>
            <Tag className='mt-2' color={i?.type === 1 ? "warning" : i?.type === 2 ? "warning" : "blue"}>{i?.type === 1 ? "Toq hafta darsi" : i?.type === 2 ? "Juft hafta darsi" : "Doimiy dars"}</Tag>
          </div>
        </Link> : <div className='text-center'>
            <p className='mr-3 text-[13px]'>{i?.subject?.name} ({i?.subjectCategory?.name})</p>
            <p className='text-[13px]'>{renderTeacherFullName(i?.user?.profile)} {i?.two_group === 1 ? <> / {renderTeacherFullName(i?.secondGroup?.user?.profile)}</>: ""}</p>
            <p className='text-[13px]'>{i?.building?.name}  {i?.room?.name} {i?.two_group === 1 ? <> / {i?.secondGroup?.building?.name}  {i?.secondGroup?.room?.name}</> : ""}</p>
            <Tag className='mt-2' color={i?.type === 1 ? "warning" : i?.type === 2 ? "warning" : "blue"}>{i?.type === 1 ? "Toq hafta darsi" : i?.type === 2 ? "Juft hafta darsi" : "Doimiy dars"}</Tag>
          </div>
      }
    </div>
  }

  const renderTimeTable = (tableData: TtimeTable, group: IGroup) => {
    

    let button: any = checkPermission("timetable_create") ? <Link to={`/time-tables-new/create/0/${group?.edu_plan_id}/${group?.id}/${tableData?.week_id}/${tableData?.para_id}/${urlValue.filter?.edu_semestr_id}/${urlValue.filter_like.edu_week?.split("and")[0]}/${urlValue.filter_like.edu_week?.split("and")[2]}`} className='my-2 block'>
                        <Button className='w-[100%] time-table-button'>+</Button>
                      </Link> : "";


    if(data?.items?.length){
      for (const item of data?.items) {
        
        if(item?.para_id === tableData?.para_id && item?.week_id === tableData?.week_id && item?.all?.some((e: any) => e.group_id === group?.id)){
          if(item?.all?.length > 1){              
            
              let currentItemToq, currentItemJuft, currentItemNeytral;

              for (const allItem1 of item?.all) {
                if(allItem1?.type === 1 && allItem1?.group_id === group?.id){
                  currentItemToq = allItem1
                } else if(allItem1?.type === 2 && allItem1?.group_id === group?.id){
                  currentItemJuft = allItem1
                } else if(allItem1?.type === 0 && allItem1?.group_id === group?.id) {
                  currentItemNeytral = allItem1
                }
              }
              
              if(!currentItemNeytral && !currentItemJuft && !currentItemToq){
                return button
              }
              return <>
                  {
                    !currentItemNeytral ? (
                      currentItemToq ? renderData({...item, timetable_id: currentItemToq?.id, type: currentItemToq?.type }) : 
                      (
                        checkPermission("timetable_create") ? 
                          // <Link to={`/time-tables-new/create/1/${group?.edu_plan_id}/${group?.id}/${tableData?.week_id}/${tableData?.para_id}/${urlValue.filter?.edu_semestr_id}/${urlValue.filter_like.edu_week?.split("and")[0]}`} className='mb-2 block'>
                          //       <Button className='w-[100%]'>+</Button>
                          //   </Link> 
                          ""
                            : ""
                        )
                    ) : ""
                  }

                  {currentItemNeytral ? renderData({...item, timetable_id: currentItemNeytral?.id, type: currentItemNeytral?.type }): ""}
                  {/* {currentItemNeytral?.type !== 0 ? <Divider className='my-2' /> : ""} */}

                  {
                    !currentItemNeytral ? (
                      currentItemJuft ? renderData({...item, timetable_id: currentItemJuft?.id, type: currentItemJuft?.type }) : 
                      (
                        checkPermission("timetable_create") ? 
                          // <Link to={`/time-tables-new/create/2/${group?.edu_plan_id}/${group?.id}/${tableData?.week_id}/${tableData?.para_id}/${urlValue.filter?.edu_semestr_id}/${urlValue.filter_like.edu_week?.split("and")[0]}`} className='mb-2 block'>
                          //       <Button className='w-[100%]'>+</Button>
                          //   </Link> 
                            ""
                            : ""
                        )
                    ) : ""
                  }
                </>
            } else {
              const newArr = data?.items?.filter((e: any) => e?.group_id === group?.id && e?.para_id === tableData?.para_id && e?.week_id === tableData?.week_id);
              const itemToq = newArr?.find((e: any) => e?.type === 1)
              const itemJuft = newArr?.find((e: any) => e?.type === 2)
              const itemNeytral = newArr?.find((e: any) => e?.type === 0)

              if(newArr?.length === 0){
                return button
              }
              return <>
                  {
                    !itemNeytral ? (
                      itemToq ? renderData(itemToq) : 
                      (
                        checkPermission("timetable_create") ? 
                          // <Link to={`/time-tables-new/create/1/${group?.edu_plan_id}/${group?.id}/${tableData?.week_id}/${tableData?.para_id}/${urlValue.filter?.edu_semestr_id}/${urlValue.filter_like.edu_week?.split("and")[0]}`} className='mb-2 block'>
                          //       <Button className='w-[100%]'>+</Button>
                          //   </Link> 
                            ""
                            : ""
                        )
                    ) : ""
                  }
                  {itemNeytral ? renderData(itemNeytral): ""}
                  {/* {itemNeytral?.type !== 0 ? <Divider className='my-2' /> : ""} */}
                  {
                    !itemNeytral ? (
                      itemJuft ? renderData(itemJuft) : 
                      (
                        checkPermission("timetable_create") ? 
                          // <Link to={`/time-tables-new/create/2/${group?.edu_plan_id}/${group?.id}/${tableData?.week_id}/${tableData?.para_id}/${urlValue.filter?.edu_semestr_id}/${urlValue.filter_like.edu_week?.split("and")[0]}`} className='mb-2 block'>
                          //       <Button className='w-[100%]'>+</Button>
                          //   </Link> 
                            ""
                            : ""
                        )
                    ) : ""
                  }
                </>
            }
        }
      }      
    } else {
      return button;
    }
    return button;
  }

  const columns: ColumnsType<any> = [
    {
      title: t('Week days'),
      fixed: "left",
      dataIndex: "week_name",
      className: "title-vertical text-center w-[50px]",
      width: 50,
      onCell: (_, index) => {
        if(index !== undefined && paras?.items?.length) {
          return {rowSpan: (index % paras?.items?.length === 0) ? paras?.items?.length : 0, colSpan: 1}
        }
        return {}
      },
    },
    {
      title: t('Time'),
      fixed: "left",
      width: 100,
      dataIndex: 'para_name'
    },
    ...((urlValue?.filter?.group_id ? (groups?.items?.filter(gr => gr?.id === urlValue?.filter?.group_id)) : groups?.items)?.map(i => ({
      title: i?.unical_name,
      className: "time-table-box",
      width: 180,
      render: (item: TtimeTable) => renderTimeTable(item, i)
    }))|| [])
]


useBreadCrumb({pageTitle: "Time tables", breadcrumb: [
  {name: "Home", path: '/'},
  {name: "Time tables", path: '/time-tables-new'}
]})

  return (
    <div className="content-card">
      <div>
        <Row gutter={[4, 12]}>
          {
            checkPermission("edu-plan_index") ? 
            <Col xs={24} sm={24} md={12} lg={6} xl={6}>
              <label className='mb-2 block'>{t("Edu plan")}</label>
              <Select
                showSearch
                placeholder="Filter by edu plan"
                className='w-[100%]'
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? '')?.toLowerCase().includes(input.toLowerCase())
                }
                onChange={(e) => {
                  writeToUrl({ name: "edu_plan_id", value: e });
                  writeToUrl({ name: "edu_semestr_id", value: undefined });
                  writeToUrl({ name: "edu_week", value: undefined });
                }}
                value={urlValue?.filter?.edu_plan_id}
                options={eduPlans?.items?.map(item => ({value: item?.id, label: item?.name}))}
              />
            </Col> : ""
          }
          {
            checkPermission("edu-semestr_index") ? 
            <Col xs={24} sm={24} md={12} lg={6} xl={5}>
              <label className='mb-2 block'>{t("Edu semestr")}</label>
              <Select
                disabled={!urlValue?.filter?.edu_plan_id}
                placeholder="Filter by semestr"
                className='w-[100%]'
                optionFilterProp="children"
                onChange={(e) => {
                  writeToUrl({ name: "edu_semestr_id", value: e });
                  writeToUrl({ name: "edu_week", value: undefined })
                }}
                value={urlValue?.filter?.edu_semestr_id}
                options={eduPlans?.items?.find(i => (i.id === urlValue?.filter?.edu_plan_id))?.eduSemestrs?.map((item: any) => ({value: item?.id, label: <div className='flex items-center'>{item?.name}{item?.status === 1 ? <Tag className='ml-3' color="green">Active</Tag> : ""}</div>}))}
              />
            </Col> : ""
          }
          {
            checkPermission("week_index") ? 
            <Col xs={24} sm={24} md={12} lg={6} xl={6}>
              <label className='mb-2 block'>{t("Ta'lim haftasi")}</label>
              <Select
                disabled={!urlValue?.filter?.edu_semestr_id}
                placeholder="Filter by week"
                className='w-[100%]'
                optionFilterProp="children"
                onChange={(e) => writeToUrl({ name: "edu_week", value: e })}
                value={urlValue?.filter_like?.edu_week}
                options={
                  eduPlans?.items?.find(i => (i.id === urlValue?.filter?.edu_plan_id))
                  ?.eduSemestrs?.find((i: any) => (i.id === urlValue?.filter?.edu_semestr_id))
                  ?.weeks?.map((item: any) => ({value: `${item?.start_date}and${item?.end_date}and${item?.week}`, 
                  label: <div className='flex items-center'>{item?.week} - hafta / {item?.start_date} - {item?.end_date} <Tag color='warning' className='ml-3'>{item?.week % 2 === 1 ? "Toq hafta" : "Juft hafta" }</Tag></div>}))}
              />
            </Col> : ""
          }
          <Col xs={24} sm={24} md={12} lg={6} xl={4}>
            <label className='mb-2 block'>{t("Edu type")}</label>
            <Select
              placeholder="Filter by edu type"
              className='w-[100%]'
              optionFilterProp="children"
              onChange={(e) => writeToUrl({ name: "edu_type_id", value: e })}
              value={urlValue?.filter?.edu_type_id}
              options={eduTypes?.items?.map(item => ({value: item?.id, label: item?.name}))}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={6} xl={3}>
            <label className='mb-2 block'>{t("Group")}</label>
            <Select
              allowClear
              showSearch
              placeholder="Filter by group"
              className='w-[100%]'
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '')?.toLowerCase().includes(input.toLowerCase())
              }
              onChange={(e) => writeToUrl({ name: "group_id", value: e })}
              value={urlValue?.filter?.group_id}
              options={groups?.items?.map(item => ({value: item?.id, label: item?.unical_name}))}
            />
          </Col>
        </Row>
        <div className='time-table-list'>
          <Table
            columns={columns}
            dataSource={(urlValue.filter?.edu_semestr_id && urlValue.filter_like?.edu_week) ? timetableData : []}
            pagination={false}
            loading={isFetching}
            size="middle"
            className="mt-3 mb-5"
            rowClassName="py-[12px]"
            scroll={{ x: 1600, y: "70vh" }}
            bordered
          />
        </div>
      </div>
    </div>
  )
}

export default TimeTableDataNew;


