import React, { useState } from 'react'
import Table, { ColumnsType } from 'antd/es/table';
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import { useTranslation } from 'react-i18next';
import checkPermission from 'utils/check_permission';
import { Button, InputNumber, Switch, Tag, Tooltip } from 'antd';
import { useParams } from 'react-router-dom';
import HeaderExtraLayout from 'components/HeaderPage/headerExtraLayout';
import useGetOneData from 'hooks/useGetOneData';
import { IFinalExam } from 'models/exam';
import { DismissFilled, PersonAvailable20Regular, PersonDelete20Regular } from '@fluentui/react-icons';
import { useMutation } from '@tanstack/react-query';
import { submitMarks } from '../crud/requests';
import { Notification } from 'utils/notification';
import { AxiosError } from 'axios';
import { useAppSelector } from 'store';
import { renderExamStatus } from '..';

const sortStudent = (a: any, b: any) => {

  const nameA = a?.student?.profile?.last_name?.toUpperCase(); // ignore upper and lowercase
  const nameB = b?.student?.profile?.last_name?.toUpperCase(); // ignore upper and lowercase
  const groupA = a?.group_id;
  const groupB = b?.group_id;

  if (groupA < groupB) {
    return -1;
  }
  else if (groupA > groupB) {
    return 1;
  }
  else {
    if (nameA < nameB) {
      return -1;
    }
    else if (nameA > nameB) {
      return 1;
    }
    return 0;
  }
};

const ExamStudentMark: React.FC = (): JSX.Element => {

  const { t } = useTranslation()
  const { exam_id } = useParams()
  const { urlValue, writeToUrl } = useUrlQueryParams({
    currentPage: 1,
    perPage: 10,
  });
  const user = useAppSelector(p => p.auth.user)
  
  const [isMark, setIsMark] = useState(false)
  const [isAmaliyStatus, setIsAmaliyStatus] = useState(0)
  const [marks, setmarks] = useState<{[std_id: number]: {a?: number, b?: number}}>({});

  const calcAttend = ({attendAll, subjectAllHour, reason}: {attendAll: number, subjectAllHour: number, reason: number}) => {
    
    const percent = parseFloat((((attendAll - reason)/(subjectAllHour))*100).toFixed(2));
    let status: "banned" | "active" = percent >= 25 ? "banned" : "active";
    let color: "red" | "green" = percent >= 25 ? "red" : "green";

    return {
      percent,
      status,
      title: <Tag color={color} className='text-[16px] px-3 py-1' >{percent? (percent) : 0}% / {attendAll * 2 - reason * 2} / {reason * 2} / {subjectAllHour * 2}</Tag>
    }
  }

  const calcBall = (vedomsControlBall: any) => {

    const allBall = vedomsControlBall?.reduce((acc: number, cur: any) => acc += cur?.ball, 0)
    const maxBall = vedomsControlBall?.reduce((acc: number, cur: any) => acc += cur?.max_ball, 0)
    let status: "banned" | "active" = allBall/maxBall < 0.6 ? "banned" : "active";
    let color: "red" | "green" = allBall/maxBall < 0.6 ? "red" : "green";

    return {
      allBall,
      status,
      title: <Tag color={color} className='text-[16px] px-3 py-1' >{allBall}</Tag>
    }
  }

  const { data, refetch, isLoading } = useGetOneData<IFinalExam>({
    queryKey: ["final-exams", exam_id],
    url: `final-exams/${exam_id}?sort=-id&expand=examsType,eduSemestrExamsType,eduPlan.faculty,groups.group,eduSemestrSubject.subject,building,room,para,group,studentMark.group,studentMark.student.profile,studentMark.studentVedomst,studentMark.attendStatus,studentMark.vedomsControlBall`,
    urlParams: { "per-page": urlValue.perPage, page: urlValue.currentPage, filter: JSON.stringify(urlValue?.filter) },
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
      onSuccess: (res) => {
        let mark = {};
        res?.data?.studentMark?.forEach(e => {
          mark = {...mark, [e?.id]: {a: e?.attend ?? 0, b: e?.ball ?? 0}};
        });
        setmarks(mark)
        if(res?.data?.studentMark?.length){
          setIsAmaliyStatus(res?.data?.studentMark[0]?.attendStatus?.status)
        }
      },
      enabled: !!exam_id
    }
  })  

  const columns: ColumnsType<any> = React.useMemo(() => {

    let arr: any = [
      {
        title: "№",
        dataIndex: "order",
        render: (_: any, __: any, i: number) => i + 1,
        width: 50,
        fixed: "left",
        rowScope: "row",
      },
      {
        title: "F.I.O",
        key: "profile",
        fixed: "left",
        rowScope: "row",
        render: (e: any) => <p className='font-normal py-[5px]' >{e?.student?.profile?.last_name} {e?.student?.profile?.first_name} {e?.student?.profile?.middle_name}</p>
      },
      {
        title: t("Group"),
        key: "profile",
        fixed: "left",
        rowScope: "row",
        className: "bg-[red]",
        render: (e: any) => <p className='font-normal py-[5px]' >{e?.group?.unical_name}</p>
      },
      isAmaliyStatus === 0 ? {
        title: t("Yakuniygacha to'plangan ball"),
        key: "profile",
        align: "center",
        render: (e: any) => <p className='font-normal'>{calcBall(e?.vedomsControlBall).title}</p>
      } : undefined,
      isAmaliyStatus === 0 ? {
        title: t("Sababsiz % / Sababsiz / Sababli / Jami (soat)"),
        key: "profile",
        align: "center",
        render: (e: any) => <p className='font-normal'>{calcAttend(e?.attendStatus)?.title}</p>
      } : undefined,
      {
        key: "ball",
        width: 400,
        className: "text-center",
        title: <div className='flex justify-between items-center'>
            <>{data?.data?.examsType?.name} (Max ball: {data?.data?.eduSemestrExamsType?.max_ball})</>
            <div>
              {isMark ? <Button onClick={() => {setIsMark(false); setmarks({})}} danger className='mr-2 items-center' icon={<DismissFilled height={16} />} /> : null}
              { data?.data?.status !== 3 ? <Tag color='warning'>Baholab bo'lmaydi</Tag> : checkPermission("student-mark_final-exam") && (data?.data?.user_id === user?.user_id || user?.active_role.includes("admin")) ? <Button
                // disabled={i?.examsType?.id === 1}
                className='ml-2'
                loading={isLoading}
                onClick={() => {
                  if(!isMark){
                    setIsMark(true);
                  } else {
                    mutate()
                  }
                }}
              >{isMark ? "Saqlash" : "Baholash"}</Button> : null}
            </div>
          </div>,
          children: [
            {
              title: "Davomat",
              align: "center",
              render: (e: any) => {
                // const {attend, ball} = e?.studentVedomst?.find((e: any) => e?.vedomst === e?.vedomst);
                if(isMark){
                  const disabled = isAmaliyStatus === 0 ? (calcAttend(e?.attendStatus).status === "banned" || calcBall(e?.vedomsControlBall)?.status === "banned") : false;
                  return disabled ? <Tooltip color='red' title={<>
                                                                  <p>{calcAttend(e?.attendStatus).status === "banned" ? "⚠️Talaba sababsiz dabomati 25% dan baland!" : ""}</p>
                                                                  <p>{calcBall(e?.vedomsControlBall)?.status === "banned" ? "⚠️Talaba to'plagan bali 60% dan past!" : ""}</p>
                                                                </>
                                                                } >
                              <Switch 
                                defaultChecked={e?.attend}
                                disabled={disabled}
                                onChange={(a) => setmarks(p => ({...p, [e?.id]: ( p[e?.id] ? {...p[e?.id], a: a?1:0, b: a ? e?.ball : 0} : {a: a?1:0, b: e?.ball})}))} 
                              />
                        </Tooltip>
                        :<Switch 
                            defaultChecked={e?.attend}
                            disabled={disabled}
                            onChange={(a) => setmarks(p => ({...p, [e?.id]: ( p[e?.id] ? {...p[e?.id], a: a?1:0, b: a ? e?.ball : 0} : {a: a?1:0, b: e?.ball})}))} 
                          />
                }
                return e?.attend ? <PersonAvailable20Regular color='#31BD59' className='ms-1' /> : <PersonDelete20Regular color='#FF0000' className='ms-1' />
              }
            },
            {
              title: "Ball",
              align: "center",
              render: (e: any) => {
                // const {attend, ball} = e?.studentVedomst?.find((e: any) => e?.vedomst === e?.vedomst);
  
                  if(isMark) {
                    return <InputNumber
                              type="number"
                              onChange={event => {
                                console.log(event, e?.ball, e?.id);
                                // setmarks(p => ({...p, [e?.id]: ( p[e?.id] ? {...p[e?.id], b: event} : {b: event})}))
                                if(event !== e?.ball) setmarks(p => ({...p, [e?.id]: ( p[e?.id] ? {...p[e?.id], b: event} : {b: event})}));
                                // setmarksToSend(prev => ({...prev, [e?.id]: Number(event)}));
                              }}
                              max={e?.max_ball}
                              min={0}
                              value={marks[e?.id]?.b}
                              disabled={!((marks[e?.id] && marks[e?.id]?.a) || ((!marks[e?.id]) && e?.attend))}
                              // className='w-[70px]'
                            />
                  } else {
                    return <span className='font-normal'>{e?.ball}</span>
                  }
                }
            }
          ]
        }
    ]

    return arr?.filter((item: any) => item);

  }, [data?.data, isMark, marks]);

  const { mutate, isLoading: clicked } = useMutation({
    mutationFn: () => submitMarks(exam_id, marks),
    onSuccess: async (res) => {
      Notification("success", "update", res?.message)
      refetch();
      setIsMark(false);
      setmarks({})
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", "update", error?.response?.data ? error?.response?.data?.message : "");
    },
    retry: 0,
  });

  return (
    <>
      <HeaderExtraLayout
      title={data?.data?.eduPlan?.faculty?.name + " / " + data?.data?.eduSemestrSubject?.subject?.name + " / " + data?.data?.date + " / " + data?.data?.para?.name + " / " + data?.data?.building?.name + " / " + data?.data?.room?.name}
        breadCrumbData={[
          { name: "Home", path: '/' },
          { name: "Exams", path: '/exams' },
          { name: "Talabalar imtihon bahosi", path: 'exams' }
        ]}
        isBack
      />
      <div className='py-2 px-6 pb-8'>
        <span><span className="text-blck opacity-60">Talabalar soni:</span> <b>{data?.data?.studentMark?.length}</b></span> &nbsp; / &nbsp;
        <span><span className="text-blck opacity-60">Guruh(lar):</span> {data?.data?.groups?.map((e: any, i: number) => <Tag key={i} color='blue' className='border-1'>{e?.group?.unical_name}</Tag> )}</span>
        &nbsp;/ &nbsp;<span><span className="text-blck opacity-60">Holati:</span> {renderExamStatus(data?.data?.status ?? 0, "py-[3px] px-[0.75rem] rounded-md")?.tag}</span>
        <Table
          columns={columns}
          // dataSource={data?.items.length ? data?.items : allData}
          dataSource={data?.data?.studentMark?.sort(sortStudent)}
          pagination={false}
          loading={isLoading}
          size="middle"
          className="mt-3"
          rowClassName="py-[12px]"
          // scroll={globalConstants?.tableScroll}
          scroll={{ y: 900 }}
        />
        {/* {(data?._meta?.totalCount ?? 0) > 10 ? <CustomPagination totalCount={data?._meta.totalCount} currentPage={urlValue.currentPage} perPage={urlValue.perPage} /> : undefined} */}
      </div>
    </>
  )
}

export default ExamStudentMark