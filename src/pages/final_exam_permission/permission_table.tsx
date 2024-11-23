import React, { FC, useEffect, useState, Dispatch } from 'react'
import { Button, Switch, Tag } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { IStudent } from 'models/student';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Notification } from 'utils/notification';
import { IStudentMark } from 'models/mark';
import { submitMarks } from './request';
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import checkPermission from 'utils/check_permission';

const ExamPermissionTable: FC<{ data: any, isFetching: boolean, refetch: any, teacher?: boolean, examTypes: any[], studentMarkData?: IStudentMark[], setSearchVal: Dispatch<string>, markIsFetching: boolean }> = ({ data, isFetching, refetch, teacher, examTypes, studentMarkData, setSearchVal, markIsFetching }): JSX.Element => {

  const [marks, setmarks] = useState<{[std_id: string]: number}>();
  const [marksForSend, setmarksForSend] = useState<{[std_id: string]: number}>();
  const [selectedExamTypeId, setselectedExamTypeId] = useState<number>();
  const [mystudentMarkData, setmystudentMarkData] = useState<IStudentMark[]>();
  const { urlValue } = useUrlQueryParams({});
  const {t} = useTranslation();

  useEffect(() => {    
    if(studentMarkData?.length){
      setmystudentMarkData(studentMarkData)
    }
  }, []); 

  useEffect(() => {    
    if(data?.length){
      setmarksForSend(undefined)
    }
  }, [data]);  
  
  useEffect(() => {
    setselectedExamTypeId(examTypes?.find((item: any) => item?.exams_type_id == 3)?.id)
  }, [examTypes])
  

  useEffect(() => {    
    if(studentMarkData?.length){
      for (const item of studentMarkData) {
        if(item?.exam_type_id === 3){
          setmarks(prev => ({...prev, [`${item?.student_id}-${item?.vedomst}`]: Number(item?.vedomst ? item?.vedomst : 0)}))
        }        
      }
    }


  }, [studentMarkData, data?.length, selectedExamTypeId]);  
    
  const { mutate, isLoading } = useMutation({
    mutationFn: async () => submitMarks(selectedExamTypeId, marksForSend, urlValue.filter?.group_id),
    onSuccess: async (res) => {
      if (res?.status === 1) {
        Notification("success", "update", res?.message);
        refetch();
        setmarks(undefined)
        setmarksForSend(undefined)
      } else {
        Notification("error", "update", res?.message);
      }
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", "update", error?.response?.data ? error?.response?.data?.message : "");
    },
    retry: 0,
  });
  
  const filterStdMark = (student_id: number, vedmost: number) =>{
    const stdMark = studentMarkData?.find((stdMark) => (stdMark?.student_id === student_id && stdMark?.exam_type_id === 3 && stdMark?.vedomst === vedmost))
    return stdMark ? stdMark : undefined
  }


  const returnswitchOne = (student_id: number, vedmost: number) => {

    if(filterStdMark(student_id, 2) || filterStdMark(student_id, 3) || filterStdMark(student_id, 4)){
      return <Tag color='volcano'>Yiqilgan - {filterStdMark(student_id, vedmost)?.ball || "_"} / {filterStdMark(student_id, vedmost)?.max_ball || "_"}</Tag>
    } else {
      if(filterStdMark(student_id, vedmost)){
        if(filterStdMark(student_id, vedmost)?.passed === 1){
          return <Tag color='green'>Baholangan - {filterStdMark(student_id, vedmost)?.ball || "_"} / {filterStdMark(student_id, vedmost)?.max_ball || "_"}</Tag>
        } else if(filterStdMark(student_id, vedmost)?.passed === 2) {
          return <Tag color='volcano'>Yiqilgan - {filterStdMark(student_id, vedmost)?.ball || "_"} / {filterStdMark(student_id, vedmost)?.max_ball || "_"}</Tag>
        } else {
          return <Switch
                    onChange={event => {
                        setmarksForSend(prev => ({...prev, [student_id]: event ? 1 : 0})); 
                        setmarks(prev => ({...prev, [`${student_id}-1`]: event ? 1 : 0}))
                      }
                    }
                    checked={marks ? marks[`${student_id}-1`] === 1 : false}
                    checkedChildren={"Faol"}
                    unCheckedChildren={t("InActive")}
                    disabled={!checkPermission("student-mark_create") || true}
                  />
  
        }
      } else {
        return <Switch
                  onChange={event => {
                      setmarksForSend(prev => ({...prev, [student_id]: event ? 1 : 0})); 
                      setmarks(prev => ({...prev, [`${student_id}-1`]: event ? 1 : 0}))
                    }
                  }
                  checked={marks ? marks[`${student_id}-1`] === 1 : false}
                  checkedChildren={"Faol"}
                  unCheckedChildren={t("InActive")}
                  disabled={!checkPermission("student-mark_create")}
                />

      }
    }
  }

  const returnswitchTwo = (student_id: number, vedmost: number) => {

    if(filterStdMark(student_id, 3) || filterStdMark(student_id, 4)) {
      if(filterStdMark(student_id, vedmost)?.passed === 1){
        return <Tag color='green'>Baholangan - {filterStdMark(student_id, vedmost)?.ball || "_"} / {filterStdMark(student_id, vedmost)?.max_ball || "_"}</Tag>
      } else if(filterStdMark(student_id, vedmost)?.passed !== 1) {
        return <Tag color='volcano'>Yiqilgan - {filterStdMark(student_id, vedmost)?.ball || "_"} / {filterStdMark(student_id, vedmost)?.max_ball || "_"}</Tag>
      }
    } else {
      if(filterStdMark(student_id, 1) && filterStdMark(student_id, 1)?.passed !== 2){
        return  <Switch
                  onChange={event => {
                      setmarksForSend(prev => ({...prev, [student_id]: event ? 2 : 0})); 
                      setmarks(prev => ({...prev, [`${student_id}-2`]: event ? 2 : 0}))
                    }
                  }
                  checked={marks ? marks[`${student_id}-2`] === 2 : false}
                  checkedChildren={"Faol"}
                  unCheckedChildren={t("InActive")}
                  disabled={true}
                />
      } else {
        return  <Switch
                    onChange={event => {
                        setmarksForSend(prev => ({...prev, [student_id]: event ? 2 : 0})); 
                        setmarks(prev => ({...prev, [`${student_id}-2`]: event ? 2 : 0}))
                      }
                    }
                    checked={marks ? marks[`${student_id}-2`] === 2 : false}
                    checkedChildren={"Faol"}
                    unCheckedChildren={t("InActive")}
                    disabled={!checkPermission("student-mark_create") || !!filterStdMark(student_id, vedmost)}
                  />
      }
    }
  }

  const returnswitchThree = (student_id: number, vedmost: number) => {

    if(filterStdMark(student_id, 4)) {
      if(filterStdMark(student_id, vedmost)?.passed === 1){
        return <Tag color='green'>Baholangan - {filterStdMark(student_id, vedmost)?.ball || "_"} / {filterStdMark(student_id, vedmost)?.max_ball || "_"}</Tag>
      } else if(filterStdMark(student_id, vedmost)?.passed !== 1) {
        return <Tag color='volcano'>Yiqilgan - {filterStdMark(student_id, vedmost)?.ball || "_"} / {filterStdMark(student_id, vedmost)?.max_ball || "_"}</Tag>
      }
    } else {
      if((filterStdMark(student_id, 1) && filterStdMark(student_id, 1)?.passed !== 2) || filterStdMark(student_id, 2) && filterStdMark(student_id, 2)?.passed !== 2){
        return  <Switch
                  onChange={event => {
                      setmarksForSend(prev => ({...prev, [student_id]: event ? 3 : 0})); 
                      setmarks(prev => ({...prev, [`${student_id}-3`]: event ? 3 : 0}))
                    }
                  }
                  checked={marks ? marks[`${student_id}-3`] === 3 : false}
                  checkedChildren={"Faol"}
                  unCheckedChildren={t("InActive")}
                  disabled={true}
                />
      } else {
        return  <Switch
                    onChange={event => {
                        setmarksForSend(prev => ({...prev, [student_id]: event ? 3 : 0})); 
                        setmarks(prev => ({...prev, [`${student_id}-3`]: event ? 3 : 0}))
                      }
                    }
                    checked={marks ? marks[`${student_id}-3`] === 3 : false}
                    checkedChildren={"Faol"}
                    unCheckedChildren={t("InActive")}
                    disabled={!checkPermission("student-mark_create") || !!filterStdMark(student_id, vedmost)}
                  />
      }
    }
  }

  const calculateBallSumm = (student_id: number) => {
    const sortedStudentMarkData = studentMarkData?.filter((stdMark) => {
      if(stdMark?.student_id === student_id){
        if(stdMark?.exam_type_id === 3){
          if(stdMark?.passed === 1) return true
        } else {
          return true
        }
      }
    })
    return sortedStudentMarkData?.reduce((prev: number, cur) => prev + cur.ball, 0)
  }

  
  const columns: ColumnsType<IStudent> = React.useMemo(() => [
    {
      title: "№",
      dataIndex: "order",
      render: (_, __, i: number) => i + 1,
      width: 40,
      fixed: "left",
      rowScope: "row",
    },
    {
      title: "F.I.SH",
      key: "profile",
      fixed: "left",
      rowScope: "row",
      width: 250,
      render: (e: any) => <p className='font-normal py-[5px]' >{e?.profile?.last_name} {e?.profile?.first_name} {e?.profile?.middle_name}</p>
    },
    {
      title: "Sababli / Jami (NB) (Soat)",
      fixed: "left",
      rowScope: "row",
      // width: 200,
      align: "center",
      render: (e: any) => checkPermission("student-attend_index") ? <Link to={`/students/${e?.id}/attends`} target='_blank' className='font-normal py-[5px]' >{e?.studentAttendReasonCount ? e?.studentAttendReasonCount * 2 : e?.studentAttendReasonCount} / {e?.studentAttendsCount ? e?.studentAttendsCount * 2 : e?.studentAttendsCount}</Link> : <p>{e?.studentAttendReasonCount} / {e?.studentAttendsCount}</p>
    },
    ...((examTypes?.length ? examTypes : [])?.map((tt: any) => {
      return {
        title: `${tt?.examsType?.name} (Ball/Max)`,
        fixed: "left",
        rowScope: "row",
        align: "center",
        render: (e: any) => <p className='font-normal'>{studentMarkData?.find((stdMark) => (stdMark?.edu_semestr_exams_type_id == tt?.id && stdMark?.student_id === e?.id))?.ball || 0} / {tt?.max_ball}</p>
      }
    }) as ColumnsType<IStudent>),
    {
      title: "Umumiy ball",
      fixed: "left",
      rowScope: "row",
      align: "center",
      render: (e: any) => <p className='font-normal'>
      {calculateBallSumm(e?.id)} / {examTypes?.reduce(function(prev, cur) { return prev + cur.max_ball}, 0)}</p>
    },
    {
      title: '1 - shakl',
      fixed: "left",
      rowScope: "row",
      align: "center",
      render: (e: any) => returnswitchOne(e?.id, 1)
    },
    {
      title: "1 - A shakl",
      fixed: "left",
      rowScope: "row",
      align: "center",
      render: (e: any) => returnswitchTwo(e?.id, 2)
    },
    {
      title: "1 - B shakl",
      fixed: "left",
      rowScope: "row",
      align: "center",
      render: (e: any) => returnswitchThree(e?.id, 3)
    },
  ], [data, examTypes, studentMarkData, marks, markIsFetching, selectedExamTypeId]);

  return (
    <div>
      <div className="flex justify-end mt-4">
        <Button onClick={() => {mutate()}} loading={isLoading} type='primary'>O'zgarishlarni saqlash</Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        size="small"
        bordered
        loading={isFetching}
        scroll={{ x: 1024, scrollToFirstRowOnChange: true }}
        className="mt-4"
      />
    </div>
  )
}

export default ExamPermissionTable

/**
  *  student-mark_index
  *  student-mark_delete
  *  student-mark_update
  *  student-mark_create
  *  student-mark_view
*/
