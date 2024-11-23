import React, { useState } from 'react'
import Table, { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { Alert, Col, Input, Popconfirm, Row, Select, Spin, Switch, Tag, Tooltip } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { changingBall, changingStatus, givingChance } from '../crud/requests';
import { Notification } from 'utils/notification';
import { AxiosError } from 'axios';
import { renderExamStatus } from '..';
import { dateParserToDatePicker } from 'utils/second_to_date';
import { Edit16Filled, Eye16Filled } from '@fluentui/react-icons';
import { AiOutlinePlusCircle } from "react-icons/ai";
import checkPermission from 'utils/check_permission';
import NewExamUpdateModal from './updatefinalExamTestStart';
import TestViewDrawer from './testViewDrawer';
import useGetAllData from 'hooks/useGetAllData';
import { Link, useParams } from 'react-router-dom';
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import CustomPagination from 'components/Pagination';
import { renderFullName } from 'utils/others_functions';
import SearchInputWithoutIcon from 'components/SearchInput/searchInputWithoutIcon';
import { globalConstants } from 'config/constants';
import instance from 'config/_axios';
import { excelExport } from 'utils/excelExport';
import { ExcelBtn } from 'components/Buttons';

const ExamStudentsControl = React.memo(({data}: {data: any}) => {
  
  const { t } = useTranslation()
  const {id: final_exam_id} = useParams()
  const { urlValue, writeToUrl } = useUrlQueryParams({ currentPage: 1, perPage: 10 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTestViewOpen, setIsTestViewOpen] = useState(false);
  const [selectedFinalExamTestStart, setselectedFinalExamTestStart] = useState({});
  const [selectedTestId, setselectedTestId] = useState<number | undefined>(undefined);
  const [studentBall, setstudentBall] = useState<{examTestId: number, ball: number} | undefined>();
  const [searchFName, setSearchFName] = useState<string | undefined>(undefined);
  const [searchLName, setSearchLName] = useState<string | undefined>(undefined);
  const [searchMName, setSearchMName] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const calcAttend = ({attendAll, subjectAllHour, reason}: {attendAll: number, subjectAllHour: number, reason: number}) => {
    
    const percent = parseFloat((((attendAll - reason)/(subjectAllHour))*100).toFixed(2));
    let status: "banned" | "active" = percent >= 25 ? "banned" : "active";
    let color: "red" | "green" = percent >= 25 ? "red" : "green";

    return {
      percent,
      status,
      davomat: {
        sababli: reason * 2,
        sababsiz: attendAll * 2 - reason * 2,
        jami: subjectAllHour * 2,
        foiz: percent ? (percent) : 0,
      },
      string: `${percent? (percent) : 0}% / ${attendAll * 2 - reason * 2} / ${reason * 2} / ${subjectAllHour * 2}`,
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
  
  const { data: data1, isFetching, refetch: refetch2, isLoading } = useGetAllData({
    queryKey: ['final-exam-tests', final_exam_id, urlValue, searchFName, searchMName, searchLName],
    url: `final-exam-tests`,
    urlParams: {
      "profile-filter-like": JSON.stringify(urlValue?.filter_like),
      group_id: urlValue?.filter?.group_id,
      final_exam_id,
      sort: "-id",
      "per-page": urlValue.perPage, 
      page: urlValue.currentPage, 
      expand: "user.profile,finalExamTestStart,addStatus,studentMark,studentMark.group,finalExamTest,studentMark.attendStatus"
    },
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!final_exam_id
    },
  });

  const columns: ColumnsType<any> = React.useMemo(() => {

    let arr: any = [
      {
        title: "№",
        dataIndex: "order",
        render: (_: any, __: any, i: number) => i + 1,
        width: 50,
      },
      {
        title: "F.I.O",
        with: 300,
        render: (e: any) => <Link to={`/students/view/${e?.student_id}`} target='_blank' className='font-normal py-[5px]' >{renderFullName(e?.user?.profile)}</Link>
      },
      {
        title: t("Username"),
        dataIndex: "user",
        render: (e: any) => <p className='font-normal py-[5px]' >{e?.username}</p>
      },
      {
        title: t("Group"),
        dataIndex: "studentMark",
        with: 200,
        render: (e: any) => <p className='font-normal py-[5px] whitespace-nowrap'>{e?.group?.unical_name}</p>
      },
      {
        title: t("Sababsiz % / Sababsiz / Sababli / Jami (soat)"),
        align: "center",
        render: (e: any) => <p className='font-normal py-[5px]' >{calcAttend(e?.studentMark?.attendStatus)?.title}</p>
      },
      // {
      //   title: t("Yakuniygacha to'plangan ball"),
      //   align: "center",
      //   render: (e: any) => <p className='font-normal py-[5px]' >{calcBall(e?.studentMark?.vedomsControlBall).title}</p>
      // },
      {
        title: t("Urunishlar soni"),
        align: "center",
        dataIndex: "finalExamTestStart",
        render: (e: any) => e?.length
      },
      // {
      //   className: "text-center",
      //   align: "center",
      //   title: "Status",
      //   render: (e: any) => "Test boshlanmagan"
      // },
      {
        title: t("Ruxsati berish"),
        align: "center",
        render: (e: any) => <Switch disabled={!checkPermission("final-exam-test_update")} checked={e?.status === 1} onChange={(event) => changeStatusMutation({status: event ? 1 : 2, id: e?.id})} />
      },
      checkPermission("final-exam-test_add") ? {
        title: t("Imkoniyat berish"),
        align: "center",
        render: (e: any) => (
          <Popconfirm
            title="Ruxsat berish"
            description="Ushbu foydalanuvchiga test uchun yana bir marta imkon berish"
            onConfirm={() => giveChanceMutation(e?.id)}
            disabled={e.addStatus !== 1}
            okText="Ruxsat berish"
            cancelText="Yopish"
          >
            {
              (e.addStatus === 1 && (data?.status == 2 || data?.status == 3)) ? <AiOutlinePlusCircle className='text-[25px] cursor-pointer hover:text-blue-500 transition' /> : ""
            }
          </Popconfirm>
        )
      } : undefined,
    ]

    return arr?.filter((item: any) => item);

  }, [data, data1]);

  const columnsForInside: ColumnsType<any> = React.useMemo(() => {

    let arr: any = [
      {
        title: "Urunishlar soni",
        dataIndex: "attends_count",
      },
      {
        title: t("Vaqti"),
        align: "center",
        render: (e: any) => e?.start_time ? dateParserToDatePicker(e?.start_time) + " / " + dateParserToDatePicker(e?.finish_time) : "Boshlamagan",
      },
      {
        title: t("Ball"),
        align: "center",
        render: (e: any) => (
          <div className='flex items-center gap-3 border border-solid border-sky-700 rounded-xl px-3 py-1 w-max mx-auto'>
            {e?.ball}
            <Popconfirm
              title={`Ballni o'zgartirish (max ball: ${Number(e?.max_ball ?? 50)})`}
              description={
                <Input 
                  onChange={(event) => setstudentBall({ball: Number(event.target.value), examTestId: Number(e?.id)})} 
                  placeholder='Ball'
                  disabled={(data?.status != 2 && data?.status != 3)}
                  type='number' 
                  max={Number(e?.max_ball ?? 50)} 
                  min={0} 
                  className='w-[200px]' 
                  defaultValue={e?.ball} 
                />
              }
              onConfirm={() => changeBallMutation()}
              okText="Saqlash"
              cancelText="Yopish"
              onCancel={() => setstudentBall(undefined)}
            >
              {checkPermission("final-exam-test-start_add-ball") ? <Edit16Filled className="edit cursor-pointer text-orange-500" /> : ""}
            </Popconfirm>
          </div>
        )
      },
      {
        title: t("Status"),
        dataIndex: "status",
        render: (e: any) => <Tag>{e === 1 ? "Boshlamagan" : e === 2 ? "Testni boshlagan" : e === 3 ? "Testni tugatgan" : ""}</Tag>
      },
      {
        title: t("Imtihon formati"),
        dataIndex: "exam_form_type",
        align: "center",
        render: (e: any) => [
          {id: 2, name: "Biriktirilgan xonada"}, 
          {id: 3, name: "Ixtiyoriy lokatsiyada"}, 
        ].find(n => n?.id === e)?.name
      },
      checkPermission("final-exam-test-start_get") ? {
        align: "center",
        title: t("Testlarni ko'rish"),
        render: (e: any) => <Tooltip placement="topLeft" title={t("View")}><Eye16Filled className="view cursor-pointer" onClick={() => {setselectedTestId(e?.id); setIsTestViewOpen(true)}} /></Tooltip>
      } : undefined,
      checkPermission("final-exam-test-start_update") ? {
        title: t("Actions"),
        align: "center",
        render: (e: any) => (
          <Tooltip placement="topLeft" title={t("Edit")}>
            <Edit16Filled onClick={() => {setIsModalOpen(true); setselectedFinalExamTestStart(e)}} className="edit cursor-pointer text-orange-500" />
          </Tooltip>
        )
      } : undefined,
    ]

    return arr?.filter((item: any) => item);

  }, [data, data1]);

  const { mutate: giveChanceMutation } = useMutation({
    mutationFn: (id: number) => givingChance(id),
    onSuccess: async (res) => {
      refetch2()
      Notification("success", "update", res?.message)
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", "update", error?.response?.data ? error?.response?.data?.message : "");
    },
    retry: 0,
  });

  const { mutate: changeStatusMutation } = useMutation({
    mutationFn: ({id, status} :{id: number, status: number}) => changingStatus(id, status),
    onSuccess: async (res) => {
      refetch2()
      Notification("success", "update", res?.message)
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", "update", error?.response?.data ? error?.response?.data?.message : "");
    },
    retry: 0,
  });

  const { mutate: changeBallMutation } = useMutation({
    mutationFn: () => changingBall(studentBall?.examTestId, studentBall?.ball),
    onSuccess: async (res) => {
      refetch2()
      Notification("success", "update", res?.message)
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", "update", error?.response?.data ? error?.response?.data?.message : "");
    },
    retry: 0,
  });

  const exportExcel = async () => {
    const arr: any = [];

    setLoading(true);

    const res = await instance({
      method: "GET",
      url: `final-exam-tests?expand=user.profile,studentMark.group,studentMark.attendStatus`,
      params: { 
        "per-page": 0, 
        "profile-filter-like": JSON.stringify(urlValue?.filter_like),
        group: urlValue?.filter?.group_id,
        final_exam_id,
      }
    });

    res?.data?.data?.items?.forEach((element: any) => {
      arr.push({
        ["F.I.SH"]: renderFullName(element?.user?.profile),
        ["Foydalanuvchi nomi"]: element?.user?.username,
        ["Guruh"]: element?.studentMark?.group?.unical_name,
        ["Sababsiz (soat)"]: calcAttend(element?.studentMark?.attendStatus)?.davomat?.sababsiz,
        ["Sababli (soat)"]: calcAttend(element?.studentMark?.attendStatus)?.davomat?.sababli,
        ["Jami (soat)"]: calcAttend(element?.studentMark?.attendStatus)?.davomat?.jami,
        ["Sababsiz %"]: calcAttend(element?.studentMark?.attendStatus)?.davomat?.foiz,
        ["Ruxsat"]: element?.status === 1 ? "Ruxsati bor" : "Ruxsati yo'q",
      })
    })
    setLoading(false);
    excelExport(arr, `${data?.eduSemestrSubject?.subject?.name} fanidan yakuniy nazorat`);
  }


  if(data?.exam_type !== 1){
    if(!isLoading ? (data1?.items?.length == 0 || !data1?.items) : false) return <Alert type='warning' message="Imtihon tasdiqlangandan keyin talabalar ko'rinadi" />
  }

  return (
    <>
      <Spin spinning={isFetching}>
        <div className='mb-10'>
          <span><span className="text-blck opacity-60">Talabalar soni:</span> <b>{data1?._meta?.totalCount}</b></span> &nbsp; / &nbsp;
          <span><span className="text-blck opacity-60">Guruh(lar):</span> {data?.groups?.map((e: any, i: number) => <Tag key={i} color='blue' className='border-1'>{e?.group?.unical_name}</Tag> )}</span>
          &nbsp;/ &nbsp;<span><span className="text-blck opacity-60">Holati:</span> {renderExamStatus(data?.status ?? 0, "py-[3px] px-[0.75rem] rounded-md")?.tag}</span>
          
          <Row gutter={[12, 12]} className='my-4'>
            <Col xs={24} sm={24} md={12} lg={6}>
              <SearchInputWithoutIcon
                setSearchVal={setSearchLName} 
                filterKey='last_name' 
                placeholder="Familiya bo'yicha qidirish" 
                duration={globalConstants.debounsDuration}
                width={"100%"}
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={6}>
              <SearchInputWithoutIcon 
                setSearchVal={setSearchFName} 
                filterKey='first_name' 
                placeholder="Ism bo'yicha qidirish" 
                duration={globalConstants.debounsDuration}
                width={"100%"}
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={6}>
              <SearchInputWithoutIcon 
                setSearchVal={setSearchMName} 
                filterKey='middle_name' 
                placeholder="Otasining ismi bo'yicha qidirish" 
                duration={globalConstants.debounsDuration}
                width={"100%"}
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={4}>
              <Select
                showSearch
                allowClear
                className='w-full'
                placeholder="Guruh bo'yicha filter"
                optionFilterProp="label"
                onChange={(e) => writeToUrl({name: "group_id", value: e})}
                options={
                  data?.groups?.map((e: any) => ({
                    value: e?.group?.id,
                    label: e?.group?.unical_name,
                  }) )
                 }
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={2}>
              <ExcelBtn onClick={exportExcel} loading={loading} />
            </Col>
          </Row>
          
          <Table
            columns={columns}
            dataSource={data1?.items?.map((item: any, index: number) => ({key: index, ...item}))}
            expandable={{
              expandedRowRender: (record) => (
                <div className='p-5 pl-0 rounded-b-3xl' style={{border: "3px solid #69c0ff"}}>
                  <Table
                    columns={columnsForInside}
                    dataSource={record?.finalExamTestStart?.map((r: any) => ({...r, max_ball: record?.studentMark?.max_ball}))}
                    pagination={false}
                    size="middle"
                    rowClassName="py-[12px]"
                    scroll={{ x: 1500}}
                  />
                </div>
              )
            }}
            pagination={false}
            size="middle"
            className="mt-3"
            rowClassName="py-[12px]"
            scroll={{ x: 1500}}
          />

          {(data1?._meta?.totalCount ?? 0) > 10 ? <CustomPagination totalCount={data1?._meta.totalCount} currentPage={urlValue.currentPage} perPage={urlValue.perPage} /> : undefined}


          <NewExamUpdateModal setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} data={selectedFinalExamTestStart} refetch={refetch2} />
          <TestViewDrawer setIsModalOpen={setIsTestViewOpen} isModalOpen={isTestViewOpen} selectedTestId={selectedTestId}/>
        </div>
      </Spin>
    </>
  )
})

export default ExamStudentsControl