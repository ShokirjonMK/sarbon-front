import React, { FC, useEffect, useState, Dispatch, useMemo } from 'react'
import { Button, InputNumber, Tag } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Notification } from 'utils/notification';
import { IStudentMark } from 'models/mark';
import { submitMarks } from './request';
import checkPermission from 'utils/check_permission';
import { DismissFilled } from '@fluentui/react-icons';
import { useTranslation } from 'react-i18next';
import { IProfile } from 'models/user';

const VedomstMarkTable: FC<{
  isFetching: boolean,
  refetch: any,
  examTypes: any[],
  isVedomstPermission: boolean,
  teacher?: boolean,
  data?: IStudentMark[],
  setSearchVal: Dispatch<string>,
}> = ({ isFetching, refetch, teacher, examTypes, data, setSearchVal, isVedomstPermission }): JSX.Element => {
  const [exam_type_id, setexam_type_id] = useState<number | undefined>();
  const [marks, setmarks] = useState<{ [std_id: number]: number }>();
  const [marksToSend, setmarksToSend] = useState<{ [std_id: number]: number }>();
  // const { urlValue } = useUrlQueryParams({});
  const { t } = useTranslation();

  useEffect(() => {
    setexam_type_id(undefined)
    if (data?.length) {
      setmarksToSend(undefined)
    }
  }, [data]);

  const students = useMemo(() => {
    let _students: { id: number, profile: IProfile | undefined, [key: number]: any }[] = [];
    // const _students: any[] = [];
    data?.forEach(e => {
      const i = _students?.findIndex(a => a?.id === e?.student_id);

      if (i >= 0) {
        _students[i] = { ..._students[i], [e?.exam_type_id]: e }
      } else {
        _students.push({
          id: e?.student_id,
          profile: e?.student?.profile,
          [e?.exam_type_id]: e
        })
      }
    });

    return _students
  }, [data])

  useEffect(() => {
    if (data?.length) {
      for (const item of data) {
        let ball = data?.find(i => (i?.student_id === item?.id && i?.edu_semestr_exams_type_id === exam_type_id))?.ball;
        setmarks(prev => ({ ...prev, [item?.id]: Number(ball ? ball : 0) }))
      }
    }
  }, [data, data?.length, exam_type_id])

  const { mutate, isLoading } = useMutation({
    mutationFn: async () => submitMarks(marksToSend),
    onSuccess: async (res) => {
      if (res?.status === 1) {
        Notification("success", "update", res?.message);
        refetch();
        setmarks(undefined)
        setmarksToSend(undefined)
        setexam_type_id(undefined)
      } else {
        Notification("error", "update", res?.message);
      }
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", "update", error?.response?.data ? error?.response?.data?.message : "");
    },
    retry: 0,
  });

  const move = (array: any[], from: number, to: number, on = 1) => {
    return array = array.slice(), array.splice(to, 0, ...array.splice(from, on)), array
  }  

  const columns: ColumnsType<any> = React.useMemo(() => [
    {
      title: "№",
      dataIndex: "order",
      render: (_, __, i: number) => i + 1,
      width: 50,
      fixed: "left",
      rowScope: "row",
    },
    {
      title: "F.I.SH",
      key: "profile",
      fixed: "left",
      rowScope: "row",
      width: 300,
      render: (e) => <p className='font-normal py-[5px]' >{e?.profile?.last_name} {e?.profile?.first_name} {e?.profile?.middle_name}</p>
    },
    ...move(((examTypes) || [])?.sort((a,b) => a?.exams_type_id - b?.exams_type_id),2,examTypes?.length-1)?.map(i => ({
      title: <div key={i?.id} className='flex justify-between items-center'>
        <>{i?.examsType?.name} (max - {i?.max_ball})</>
        <div>
          {(exam_type_id == i?.id) ? <Button onClick={() => { setexam_type_id(undefined); setmarksToSend(undefined) }} danger className='mr-2 items-center' icon={<DismissFilled height={16} />} /> : null}
          {checkPermission("student-mark_student-mark-update") && i?.exams_type_id !== 3 ? <Button
            // disabled={i?.examsType?.id === 1}
            className='ml-2'
            loading={isLoading}
            disabled={!isVedomstPermission}
            onClick={() => {
              exam_type_id != i?.id ?
                setexam_type_id(i?.id)
                : mutate()
            }}
          >{exam_type_id == i?.id ? "Saqlash" : "Baholash"}</Button> : null}
        </div>
      </div>,
      key: "ball",
      width: 300,
      className: "text-center",
      render: (e: any) => {
        // const currentStdMark = studentMarkData?.find(mark => (mark?.student_id == e?.id && mark?.edu_semestr_exams_type_id == i?.id));
        if (e?.status === 0) {
          return <Tag color='error'>{t("Not allowed")}</Tag>
        } else {
          if (exam_type_id == i?.id) {
            return <InputNumber
              onChange={event => {
                setmarks(prev => ({ ...prev, [e[i?.exams_type_id]?.id]: Number(event) }));
                setmarksToSend(prev => ({ ...prev, [e[i?.exams_type_id]?.id]: Number(event) }));
              }}
              max={i?.max_ball}
              min={0}
              disabled={!isVedomstPermission}
              defaultValue={e[i?.exams_type_id]?.ball}
              className='w-[70px]'
            />
          } else {
            return <span className='font-normal'>{e[i?.exams_type_id]?.ball}</span>
          }
        }
      }
    })),
    {
      title: "Umumiy (ball / max)",
      key: "profile",
      width: 300,
      className: "text-center",
      render: (e) => <p className='font-normal py-[5px]' >{data?.filter(i => i?.student_id === e?.id)?.reduce(function(prev, cur) { return prev + cur.ball}, 0)} / {data?.filter(i => i?.student_id === e?.id)?.reduce(function(prev, cur) { return prev + cur.max_ball}, 0)}</p>
    },
  ], [data, examTypes, data, exam_type_id, marks, isLoading]);

  return (
    <Table
      columns={columns}
      dataSource={students}
      pagination={false}
      size="small"
      bordered
      loading={isFetching}
      scroll={{ x: 1024, scrollToFirstRowOnChange: true }}
      className="mt-4"
    />
  )
}

export default VedomstMarkTable

/**
  *  student-mark_student-mark-update
  *  student-mark_index
  *  student-mark_delete
  *  student-mark_update
  *  student-mark_create
  *  student-mark_view
*/
