import React, {ReactNode, useState} from 'react'
import useGetOneData from 'hooks/useGetOneData';
import { Link, useParams } from 'react-router-dom'
import HeaderExtraLayout from 'components/HeaderPage/headerExtraLayout';
import { useTranslation } from 'react-i18next';
import { Badge, Button, Divider, Tooltip } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import DeleteData from 'components/deleteData';
import checkPermission from 'utils/check_permission';
import UpdateTopic from './update';
import { useAppSelector } from 'store';

interface DataType {
  name: string;
  value: ReactNode;
  value2?: ReactNode;
  value3?: ReactNode;
}


const TopicView = () => {
  const {t} = useTranslation()
  const {subject_id, topic_id} = useParams()
  const [isOpenForm, setisOpenForm] = useState<boolean>(false);
  const [dataId, setDataId] = useState<number | undefined>()
  const user = useAppSelector(s => s.auth.user);

  const { data, isLoading, refetch } = useGetOneData({
    queryKey: ["subject topic", topic_id],
    url: `subject-topics/${topic_id}?expand=description,lang,subject,subjectCategory,createdBy,updatedBy,parent`,
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  });

  const sharedOnCell = (_: DataType, index: number | undefined) => {
    if (index || index == 0) {
      if (index < 2) {
        return { colSpan: 0 };
      }
    }
    return {};
  }

  const columns: ColumnsType<DataType> = [
    {
      title: t("Name"),
      dataIndex: "name",
      rowScope: "row",
    },
    {
      title: t("Value"),
      dataIndex: "value",
      onCell: (_, index) => ({
        colSpan: !(index == 0 || index == 1) ? 1 : 3,
      }),
    },
    {
      title: t("Name2"),
      dataIndex: "value2",
      onCell: (_, index) => sharedOnCell(_, index),
      className: "bg-[#FAFAFA]",
    },
    {
      title: t("Name3"),
      dataIndex: "value3",
      onCell: (_, index) => sharedOnCell(_, index),
    },
  ];


  const tableData: DataType[] = [
    {
      name: t("Name"),
      value: data?.data.name,
    },
    {
      name: t("Description"),
      value: data?.data?.description,
    },
    {
      name: t("Ta'lim tili"),
      value: data?.data?.lang?.name,
      value2: t("Occupation category"),
      value3: data?.data?.subjectCategory?.name,
    },
    {
      name: t("Subject"),
      value: data?.data?.subject?.name,
      value2: t("Hours"),
      value3: data?.data?.hours,
    },
  ]


  const testColumns: ColumnsType<DataType> = [
    {
      title: t("Name"),
      dataIndex: "name",
      rowScope: "row",
    },
    {
      title: t("Value"),
      dataIndex: "value",
      onCell: (_, index) => ({
        colSpan: !(index == 0 || index == 1) ? 1 : 3,
      }),
    },
    {
      title: t("Name2"),
      dataIndex: "value2",
      onCell: (_, index) => sharedOnCell(_, index),
      className: "bg-[#FAFAFA]",
    },
    {
      title: t("Name3"),
      dataIndex: "value3",
      onCell: (_, index) => sharedOnCell(_, index),
    },
  ];

  const testTableData: DataType[] = [
    {
      name: t("Allotted time for test"),
      value: <span>{Math.floor(data?.data?.allotted_time/3600)}:{Math.floor(data?.data?.allotted_time%3600/60)}:{Math.floor(data?.data?.allotted_time%60)}</span>,
    },
    {
      name: t("Status"),
      value: <Badge status={`${data?.data?.status === 1 ? 'success' : 'error'}`} text={`${data?.data?.status === 1 ? `${t('Active')}` : `${t('InActive')}`}`} />,
    },
    {
      name: t("Duration reading time"),
      value: <span>{Math.floor(data?.data?.duration_reading_time/3600)}:{Math.floor(data?.data?.duration_reading_time%3600/60)}:{Math.floor(data?.data?.duration_reading_time%60)}</span>,
      value2: t("Min prosent"),
      value3: data?.data?.min_percentage,
    },
    {
      name: t("Attempts count"),
      value: data?.data?.attempts_count,
      value2: t("Content"),
      value3: checkPermission("subject-content_index") ? user?.active_role === "teacher" ? <Link to={`/subjects/${data?.data?.subject_id}/topics/${data?.data?.id}/contents/${user?.user_id}`}>{t("Content")}</Link> : <Link to={`/subjects/${data?.data?.subject_id}/topics/${data?.data?.id}/teachers`}>{t("Content")}</Link> : null
    },
    {
      name: t("Test count"),
      value: data?.data?.test_count,
      value2: t("Add test"),
      value3: checkPermission('subject-topic-test_index') ? (<Link to={`/subject/tests/${data?.data?.subject_id}/${data?.data?.id}`}>{t('Add')}</Link>) : null
    },
  ]

  return(
    <>
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: "/" },
          { name: "Subjects", path: "/subjects" },
          { name: "Topic view", path: "" },
        ]}
        title={data?.data?.name}
        isBack={true}
        btn={
          <div className='flex items-center'>

            {checkPermission("subject-topic_update") ? (
            <Tooltip placement="topLeft" title={t("Edit")}>
              <Button type='default' className='mr-3' onClick={() => {setisOpenForm(true); setDataId(topic_id ? Number(topic_id) : undefined)}}>{t('Edit')}</Button>
            </Tooltip>
          ) : null}

            <DeleteData
            permission={"subject-topic_delete"}
            refetch={refetch}
            url={"subject-topics"}
            id={Number(topic_id)}
            navigateUrl='/subjects'
          >
            <Button danger>{t('Delete')}</Button>
          </DeleteData>
          </div>
        }
      />

      <UpdateTopic topic_id={Number(topic_id)} setId={setDataId} isOpenForm={isOpenForm} setisOpenForm={setisOpenForm} refetch={refetch} />

      <div className='px-4 py-3'>
        <div className='mb-12'>
          <Divider orientation='left'>{t("Basic information")}</Divider>
          <Table
            columns={columns}
            bordered
            dataSource={tableData}
            showHeader={false}
            pagination={false}
            loading={isLoading}
            size='middle'
          />
        </div>

        <div>
          <Divider orientation='left'>{t("Test information")}</Divider>
          <Table
            columns={testColumns}
            bordered
            dataSource={testTableData}
            showHeader={false}
            pagination={false}
            loading={isLoading}
            size='middle'
          />
        </div>
      </div>
    </>
  )
}

export default TopicView