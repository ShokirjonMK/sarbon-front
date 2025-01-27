import React, { useState } from 'react';
import Table, { ColumnsType } from 'antd/es/table';
import HeaderPage from 'components/HeaderPage';
import SearchInput from 'components/SearchInput';
import { globalConstants } from 'config/constants';
import useGetAllData from 'hooks/useGetAllData';
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import { ISubjectTopic } from 'models/subject';
import { useTranslation } from 'react-i18next';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy, } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MenuOutlined } from '@ant-design/icons';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { number_order } from 'utils/number_orders';
import Actions from 'components/Actions';
import { message, Select, Tag } from 'antd';
import StatusTag from 'components/StatusTag';
import UpdateTopic from './crud/update';
import CustomPagination from 'components/Pagination';
import useGetData from 'hooks/useGetData';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Notification } from 'utils/notification';
import { AxiosError } from 'axios';
import { importTopicToExcel, submitTopicOrderData } from './crud/request';
import checkPermission from 'utils/check_permission';
import './style.scss'
import { ArrowUploadFilled } from '@fluentui/react-icons';
import { useAppSelector } from 'store';


interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  "data-row-key": string;
}

const Row = ({ children, ...props }: RowProps) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging, } = useSortable({ id: props["data-row-key"], });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 999 } : {}),
  };

  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if ((child as React.ReactElement).key === 'sort') {
          return React.cloneElement(child as React.ReactElement, {
            children: (
              checkPermission('subject-topic_order') ? (
                <MenuOutlined
                  ref={setActivatorNodeRef}
                  style={{ touchAction: 'none', cursor: 'move' }}
                  {...listeners}
                />
              ) : null
            ),
          });
        }
        return child;
      })}
    </tr>
  );
};

const SubjectTopic: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id: subject_id, teacher_id } = useParams()
  const { urlValue, writeToUrl } = useUrlQueryParams({
    currentPage: 1,
    perPage: 10,
  });

  const [searchVal, setSearchVal] = useState<string>("");
  const [isOpenForm, setisOpenForm] = useState<boolean>(false);
  const [id, setId] = useState<number | undefined>();
  const [visibleView, setVisibleView] = useState<boolean>(false);
  const [allData, setallData] = useState<ISubjectTopic[]>([]);
  const [lang_id, setLang] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  const user = useAppSelector(s => s.auth.user);

  console.log("user", user);


  const { data, refetch, isFetching } = useGetAllData<ISubjectTopic>({
    queryKey: ["subject-topics", urlValue.perPage, urlValue.currentPage, searchVal, lang_id, category],
    url: `subject-topics?sort=order&expand=description,teacherAccess,subject,subjectCategory,lang&filter={"subject_id":${subject_id}}`,
    urlParams: { "per-page": urlValue.perPage, page: urlValue.currentPage, query: searchVal, lang_id, category, },
    options: {
      refetchOnWindowFocus: false,
      retry: 1,
      onSuccess: (res) => {
        setallData(res?.items);
        setisOpenForm(false);
      },
    },
  });

  const { data: langName } = useGetData<ISubjectTopic>({
    queryKey: ["languages"],
    url: "languages",
    options: { staleTime: Infinity, refetchOnWindowFocus: false, retry: 0 },
  });

  const { data: occupCategory } = useGetData<ISubjectTopic>({
    queryKey: ["subject-categories"],
    url: "subject-categories",
    options: { staleTime: Infinity, refetchOnWindowFocus: false, retry: 0 },
  });


  const columns: ColumnsType<ISubjectTopic> = [
    {
      children: [
        {
          key: 'sort',
        }
      ]
    },
    {
      title: '№',
      children: [
        {
          title: <span></span>,
          dataIndex: 'order',
          render: (_, __, i) =>
            number_order(
              urlValue.currentPage,
              urlValue.perPage,
              Number(i),
              isFetching
            ),
        }
      ],
      width: 20,
      // fixed: "left",
    },
    {
      title: t("Topic name"),
      children: [
        {
          title: <SearchInput duration={globalConstants.debounsDuration} setSearchVal={setSearchVal} />,
          render: (i, e) => checkPermission("subject-content_index") ? (
            <Link
              to={`/subjects/${subject_id}/topic-view/${e?.id}`}
              className="text-black hover:text-[#0a3180] underline cursor-pointer"
            >{e?.name} </Link>
          ) : (<span>{e?.name}</span>),
        }
      ],
      // fixed: "left",
      // width: 180,
    },
    {
      title: t("Description"),
      children: [
        {
          title: <span></span>,
          dataIndex: 'description',
        }
      ]
    },
    {
      title: t("Ta'lim tili"),
      children: [
        {
          title: <Select
            showSearch
            allowClear
            className="w-[180px]"
            placeholder={t("Til bo'yicha saralash")}
            optionFilterProp="children"
            onChange={(e) => setLang(e)}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={langName?.items?.map(lang => ({ label: lang?.name, value: lang?.id }))}
          />,
          dataIndex: 'lang_id',
          render: (i, e) => <Tag>{e?.lang?.name}</Tag>
        }
      ],
    },
    {
      title: t('Occupation category'),
      children: [
        {
          title: <Select
            showSearch
            allowClear
            className="w-[180px]"
            placeholder={t("Filter by category")}
            optionFilterProp="children"
            onChange={(e) => setCategory(e)}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={occupCategory?.items?.map(category => ({ label: category?.name, value: category?.id }))}
          />,
          dataIndex: 'subject_category_id',
          render: (i, e) => <span>{e?.subjectCategory?.name}</span>
        }
      ]
    },
    {
      title: t('Content'),
      children: [
        {
          title: <span></span>,
          dataIndex: 'subject_id',
          render: (i, e) => checkPermission("subject-content_index") ?
            // user?.active_role === "teacher" ?
            <Link to={`/subjects/${e?.subject_id}/topics/${e?.id}/contents`}>{t("Content")}</Link>
            // <Link to={`/subjects/${e?.subject_id}/topics/${e?.id}/contents/${teacher_id}`}>{t("Content")}</Link>
            // : <Link to={`/subjects/${e?.subject_id}/topics/${e?.id}/teachers`}>{t("Content")}</Link>
            : null
        }
      ]
    },
    {
      title: t('Tests'),
      children: [
        {
          title: <span></span>,
          dataIndex: 'subject_id',
          render: (i, e) => {
            if (e?.subject_category_id == globalConstants.lectureIdForTimeTable)
              return checkPermission("test_index") ? <Link to={`/subject/tests/${subject_id}/${e?.id}`}>Test</Link> : null
          }
        }
      ]
    },
    {
      title: t('Test count'),
      children: [
        {
          title: <span></span>,
          dataIndex: 'test_count',
          render: (i, e) => <span>{e?.test_count}</span>
        }
      ]
    },
    {
      title: t("Status"),
      children: [
        {
          title: <span></span>,
          dataIndex: "status",
          key: "status",
          render: (i, e) => <StatusTag status={e?.status} />,
        }
      ]
    },
    {
      title: t("Actions"),
      children: [
        {
          title: <span></span>,
          dataIndex: "actions",
          key: "actions",
          render: (i, e) => (
            <Actions
              id={e?.id}
              url={"subject-topics"}
              refetch={refetch}
              onClickEdit={() => {
                setisOpenForm(true);
                setId(e?.id);
              }}
              onClickView={() => navigate(`/subjects/${subject_id}/topic-view/${e?.id}`)}
              viewPermission={"subject-topic_view"}
              editPermission={"subject-topic_update"}
              deletePermission={"subject-topic_delete"}
            />
          ),
        }
      ]
    },
  ];


  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      if (over?.id)
        setallData((previous) => {
          const activeIndex = previous.findIndex((i) => i.id === active.id);
          const id = active.id
          const overIndex = previous.findIndex((i) => i.id === over?.id);
          let order = ((urlValue.perPage ?? 10) * urlValue.currentPage + overIndex - (urlValue.perPage ?? 10) + 1)
          mutate({ id: Number(id), order })
          return arrayMove(previous, activeIndex, overIndex);
        });
    }
  };

  const { mutate } = useMutation({
    mutationFn: ({ id, order }: { id: number, order: number }) => submitTopicOrderData(id, { order }, Number(subject_id)),
    onSuccess: async (res) => {
      refetch();
      Notification("success", id ? "update" : "create", res?.message)
    },
    onError: (error: AxiosError) => {
      message.error(`${t('Data retrieval error')}`)
    },
    retry: 0,
  });


  const { mutate: importTopic } = useMutation({
    mutationFn: ({ id, file }: { id: string, file: any }) => importTopicToExcel(id, file),
    onSuccess: async (res) => {
      refetch();
      Notification("success", "create", res?.message)
    },
    onError: (error: AxiosError) => {
      message.error(`${t('Data retrieval error')}`)
    },
    retry: 0,
  });

  return (
    <div className="px-6 py-2">
      <HeaderPage
        title={"Topics"}
        create_permission={"subject-topic_create"}
        createOnClick={() => {
          setisOpenForm(true);
          setId(undefined);
        }}
        className="mb-5"
        buttons={
          checkPermission("subject-topic_create") ?
            <>
              <input type="file" accept=".xls,.xlsx" onChange={(e) => importTopic({ id: subject_id ?? "", file: e?.target?.files ? e.target.files[0] ?? "" : "" })} className="hidden" style={{ display: "none" }} id="excel_import" />
              <label htmlFor="excel_import" className="d-f cursor-pointer text-[#52C41A] rounded-lg border border-solid border-[#52C41A] px-3 py-1" >
                <ArrowUploadFilled fontSize={16} color="#52C41A" />&nbsp;&nbsp;Import excel
              </label>
            </> : ""
        }
      />

      <UpdateTopic topic_id={id} setId={setId} isOpenForm={isOpenForm} setisOpenForm={setisOpenForm} refetch={refetch} />

      <div>
        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
          <SortableContext
            // rowKey array
            items={allData?.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <Table
              components={{
                body: {
                  row: Row,
                },
              }}
              rowKey="id"
              columns={columns}
              dataSource={allData}
              pagination={false}
              rowClassName={(record, index) =>
                index !== undefined
                  ? "my-row-class"
                  : ""
              }
              loading={isFetching}
              scroll={{ x: 576 }}
            />
          </SortableContext>
        </DndContext>

        <CustomPagination
          totalCount={data?._meta.totalCount}
          currentPage={urlValue.currentPage}
          perPage={urlValue.perPage}
        />
      </div>
    </div>
  );
};

export default SubjectTopic;