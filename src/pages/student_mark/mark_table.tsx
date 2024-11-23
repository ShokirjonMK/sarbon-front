import React, { FC, useEffect, useState, Dispatch } from 'react'
import { Button, Input, Tag } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { IStudent } from 'models/student';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Notification } from 'utils/notification';
import { IStudentMark } from 'models/mark';
import { submitMarks } from './request';
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import checkPermission from 'utils/check_permission';
import { DismissFilled } from '@fluentui/react-icons';
import { useTranslation } from 'react-i18next';

const MarkTable: FC<{ data: any, isFetching: boolean, refetch: any, teacher?: boolean, examTypes: any[], studentMarkData?: IStudentMark[], setSearchVal: Dispatch<string>, markIsFetching: boolean }> = ({ data, isFetching, refetch, teacher, examTypes, studentMarkData, setSearchVal, markIsFetching }): JSX.Element => {

  const [exam_type_id, setexam_type_id] = useState<number | undefined>();
  const [marks, setmarks] = useState<{[std_id: number]: number}>();
  const [marksToSend, setmarksToSend] = useState<{[std_id: number]: number}>();
  const [selectedExamTypeId, setselectedExamTypeId] = useState<number>();
  const { urlValue } = useUrlQueryParams({});
  const { t } = useTranslation();

  useEffect(() => {
     setexam_type_id(undefined)
    if(data?.length){
      setmarksToSend(undefined)
    }
  }, [data]);

  useEffect(() => {
    if(data?.length){
      for (const item of data) {
        let ball = studentMarkData?.find(i => (i?.student_id == item?.id && i?.edu_semestr_exams_type_id == exam_type_id))?.ball;
        setmarks(prev => ({...prev, [item?.id]: Number(ball ? ball : 0)}))
      }
    }
  }, [studentMarkData, data?.length, exam_type_id])

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

  const columns: ColumnsType<IStudent> = React.useMemo(() => [
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
    ...((selectedExamTypeId ? [examTypes?.find(i => i?.id == selectedExamTypeId)] : examTypes) || []).map(i => ({
      title: <div key={i?.id} className='flex justify-between items-center'>
          <>{i?.examsType?.name} (max - {i?.max_ball})</>
          <div>
            {(exam_type_id == i?.id || !!selectedExamTypeId) ? <Button onClick={() => {setexam_type_id(undefined); setselectedExamTypeId(undefined); setmarksToSend(undefined)}} danger className='mr-2 items-center' icon={<DismissFilled height={16} />} /> : null}
            {checkPermission("student-mark_update") && !selectedExamTypeId ? <Button
              // disabled={i?.examsType?.id === 1}
              className='ml-2'
              loading={isLoading}
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
        const currentStdMark = studentMarkData?.find(mark => (mark?.student_id == e?.id && mark?.edu_semestr_exams_type_id == i?.id));
        if(currentStdMark?.status === 0) {
          return <Tag color='error'>{t("Not allowed")}</Tag>
        } else {
          if(exam_type_id == i?.id) {
            return <Input
                      type="number"
                      onChange={event => {
                        setmarks(prev => ({...prev, [e?.id]: Number(event.target.value)}));
                        setmarksToSend(prev => ({...prev, [e?.id]: Number(event.target.value)}));
                      }}
                      max={i?.max_ball}
                      min={0}
                      defaultValue={currentStdMark?.ball}
                      className='w-[70px]'
                    />
          } else {
            return <span className='font-normal'>{currentStdMark?.ball}</span>
          }
        }
      }
    }))
  ], [data, examTypes, studentMarkData, exam_type_id, marks, markIsFetching, selectedExamTypeId, isLoading]);

  return (
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
  )
}

export default MarkTable

/**
  *  student-mark_index
  *  student-mark_delete
  *  student-mark_update
  *  student-mark_create
  *  student-mark_view
*/
