import React, {useState} from "react";
import { Button, Input, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { renderFullName } from "utils/others_functions";
import useGetAllData from "hooks/useGetAllData";
import { useMutation } from "@tanstack/react-query";
import { finalExamTeacherAllotment } from "../crud/requests";
import { Notification } from "utils/notification";
import { AxiosError } from "axios";
import { IExamStudent, IFinalExam } from "models/exam";
import checkPermission from "utils/check_permission";

const FinalExamAllotment = ({examView, examStudents, refetch}: {examView: IFinalExam | undefined, examStudents: IExamStudent[] | undefined, refetch: any}) => {

    const { t } = useTranslation();
    const {id} = useParams()
    const navigate = useNavigate()
    const [allotments, setallotments] = useState<{[teacher_id: number]: number}>();

    const { data, isLoading } = useGetAllData({
        queryKey: ['teacher-accesses', examView?.subject?.id],
        url: `teacher-accesses`,
        urlParams: { "per-page": 0, "filter": { subject_id : examView?.subject?.id } },
        options: {
          refetchOnWindowFocus: false,
          retry: 1,
          enabled: !!examView?.subject?.id
        }
    });

    const { mutate, isLoading: checkLoading } = useMutation({
        mutationFn: () => finalExamTeacherAllotment(examView?.id, JSON.stringify(allotments)),
        onSuccess: async (res) => {
          Notification("success", "update", res?.message)
          refetch()
        },
        onError: (error: AxiosError<any>) => {
          Notification("error", "update", error?.response?.data ? error?.response?.data?.message : "");
        },
        retry: 0,
    });

    const columns: ColumnsType<any> = React.useMemo(() =>  [
        {
            title: '№',
            width: 45,
            render: (_, __, i) => i + 1
        },
        {
            title: t('FullName'),
            key: 'name',
            render: (i, e: any) => renderFullName(e?.teacher)
        },
        {
            title: t('Tekshirilganlar / Jami (talabalar)'),
            width: 300,
            align: "center",
            render: (i, e) => {
                const teachetStudents = examStudents?.filter((item: any) => item?.exam_teacher_user_id === e?.user_id)
                const checkedteachetStudents = teachetStudents?.filter((item: any) => item?.status === 3)
                return `${checkedteachetStudents?.length ?  checkedteachetStudents?.length : "_"} / ${teachetStudents?.length ? teachetStudents?.length : "_"}`
            }
        },
        {
            title: t('Students count'),
            width: 300,
            render: (i, e) => { 
                const teachetStudentsCount = examStudents?.filter((item: any) => item?.exam_teacher_user_id === e?.user_id)?.length
                return checkPermission("exam_allotment")  ? 
                <Input 
                    type="number" 
                    onChange={(event) => setallotments(prev => ({...prev, [e.user_id]: Number(event.target.value) }))} 
                    defaultValue={teachetStudentsCount} 
                    min={0} 
                /> : teachetStudentsCount}
        },
    ], [checkLoading, examStudents]);
    
    return (
        <div>
            <div className="grid grid-cols-12 gap-4">
                <div className="xl:col-span-8 md:col-span-10 col-span-12">
                    <Table
                        className='mt-4'
                        columns={columns}
                        dataSource={data?.items?.length ? data?.items : []}
                        pagination={false}
                        loading={isLoading}
                    />
                    {checkPermission("exam_allotment") ? <div className="text-right">
                        <Button type="primary" className="mt-4" onClick={() => mutate()} disabled={!allotments} loading={checkLoading} >{t("Save")}</Button>
                    </div> : null}
                </div>
                <div className="xl:col-span-4 md:col-span-2 col-span-12">
                    <div className="rounded-md p-3" style={{border: "1px solid #f0f0f0"}}>
                        <div className="flex justify-between mb-3">
                            <strong className="text-gray-600">Imtihon topshirgan talabalar soni</strong>
                            <p>{examStudents?.length} ta</p>
                        </div>
                        <div className="flex justify-between mb-3">
                            <strong className="text-gray-600">Vazifasi tekshirilgan talabalar</strong>
                            <p>{examStudents?.filter((item: any) => item?.status === 3).length} ta</p>
                        </div>
                        <div className="flex justify-between mb-3">
                            <strong className="text-gray-600">Vazifasi tekshirilmagan talabalar</strong>
                            <p>{examStudents?.filter((item: any) => item?.status === 2).length} ta</p>
                        </div>
                        <div className="flex justify-between">
                            <strong className="text-gray-600">O'qituvchilar soni</strong>
                            <p>{data?.items?.length} ta</p>
                        </div>
                    </div>
                    <Button className="w-full mt-4 text-center"  onClick={() => navigate(`/exam-entered-students/${id}/${examView?.edu_plan_id}/${examView?.edu_semestr_subject_id}`)} type="primary">Ko'proq ko'rish</Button>
                </div>
            </div>

        </div>
    )
}
export default FinalExamAllotment;