import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import useGetAllData from "hooks/useGetAllData";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import CustomPagination from "components/Pagination";
import { number_order } from "utils/number_orders";
import { Button, Table, Tag, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { Link, useNavigate } from "react-router-dom";
import checkPermission from "utils/check_permission";
import dayjs from "dayjs";
import { FILE_URL } from "config/utils";
import { DocumentText24Regular, Eye16Filled } from "@fluentui/react-icons";
import Actions from "components/Actions";
import OpenFileByModal from "components/openFileByModal";

const ComeLetters = () => {
  const { t } = useTranslation();
  const [allData, setAllData] = useState<any[]>([]);
  const { urlValue, writeToUrl } = useUrlQueryParams({ currentPage: 1, perPage: 15 });
  const navigate = useNavigate()
  const [searchVal, setSearchVal] = useState<string>("");
  const [open, setOpen] = useState<any>()

  const { data, refetch, isFetching: isLoading } = useGetAllData({
    queryKey: ["letter-forward-items", urlValue.perPage, urlValue.currentPage, urlValue.filter_like?.sort, searchVal, ...(Object.values(urlValue?.filter) ?? [])],
    url: `letter-forward-items?sort=-id&expand=letter,letter.user.profile,letter.description,letterForward,user.profile,letterReply,createdBy&filter=${JSON.stringify(urlValue.filter)}`,
    urlParams: { "per-page": urlValue.perPage, page: urlValue.currentPage, sort: urlValue.filter_like?.sort ?? "-id", query: searchVal },
    options: {
      onSuccess: (res) => {
        setAllData(res?.items);
      }
    }
  });

  const columns: ColumnsType<any> = React.useMemo(() => [
    {
      title: '№',
      width: 45,
      showSorterTooltip: false,
      sorter: () => { writeToUrl({ name: "sort", value: urlValue?.filter_like?.sort === "-id" ? "id" : "-id" }); return 0 },
      render: (_, __, i) => number_order(urlValue.currentPage, urlValue.perPage, Number(i), isLoading),
    },
    // {
    //   title: t('Hujjat raqami'),
    //   showSorterTooltip: false,
    //   render: (e) =>
    //     checkPermission("letter_view") ? (
    //       <span
    //         onClick={() => navigate(`/letters/view/${e?.id}`)}
    //         className="hover:text-[#0a3180] underline cursor-pointer"
    //       >{e?.letter?.doc_number} </span>
    //     ) : (<span>{e?.doc_number}</span>),
    // },
    {
      title: t('Topshiriq maznuni'),
      render: (i: string, e) => checkPermission('letter-forward_view') ? <Link to={`/come-letters/view/${e?.id}`} className="text-black hover:text-[#0a3180] hover:underline cursor-pointer">{e?.letterForward?.description}</Link> : <span>{e?.letterForward?.description}</span>,
    },
    {
      title: t('Topshiriq file'),
      render: (e: any) => e?.letter?.file ? <DocumentText24Regular color='blue' cursor="pointer" onClick={() => setOpen(e?.letter?.file)} /> : <Tag color="red" className='border-0' >File yuklanmagan</Tag>
    },
    {
      title: t('Ijro muddati'),
      showSorterTooltip: false,
      render: (e) => <div>
        <p>{e?.letterForward?.end_date ? dayjs(e?.letterForward?.end_date*1000).format("YYYY.MM.DD HH:mm:ss") : ""}</p>
      </div>,
    },
    {
      title: t('Topshiriq beruvchi'),
      render: (e: any) => <p>{e?.createdBy?.last_name} {e?.createdBy?.first_name} {}</p>,
    },
    {
      title: t('Ijrochi'),
      render: (e: any) => <p>{e?.user?.profile?.last_name} {e?.user?.profile?.first_name} {}</p>,
    },
    {
      title: t('Javob xati holati'),
      render: (e: any) => {
        if(!e?.letterReply) return <Tag color="warning" >Javob yozilmagan</Tag>
        if(!e?.letterReply?.status) return <Tag color="info" >Yuborilmagan</Tag>
        if(!e?.letterReply?.is_ok) return <Tag color="blue" >Kutilmoqda</Tag>
        if(e?.letterReply?.is_ok === 1) return <Tag color="success" >Tasdiqlangan</Tag>
        if(e?.letterReply?.is_ok === 2) return <div className="d-f" >
          <Tag color="error" >Qaytarilgan</Tag>
          <Tooltip title={e?.letterReply?.message ?? ""}>
                <Button size="small" className="d-f" ><Eye16Filled/></Button>
              </Tooltip>
          </div>
      },
    },
    // {
    //   title: t("Topshiriqqa javob qaytarish"),
    //   width: 120,
    //   align: "center",
    //   render: (i, e) => e?.letterReply?.length ? <Link to={`/come-letters/view/${e?.id}?user-block=letter-reply-info`} >Javob xatini ko'rish</Link>
    //   : <Button type="primary" size="small" onClick={() => navigate(`/letter/${e?.letter_id}/reply-letter/${e?.id}/create`)} >Javob qaytarish</Button>,
    // },
    {
      title: t("Javob xatlari"),
      width: 120,
      align: "center",
      render: (i, e) => <Link to={`/come-letters/view/${e?.id}?user-block=letter-reply-info`} >ko'rish</Link>,
    },
    {
      title: t("Actions"),
      width: 120,
      align: "center",
      render: (i, e) => <Actions
      id={e?.id}
      url={'come-letters'}
      onClickEdit={() => navigate(`/come-letters/update/${e?.id}`)}
      onClickView={() => navigate(`/come-letters/view/${e?.id}`)}
      viewPermission={'letter-forward_view'}
      editPermission={"_"}
      deletePermission={"_"}
    />,
    },
  ], [data?.items]);

  return (
    <div className="">
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: '/' },
          { name: "Kelgan topshiriq xatlari", path: '/come-letters' }
        ]}
        title={t("Kelgan topshiriq xatlari")}
        btn={
          <div className="d-f gap-3" >
          </div>
        }
      />
      <div className="p-3">
        {/* <Row gutter={[12, 12]}>
          <Col xs={24} sm={24} md={12} lg={8} xl={6}>
            <SearchInput setSearchVal={setSearchVal} duration={500} width={"full"} />
          </Col>
          {selectData?.map((e, i) => (
            <FilterSelect
              key={i}
              url={e.url}
              name={e.name}
              label={e.label}
              permission={e.permission}
              parent_name={e?.parent_name}
              child_names={e?.child_names}
              value_name={e?.value_name}
            // span={ xl: 8 }
            />
          ))}
        </Row> */}
        <Table
          columns={columns}
          dataSource={data?.items.length ? data?.items : allData}
          pagination={false}
          loading={isLoading}
          size="middle"
          className="mt-3"
          rowClassName="py-[12px]"
          scroll={{ x: 576 }}
        />
        {(data?._meta?.totalCount ?? 0) > 10 ? <CustomPagination totalCount={data?._meta.totalCount} currentPage={urlValue.currentPage} perPage={urlValue.perPage} /> : undefined}
        <OpenFileByModal setVisible={setOpen} visible={open} file={open} width={"100%"} />
      </div>
    </div>
  )
}

export default ComeLetters;

// letter_create
// letter_delete
// letter_view
// letter_update
// letter_index