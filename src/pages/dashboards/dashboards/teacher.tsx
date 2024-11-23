import { BookRegular, BuildingRegular, ClockRegular, PeopleCommunityRegular } from '@fluentui/react-icons';
import { Calendar, Col, Row, Segmented, Tag } from 'antd';
import useGetAllData from 'hooks/useGetAllData';
import useGetData from 'hooks/useGetData';
import { ISimple } from 'models/other';
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';


const generateColor = () => {
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

  const i = Math.floor(Math.random() * 5);
  return colors[i];
}

const TeacherDashboard: React.FC = (): JSX.Element => {
  const navigate = useNavigate();
  const [activeWeek, setActiveWeek] = useState<number>(new Date().getDay())

  const { data, isFetching } = useGetAllData({
    queryKey: ["time-table"],
    url: "time-tables?expand=subject,group,subjectCategory,building,room,language,week,para,archived,teacher,isLesson",
    urlParams: {
      "per-page": 0,
      // filter: { week_id: activeWeek }
    },
  });

  const time_tables = useMemo(() => { }, [])

  const { data: weeks } = useGetData<ISimple>({
    queryKey: ["weeks"],
    url: "weeks",
    options: { staleTime: Infinity, },
  });

  const time_table_item = (time_table: any, groups: string[], type?: boolean) => {
    return <div onClick={() => { navigate(`/time-table/${time_table?.id}/to-attend`) }} className={`w-full inline-block rounded-lg p-2 mt-2 text-start border border-solid border-[#ddd] cursor-pointer ${type ? "border-green-500" : "border-blue-500"}`}>
      {/* {time_table?.id} */}
      {/* {time_table?.teacher?.first_name} {time_table?.teacher?.last_name} */}
      <p className='d-f mt-1' ><ClockRegular fontSize={16} className='me-2' /><b>{time_table?.para?.name}.&nbsp;&nbsp;{time_table?.para?.start_time}&nbsp;-&nbsp;{time_table?.para?.end_time}</b></p>
      <p className='d-f mt-1' ><BuildingRegular fontSize={16} className='me-2' /><span>{time_table?.building?.name}&nbsp;&nbsp;{time_table?.room?.name?.replace(/\D/g, '')}-xona ({time_table?.room?.capacity})</span></p>
      <p className='d-f mt-1' ><BookRegular fontSize={16} className='me-2' /><span className='text-blue-600'>{time_table?.subject?.name}</span>&nbsp;&nbsp;(<i>{time_table?.subjectCategory?.name}</i>)</p>
      <p className='d-f mt-2 uppercase' ><PeopleCommunityRegular fontSize={16} className='me-2' />
        {/* <span className='text-[#D18D4B]' >{time_table?.group?.unical_name}</span> */}
        {
          groups?.map((e, i) => <Tag color='blue' className='border-0' key={i}>{e}</Tag>)
        }
      </p>
    </div>
  }

  const time_table = useMemo(() => {
    const _time_table = data?.items?.sort((a, b) => Number(a?.para?.start_time.slice(0, 1)) - Number(b?.para?.start_time.slice(0, 1)))?.filter(e => e?.week_id === activeWeek);
    let new_data: { time_table: any, pear_time_table: any, groups: string[], ids: number }[] = [];

    // globalConstants.lectureIdForTimeTable

    _time_table?.forEach(e => {
      const pear = _time_table?.find(a => a?.type !== 0 && a?.type !== e?.type && a?.weel_id === e?.week_id && a?.para_id === e?.para_id)

      const index = new_data?.findIndex(a => a?.ids === e?.ids);
      // if (e?.isLesson) {
        if (index > -1 && e?.subject_category_id === 1) {
          new_data[index] = { ...new_data[index], groups: [...new_data[index]?.groups, e?.group?.unical_name] }
        } else {
          if (e?.type === 0) {
            new_data.push({
              ids: e?.ids,
              time_table: e,
              pear_time_table: null,
              groups: [e?.group?.unical_name]
            })
          } else {
            new_data.push({
              ids: e?.ids,
              time_table: e,
              pear_time_table: pear,
              groups: [e?.group?.unical_name]
            })
          }
        // }
      }

    })

    console.log(new_data);

    return new_data;
  }, [data?.items, activeWeek])

  return (
    <div className="dashboard bg-[#F7F7F7] min-h-full p-3">
      <Row gutter={[12, 12]}>
        <Col xs={24} lg={14} xl={16}>
          <div className="rounded-lg e-card-shadow shadow- min-h-[24rem] p-2 bg-white">
            <Segmented block className='' value={activeWeek} options={
              weeks?.items?.filter(e => e?.status)?.map(e => ({ label: e?.name, value: e?.id })) ?? []} onChange={e => setActiveWeek(Number(e))} />
            {
              time_table?.map((e, i) => {
                if (e?.time_table?.type === 0) {
                  return time_table_item(e?.time_table, e?.groups)
                } else {
                  return <>
                    {
                      time_table_item(e?.time_table, e?.groups, true)
                    }
                    {
                      e?.pear_time_table ? time_table_item(e?.pear_time_table, e?.groups, true) : null
                    }
                  </>
                }
              })
            }
          </div>
        </Col>
        <Col xs={24} lg={10} xl={8}>
          <div className="flex-center rounded-lg e-card-shadow shadow- min-h-[24rem]">
            <Calendar fullscreen={false} className="min-h-[24rem]" />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default TeacherDashboard;