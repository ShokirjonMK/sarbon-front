import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import useGetAllData from "hooks/useGetAllData";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import CustomPagination from "components/Pagination";
import { number_order } from "utils/number_orders";
import { Button, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { CreateBtn } from "components/Buttons";
import { useNavigate } from "react-router-dom";
import checkPermission from "utils/check_permission";
import dayjs from "dayjs";
import StatusTag from "components/StatusTag";
import { FILE_URL } from "config/utils";
import { DocumentText24Regular } from "@fluentui/react-icons";
import Actions from "components/Actions";
import UpdateDocumentExecution from "./crud/update";

const DocumentExecutions = () => {

  const { t } = useTranslation();
  const [allData, setAllData] = useState<any[]>([]);
  const { urlValue, writeToUrl } = useUrlQueryParams({ currentPage: 1, perPage: 15 });
  const navigate = useNavigate()
  const [searchVal, setSearchVal] = useState<string>("");
  const [open, setOpen] = useState(false);

  const { data, refetch, isLoading } = useGetAllData({
    queryKey: ["document-executions", urlValue.perPage, urlValue.currentPage, urlValue.filter_like?.sort, searchVal, ...(Object.values(urlValue?.filter) ?? [])],
    url: `document-executions?sort=-id&expand=user,user.profile,description&filter=${JSON.stringify(urlValue.filter)}`,
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
    {
      title: t('Hujjat raqami'),
      showSorterTooltip: false,
      render: (e) =>
        checkPermission("document_view") ? (
          <span
            onClick={() => navigate(`/documents/view/${e?.id}`)}
            className="hover:text-[#0a3180] underline cursor-pointer"
          >{e?.doc_number} </span>
        ) : (<span>{e?.doc_number}</span>),
    },
    {
      title: t('Topshiriq sarlovhasi'),
      render: (i: string, e) => <span>{e?.title}</span>,
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
    {
      title: t('Topshiriq file'),
      render: (e: any) => e?.file ? <a href={FILE_URL + e?.file} target='_blank'><DocumentText24Regular /></a> : "Fayl yuklanmagan"
    },
    {
      title: t('Status'),
      render: (_, e) => <StatusTag status={e?.status} />,
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
            url={'documents'}
            refetch={refetch}
            onClickEdit={() => navigate(`/documents/update/${e?.id}`)}
            onClickView={() => navigate(`/documents/view/${e?.id}`)}
            viewPermission={'document_view'}
            editPermission={"document_update"}
            deletePermission={"document_delete"}
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
            <Button className="ml-auto" onClick={() => setOpen(true)} type="primary">{t("Create")}</Button>
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

      <UpdateDocumentExecution open={open} setOpen={setOpen} refetch={refetch} />
    </div>
  )
}

export default DocumentExecutions;

// document_create
// document_delete
// document_view
// document_update
// document_index