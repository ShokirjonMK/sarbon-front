import React, { FC, useEffect, useRef, useState } from 'react'
import { CheckmarkCircleRegular, DismissCircleRegular, PersonAvailable20Filled, PersonAvailable20Regular, PersonDelete20Regular } from '@fluentui/react-icons';
import { Button, Tag } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import SearchInput from 'components/SearchInput';
import { IStudent } from 'models/student';
import checkPermission from 'utils/check_permission';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Notification } from 'utils/notification';
import instance from 'config/_axios';
import dayjs from 'dayjs';
import { t } from 'i18next';

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
  const [activeDate, setActiveDate] = useState<{ date: string, attend_id: number | undefined }>({ date: "", attend_id: undefined });
  const [notAvailable, setNotAvailable] = useState<{ reason: number, student_id: number, group_id: number }[]>([]);
  const [searchText, setSearchText] = useState<string>("");

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
      const _ref = ref.current?.children[0]?.children[0]?.children[0]?.children[0]?.children[0];
      if (_ref.current) {
        _ref.scrollIntoView({
          behavior: "smooth",
          block: 'end',
        });
      }
    }
  }, [data]);

  const to_attend = (id: number, group_id: number) => {
    if (notAvailable?.some(i => i?.student_id == id)) {
      setNotAvailable(p => p.filter(e => e.student_id !== id))
    } else {
      setNotAvailable(p => [...p, { student_id: id, reason: 0, group_id }]);
    }
  }

  const filterStudentList = (e: any) => {
    return (
      !!String(e?.profile?.last_name).toUpperCase().includes(String(searchText).toUpperCase()) ||
      !!String(e?.profile?.first_name).toUpperCase().includes(String(searchText).toUpperCase()) ||
      !!String(e?.profile?.middle_name).toUpperCase().includes(String(searchText).toUpperCase())
    )
  }

  const { mutate, isLoading: clicked } = useMutation({
    mutationFn: async () => {
      const formdata = new FormData();

      formdata.append("ids", data?.ids);
      formdata.append("date", activeDate.date);

      const attObj: { [name: number]: number[] } = {}

      for (const x of notAvailable) {
        const std_ids = []
        for (const y of notAvailable) {
          if (x.group_id === y.group_id) {
            std_ids.push(y.student_id)
          }
        }
        attObj[x.group_id] = std_ids
      }

      if (notAvailable?.length) {
        formdata.append("students", JSON.stringify(attObj));
      } else {

        const emptyObj: any = {}
        if (data?.patok) {
          for (const group of data?.patok) {
            emptyObj[group.group.id] = []
          }
        }
        emptyObj[data?.group?.id] = []

        formdata.append("students", JSON.stringify(emptyObj));
      }


      formdata.append("group_type", data?.group_type);

      const url = activeDate.attend_id ? `/attends/${activeDate.attend_id}` : "/attends";
      const response = await instance({
        url,
        method: "POST",
        data: formdata,
      });
      return response.data;
    },
    onSuccess: async (res) => {
      queryClient.setQueryData(["attends", activeDate.attend_id], res);
      if (res?.status === 1) {
        Notification("success", activeDate.attend_id ? "update" : "create", res?.message);
        setActiveDate({ date: "", attend_id: undefined });
        setNotAvailable([]);
        refetch();
      } else {
        Notification("error", activeDate.attend_id ? "update" : "create", res?.message);
      }
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", activeDate.attend_id ? "update" : "create", error?.response?.data ? error?.response?.data?.message : "");
    },
    retry: 0,
  });

  const selectNewAttends = (attend: any) => {
    if (attend) {
      const attends: { [key: string]: { reason: number, student_id: number, group_id: number }[] } = {}
      const arr: { reason: number, student_id: number, group_id: number }[] = []
      for (const item of attend) {
        for (const itemIn of item?.student_ids) {
          arr.push(itemIn)
        }
      }
      attends['student_ids'] = arr
      return attends
    } else {
      return {}
    }
  }

  const renderAttendBtn = (student: any, date: string, attend: { reason: number, student_ids: any[] }[]) => {

    if (activeDate.date == date) {
      if (notAvailable?.some(i => i?.student_id == student?.id) || selectNewAttends(attend)?.student_ids?.some(i => i?.student_id == student?.id)) {
        if (selectNewAttends(attend)?.student_ids?.find(i => i?.student_id == student?.id)?.reason === 1) {
          return <Button size='small' block className='py-1' onClick={() => { !selectNewAttends(attend)?.student_ids?.some(i => i?.student_id == student?.id) && to_attend(student?.id, student?.group_id) }} >
            <PersonAvailable20Regular color='#ffa940' />
          </Button>
        } else {
          return <Button size='small' danger type="primary" block className='py-1' onClick={() => { !selectNewAttends(attend)?.student_ids?.some(i => i?.student_id == student?.id) && to_attend(student?.id, student?.group_id) }} >
            <PersonDelete20Regular />
          </Button>
        }
      } else {
        return <Button size='small' type="primary" block className='py-2' onClick={() => { to_attend(student?.id, student?.group_id) }} >
          <PersonAvailable20Filled />
        </Button>
      }
    } else if (selectNewAttends(attend)?.student_ids?.length && selectNewAttends(attend)?.student_ids?.some(i => i?.student_id == student?.id)) {
      if (selectNewAttends(attend)?.student_ids?.find((i) => i?.student_id == student?.id)?.reason === 1) {
        return <div className="text-center"><PersonAvailable20Regular color='#ffa940' /></div>
      } else {
        return <div className="text-center"><PersonDelete20Regular color='#ff0000' /></div>
      }
    } else {
      return null
    }
  }

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
      title: (<SearchInput duration={500} setSearchVal={setSearchText} />),
      key: "name",
      fixed: "left",
      rowScope: "row",
      width: 300,
      render: (e) => <span className='font-normal' >{e?.profile?.last_name} {e?.profile?.first_name} {e?.profile?.middle_name}&nbsp;&nbsp;<span className='text-blue-600 ' >{e?.group?.unical_name}</span></span>
    },
    ...Object.entries(data?.attendanceDates ?? {})?.map(([key, value]: [key: string, value: any]) => {
      if (!dayjs(key).isAfter(data?.now[2])) {
        return {
          key: key,
          title: <Button
            ref={key === data?.now[2] ? date_ref : null}
            block
            // dont touch this commented line!!
            disabled={!((teacher && key === data?.now[2]) || (!teacher && ((value) || (!value && checkPermission("attend_create"))))) || dayjs(key).isAfter(data?.now[2])}
            // disabled={!(checkPermission("attend_create")) || dayjs(key).isAfter(data?.now[2])}
            onClick={() => {
              if (key !== activeDate.date) {
                _click(key);
                if (key !== activeDate.date) {
                  setActiveDate({ date: key, attend_id: value?.id });
                  if (value) {
                    const arr: { reason: number, student_id: number, group_id: number }[] = [];
                    for (const item of value) {
                      for (const itemIn of item.student_ids) {
                        arr.push(itemIn)
                      }
                    }
                    setNotAvailable(arr ?? [])
                  } else {
                    setNotAvailable([])
                  }

                }
              }
            }}
          >{key}{!dayjs(key).isAfter(data?.now[2]) ? value ? <CheckmarkCircleRegular color='#31BD59' className='ms-1' /> : <DismissCircleRegular color='#FF0000' className='ms-1' /> : null}</Button>,
          render: (e: { id: number }) => renderAttendBtn(e, key, value),
          width: 126,
        }
      } else {
        return {}
      }
    })?.filter(e => !!Object.keys(e)?.length),
  ], [data, activeDate, notAvailable]);

  return (
    <>
      <div className="flex-between mt-4">
        <div>
          <span>{t("Groups")}:&nbsp;</span>
          {
            data?.subject_category_id === 1 ? <div className='inline-flex'>
              <Tag>{data?.group?.unical_name}</Tag>
              {
                data?.patok?.map((e: any, i: number) => <Tag key={i} >{e?.group?.unical_name}</Tag>)
              }
            </div> : <Tag>{data?.group?.unical_name}</Tag>
          }
        </div>
        {
          data?.student && data?.attendanceDates && Object.keys(data?.attendanceDates ?? {}).includes(activeDate.date)
            ? <Button type='primary' loading={clicked} onClick={() => { mutate() }}  >{activeDate.date}{t(`save attendance for`)}</Button>
            : null
        }
      </div>
      <Table
        columns={columns}
        dataSource={data?.student?.filter(filterStudentList)?.sort(sortStudent)}
        pagination={false}
        size="small"
        loading={isFetching}
        scroll={{ x: 1024, scrollToFirstRowOnChange: true }}
        className="mt-2"
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
  *  attend_create
  *  attend_view
*/