import { ColumnsType } from 'antd/es/table';
import useGetAllData from 'hooks/useGetAllData';
import useGetData from 'hooks/useGetData';
import { IPara } from 'models/education';
import { ISimple } from 'models/other';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Select, Table, Tag } from "antd"
import { BookRegular, BuildingRegular, InfoRegular, PersonVoiceRegular } from '@fluentui/react-icons';
import useUrlQueryParams from 'hooks/useUrlQueryParams';

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
  return colors[i];
}

const GroupTimeTable = ({dates}: {dates: any}) => {
  const { id: group_id } = useParams();
  const { t } = useTranslation();
  const { urlValue, writeToUrl } = useUrlQueryParams({ currentPage: 1, perPage: 15 });

  const { data, isFetching } = useGetAllData({
    queryKey: ["timetable-dates", urlValue.filter_like, group_id],
    url: "timetable-dates?expand=subject,subjectCategory,building,room,week,para,user.profile,all,all.group,secondGroup,secondGroup.user,secondGroup.user.profile,secondGroup.building,secondGroup.room",
    urlParams: {
      "per-page": 0,
      filter: `{"group_id":${group_id}}`,
      start_date: urlValue.filter_like.edu_week?.split("and")[0], 
      end_date: urlValue.filter_like.edu_week?.split("and")[1],
    },
    options: {
      enabled: !!group_id && !!urlValue.filter_like.edu_week,
    }
  })

  const { data: weeks } = useGetData<ISimple>({
    queryKey: ["weeks"],
    url: "weeks",
    urlParams: {
      filter: JSON.stringify({status: 1})
    },
    options: { staleTime: Infinity, refetchOnWindowFocus: false, retry: 0 },
  });

  const { data: paras } = useGetData<IPara>({
    queryKey: ["paras"],
    url: "paras",
    options: { staleTime: Infinity, refetchOnWindowFocus: false, retry: 0 },
  });



  const renderData = (time_table: any, color: any, paer?: any) => {
    return <div className={`rounded-r-lg p-2 text-start`} style={{background: color?.bg ?? "#fff", borderLeft: "4px solid", borderColor: color?.color ?? "#ddd"}} >
        <p className='inline-flex items-start flex-wrap' ><BuildingRegular fontSize={16} className='me-2' /><span>{time_table?.building?.name}&nbsp;&nbsp;{time_table?.room?.name?.replace(/\D/g, '')}-xona ({time_table?.room?.capacity})</span>{paer ? <span> / {paer?.building?.name}&nbsp;&nbsp;{paer?.room?.name?.replace(/\D/g, '')}-xona ({time_table?.room?.capacity})</span> : null}</p>
        <p className='d-f- inline-flex-' ><InfoRegular fontSize={16} className='me-2' /><span><i>{time_table?.subjectCategory?.name}</i></span></p>
        <p className='d-f- inline-flex-' ><BookRegular fontSize={16} className='me-2' /><span className='text-blue-600'>{time_table.subject?.name}</span></p>
        <p className='d-f- inline-flex- uppercase flex-wrap' ><PersonVoiceRegular fontSize={16} className='me-2' /><span className='text-[#D18D4B]' >{time_table.user?.profile?.last_name}&nbsp;{time_table?.user?.profile?.first_name?.slice(0, 1)}. {time_table?.user?.profile?.middle_name?.slice(0, 1)}.</span>{ paer ? <span className='text-[#D18D4B]' > / {paer.user?.profile?.last_name}&nbsp;{paer?.user?.profile?.first_name?.slice(0, 1)}. {paer?.user?.profile?.middle_name?.slice(0, 1)}.</span> : null}</p>
        <Tag className='mt-2' color={time_table?.type === 1 ? "warning" : time_table?.type === 2 ? "warning" : "blue"}>{time_table?.type === 1 ? "Toq hafta darsi" : time_table?.type === 2 ? "Juft hafta darsi" : "Doimiy dars"}</Tag>
    </div>
  }

  const renderTimeTable = (para_id: number, week_id: number) => {
    if (data?.items?.length) {
      for (const item of data?.items) {
        if (item?.para_id === para_id && item?.week_id === week_id && item?.group_id == group_id) {

          let paer_1 = item
          let paer_2 = null

          if(item?.two_group === 1) {
            paer_2 = item?.secondGroup;
          }





          // let paer_1 = null
          // let paer_2 = null

          // if(item?.type === 0){

          //   // paer_1 = item
          //   paer_2 = data?.items?.find(e => e?.para_id === para_id && e?.week_id === week_id && e?.group_id == group_id && e?.two_groups === 1 && e?.id !== item?.id)
          // }else {
          //   paer_1 = data?.items?.find(e => e?.para_id === para_id && e?.week_id === week_id && e?.group_id == group_id && e?.type === 1)
          //   paer_2 = data?.items?.find(e => e?.para_id === para_id && e?.week_id === week_id && e?.group_id == group_id && e?.type === 2)
          // }

          return <>
            {
              item?.two_group === 1 ? <div>{renderData(paer_1, generateColor(item?.subject?.name), paer_2)}</div> : <div>{renderData(paer_1, generateColor(item?.subject?.name))}</div>
            }
            {/* {
              item?.type === 2 && !paer_1 ? null : paer_1 && paer_1?.type !== item?.type ? <div className='mb-2' >{renderData(paer_1, generateColor(item?.subject?.name), paer_2)}</div> : ""
            } */}
            {/* { item?.type === 0 && paer_2 ? <div>{renderData(item, generateColor(item?.subject?.name), paer_2)}</div> : <div>{renderData(item, generateColor(item?.subject?.name))}</div>}
            {
              item?.type === 1 && !paer_2 ? null : paer_2 && paer_2?.type !== item?.type ? <div className='mt-2' >{renderData(paer_2, generateColor(item?.subject?.name), paer_2)}</div> : ""
            } */}
          </>
          // return <> {renderData(item, generateColor())} </>
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
      render: (e, _, i) => <span><b>{i + 1}.</b> {e?.start_time} - {e?.end_time}</span>
    },
    ...(weeks?.items?.map(e => ({
      title: e?.name,
      className: "time-table-box",
      width: 200,
      render: (item: IPara) => renderTimeTable(item?.id, e?.id)
    })) || [])
  ]

  return (
    <div className="px-2">
      <Select
        className='w-[400px]'
        showSearch
        placeholder="Select date"
        optionFilterProp="children"
        value={urlValue?.filter_like?.edu_week}
        onChange={(e) => writeToUrl({ name: "edu_week", value: e })}
        filterOption={(input: string, option?: { label: string; value: string }) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
        options={dates?.map((item: any) => ({value: `${item?.start_date}and${item?.end_date}`, label: <div className='flex items-center'>{item?.week} - hafta / {item?.start_date} - {item?.end_date}</div>}))}
      />
      <Table
        columns={columns}
        dataSource={paras?.items}
        pagination={false}
        loading={isFetching}
        size="middle"
        className="mt-3 mb-5"
        rowClassName="py-[12px]"
        scroll={{ x: 1600 }}
        bordered
      />
    </div>
  );
};

export default GroupTimeTable;