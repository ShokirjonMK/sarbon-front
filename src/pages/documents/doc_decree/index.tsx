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
import { DocumentText24Regular, Eye16Filled, SendFilled } from "@fluentui/react-icons";
import Actions from "components/Actions";
import { ILetterOutgoing } from "models/document";
import A4FormatModal from "components/A4FormatModal";
import { useMutation } from "@tanstack/react-query";
import { sendNoticeData } from "./crud/request";
import { Notification } from "utils/notification";
import { AxiosError } from "axios";

const DocDecree = () => {
  const { t } = useTranslation();
  const [allData, setAllData] = useState<any[]>([]);
  const { urlValue, writeToUrl } = useUrlQueryParams({ currentPage: 1, perPage: 15 });
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const [file, setFile] = useState<ILetterOutgoing>();

  const { data, refetch, isFetching: isLoading } = useGetAllData({
    queryKey: ["document-decrees", urlValue.perPage, urlValue.currentPage, urlValue.filter_like?.sort, urlValue.filter_like?.type, ...(Object.values(urlValue?.filter) ?? [])],
    url: `document-decrees?expand=user.profile,body,qrCode&filter=${JSON.stringify({...urlValue.filter, type: urlValue.filter_like?.type})}`,
    urlParams: { "per-page": urlValue.perPage, page: urlValue.currentPage, sort: urlValue.filter_like?.sort ?? "-id", },
    options: {
      onSuccess: (res) => {
        setAllData(res?.items);
      }
    }
  });

  const { mutate: sendNotice, isLoading: sendLoading } = useMutation({
    mutationFn: (id: number) => sendNoticeData(id),
    onSuccess: async (res) => {
      if (res?.status === 1) {
        Notification("success", "update", res?.message);
        refetch();
      } else {
        Notification("error", "update", res?.message);
      }
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", "update", error?.response?.data ? error?.response?.data?.data?.message : "");
    },
    retry: 0,
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
      title: t('Farmoyish maznuni'),
      render: (i: string, e) => checkPermission('document-decree_view') ? <Link to={`/doc-decree/view/${e?.id}`} className="text-black hover:text-[#0a3180] hover:underline cursor-pointer">{e?.description}</Link> : <span>{e?.description}</span>,
    },
    {
      title: t('File'),
      render: (e: any) => e?.body ? <DocumentText24Regular color='blue' cursor="pointer" onClick={() => { setFile(e); setOpen(true) }} /> : <Tag color="red" className='border-0' >File yuklanmagan</Tag>
    },
    {
      title: t('Farmoyish beruvchi'),
      render: (e: any) => <p>{e?.user?.profile?.last_name} {e?.user?.profile?.first_name} { }</p>,
    },
    {
      title: t('Yuborilgan vaqti'),
      render: (i: string, e) => dayjs(e?.sent_time * 1000).format("YYYY.MM.DD HH:mm:ss"),
    },
    {
      title: t('Farmoyish holati'),
      render: (e: any) => {
        if (!e?.status) return <div className="d-f gap-1"><Tag color="gold" >Yuborilmagan</Tag><Tooltip title={"Yuborish"}>
        <Button
          type='primary'
          size='small'
          onClick={() => { sendNotice(e?.id) }}
          className='d-f gap-1'
        ><SendFilled fontSize={15} className='-rotate-45- ml-1' /></Button>
      </Tooltip></div>
        if (e?.type === 2) return <Tag color="success" >Kard tasdiqlagan</Tag>
        if (e?.type === 4) return <Tag color="#87d068" >Imzolangan</Tag>
        if (e?.type === 1) return <div className="d-f" >
          <Tag color="error" >Kadr qaytargan</Tag>
          <Tooltip title={e?.message ?? ""}>
            <Button size="small" className="d-f" ><Eye16Filled /></Button>
          </Tooltip>
        </div>
        if (e?.type === 3) return <div className="d-f" >
          <Tag color="error" >Rektor qaytargan</Tag>
          <Tooltip title={e?.message ?? ""}>
            <Button size="small" className="d-f" ><Eye16Filled /></Button>
          </Tooltip>
        </div>
        if (e?.status) return <Tag color="blue" >Kutilmoqda</Tag>
      },
    },
    {
      title: t("Actions"),
      width: 120,
      align: "center",
      render: (i, e) => <Actions
        id={e?.id}
        url={'document-decrees'}
        onClickEdit={() => navigate(`/doc-decree/update/${e?.id}`)}
        onClickView={() => navigate(`/doc-decree/view/${e?.id}`)}
        viewPermission={'document-decree_view'}
        editPermission={!e?.status ? 'document-decree_update' : ""}
        deletePermission={!e?.status ? 'document-decree_delete' : ""}
      />,
    },
  ], [data?.items]);

  return (
    <div className="">
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: '/' },
          { name: "Farmoyish", path: '/doc-decree' }
        ]}
        title={t("Farmoyish")}
        btn={
          checkPermission('document-decree_create') ? <Button type="primary" onClick={() => navigate("/doc-decree/create")} >Farmoyish yaratish</Button> : null
        }
      />
      <div className="p-3">
      <Tag color={urlValue?.filter_like?.type == undefined ? "blue" : ""} onClick={() => writeToUrl({ name: "type", value: undefined })} className="cursor-pointer text-[14px] py-[2px] px-2" >Hammasi</Tag>
      <Tag color={urlValue?.filter_like?.type === '4' ? "blue" : ""} onClick={() => writeToUrl({ name: "type", value: 4 })} className={`cursor-pointer text-[14px] py-[2px] px-2 ${urlValue?.filter_like?.type !== '4' ? "text-green-500" : ""}`} >Imzolangan</Tag>
      <Tag color={urlValue?.filter_like?.type === '3' ? "blue" : ""} onClick={() => writeToUrl({ name: "type", value: 3 })} className={`cursor-pointer text-[14px] py-[2px] px-2 ${urlValue?.filter_like?.type !== '3' ? "text-red-600" : ""}`} >Rektor qaytargan</Tag>
      <Tag color={urlValue?.filter_like?.type === '2' ? "blue" : ""} onClick={() => writeToUrl({ name: "type", value: 2 })} className={`cursor-pointer text-[14px] py-[2px] px-2 ${urlValue?.filter_like?.type !== '2' ? "text-blue-600" : ""}`} >Tasdiqlangan</Tag>
      <Tag color={urlValue?.filter_like?.type === '1' ? "blue" : ""} onClick={() => writeToUrl({ name: "type", value: 1 })} className={`cursor-pointer text-[14px] py-[2px] px-2 ${urlValue?.filter_like?.type !== '1' ? "text-red-600" : ""}`} >Kadr qaytargan</Tag>
      <Tag color={urlValue?.filter_like?.type === '0' ? "blue" : ""} onClick={() => writeToUrl({ name: "type", value: "0" })} className={`cursor-pointer text-[14px] py-[2px] px-2 ${urlValue?.filter_like?.type !== '0' ? "text-yellow-600" : ""}`} >Kutilmoqda</Tag>
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
        <A4FormatModal isModalOpen={open} setIsModalOpen={setOpen} data={file} />
      </div>
    </div>
  )
}

export default DocDecree;

// letter_create
// letter_delete
// letter_view
// letter_update
// letter_index