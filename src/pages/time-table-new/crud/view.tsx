import React, { ReactNode, useState } from "react";
import { Button, Divider, Tag } from "antd";
import { useTranslation } from "react-i18next";
import Table, { ColumnsType } from "antd/es/table";
import { renderFullName } from "utils/others_functions";
import checkPermission from "utils/check_permission";
import Actions from "components/Actions";
import TimeTableDateUpdateModal from "./tableDateUpdateModal";
import AddDayModal from "./addDayModal";
import dayjs from "dayjs";
import AddTimeTableGroup from "./addGroupForm";
import DeleteData from "components/deleteData";
import { CalendarEdit24Regular, Delete16Filled } from "@fluentui/react-icons";
import { useParams } from "react-router-dom";
import TimeTableDateDateUpdateModal from "./tableDateUpdateDateModal";

interface DataType {
    name: string;
    value: ReactNode;
    value2?: ReactNode;
    value3?: ReactNode;
}

const sharedOnCell = (_: DataType, index: number | undefined) => {
  if (index || index == 0) {
      if (index < 1) {
      return { colSpan: 0 };
      }
  }
  return {};
};

const TimeTableNewViewFirstTab = ({timetableQuery}: {timetableQuery: any}) => {

  const {isLoading, data, refetch} = timetableQuery;  
  const { time_table_id } = useParams()  
    
  const { t } = useTranslation();
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState<boolean>(false);
  const [isModalOpenUpdateData, setIsModalOpenUpdateData] = useState<boolean>(false);
  const [isModalOpenAddDay, setIsModalOpenAddDay] = useState<boolean>(false);
  const [selectedItem, setselectedItem] = useState<any>();

  const columnsMainData: ColumnsType<DataType> = [
    {
      title: t("Name"),
      dataIndex: "name",
      rowScope: "row",
    },
    {
      title: t("Value"),
      dataIndex: "value",
      onCell: (_, index) => ({
        colSpan: (index == 0) ? 3 : 1,
      }),
    },
    {
      title: t("Name2"),
      dataIndex: "value2",
      onCell: (_, index) => sharedOnCell(_, index),
      className: "bg-[#FAFAFA]"
    },
    {
      title: t("Name3"),
      dataIndex: "value3",
      onCell: (_, index) => sharedOnCell(_, index),
    },
  ];

  
  const successUrl = (timeTableId: number | string) => {

    if(timeTableId != time_table_id) return ``;
        
    if(data?.data?.allGroup?.length > 1 && timeTableId == time_table_id) return `/time-tables-new/view/table/${data?.data?.allGroup?.filter((e: any) => e?.id != time_table_id)[0]?.id}`

    return `/time-tables-new/${data?.data?.course_id}/${data?.data?.edu_form_id}?edu_plan_id=${data?.data?.edu_plan_id}&edu_semestr_id=${data?.data?.edu_semestr_id}`

  }

  const tableData: DataType[] = [
    {
      name: t("Group"),
      value: <div>
          {
            data?.data?.allGroup?.map((i: any, index: number) => <Tag key={index + 12000} className="py-2 w-max items-start text-sm">{i?.group?.unical_name} 
              <DeleteData
                className="cursor-pointer ml-4"
                permission={'timetable_delete-one'}
                refetch={refetch}
                url={'timetables/delete-one'}
                id={i?.id}
                navigateUrl={successUrl(i?.id)}
              >
                <Delete16Filled className="delete text-[#595959]" />
              </DeleteData></Tag>)
          }
        <AddTimeTableGroup data={data} refetch={refetch} />
      </div>,
    },
    {
      name: t("Subject"),
      value: data?.data?.subject?.name,
      value2: t("Subject category"),
      value3: data?.data?.subjectCategory?.name,
    },
    {
      name: t("Faculty"),
      value: data?.data?.faculty?.name,
      value2: t("Direction"),
      value3: data?.data?.direction?.name,
    },
    {
      name: t("Edu plan"),
      value: data?.data?.eduPlan?.name,
      value2: t("Semestr"),
      value3: data?.data?.semestr?.name,
    },
    {
      name: t("CreatedBy"),
      value: (
        <div>
          <span className="text-gray-400">
            {t("name")}/{t("Last Name")}/{t("Role")} :{" "}
          </span>
          {data?.data?.createdBy?.first_name} {data?.data?.createdBy?.last_name}{" "}
          (
          {data?.data?.createdBy?.role.map((item: string, index: number) => {
            return <span key={index+200}>{item}</span>;
          })}
          )
          <p>
            <span className="text-gray-400">{t("Login")}: </span>
            {data?.data?.createdBy?.username}
          </p>
          <time>
            <span className="text-gray-400">{t("Date")}: </span>
            {data?.data?.created_at ? dayjs.unix(data?.data?.created_at).format("MM-DD-YYYY hh:mm:ss a") : null}
          </time>
        </div>
      ),
      value2: t("UpdateBy"),
      value3: (
        <div>
          <span className="text-gray-400">
            {t("name")}/{t("Last Name")}/{t("Role")} :{" "}
          </span>
          {data?.data?.updatedBy?.first_name} {data?.data?.updatedBy?.last_name}{" "}
          (
          {data?.data?.updatedBy?.role.map((item: string, index: number) => {
            return <span key={index + 1000}>{item}</span>;
          })}
          )
          <p>
            <span className="text-gray-400">{t("Login")}: </span>
            {data?.data?.updatedBy?.username}
          </p>
          <time>
            <span className="text-gray-400">{t("Date")}: </span>
            {data?.data?.updated_at ? dayjs.unix(data?.data?.updated_at).format("MM-DD-YYYY hh:mm:ss a") : null}
          </time>
        </div>
      )
    }
  ];

  const columns: ColumnsType<any> = React.useMemo(() => [
    {
      title: 'Hafta',
      width: 90,
      showSorterTooltip: false,
      render: (_, __, i) => `${i + 1} - hafta`,
    },
    {
      title: t('Sanasi'),
      width: 120,
      dataIndex: "date",
    },
    {
      title: t("Teacher"),
      render: (e: any) => <p>{renderFullName(e?.user?.profile)}</p>,
    },
    {
      title: t('Building') + " - " +  t('Room'),
      render: (i) => `${i?.building?.name} - ${i?.room?.name}`,
    },
    {
      title: t('Para'),
      dataIndex: "para",
      width: data?.data?.two_group === 0 ? 160 : 90,
      render: (i) => i?.name,
    },
    {
      title: t('Week'),
      dataIndex: "week",
      width: data?.data?.two_group === 0 ? 130 : 90,
      render: (i) => i?.name,
    },
    {
      title: t("Actions"),
      width: data?.data?.two_group === 0 ? 200 : 200,
      align: "center",
      render: (i, e) => <div className="flex">
          <Actions
            key={e?.id}
            refetch={refetch}
            id={e?.id}
            url={'timetable-dates'}
            onClickEdit={() => {
              setIsModalOpenUpdate(true);
              setselectedItem(e)
            }}
            onClickView={() => console.log(`view`)}
            viewPermission={'_'}
            editPermission={"timetable_update"}
            deletePermission={"timetable-date_delete"}
          /> 
          {
            checkPermission("timetable_update") ? 
            <Button className="ml-2">
              <CalendarEdit24Regular 
                className="w-[20px] h-[20px] cursor-pointer text-green-500 ml-2" 
                onClick={() => {
                  setIsModalOpenUpdateData(true);
                  setselectedItem(e)
                }} 
              />
            </Button> : ""
          } 
      </div>,
    },
  ], [data?.data]);

  return(
    <div>
      <div>
        <div className="px-[24px] pb-[20px]">
          <div className="table-none-hover">
            <h3 className="mb-2">Umumiy ma'lumot</h3>
              <Table
                  columns={columnsMainData}
                  bordered
                  dataSource={tableData}
                  showHeader={false}
                  pagination={false}
                  className="mb-4"
              />
              <Divider />
              <div className="flex justify-between items-center">
                <h3>Dars ma'lumot</h3>
                {checkPermission("timetable_add-day") ? <Button onClick={() => setIsModalOpenAddDay(true)} >Para qo'shish</Button> : ""}
              </div>
              {
                data?.data?.two_group === 0 ?
                <Table
                  columns={columns}
                  dataSource={data?.data?.timeTableDate}
                  pagination={false}
                  loading={isLoading}
                  size="middle"
                  className="mt-3 mb-5"
                  rowClassName="py-[12px]"
                  scroll={{ x: 900, y: "70vh" }}
                  bordered
                />
                : data?.data?.two_group === 1 ?
                <div className="grid xl:grid-cols-2 grid-cols-1 gap-4">
                  <div>
                    <h3>1 - patok</h3>
                    <Table
                      columns={columns}
                      dataSource={data?.data?.timeTableDate}
                      pagination={false}
                      loading={isLoading}
                      size="middle"
                      className="mt-3 mb-5"
                      rowClassName="py-[12px]"
                      scroll={{ x: 800, y: "70vh" }}
                      bordered
                    />
                  </div>
                  <div>
                    <h3>2 - patok</h3>
                    <Table
                      columns={columns}
                      dataSource={data?.data?.secondGroup?.timeTableDate}
                      pagination={false}
                      loading={isLoading}
                      size="middle"
                      className="mt-3 mb-5"
                      rowClassName="py-[12px]"
                      scroll={{ x: 800, y: "70vh" }}
                      bordered
                    />
                  </div>
                </div> : ""
              }
          </div>
        </div>
      </div>
      <TimeTableDateUpdateModal 
        isModalOpen={isModalOpenUpdate} 
        setIsModalOpen={setIsModalOpenUpdate} 
        selectedItem={selectedItem} 
        setselectedItem={setselectedItem} 
        subjectCategoryTime={data?.data?.subjectCategoryTime}
        dates={data?.data?.timeTableDate}
        refetch={refetch}
      />
      {
        isModalOpenUpdateData ? 
        <TimeTableDateDateUpdateModal
          isModalOpen={isModalOpenUpdateData} 
          setIsModalOpen={setIsModalOpenUpdateData} 
          selectedItem={selectedItem} 
          setselectedItem={setselectedItem} 
          subjectCategoryTime={data?.data?.subjectCategoryTime}
          mainData={data?.data}
          refetch={refetch}
        /> : ""
      }
      <AddDayModal 
        isModalOpen={isModalOpenAddDay} 
        setIsModalOpen={setIsModalOpenAddDay} 
        refetch={refetch}
        freeHour={data?.data?.freeHour}
        ids={data?.data?.ids}
        type={data?.data?.two_group === 0 ? "2" : "1"}
      />
    </div>
  )
}
export default TimeTableNewViewFirstTab;