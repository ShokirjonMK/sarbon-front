import React, { useState } from 'react'
import Table, { ColumnsType } from 'antd/es/table'
import HeaderExtraLayout from 'components/HeaderPage/headerExtraLayout'
import useGetAllData from 'hooks/useGetAllData'
import useUrlQueryParams from 'hooks/useUrlQueryParams'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { number_order } from 'utils/number_orders'
import { Tag } from 'antd'
import useGetOneData from 'hooks/useGetOneData'
import CustomPagination from 'components/Pagination'

const ContentTeachers : React.FC = () : JSX.Element => {
  const {t} = useTranslation()
  const {subject_id, topic_id} = useParams()
  const { urlValue, writeToUrl } = useUrlQueryParams({
    currentPage: 1,
    perPage: 10,
  });
  const [searchVal, setSearchVal] = useState<string>("");
  const [allData, setallData] = useState<any[]>([]);

  const { data, isLoading } = useGetAllData<any>({
    queryKey: ["teacher-accesses", urlValue.perPage, urlValue.currentPage, searchVal,],
    url: `teacher-accesses?filter={"subject_id":${subject_id}}&expand=language,subject`,
    urlParams: { "per-page": urlValue.perPage, page: urlValue.currentPage, query: searchVal, },
    options: {
      refetchOnWindowFocus: false,
      retry: 1,
      onSuccess: (res) => {
        setallData(res?.items);
      },
    },        
  });


  const { data: topics } = useGetOneData({
    queryKey: [`subject-topics`, topic_id],
    url: `subject-topics/${topic_id}?expand=teachersContentCount`        
  });

  const columns: ColumnsType<any> = [
    {
      title: "№",
      dataIndex: "order",
      width: 45,
      render: (_, __, i) =>
        number_order(
          urlValue.currentPage,
          urlValue.perPage,
          Number(i),
          isLoading
        ),
    },
    {
      title: t("First name"),
      dataIndex: "first_name",
      key: "first_name",
      render: (i,e) => <span>{e?.teacher?.first_name}</span>
    },
    {
      title: t("Last name"),
      dataIndex: "last_name",
      key: "last_name",
      render: (i,e) => <span>{e?.teacher?.last_name}</span>
    },
    {
      title: t("Middle name"),
      dataIndex: "middle_name",
      key: "middle_name",
      render: (i,e) => <span>{e?.teacher?.middle_name}</span>
    },
    {
      title: t("Subject name"),
      dataIndex: "subject_id",
      key: "subject_id",
      render: (i,e) => <span>{e?.subject?.name}</span>
    },
    {
      title: t("Language"),
      dataIndex: "language",
      key: "language",
      render: (i,e) => <Tag>{e?.language?.name}</Tag>
    },
    {
      title: t("Content"),
      dataIndex: "content",
      key: "content",
      render: (i,e) => <Link to={`/subjects/${subject_id}/topics/${topic_id}/contents/${e?.id}`}>{t("Content")}</Link>
    },
    {
      title: t("Content count"),
      dataIndex: "content_count",
      key: "content",
      render: (i,e) => <span>{topics?.data?.teachersContentCount?.map((item:any) => item?.teacher_access_id === e?.id ? item?.count : null ) }</span>
    },
  ];

  return(
    <>
      <HeaderExtraLayout title={topics?.data?.name}
        breadCrumbData={[
          { name: "Home", path: '/' },
          { name: "Subject", path: 'subjects' },
          { name: "Subject topics", path: 'subjects/view/517?user-block=topic-info' },
          { name: "Subject topic teachers", path: 'subjects' }
        ]}
        btn={
          <div className='flex'>
            {/* <CreateBtn onClick={() => { navigate("/exam-controls/create") }} permission={"exam-control_create"} /> */}
          </div>
        }
        isBack={true}
      />
      <div className='py-3 px-6'>
        <Table
          columns={columns}
          dataSource={data?.items.length ? data?.items : allData}
          pagination={false}
          loading={isLoading}
        />

        <CustomPagination
          totalCount={data?._meta.totalCount}
          currentPage={urlValue.currentPage}
          perPage={urlValue.perPage}
        />
      </div>
    </>
  )
}

export default ContentTeachers