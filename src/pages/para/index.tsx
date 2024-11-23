import React, { useState } from 'react'
import { globalConstants } from 'config/constants';
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import { useTranslation } from 'react-i18next'
import { IPara } from 'models/education';
import useGetAllData from 'hooks/useGetAllData';
import Table, { ColumnsType } from 'antd/es/table';
import { number_order } from 'utils/number_orders';
import checkPermission from 'utils/check_permission';
import { Link } from 'react-router-dom';
import HeaderPage from 'components/HeaderPage';
import Actions from 'components/Actions';
import SearchInput from 'components/SearchInput';
import UpdatePara from './crud/update';
import ViewPara from './crud/view';
import CustomPagination from 'components/Pagination';

const Para: React.FC = (): JSX.Element => {

  const { t } = useTranslation()
  const { urlValue, writeToUrl } = useUrlQueryParams({
    currentPage: 1,
    perPage: 10,
  });

  const [allData, setallData] = useState<IPara[]>();
  const [isOpenForm, setisOpenForm] = useState<boolean>(false);
  const [visibleView, setVisibleView] = useState<boolean>(false);
  const [id, setId] = useState<number | undefined>();
  const [searchVal, setSearchVal] = useState<string>("");

  const { data, refetch, isLoading } = useGetAllData<IPara>({
    queryKey: [
      "paras",
      urlValue.perPage,
      urlValue.currentPage,
      searchVal,
      urlValue?.filter_like
    ],
    url: `paras?${"sort=" + (urlValue?.filter_like?.sort ? urlValue?.filter_like?.sort : "-id")}&expand=description`,
    urlParams: {
      "per-page": urlValue.perPage,
      page: urlValue.currentPage,
      query: searchVal,
      filter: JSON.stringify(urlValue.filter),
    },
    options: {
      refetchOnWindowFocus: false,
      retry: 1,
      onSuccess: (res) => {
        setallData(res?.items);
        setisOpenForm(false);
      },
    },
  });

  const columns: ColumnsType<IPara> = [
    {
      title: "№",
      dataIndex: "order",
      render: (_, __, i) =>
        number_order(
          urlValue.currentPage,
          urlValue.perPage,
          Number(i),
          isLoading
        ),
        width: 50,
        sorter: () => {writeToUrl({name: "sort", value: urlValue?.filter_like?.sort === "-id" ? "id" : "-id" }); return 0},
    },
    {
      title: t("Name"),
      dataIndex: "name",
      key: "name",
      render: (i, e) =>
        checkPermission("department_view") ? (
          <Link
            to={``}
            onClick={() => {
              setVisibleView(true);
              setId(e?.id);
            }}
            className="underline text-black"
          >
            {e?.name}
          </Link>
        ) : (
          <span>{e?.name}</span>
        ),
    },
    {
      title: t("Start time"),
      dataIndex: "start_time",
      key: "start_time",
      render: (i, e) => <span>{e?.start_time}</span>,
    },
    {
      title: t("End time"),
      dataIndex: "end_time",
      key: "end_time",
      render: (i, e) => <span>{e?.end_time}</span>,
    },
    {
      title: t("Actions"),
      dataIndex: "actions",
      key: "actions",
      render: (i, e) => (
        <Actions
          id={e?.id}
          url={"paras"}
          refetch={refetch}
          onClickEdit={() => {
            setisOpenForm(true);
            setId(e?.id);
          }}
          onClickView={() => { setVisibleView(true); setId(e?.id); }
          }
          viewPermission={"para_view"}
          editPermission={"para_update"}
          deletePermission={"para_delete"}
        />
      ),
    },
  ]

  return (
    <>

      <HeaderPage
        title={"Para"}
        buttons={
          <SearchInput duration={globalConstants.debounsDuration} setSearchVal={setSearchVal} />
        }
        create_permission={"para_create"}
        createOnClick={() => {
          setisOpenForm(true);
          setId(undefined);
        }}
      />

      <UpdatePara id={id} setisOpenForm={setisOpenForm} isOpenForm={isOpenForm} setId={setId} refetch={refetch} />

      <ViewPara id={id} visible={visibleView} setVisible={setVisibleView} url='paras' title='View para' refetch={refetch} setEditVisible={setisOpenForm} permissions={{ delete_: "para_delete", update_: "para_update" }} />

      <div className='mt-4'>
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

export default Para