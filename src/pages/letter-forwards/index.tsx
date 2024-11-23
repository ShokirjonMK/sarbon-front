import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import useGetAllData from "hooks/useGetAllData";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import CustomPagination from "components/Pagination";
import { number_order } from "utils/number_orders";
import { Button, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import Actions from "components/Actions";
import UpdateLetterForwar from "./crud/update";
import { renderFullName } from "utils/others_functions";
import ViewLetterForwardView from "./crud/view";
import { useParams } from "react-router-dom";

const LetterForwards = () => {

  const { t } = useTranslation();
  const { id } = useParams();
  const [allData, setAllData] = useState<any[]>([]);
  const { urlValue, writeToUrl } = useUrlQueryParams({ currentPage: 1, perPage: 15 });
  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedItem, setselectedItem] = useState();  

  const { data, refetch, isLoading } = useGetAllData({
    queryKey: ["letter-forwards", urlValue.perPage, urlValue.currentPage, urlValue.filter_like?.sort, ...(Object.values(urlValue?.filter) ?? []), id],
    url: `letter-forwards?sort=-id&expand=user,user.profile,description,letterReply,letterForwardItem&filter=${JSON.stringify({...urlValue.filter, letter_id: id})}`,
    urlParams: { "per-page": urlValue.perPage, page: urlValue.currentPage, sort: urlValue.filter_like?.sort ?? "-id" },
    options: {
      onSuccess: (res) => {
        setAllData(res?.items);
      },
      enabled: !!id
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
    {
      title: t('Asosiy bajaruvchi'),
      render: (i: string, e) => <span>{renderFullName(e?.user?.profile)}</span>,
    },
    {
      title: t('Topshiriq maznuni'),
      render: (i: string, e) => <span>{e?.description}</span>,
    },
    {
      title: t('Ijro muddati'),
      showSorterTooltip: false,
      render: (e) => <div>
        <p>{dayjs(e?.start_date*1000).format("YYYY.MM.DD HH:mm:ss")}</p>
        <p>{dayjs(e?.end_date*1000).format("YYYY.MM.DD HH:mm:ss")}</p>
      </div>,
    },
    // {
    //   title: t("Ko'rish holati"),
    //   render: (_, e) => <Tag color={e?.view_type === 1 ? "success" : "warning"}> {e?.view_type === 1 ? <span>{t("Ko'rilgan")} - {dayjs(e?.view_date*1000).format("YYYY.MM.DD HH:mm:ss")}</span> : t("Ko'rilmagan")} </Tag>,
    // },
    // {
    //   title: t("Javob holati"),
    //   render: (_, e) => <Tag color={e?.is_answer === 1 ? "success" : "warning"}> {e?.is_answer === 1 ? <span>{t("Javob berilgan")} - {dayjs(e?.view_date*1000).format("YYYY.MM.DD HH:mm:ss")}</span> : t("Javob berilmagan")} </Tag>,
    // },
    {
      title: t("Yuborish holati"),
      render: (_, e) => <Tag color={e?.status === 1 ? "#52C41A" : "#fa8c16"}> {e?.status === 1 ? t("Ijrochiga yuborilgan") : t("Yuborilmagan")} </Tag>,
    },
    {
      title: t("Actions"),
      width: 120,
      align: "center",
      children: [
        {
          dataIndex: 'actions',
          render: (i, e) => <Actions
            id={e?.id}
            url={'letter-forwards'}
            refetch={refetch}
            onClickEdit={() => {setOpen(true); setselectedItem(e)}}
            onClickView={() => {setOpenView(true); setselectedItem(e)}}
            viewPermission={'letter-forward_view'}
            editPermission={e?.status !== 1 ? "letter-forward_update" : "none"}
            deletePermission={e?.status !== 1 ? "letter-forward_delete" : "none"}
          />,
        }
      ]
    },
  ], [data?.items]);

  return (
    <div className="">
      <div className="px-[24px] pb-[20px]">
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
        <div className="flex justify-end" >
            <Button className="ml-auto" onClick={() => {setOpen(true); setselectedItem(undefined)}} type="primary">{t("Create")}</Button>
        </div>
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
      </div>

      <ViewLetterForwardView open={openView} setOpen={setOpenView} refetch={refetch} selectedItem={selectedItem} setselectedItem={setselectedItem} />
      <UpdateLetterForwar open={open} setOpen={setOpen} refetch={refetch} selectedItem={selectedItem} setselectedItem={setselectedItem} />
    </div>
  )
}

export default LetterForwards;

// letter-forward_create
// letter-forward_delete
// letter-forward_view
// letter-forward_update
// letter-forward_index