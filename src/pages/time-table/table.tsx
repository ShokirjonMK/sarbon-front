import './style.scss'
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useGetAllData from "hooks/useGetAllData";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import { Button, Col, Divider, Dropdown, MenuProps, Row, Select, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { Link, useParams } from "react-router-dom";
import useGetData from "hooks/useGetData";
import { IGroup, IPara } from 'models/education';
import { Delete16Filled, Edit16Filled, Eye16Filled, MoreVertical24Filled } from '@fluentui/react-icons';
import checkPermission from 'utils/check_permission';
import DeleteData from 'components/deleteData';

type TtimeTable = {
  para_id: number, 
  para_name: string, 
  week_id: number, 
  week_name: string
};

const TimeTableData = () => {

  const { t } = useTranslation();
  const { course_id, edu_form_id } = useParams()
  const { urlValue, writeToUrl } = useUrlQueryParams({ currentPage: 1, perPage: 15 });
  const [timetableData, settimetableData] = useState<TtimeTable[]>();

  const { data: groups } = useGetAllData<IGroup>({
    queryKey: ["groups", urlValue.filter, course_id, edu_form_id],
    urlParams: { "per-page": 0, 'group-filter': {...urlValue.filter, course_id, edu_form_id}},
    url: "groups",
    options: { 
        enabled: (!!urlValue.filter?.edu_year_id),
        // enabled: (!!urlValue.filter?.edu_plan_id && !!urlValue.filter?.edu_year_id),
        refetchOnWindowFocus: false, 
        retry: 0 
    },
  });

  const menuItems = (i: any) => {

    const menuProps:MenuProps['items'] = [
      {
        label: checkPermission("time-table_update") ? 
        <Link to={`/time-tables/update/${i?.type}/${i?.edu_plan_id}/${i?.group_id}/${i?.week_id}/${i?.para_id}/${i?.id}`} className='text-black flex justify-between items-center w-[100px]'>
          Update
          <Edit16Filled className="edit" />
        </Link> : null,
        key: '0',
      },
      {
        label: checkPermission("time-table_view") ? <Link to={`/time-tables/view/${i?.id}`} className='flex justify-between items-center'>
          View
          <Eye16Filled className="view" />
          </Link> : null,
        key: '2',
      },
      {
        label: checkPermission("time-table_delete") ? 
        <DeleteData
          permission={'time-table_delete'}
          refetch={refetch}
          url={"time-tables"}
          id={i?.id}
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
    queryKey: [ "time-tables", urlValue.filter, course_id, edu_form_id],
    url: "time-tables?expand=subject,teacher,subjectCategory,building,room,language,week,para,archived,twoGroups,twoGroups.teacher,twoGroups.building,twoGroups.room",
    urlParams: { filter: {...urlValue.filter, course_id, edu_form_id}, "per-page": 0},
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
    urlParams: { filter: {edu_form_id}, "per-page": 0, course_id},
    options: { 
        onSuccess: (res) => {
          if(!urlValue?.filter?.edu_plan_id) writeToUrl({ name: "edu_plan_id", value: res?.items[0]?.id })            
        },
        refetchOnWindowFocus: false, 
        retry: 0 ,
        enabled: checkPermission("edu-plan_index")
    },
  }); 
  
  const { data: eduYears } = useGetAllData({
    queryKey: ["edu-years"],
    url: "edu-years",
    urlParams: {"per-page": 0,},
    options: {
        onSuccess: (res) => {
          if(!urlValue?.filter?.edu_year_id) writeToUrl({ name: "edu_year_id", value: res?.items?.find(i => i?.status === 1)?.id })            
        },
        refetchOnWindowFocus: false, 
        retry: 0 
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
        for (const para of paras?.items) {
          arr.push({week_id: week?.id, week_name: week?.name, para_id: para?.id, para_name: `${para?.start_time} - ${para?.end_time}`})
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
        checkPermission("time-table_create") ? 
        <Link to={`/time-tables/view/${i?.id}`} className='text-black'>
          <div className='text-center'>
            <p className='mr-3 text-[13px]'>{i?.subject?.name} ({i?.subjectCategory?.name})</p>
            <p className='text-[13px]' >{renderTeacherFullName(i?.teacher)} {i?.two_groups == 1 ? <> / {renderTeacherFullName(i?.twoGroups?.teacher)}</>: ""}</p>
            <p className='text-[13px]' >{i?.building?.name}  {i?.room?.name} {i?.two_groups == 1 ? <> / {i?.twoGroups?.building?.name}  {i?.twoGroups?.room?.name}</> : ""}</p>
          </div>
        </Link> : <div className='text-center'>
            <p className='mr-3 text-[13px]'>{i?.subject?.name} ({i?.subjectCategory?.name})</p>
            <p className='text-[13px]'>{renderTeacherFullName(i?.teacher)} {i?.two_groups == 1 ? <> / {renderTeacherFullName(i?.twoGroups?.teacher)}</>: ""}</p>
            <p className='text-[13px]'>{i?.building?.name}  {i?.room?.name} {i?.two_groups == 1 ? <> / {i?.twoGroups?.building?.name}  {i?.twoGroups?.room?.name}</> : ""}</p>
          </div>
      }
    </div>
  }

  const renderTimeTable = (tableData: TtimeTable, group: IGroup) => {


    let button: any = checkPermission("time-table_create") ? <Link to={`/time-tables/create/0/${group?.edu_plan_id}/${group?.id}/${tableData?.week_id}/${tableData?.para_id}`} className='my-2 block'>
                        <Button className='w-[100%] time-table-button'>+</Button>
                      </Link> : "";

    if(data?.items?.length){
      for (const item of data?.items) {        
        if(item?.para_id === tableData?.para_id && item?.week_id === tableData?.week_id && item?.group_id === group?.id){

          const paer_1 = data?.items?.find(e => e?.para_id === tableData?.para_id && e?.week_id === tableData?.week_id && e?.group_id === group?.id && e?.type === 1)
          const paer_2 = data?.items?.find(e => e?.para_id === tableData?.para_id && e?.week_id === tableData?.week_id && e?.group_id === group?.id && e?.type === 2)

          return <>
            {
              item?.type === 2 && !paer_1 ? (checkPermission("time-table_create") ? <Link to={`/time-tables/create/1/${group?.edu_plan_id}/${group?.id}/${tableData?.week_id}/${tableData?.para_id}`} className='mb-2 block'>
              <Button className='w-[100%]'>+</Button>
          </Link> : "") : paer_1 && paer_1?.type !== item?.type ? renderData(paer_1) : ""
            }
            {renderData(item)}
            {!!paer_2 && !!paer_1 ? <Divider className='my-2' /> : ""}
            {
              item?.type === 1 && !paer_2 ? (checkPermission("time-table_create") ? <Link to={`/time-tables/create/2/${group?.edu_plan_id}/${group?.id}/${tableData?.week_id}/${tableData?.para_id}`} className='mt-2 block'>
              <Button className='w-[100%]'>+</Button> 
            </Link> : "") : paer_2 && paer_2?.type !== item?.type ? renderData(paer_2) : ""
            }
          </>
        }
      }
    } else {
      return button
    }
    return button

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

  return (
    <div className="">
        <HeaderExtraLayout 
            breadCrumbData={[
              {name: "Home", path: '/'},
              {name: "Time tables", path: '/time-tables'}
            ]}
            title={t("Time tables")}
            isBack={true}
            backUrl='/time-tables'
        />
        <div className="p-3">
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
                  onChange={(e) => writeToUrl({ name: "edu_plan_id", value: e })}
                  value={urlValue?.filter?.edu_plan_id}
                  options={eduPlans?.items?.map(item => ({value: item?.id, label: item?.name}))}
                />
              </Col> : ""
            }
            <Col xs={24} sm={24} md={12} lg={6} xl={6}>
              <label className='mb-2 block'>{t("Edu year")}</label>
              <Select
                placeholder="Filter by edu year"
                className='w-[100%]'
                optionFilterProp="children"
                onChange={(e) => writeToUrl({ name: "edu_year_id", value: e })}
                value={urlValue?.filter?.edu_year_id}
                options={eduYears?.items?.map(item => ({value: item?.id, label: <div className='flex items-center'>{item?.name}{item?.status === 1 ? <Tag className='ml-3' color="green">Active</Tag> : ""}</div>}))}
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={6} xl={6}>
              <label className='mb-2 block'>{t("Edu type")}</label>
              <Select
                placeholder="Filter by edu year"
                className='w-[100%]'
                optionFilterProp="children"
                onChange={(e) => writeToUrl({ name: "edu_type_id", value: e })}
                value={urlValue?.filter?.edu_type_id}
                options={eduTypes?.items?.map(item => ({value: item?.id, label: item?.name}))}
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={6} xl={6}>
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
              dataSource={(urlValue.filter?.edu_year_id) ? timetableData : []}
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

export default TimeTableData;


