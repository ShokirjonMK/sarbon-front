import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useGetAllData from "hooks/useGetAllData";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import CustomPagination from "components/Pagination";
import { number_order } from "utils/number_orders";
import { Button, Table, Tag, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { FILE_URL } from "config/utils";
import { DocumentText24Regular, Eye16Filled } from "@fluentui/react-icons";
import Actions from "components/Actions";
import dayjs from "dayjs";
import A4FormatModal from "components/A4FormatModal";
import { ILetterOutgoing } from "models/document";

const LetterSigning = () : JSX.Element => {

  const { t } = useTranslation();
  const [allData, setAllData] = useState<any[]>([]);
  const { urlValue, writeToUrl } = useUrlQueryParams({ currentPage: 1, perPage: 15 });
  const navigate = useNavigate()
  const [descVal, setDescVal] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false)
  const [file, setFile] = useState<ILetterOutgoing>();

  const { data, refetch, isLoading } = useGetAllData<ILetterOutgoing>({
    queryKey: ["letter-outgoings", urlValue.perPage, urlValue.currentPage, ...(Object.values(urlValue?.filter) ?? []), {status: [1, 2]}, urlValue?.filter_like?.is_ok],
    url: `letter-outgoings?sort=-id&expand=user,user.profile,description,createdBy,files,qrCode.createdBy,letterOutgoingBody,body&filter=${JSON.stringify(urlValue.filter)}`,
    urlParams: { "per-page": urlValue.perPage, page: urlValue.currentPage, sort: "-id", filter: {status: [1, 2], is_ok: urlValue?.filter_like?.is_ok}},
    options: {
      onSuccess: (res) => {
        setAllData(res?.items);
      }
    }
  });

  useEffect(() => {
    if(!open) setFile(undefined);
  }, [open]);

  const columns: ColumnsType<any> = React.useMemo(() => [
    {
      title: '№',
      width: 45,
      showSorterTooltip: false,
      sorter: () => { writeToUrl({ name: "sort", value: urlValue?.filter_like?.sort === "-id" ? "id" : "-id" }); return 0 },
      render: (_, __, i) => number_order(urlValue.currentPage, urlValue.perPage, Number(i), isLoading),
    },
    {
      title: t('Yaratilgan sana'),
      render: (i: string, e) => dayjs(e?.updated_at*1000).format("YYYY.MM.DD HH:mm:ss"),
    },
    {
      title: t('Topshiriq maznuni'),
      render: (i: string, e) => <span>{e?.description}</span>,
    },
    {
      title: t('Topshiriq file'),
      render: (e: any) => e?.body ? <DocumentText24Regular color='blue' cursor="pointer" onClick={() => {setFile(e); setOpen(true)}} /> : <Tag color="red" className='border-0' >File yuklanmagan</Tag>
    },
    {
      title: t('Status'),
      align: "center",
      render: (e: any) => {
        return e?.is_ok === 1 ? <Tag color="success" className="py-1 text-sm">Imzolangan</Tag>
        : e?.is_ok === 2 ? <div className="d-f gap-1" ><Tag color="error" className="py-1 text-sm">Qaytarilgan</Tag><Tooltip title={e?.message ?? ""}>
        <Button size="small" className="d-f" ><Eye16Filled/></Button>
      </Tooltip></div>
        : <Tag color="warning" className="py-1 text-sm">Kutilayotgan</Tag>
      }
    },
    {
      title: t("Actions"),
      width: 120,
      align: "center",
      render: (i, e) => <Actions
        id={e?.id}
        url={'letter-outgoings'}
        refetch={refetch}
        onClickEdit={() => {}}
        onClickView={() => navigate(`/document-sign/letters/${e?.id}`)}
        viewPermission={'letter-outgoing_view'}
        editPermission={"none"}
        deletePermission={"none"}
      />,
    },
  ], [data?.items, descVal]);

  return (
    <div>
      <Tag color={urlValue?.filter_like?.is_ok == undefined ? "blue" : ""} onClick={() => writeToUrl({name: "is_ok", value: undefined})} className="cursor-pointer text-[14px] py-[2px] px-2" >Hammasi</Tag>
      <Tag color={urlValue?.filter_like?.is_ok === '1' ? "blue" : ""} onClick={() => writeToUrl({name: "is_ok", value: 1})} className={`cursor-pointer text-[14px] py-[2px] px-2 ${urlValue?.filter_like?.is_ok !== '1' ? "text-green-500" : ""}`} >Imzolangan</Tag>
      <Tag color={urlValue?.filter_like?.is_ok === '2' ? "blue" : ""} onClick={() => writeToUrl({name: "is_ok", value: 2})} className={`cursor-pointer text-[14px] py-[2px] px-2 ${urlValue?.filter_like?.is_ok !== '2' ? "text-red-600" : ""}`} >Qaytarilgan</Tag>
      <Tag color={urlValue?.filter_like?.is_ok === '0' ? "blue" : ""} onClick={() => writeToUrl({name: "is_ok", value: "0"})} className={`cursor-pointer text-[14px] py-[2px] px-2 ${urlValue?.filter_like?.is_ok !== '0' ? "text-yellow-600" : ""}`} >Kutilayotgan</Tag>
      <div>
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

export default LetterSigning;

// letter-outgoing_create
// letter-outgoing_delete
// letter-outgoing_view
// letter-outgoing_update
// letter-outgoing_index
// letter-outgoing_is-ok

// 4073420014617421