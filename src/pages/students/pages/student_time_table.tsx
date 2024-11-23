import { ColumnsType } from 'antd/es/table';
import useGetAllData from 'hooks/useGetAllData';
import useGetData from 'hooks/useGetData';
import { IEduSemestr, IPara } from 'models/education';
import { ISimple } from 'models/other';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Segmented, Select, Table, Tag } from "antd"
import { BookRegular, BuildingRegular, PersonVoiceRegular } from '@fluentui/react-icons';
import HeaderExtraLayout from 'components/HeaderPage/headerExtraLayout';
import useUrlQueryParams from 'hooks/useUrlQueryParams';
// import "./style.scss";


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

  const i = Math.round((name.toUpperCase().charCodeAt(0) - 65) / 5)
  // const i = Math.floor(Math.random() * 5);
  return colors[i];
}

const StudentTimeTable: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { student_id, user_id } = useParams();
  const ref = useRef<any>(null)
  const { urlValue, writeToUrl } = useUrlQueryParams({});

  // const { data: semestrs } = useGetData<IEduSemestr>({
  //   queryKey: ["edu-semestrs"],
  //   url: `edu-semestrs?expand=semestr,eduSemestrSubjects.subject`,
  //   urlParams: { "per-page": 0 },
  //   options: {
  //     onSuccess: (res) => {
  //       writeToUrl({ name: "semestr_id", value: res?.items?.find(e => e?.status)?.id ?? res.items[0]?.id })
  //     }
  //   }
  // });

  // const { isFetching: edu_year_loading } = useGetData<IEduSemestr>({
  //   queryKey: ["edu-years"],
  //   url: `edu-years?expand=semestr,eduSemestrSubjects.subject`,
  //   urlParams: { "per-page": 0 },
  //   options: {
  //     onSuccess: (res) => {
  //       writeToUrl({ name: "edu_year_id", value: res?.items?.find(e => e?.status)?.id ?? res.items[0]?.id })
  //     }
  //   }
  // });

  const { data, isFetching } = useGetAllData({
    queryKey: ["timetable-dates", urlValue.filter_like, urlValue.filter?.edu_semestr_id],
    url: "timetable-dates?expand=subject,subjectCategory,building,room,week,para,user.profile,all,all.group,secondGroup,secondGroup.user,secondGroup.user.profile,secondGroup.building,secondGroup.room",
    urlParams: {
      "per-page": 0,
      user_id,
      filter: JSON.stringify({edu_semestr_id: urlValue.filter?.edu_semestr_id}),
      start_date: urlValue.filter_like.edu_week?.split("and")[0], 
      end_date: urlValue.filter_like.edu_week?.split("and")[1],
    },
    options: {
      enabled: !!user_id && !!urlValue.filter_like.edu_week,
    }
  });

  useEffect(() => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: 'center',
    });
  }, [data?.items]);

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

  const { data: studentGroups, isFetching: groupsLoading } = useGetAllData({
    queryKey: ["student-groups", student_id],
    url: "student-groups",
    urlParams: { 
      "per-page": urlValue.perPage, 
      page: urlValue.currentPage, 
      filter: JSON.stringify({student_id}),
      expand: 'semestr,eduSemestr.weeks'
    }
  })

  const renderData = (time_table: any, color: any, paer?: any) => {
    return <div className={`rounded-r-lg p-2 text-start`}  >
      <p className='' ><BookRegular fontSize={16} className='me-2' /><span className='text-blue-60000 font-semibold'>{time_table.subject?.name}</span>&nbsp;&nbsp;<i>({time_table?.subjectCategory?.name})</i></p>
      <p className='uppercase my-2' ><PersonVoiceRegular fontSize={16} className='me-2' /><span className='text-black text-opacity-50' >{time_table.teacher?.last_name}&nbsp;{time_table?.teacher?.first_name?.slice(0, 1)}. {time_table?.teacher?.middle_name?.slice(0, 1)}.</span>{paer ? <span className='text-black text-opacity-50' > / {paer.teacher?.last_name}&nbsp;{paer?.teacher?.first_name?.slice(0, 1)}. {paer?.teacher?.middle_name?.slice(0, 1)}.</span> : null}</p>
      <p className='flex items-start' ><BuildingRegular fontSize={16} className='me-2' /><span>{time_table?.building?.name}&nbsp;&nbsp;{time_table?.room?.name?.replace(/\D/g, '')}-xona ({time_table?.room?.capacity})</span>{paer ? <span> / {paer?.building?.name}&nbsp;&nbsp;{paer?.room?.name?.replace(/\D/g, '')}-xona ({paer?.room?.capacity})</span> : null}</p>
      <Tag className='mt-2' color={time_table?.type === 1 ? "warning" : time_table?.type === 2 ? "warning" : "blue"}>{time_table?.type === 1 ? "Toq hafta darsi" : time_table?.type === 2 ? "Juft hafta darsi" : "Doimiy dars"}</Tag>
    </div>
  }

  const renderTimeTable = (para_id: number, week_id: number) => {
    if (data?.items?.length) {
      for (const item of data?.items) {
        if (item?.para_id === para_id && item?.week_id === week_id) {

          // let paer_1 = null
          // let paer_2 = null

          // if (item?.type !== 0) {
          //   paer_1 = data?.items?.find(e => e?.para_id === para_id && e?.week_id === week_id && e?.type === 1)
          //   paer_2 = data?.items?.find(e => e?.para_id === para_id && e?.week_id === week_id && e?.type === 2)
          // }

          let paer_1 = item
          let paer_2 = null

          if(item?.two_group === 1) {
            paer_2 = item?.secondGroup;
          }

          return <>
            {
              item?.two_group === 1 ? <div>{renderData(paer_1, generateColor(item?.subject?.name), paer_2)}</div> : <div>{renderData(paer_1, generateColor(item?.subject?.name))}</div>
            }
            {/* {
              item?.type === 2 && !paer_1 ? null : paer_1 && paer_1?.type !== item?.type && item?.group_type === Number(urlValue?.filter_like?.type) ? <div className='mb-2' >{renderData(paer_1, generateColor(item?.subject?.name))}</div> : ""
            }
            {item?.group_type === Number(urlValue?.filter_like?.type) ? <div>{renderData(item, generateColor(item?.subject?.name))}</div> : null}
            {
              item?.type === 1 && !paer_2 ? null : paer_2 && paer_2?.type !== item?.type && item?.group_type === Number(urlValue?.filter_like?.type) ? <div className='mt-2' >{renderData(paer_2, generateColor(item?.subject?.name))}</div> : ""
            } */}
          </>
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
      const today = e?.id == data?.items[0]?.now[6];
      return {
        title: <div ref={today ? ref : null} >{e?.name} {today ? ` (${data?.items[0]?.now[2]})` : null}</div>,
        className: `time-table-box ${today ? "active" : ""}`,
        width: 200,
        render: (item: IPara) => renderTimeTable(item?.id, e?.id),
        rowScope: undefined,
      }
    }) || [])
  ]

  return (
    <div className="time-table-wrapper">
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: '/' },
          { name: "Students", path: '/students' },
          { name: `Student view`, path: `/students/view/${student_id}` },
          { name: `Student time table`, path: `/students/${student_id}/time-table` },
        ]}
        title={t(`Student time table`)}
        isBack={true}
        btn={
          <div className='flex items-center'>
            <p className='mr-2'>{t("Semestr")}: </p>
            <Segmented
              value={urlValue.filter?.edu_semestr_id}
              onChange={(e) => writeToUrl({name: "edu_semestr_id", value: e})}
              options={
                (studentGroups?.items ? studentGroups?.items : [])?.map((item: any, index) => (
                  { label: item?.semestr?.name, value: item?.edu_semestr_id }
                ))
              }
            />
          </div>
        }
      />
      <div className="px-6">
        <Select
          className='w-[400px] mt-3'
          showSearch
          placeholder="Select date"
          optionFilterProp="children"
          value={urlValue?.filter_like?.edu_week}
          onChange={(e) => writeToUrl({ name: "edu_week", value: e })}
          filterOption={(input: string, option?: { label: string; value: string }) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
          options={studentGroups?.items?.find((i:any) => i?.edu_semestr_id == urlValue.filter?.edu_semestr_id)?.eduSemestr?.weeks?.map((item: any) => ({value: `${item?.start_date}and${item?.end_date}`, label: <div className='flex items-center'>{item?.week} - hafta / {item?.start_date} - {item?.end_date}</div>}))}
        />
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

export default StudentTimeTable;