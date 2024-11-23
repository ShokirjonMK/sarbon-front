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
import { DismissFilled } from '@fluentui/react-icons';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import checkPermission from 'utils/check_permission';

const ExamPermissionTable: FC<{ data: any, isFetching: boolean, refetch: any, teacher?: boolean, examTypes: any[], studentMarkData?: IStudentMark[], setSearchVal: Dispatch<string>, markIsFetching: boolean }> = ({ data, isFetching, refetch, teacher, examTypes, studentMarkData, setSearchVal, markIsFetching }): JSX.Element => {

  const [marks, setmarks] = useState<{[std_id: number]: number}>();
  const [marksForSend, setmarksForSend] = useState<{[std_id: number]: number}>();
  const [selectedExamTypeId, setselectedExamTypeId] = useState<number>();
  const [selectedExamType, setselectedExamType] = useState<any>();
  const { urlValue } = useUrlQueryParams({});
  const {t} = useTranslation();

  useEffect(() => {    
    if(data?.length){
      for (const item of data) {
        let markStatus = studentMarkData?.find(i => (i?.student_id == item?.id && i?.edu_semestr_exams_type_id == selectedExamTypeId))?.status;
        setmarks(prev => ({...prev, [item?.id]: Number(markStatus ? markStatus : 0)}))
      }
    }
  }, [studentMarkData, data?.length, selectedExamTypeId]);  
    
  const { mutate } = useMutation({
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
    {
      title: "Sababli / Jami (NB)",
      fixed: "left",
      rowScope: "row",
      width: 150,
      align: "center",
      render: (e) => checkPermission("student-attend_index") ? <Link to={`/students/${e?.id}/attends`} target='_blank' className='font-normal py-[5px]' >{e?.studentAttendReasonCount} / {e?.studentAttendsCount}</Link> : <p>{e?.studentAttendReasonCount} / {e?.studentAttendsCount}</p>
    },
    ...((selectedExamTypeId ? [examTypes?.find(i => i?.id == selectedExamTypeId)] : examTypes) || []).map(i => ({
      title: <div key={i?.id} className='flex justify-between items-center'>
          <>{i?.examsType?.name} (max - {i?.max_ball})</>
          <div>
            {!!selectedExamTypeId ? <Button onClick={() => {setselectedExamTypeId(undefined); setmarksForSend(undefined)}} danger className='mr-2 items-center' icon={<DismissFilled height={16} />} /> : null}
            <Button onClick={() => {
                
                selectedExamTypeId != i?.id ?
                setselectedExamTypeId(i?.id)
                : mutate();
              }}
              disabled={!checkPermission("student-mark_update")}
            >{selectedExamTypeId !== i?.id ? t("Designation") : t("Save")}</Button>
          </div>
        </div>,
      key: "ball",
      width: 300,
      className: "text-center",
      render: (e: any) => {
        console.log("Gggg", e, i);
        
        const isGivenPermisison = studentMarkData?.find(mark => (mark?.student_id == e?.id && mark?.edu_semestr_exams_type_id == i?.id))?.status;
        return selectedExamTypeId == i?.id ? 
          <div>
            {
              i?.examsType?.id == 3 ?
              <div>
                <Switch
                  // onChange={event => setmarks(prev => ({...prev, [e?.id]: event ? 1 : 0}))}
                  onChange={event => {
                      setmarksForSend(prev => ({...prev, [e?.id]: event ? 1 : 0})); 
                      setmarks(prev => ({...prev, [e?.id]: event ? 1 : 0}))
                    }
                  }
                  checked={marks ? (marks[e?.id] === 1 || marks[e?.id] === 2) : false}
                  checkedChildren={marks ? (marks[e?.id] === 1 ? t("Active") : t("Baholangan")) : ""}
                  unCheckedChildren={t("InActive")}
                  disabled={!checkPermission("student-mark_update") || (marks ? marks[e?.id] === 2 : false)}
                />
                {/* <Switch
                  // onChange={event => setmarks(prev => ({...prev, [e?.id]: event ? 1 : 0}))}
                  onChange={event => {
                      setmarksForSend(prev => ({...prev, [e?.id]: event ? 1 : 0})); 
                      setmarks(prev => ({...prev, [e?.id]: event ? 1 : 0}))
                    }
                  }
                  checked={marks ? (marks[e?.id] === 1 || marks[e?.id] === 2) : false}
                  checkedChildren={marks ? (marks[e?.id] === 1 ? t("Active") : t("Baholangan")) : ""}
                  unCheckedChildren={t("InActive")}
                  disabled={!checkPermission("student-mark_update") || (marks ? marks[e?.id] === 2 : false)}
                />
                <Switch
                  // onChange={event => setmarks(prev => ({...prev, [e?.id]: event ? 1 : 0}))}
                  onChange={event => {
                      setmarksForSend(prev => ({...prev, [e?.id]: event ? 1 : 0})); 
                      setmarks(prev => ({...prev, [e?.id]: event ? 1 : 0}))
                    }
                  }
                  checked={marks ? (marks[e?.id] === 1 || marks[e?.id] === 2) : false}
                  checkedChildren={marks ? (marks[e?.id] === 1 ? t("Active") : t("Baholangan")) : ""}
                  unCheckedChildren={t("InActive")}
                  disabled={!checkPermission("student-mark_update") || (marks ? marks[e?.id] === 2 : false)}
                /> */}
              </div>
              : <Switch
                  // onChange={event => setmarks(prev => ({...prev, [e?.id]: event ? 1 : 0}))}
                  onChange={event => {
                      setmarksForSend(prev => ({...prev, [e?.id]: event ? 1 : 0})); 
                      setmarks(prev => ({...prev, [e?.id]: event ? 1 : 0}))
                    }
                  }
                  checked={marks ? (marks[e?.id] === 1 || marks[e?.id] === 2) : false}
                  checkedChildren={marks ? (marks[e?.id] === 1 ? t("Active") : t("Baholangan")) : ""}
                  unCheckedChildren={t("InActive")}
                  disabled={!checkPermission("student-mark_update") || (marks ? marks[e?.id] === 2 : false)}
                />
            }
            {/* <Switch
              // onChange={event => setmarks(prev => ({...prev, [e?.id]: event ? 1 : 0}))}
              onChange={event => {
                  setmarksForSend(prev => ({...prev, [e?.id]: event ? 1 : 0})); 
                  setmarks(prev => ({...prev, [e?.id]: event ? 1 : 0}))
                }
              }
              checked={marks ? (marks[e?.id] === 1 || marks[e?.id] === 2) : false}
              checkedChildren={marks ? (marks[e?.id] === 1 ? t("Active") : t("Baholangan")) : ""}
              unCheckedChildren={t("InActive")}
              disabled={!checkPermission("student-mark_update") || (marks ? marks[e?.id] === 2 : false)}
            /> */}

          </div>
        : <Tag 
            color={
              isGivenPermisison === 1 ?
            "success" 
            : isGivenPermisison === 2 ? 
            "processing" 
            : "error"
          }>{isGivenPermisison === 1 ? t("Allowed") : isGivenPermisison === 2 ? "Baholangan" : t("Not allowed")}
          </Tag>
        }
    }))
  ], [data, examTypes, studentMarkData, marks, markIsFetching, selectedExamTypeId]);

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

export default ExamPermissionTable

/**
  *  student-mark_index
  *  student-mark_delete
  *  student-mark_update
  *  student-mark_create
  *  student-mark_view
*/
