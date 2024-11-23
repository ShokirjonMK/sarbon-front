import { BookRegular, BuildingRegular, ClockRegular, PeopleCommunityRegular } from '@fluentui/react-icons';
import { Calendar, Col, Row, Segmented, Select, Tag } from 'antd';
import FilterSelect, { TypeFilterSelect } from 'components/FilterSelect';
import useGetAllData from 'hooks/useGetAllData';
import useGetData from 'hooks/useGetData';
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import { ISimple } from 'models/other';
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import checkPermission from 'utils/check_permission';


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
    const [activeWeek, setActiveWeek] = useState<number>(new Date().getDay());
    const { urlValue, writeToUrl } = useUrlQueryParams({});
    const { t } = useTranslation();


    const { data, isFetching } = useGetAllData({
        queryKey: ["timetable-dates/get", urlValue?.filter?.edu_semestr_id, urlValue?.filter_like?.edu_week],
        url: "timetable-dates/get?expand=subject,group,subjectCategory,room,language,week,para,building",
        urlParams: {
            "per-page": 0,
            'edu_semestr_id': urlValue?.filter?.edu_semestr_id,
            start_date: urlValue.filter_like.edu_week?.split("and")[0],
            end_date: urlValue.filter_like.edu_week?.split("and")[1],
            // filter: { week_id: activeWeek }
        },
    });

    const { data: weeks } = useGetData<ISimple>({
        queryKey: ["weeks"],
        url: "weeks",
        options: { staleTime: Infinity, },
    });

    const time_table_item = (time_table: any, groups: string[], type?: boolean) => {
        return <div onClick={() => { navigate(`/time-table/${time_table?.id}/to-attend`) }} className={`w-full inline-block rounded-lg p-2 mt-2 text-start border border-solid border-[#ddd] cursor-pointer border-blue-500-`}>
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
                {
                    time_table?.two_group ? <p className="italic ms-2-">({time_table?.group_type} potok)</p> : null
                }
            </p>
        </div>
    }

    const time_table = useMemo(() => {
        const _time_table = data?.items?.sort((a, b) => Number(a?.para?.name.slice(0, 1)) - Number(b?.para?.name.slice(0, 1)))?.filter(e => e?.week_id === activeWeek);
        let new_data: { time_table: any, pear_time_table: any, groups: string[], ids_id: number }[] = [];

        // globalConstants.lectureIdForTimeTable

        _time_table?.forEach(e => {            
            const index = new_data?.findIndex(a => a?.ids_id === e?.ids_id && a?.time_table?.para_id === e?.para_id);
            // if (e?.isLesson) {
            if (index > -1 && e?.subject_category_id === 1) {
                new_data[index] = { ...new_data[index], groups: [...new_data[index]?.groups, e?.group?.unical_name] }
            } else {
                    new_data.push({
                        ids_id: e?.ids_id,
                        time_table: e,
                        pear_time_table: null,
                        groups: [e?.group?.unical_name]
                    })
                // }
            }

        })

        return new_data;
    }, [data?.items, activeWeek])

    const { data: eduSemestr } = useGetAllData({
        queryKey: [`timetables/edu-semestr`, urlValue?.filter?.edu_plan_id],
        url: `timetables/edu-semestr/${urlValue?.filter?.edu_plan_id}?expand=weeks`,
        options: {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: !!urlValue?.filter?.edu_plan_id
        },
    });

    const selectData: TypeFilterSelect[] = [
        {
            name: "edu_plan_id",
            label: "Edu plan",
            permission: "edu-plan_index",
            url: "timetables/edu-plan",
            // onChange: (e) => { },
            child_names: ["edu_semestr_id"]
        },
    ]

    return (
        <div className="dashboard bg-[#F7F7F7] min-h-full p-3">
            <Row gutter={[12, 12]}>
                <Col xs={24} lg={14} xl={16}>
                    <div className="rounded-lg e-card-shadow shadow- min-h-[24rem] p-2 bg-white">
                        <Row gutter={[12, 12]} className='mb-4 mt-2' >
                            {
                                selectData?.map(e => <FilterSelect key={e?.name} {...e} />)
                            }
                            {
                                checkPermission("edu-semestr_index") ?
                                    <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                                        {/* <label className='mb-2 block'>{t("Edu semestr")}</label> */}
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
                        <h2 className='opacity-60 mb-4' >{urlValue?.filter_like?.edu_week?.split("and")[0] ?? "-"} dan {urlValue?.filter_like?.edu_week?.split("and")[1] ?? '-'} gacha</h2>
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