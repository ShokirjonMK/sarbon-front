import React, { useEffect, useState } from 'react'
import Table, { ColumnsType } from 'antd/es/table';
import { IStudent } from 'models/student';
import HeaderExtraLayout from 'components/HeaderPage/headerExtraLayout';
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import useGetAllData from 'hooks/useGetAllData';
import checkPermission from 'utils/check_permission';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Row, Select, Tag } from 'antd';
import FilterSelect, { TypeFilterSelect } from 'components/FilterSelect';
import { useTranslation } from 'react-i18next';
import { renderFullName } from 'utils/others_functions';
import { useMutation } from '@tanstack/react-query';
import { Notification } from 'utils/notification';
import { transferStudentSemestr } from './request1';
import useBreadCrumb from 'hooks/useBreadCrumb';

const StudentSemestrTransfer = () => {

  const navigate = useNavigate();
  const { t } = useTranslation();
  const { urlValue, writeToUrl } = useUrlQueryParams({ currentPage: 1, perPage: 15 });
  const [selectedEduPlan, setselectedEduPlan] = useState<any>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    writeToUrl({name: "edu_plan_id", value: undefined})
    writeToUrl({name: "group_id", value: undefined})
  }, [])

  const selectData: TypeFilterSelect[] = [
    {
      name: "faculty_id",
      label: "Faculty",
      url: "faculties",
      permission: "faculty_index",
      child_names: ["edu_plan_id", "group_id"],
      span: { xl: 12 }
    },
    {
      name: "edu_plan_id",
      label: "Edu plan",
      url: "edu-plans?expand=activeSemestr,activeSemestr.semestr",
      permission: "edu-plan_index",
      parent_name: "faculty_id",
      child_names: ["group_id"],
      span: { xl: 12 },
      onChange: (e, item) => {
        setselectedEduPlan(item);
        setSelectedRowKeys([])
    },
    },
    {
      name: "group_id",
      label: "Group",
      url: "groups",
      permission: "group_index",
      parent_name: "edu_plan_id",
      render: (e) => e?.unical_name,
      span: { xl: 12 }
    },
  ]

  const selectDataSecond: TypeFilterSelect[] = [
    {
      name: "faculty_id",
      label: "Faculty",
      url: "faculties",
      permission: "faculty_index",
      child_names: ["edu_plan_id", "group_id"],
      span: { xl: 12 },
    },
    {
      name: "edu_plan_id",
      label: "Edu plan",
      url: "edu-plans?expand=activeSemestr,activeSemestr.semestr",
      permission: "edu-plan_index",
      parent_name: "faculty_id",
      child_names: ["group_id"],
      span: { xl: 12 },
      onChange: (e, item) => {
        setselectedEduPlan(item)
    },
    },
    {
      name: "group_id",
      label: "Group",
      url: "groups",
      permission: "group_index",
      parent_name: "edu_plan_id",
      render: (e) => e?.unical_name,
      span: { xl: 12 }
    },
  ]

  const { data: eduSemestrs } = useGetAllData({
    queryKey: ['edu-semestrs', selectedEduPlan?.activeSemestr?.semestr_id, urlValue.filter?.edu_plan_id],
    url: `edu-semestrs`,
    urlParams: { 
      "per-page": 0,
      sort: "-id",
      expand: "semestr",
      filter: JSON.stringify({
        edu_plan_id: urlValue.filter?.edu_plan_id, 
        semestr_id: (selectedEduPlan?.activeSemestr?.semestr_id + 1)
      })
    },
    options: {
      enabled: !!selectedEduPlan?.activeSemestr?.semestr_id
    }
  });

  const { data, isFetching, refetch } = useGetAllData({
    queryKey: ["students", urlValue.filter?.group_id, selectedEduPlan?.activeSemestr?.id, "first"],
    url: `students`,
    urlParams: { 
      "per-page": 0,
      sort: "-id",
      expand: 'profile,eduType,eduForm,group',
      filter:  JSON.stringify({
        edu_year_id: selectedEduPlan?.activeSemestr?.edu_year_id,
        group_id: urlValue.filter?.group_id,
        status: 10,
      }),
    },
    options: {
      enabled: !!urlValue.filter?.group_id,
    }
  })

  const { data: secondData, isFetching: secondFetching, refetch: refetchSecond } = useGetAllData({
    queryKey: ["student-groups", urlValue.filter?.group_id, eduSemestrs?.items?.length ? eduSemestrs?.items[0]?.id : undefined, "second"],
    url: `student-groups`,
    urlParams: { 
      "per-page": 0,
      page: urlValue.currentPage, 
      sort: urlValue.filter_like?.sort ?? "-id",
      expand: 'student,student.profile,profile,eduType,eduForm,group',
      filter:  JSON.stringify({
        is_active: 1,
        edu_semestr_id: eduSemestrs?.items[0]?.id,
        edu_plan_id: urlValue.filter?.edu_plan_id,
        group_id: urlValue.filter?.group_id,
      }),
    },
    options: {
      enabled: !!urlValue.filter?.group_id,
    }
  })

  const columns: ColumnsType<IStudent> = React.useMemo(() => [
    {
      title: '№',
      width: 40,
      showSorterTooltip: false,
      render: (_, __, i) => i + 1,
    },
    {
      title: t('F.I.SH'),
      showSorterTooltip: false,
      render: (e) =>
        checkPermission("student_view") ? (
          <span
            onClick={() => navigate(`/students/view/${e?.id}`)}
            className="hover:text-[#0a3180] underline cursor-pointer"
          >{renderFullName(e?.profile)} </span>
        ) : (<span>{renderFullName(e?.profile)}</span>),
    },
    // {
    //   title: t('Edu Type'),
    //   dataIndex: "eduType",
    //   render: (e) => e?.name
    // },
    {
      title: t('Edu Form'),
      dataIndex: "eduForm",
      render: (e) => e?.name
    },
    {
      title: t('Group'),
      dataIndex: "group",
      render: (e) => e?.unical_name
    },
  ], [data?.items]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => setSelectedRowKeys(newSelectedRowKeys),
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: () => transferStudentSemestr({
      old_group_id: urlValue.filter?.group_id, 
      old_edu_semestr_id: selectedEduPlan?.activeSemestr?.id,
      students: JSON.stringify(selectedRowKeys),
      type: 1
    }),
    onSuccess: async (res) => {
        if(res?.status === 1){
          Notification("success", "create", res?.message);
          refetchSecond();
          setSelectedRowKeys([])
          refetch();
          navigate(-1);
        }
    },
    retry: 0,
});

  useBreadCrumb({pageTitle: "Talabalarni semestrini o'zgartirish", breadcrumb: [
    {name: "Home", path: '/'},
    {name: "Talabalarni semestrini o'zgartirish", path: '/student-semestr-transfer'},
  ]})

  return (
    <>
      <div className='content-card'>
        <div className="grid grid-cols-2 gap-4">
          <div className='p-3 rounded-lg' style={{border: "1px solid #d9d9d9"}}>
            <Row gutter={[12, 12]}>
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
                  span={e?.span}
                  render={e?.render}
                  filter={e?.filter}
                  disable={e?.disable}
                  onChange={e?.onChange}
                />
              ))}
              <Col span={12}>
                <Select
                  placeholder="Aktiv semestr"
                  optionFilterProp="children"
                  value={selectedEduPlan ? selectedEduPlan?.activeSemestr?.semestr?.id : undefined}
                  disabled
                  className='w-full'
                  options={[{value: selectedEduPlan?.activeSemestr?.semestr?.id, label: <div>{selectedEduPlan?.activeSemestr?.semestr?.name}<Tag color="success" className="ml-2" >Active</Tag></div>}]}
                />
              </Col>
              <Col span={12}></Col>
              <Col span={12}>
                <Button onClick={() => mutate()} type='primary' disabled={selectedRowKeys.length === 0} loading={isLoading} className='w-full' >Ko'chirish</Button>
              </Col>
            </Row>
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={(data?.items.length && urlValue?.filter?.group_id) ? data?.items?.map((item: any) => ({...item, key: item?.id})) : []}
              pagination={false}
              loading={isFetching}
              size="middle"
              className="mt-3"
              rowClassName="py-[12px]"
              scroll={{ x: 576 }}
            />
          </div>
          <div className='p-3 rounded-lg' style={{border: "1px solid #d9d9d9"}}>
            <Row gutter={[12, 12]} className='mb-14'>
              {selectDataSecond?.map((e, i) => (
                <FilterSelect
                  key={i}
                  url={e.url}
                  name={e.name}
                  label={e.label}
                  permission={e.permission}
                  parent_name={e?.parent_name}
                  child_names={e?.child_names}
                  value_name={e?.value_name}
                  span={e?.span}
                  render={e?.render}
                  filter={e?.filter}
                  disable={true}
                />
              ))}
              {
                eduSemestrs?.items?.length ? 
                <Col span={12}>
                  <Select
                    placeholder="Aktiv semestr"
                    optionFilterProp="children"
                    value={selectedEduPlan ? eduSemestrs?.items[0]?.id : undefined}
                    disabled
                    className='w-full'
                    options={[{value: eduSemestrs?.items[0]?.id, label: <div>{eduSemestrs?.items[0]?.semestr?.name}</div>}]}
                  />
                </Col> : ""
              }
            </Row>
            <Table
              columns={columns}
              dataSource={secondData?.items.length ? secondData?.items : []}
              pagination={false}
              loading={secondFetching}
              size="middle"
              className="mt-3"
              rowClassName="py-[12px]"
              scroll={{ x: 576 }}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default StudentSemestrTransfer

/**
  *  attend-reason_index
  *  attend-reason_delete
  *  attend-reason_update
  *  attend-reason_create
  *  attend-reason_view
*/


/**
 * student-category_index
 * student-category_delete
 * student-category_update
 * student-category_view
 */