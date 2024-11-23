import React, { FC, useEffect, useRef, useState } from 'react'
import { CheckmarkCircleRegular, Dismiss16Filled, Dismiss20Filled, Dismiss24Filled, DismissCircleRegular, PersonAvailable20Filled, PersonAvailable20Regular, PersonDelete20Regular } from '@fluentui/react-icons';
import { Button, Input, Tag } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import SearchInput from 'components/SearchInput';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Notification } from 'utils/notification';
import instance from 'config/_axios';
import dayjs from 'dayjs';
import { t } from 'i18next';
import checkPermission from 'utils/check_permission';
import useWindowSize from 'hooks/useWindowSize';

const sortStudent = (a: any, b: any) => {
    const nameA = a?.profile?.last_name?.toUpperCase(); // ignore upper and lowercase
    const nameB = b?.profile?.last_name?.toUpperCase(); // ignore upper and lowercase
    const groupA = a?.group?.unical_name?.toUpperCase(); // ignore upper and lowercase
    const groupB = b?.group?.unical_name?.toUpperCase(); // ignore upper and lowercase

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

const AttendanceTable: FC<{ data: any, isFetching: boolean, refetch: any, teacher?: boolean }> = ({ data, isFetching, refetch, teacher }): JSX.Element => {

    const queryClient = useQueryClient();
    const [activeDate, setActiveDate] = useState<{ date: string, para_id: number | undefined }>({ date: "", para_id: undefined });
    const [notStudentIds, setNotStudentIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [students, setStudents] = useState<any[]>([]);
    const { width } = useWindowSize();

    const date_ref = useRef<any>();
    const ref = useRef<any>();

    const _click = (date: string) => {
        // const _ref = ref.current?.children[0]?.children[0]?.children[0]?.children[0]?.children[0];

        // if (ref.current) {
        //   if (dayjs(date).isBefore(activeDate.date)) {
        //     _ref?.scroll({ left: Number(_ref?.scrollLeft) - 126, top: 0, behavior: 'smooth' });
        //   } else {
        //     _ref?.scroll({ left: Number(_ref?.scrollLeft) + 126, top: 0, behavior: 'smooth' });
        //   }
        // }
    };

    useEffect(() => {
        if (date_ref?.current) {
            date_ref.current.scrollIntoView({
                behavior: "smooth",
                block: 'center',
            });
        } else {
            const _ref = ref?.current?.children[0]?.children[0]?.children[0]?.children[0]?.children[0];
            if (_ref?.current) {
                _ref.scrollIntoView({
                    behavior: "smooth",
                    block: 'end',
                });
            }
        }
    }, [data]);

    useEffect(() => {
        const arr = [];
        if (data?.patok?.length) {
            for (const patok of data?.patok) {
                if (patok?.student?.length) {
                    for (const e of patok?.student) {
                        arr.push(e);
                    }
                }
            }
        }
        setStudents(arr)
    }, [data])

    const to_attend = (id: number) => {
        if (notStudentIds?.includes(id)) {
            setNotStudentIds(p => p?.filter(e => e !== id));
        } else {
            setNotStudentIds(p => ([...p, id]))
        }
    }

    const filterStudentList = (e: any) => {
        return (
            !!String(e?.profile?.last_name)?.toUpperCase()?.includes(String(searchText)?.toUpperCase()) ||
            !!String(e?.profile?.first_name)?.toUpperCase()?.includes(String(searchText)?.toUpperCase()) ||
            !!String(e?.profile?.middle_name)?.toUpperCase()?.includes(String(searchText)?.toUpperCase())
        )
    }

    const { mutate, isLoading: clicked } = useMutation({
        mutationFn: async () => {
            const formdata = new FormData();

            formdata.append("ids", data?.ids);
            formdata.append("date", activeDate.date);
            formdata.append("student_ids", JSON.stringify(notStudentIds));
            formdata.append("group_type", data?.group_type);
            formdata.append("para_id", `${activeDate.para_id}`);

            const url = "timetable-attends";
            const response = await instance({
                url,
                method: "POST",
                data: formdata,
            });
            return response.data;
        },
        onSuccess: async (res) => {
            queryClient.setQueryData(["attends", activeDate.date], res);
            if (res?.status === 1) {
                Notification("success", "create", res?.message);
                setActiveDate({ date: "", para_id: undefined });
                setNotStudentIds([]);
                refetch();
            } else {
                Notification("error", "create", res?.message);
            }
        },
        onError: (error: AxiosError<any>) => {
            Notification("error", "create", error?.response?.data ? error?.response?.data?.message : "");
        },
        retry: 0,
    });

    const renderAttendBtn = (student_id: number, date: string, attend: { reason: number, student_id: number }[]) => {
        const student_attend = attend?.find(a => a?.student_id === student_id)
        if ((activeDate.date === date && !student_attend)) {
            if (notStudentIds?.includes(student_id)) {
                return <Button size='small' danger type="primary" block onClick={() => { to_attend(student_id) }} >
                    <PersonDelete20Regular />
                </Button>
            } else {
                return <Button size='small' type="primary" block onClick={() => { to_attend(student_id) }} >
                    <PersonAvailable20Filled />
                </Button>
            }
        } else {
            if (student_attend) {
                if (student_attend?.reason) {
                    return <div className="text-center"><PersonAvailable20Regular color='#ffa940' /></div>
                } else {
                    return <div className="text-center"><PersonDelete20Regular color='#ff0000' /></div>
                }
            }
        }
    }

    const columns: ColumnsType<any> = React.useMemo(() => [
        {
            title: "№",
            dataIndex: "order",
            render: (_, __, i: number) => i + 1,
            width: 40,
            fixed: "left",
            rowScope: "row",
        },
        {
            title: (<Input onChange={(e) => setSearchText(e.target?.value)} placeholder='Search by F.I.O' />),
            key: "name",
            fixed: "left",
            rowScope: "row",
            width: width > 992 ? 300 : 100,
            render: (e) => <span className='font-normal max-md:text-xs'>{e?.profile?.last_name} {e?.profile?.first_name} {e?.profile?.middle_name}&nbsp;&nbsp;<span className='text-blue-600 ' >{e?.group?.unical_name}</span></span>
        },
        ...(data?.dates ?? []).map((e: any) => {
            return {
                key: e?.date,
                title: <Button
                    ref={e?.date === data?.now ? date_ref : null}
                    block
                    // teacherda faqat usha kun ochiq turishi
                    // disabled={!((teacher && e?.date === data?.now) || (!teacher && ((e?.attend) || (!e?.attend && checkPermission("timetable-attend_create"))))) || dayjs(e?.date).isAfter(data?.now)}
                    disabled={!(checkPermission("timetable-attend_create")) || dayjs(e?.date).isAfter(data?.now)}
                    onClick={() => {
                        if (e?.date !== activeDate?.date) {
                            _click(e?.date);
                            setNotStudentIds([]);
                            if (e?.date !== activeDate?.date) {
                                setActiveDate({ date: e?.date, para_id: e?.para?.id });
                            }
                        }
                    }}
                >{e?.date}{!dayjs(e?.date).isAfter(data?.now) ? e?.attend_status ? <CheckmarkCircleRegular color='#31BD59' className='ms-1' /> : <DismissCircleRegular color='#FF0000' className='ms-1' /> : null}</Button>,
                render: (a: any) => renderAttendBtn(a?.id, e?.date, e?.attend),
                width: 126
            }
        })?.filter((e: any) => !!Object.keys(e)?.length) as ColumnsType<any>,
    ], [data, activeDate, notStudentIds]);

    return (
        <>
            <div className="lg:flex-between mt-4 max-md:pl-4">
                <div className=''>
                    <div>
                        <span>{t("Group")}:&nbsp;</span>
                        {
                            data?.patok?.map((patok: any) => (
                                <Tag>{patok?.group?.unical_name}</Tag>
                            ))
                        }
                    </div>
                    <div>

                    </div>
                </div>
                {
                    students && data?.dates && (data?.dates ?? []).find((i: any) => i?.date === activeDate.date)
                        ? <div className='d-f gap-4 max-md:mt-2' >
                            <Button type='primary' danger onClick={() => { setNotStudentIds([]); setActiveDate({date: "", para_id: undefined}) }}  >{width > 992 ? <Dismiss24Filled/> : <Dismiss20Filled/>}</Button>
                            <Button className='max-md:text-xs' type='primary' loading={clicked} onClick={() => { mutate() }}  >{activeDate.date} {t(`save attendance for`)}</Button>
                        </div>
                        : null
                }
            </div>
            <Table
                columns={columns}
                dataSource={students?.filter(filterStudentList)?.sort(sortStudent)}
                pagination={false}
                size="small"
                loading={isFetching}
                scroll={{ x: 1024, scrollToFirstRowOnChange: true }}
                className="mt-2 mb-6"
                ref={ref}
            />
        </>
    )
}

export default AttendanceTable

/**
  *  attend_index
  *  attend_delete
  *  attend_update
  *  timetable-attend_create
  *  attend_view
*/