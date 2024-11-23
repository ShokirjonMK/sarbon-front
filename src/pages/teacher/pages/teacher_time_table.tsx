import { ColumnsType } from 'antd/es/table';
import useGetAllData from 'hooks/useGetAllData';
import useGetData from 'hooks/useGetData';
import { IPara } from 'models/education';
import { ISimple } from 'models/other';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Col, Row, Select, Table, Tag } from "antd"
import { BookRegular, BuildingRegular, PeopleCommunityRegular } from '@fluentui/react-icons';
import HeaderExtraLayout from 'components/HeaderPage/headerExtraLayout';
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import checkPermission from 'utils/check_permission';
import FilterSelect, { TypeFilterSelect } from 'components/FilterSelect';

const generateColor = (name: string) => {
  const colors = [
    {
      bg: "#E4F5FF",
      color: "#a8defd"
    },
    {
      bg: "#DAF8E7",
      color: "#a5eec4"
    },
    {
      bg: "#EBE7FF",
      color: "#c0b6f1"
    },
    {
      bg: "#fceeda",
      color: "#fcce73"
    },
    {
      bg: "#ffe9ef",
      color: "#faacbf"
    },
  ];

  const i = Math.round((name?.toUpperCase().charCodeAt(0) - 65) / 5)
  return colors[i];
}

const TeacherTimeTable: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { user_id } = useParams();
  const { urlValue, writeToUrl } = useUrlQueryParams({});

  const { data, isFetching } = useGetAllData({
    queryKey: ["timetable-dates/get", urlValue?.filter?.edu_semestr_id, urlValue?.filter_like?.edu_week],
    url: "timetable-dates/get?expand=subject,group,subjectCategory,room,building,all,all.group",
    urlParams: {
        "per-page": 0,
        'edu_semestr_id': urlValue?.filter?.edu_semestr_id,
        start_date: urlValue.filter_like.edu_week?.split("and")[0],
        end_date: urlValue.filter_like.edu_week?.split("and")[1],
        user_id
    },
    options: {
      enabled: !!urlValue?.filter?.edu_semestr_id && !!urlValue.filter_like.edu_week?.split("and")[0] && !!urlValue.filter_like.edu_week?.split("and")[1]
    }
});

  const { data: weeks, isFetching: loadingWeek } = useGetData<ISimple>({
    queryKey: ["weeks"],
    url: "weeks",
    options: { staleTime: Infinity, refetchOnWindowFocus: false, retry: 0 },
  });

  const { data: paras, isFetching: loadingPara } = useGetData<IPara>({
    queryKey: ["paras"],
    url: "paras",
    options: { staleTime: Infinity, refetchOnWindowFocus: false, retry: 0 },
  });

  const renderData = (time_table: any, color: any) => {
    return <div className={`rounded-r-lg p-2 text-start`}  >
      <p className={`text-[${color}]`} ><BookRegular fontSize={16} className='me-2' /><span className='text-blue-60000 font-semibold'>{time_table?.subject?.name}</span>&nbsp;&nbsp; <i>({time_table?.subjectCategory?.name})</i></p>
      <p className='flex items-start' ><BuildingRegular fontSize={16} className='me-2' /><span>{time_table?.building?.name}&nbsp;&nbsp;{time_table?.room?.name?.replace(/\D/g, '')}-xona ({time_table?.room?.capacity})</span></p>
      <p className='d-f mt-2 gap-y-1 uppercase flex-wrap' ><PeopleCommunityRegular fontSize={16} className='me-2' />
        {
          time_table?.all?.map((e: any, i: number) => <Tag color='blue' className='border-0' key={i}>{e?.group?.unical_name}</Tag>)
        }
      </p>
    </div>
  }

  const renderTimeTable = (para_id: number, week_id: number) => {
    if (data?.items?.length) {
      for (const item of data?.items) {
        if (item?.para_id === para_id && item?.week_id === week_id) {
          return  <div>{renderData(item, generateColor(item?.time_table?.subject?.name))}</div>
        }
      }
    } else {
      return null
    }
    return null

  }

  const columns: ColumnsType<any> = [
    {
      title: t('Time'),
      fixed: "left",
      width: 120,
      render: (e, _, i) => <div><b>{i + 1}.</b> <div>{e?.start_time} - {e?.end_time}</div></div>,
    },
    ...(weeks?.items?.filter(e => e?.status)?.map(e => {
      return {
        title: <div>{e?.name}</div>,
        className: `time-table-box`,
        width: 200,
        render: (item: IPara) => renderTimeTable(item?.id, e?.id),
        rowScope: undefined,
      }  
    }) || [])
  ]

  const { data: eduSemestr } = useGetAllData({
    queryKey: [`timetables/edu-semestr`, urlValue?.filter?.edu_plan_id],
    url: `timetables/edu-semestr/${urlValue?.filter?.edu_plan_id}?expand=weeks`,
    urlParams: {
      user_id: user_id,
      status: "all"
    },
    options: {
        refetchOnWindowFocus: false,
        retry: 0,
        enabled: !!urlValue?.filter?.edu_plan_id,
    },
});

  const selectData: TypeFilterSelect[] = [
    {
        name: "edu_plan_id",
        label: "Edu plan",
        permission: "edu-plan_index",
        url: `timetables/edu-plan?user_id=${user_id}`,
        child_names: ["edu_semestr_id", "edu_week"]
    },
]

  return (
    <div className="time-table-wrapper">
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: '/' },
          { name: "Teachers", path: '/teachers' },
          { name: `Teacher view`, path: `/teachers/view/${user_id}` },
          { name: `O'qituvchi dars jadvali`, path: `/teachers/${user_id}/time-table` },
        ]}
        title={t(`O'qituvchi dars jadvali`)}
        isBack={true}
        backUrl={`/teachers/view/${user_id}`}
      />
      <div className="px-6">
        <Row gutter={[12, 12]} className='mb-4 mt-2' >
          {
              selectData?.map(e => <FilterSelect key={e?.name} {...e} />)
          }
          {
              checkPermission("edu-semestr_index") ?
                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
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
                        options={eduSemestr?.items?.map((item: any) => ({ value: item?.id, label: <div className='flex items-center'>{item?.name}{item?.status === 1 ? <Tag className='ml-3' color="green">Active</Tag> : ""}</div> }))}
                    />
                </Col> : ""
          }
          {
              checkPermission("week_index") ?
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                      <Select
                          disabled={!urlValue?.filter?.edu_semestr_id}
                          placeholder="Filter by week"
                          className='w-[100%]'
                          optionFilterProp="children"
                          onChange={(e) => writeToUrl({ name: "edu_week", value: e })}
                          value={urlValue?.filter_like?.edu_week}
                          options={eduSemestr?.items?.find((i: any) => (i.id === urlValue?.filter?.edu_semestr_id))?.weeks?.map((item: any) => ({ value: `${item?.start_date}and${item?.end_date}`, label: <div className='flex items-center'>{item?.week} - hafta / {item?.start_date} - {item?.end_date}</div> }))}
                      />
                  </Col> : ""
          }
        </Row>
        <Table
          columns={columns}
          dataSource={paras?.items}
          pagination={false}
          loading={isFetching || loadingPara || loadingWeek}
          size="middle"
          className="mt-3 mb-5"
          rowClassName="py-[12px]"
          scroll={{ x: 1600 }}
          bordered
        />
      </div>
    </div>
  );
};

export default TeacherTimeTable;

// https://stackblitz.com/edit/react-docx?file=cv-generator.ts,index.tsx