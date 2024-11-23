import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import useGetAllData from "hooks/useGetAllData";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import CustomPagination from "components/Pagination";
import { number_order } from "utils/number_orders";
import { Button, Input, Popconfirm, Table, Tag, message } from "antd";
import { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { FILE_URL } from "config/utils";
import { DocumentText24Regular } from "@fluentui/react-icons";
import Actions from "components/Actions";
import { useMutation } from "@tanstack/react-query";
import { Notification } from "utils/notification";
import { AxiosError } from "axios";
import { changeLetterIsOk } from "./crud/request";
import dayjs from "dayjs";
import OpenFileByModal from "components/openFileByModal";

const LetterConfirmation = () : JSX.Element => {

  const { t } = useTranslation();
  const [allData, setAllData] = useState<any[]>([]);
  const { urlValue, writeToUrl } = useUrlQueryParams({ currentPage: 1, perPage: 15 });
  const navigate = useNavigate()
  const [descVal, setDescVal] = useState<string>("");
  const [open, setOpen] = useState<any>()

  const { data, refetch, isLoading } = useGetAllData({
    queryKey: ["letters", urlValue.perPage, urlValue.currentPage, urlValue.filter_like?.sort, ...(Object.values(urlValue?.filter) ?? []), {status: [1, 2]}, urlValue?.filter_like?.is_ok],
    url: `letters?sort=-id&expand=user,user.profile,description,documentWeight,importantLevel,createdBy&filter=${JSON.stringify(urlValue.filter)}`,
    urlParams: { "per-page": urlValue.perPage, page: urlValue.currentPage, sort: urlValue.filter_like?.sort ?? "-id", filter: {status: [1, 2], is_ok: urlValue?.filter_like?.is_ok}},
    options: {
      onSuccess: (res) => {
        setAllData(res?.items);
      }
    }
  });

  const { mutate } = useMutation({
    mutationFn: (vals: {id: number, is_ok: 0 | 1 | 2, message?: string}) => changeLetterIsOk({id: vals?.id, is_ok: vals?.is_ok, message: vals?.message}),
    onSuccess: async (res) => {
      refetch();
      Notification("success","update", res?.message)
    },
    onError: (error: AxiosError<any>) => {
      message.error(error?.response?.data?.message);
    },
    retry: 0,
  });

  const cancelButton = (itemId: number) => {

    return <Popconfirm
        title="Bekor qilish sababi!"
        cancelText="Yopish"
        okText="Saqlash"
        onCancel={(event) => event?.stopPropagation()}
        icon={false}
        okButtonProps={{disabled: !descVal}}
        description={
          <div>
            <Input.TextArea onChange={(e) => setDescVal(e?.target?.value)} value={descVal} rows={4} className="w-[400px]" />
          </div>
        }
        onConfirm={(event) => {
          event?.stopPropagation();
          mutate({id: itemId, is_ok: 2, message: descVal})
        }}
    >
        <Button onClick={(event) => {setDescVal(""); event.stopPropagation()}} danger>Bekor qilish</Button>
    </Popconfirm>
  }

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
      render: (e: any) => e?.file ? <DocumentText24Regular color='blue' cursor="pointer" onClick={() => setOpen(e?.file)} /> : <Tag color="red" className='border-0' >File yuklanmagan</Tag>
    },
    {
      title: t('Status'),
      align: "center",
      render: (e: any) => {
        return e?.is_ok === 0 ? <>
            {cancelButton(e?.id)}
            <Button onClick={() => mutate({id: e?.id, is_ok: 1})} className="ml-2">Tasdiqlash</Button>
          </> : e?.is_ok === 1 ? <Tag color="success" className="py-1">Tasdiqlangan</Tag> : <Tag color="error" className="py-1">Bekor qilingan</Tag>
      }
    },
    {
      title: t("Actions"),
      width: 120,
      align: "center",
      render: (i, e) => <Actions
        id={e?.id}
        url={'letters'}
        refetch={refetch}
        onClickEdit={() => {}}
        onClickView={() => navigate(`/document-confirmations/letters/${e?.id}`)}
        viewPermission={'letter_view'}
        editPermission={"none"}
        deletePermission={"none"}
      />,
    },
  ], [data?.items, descVal]);

  return (
    <div>
      <Tag color={urlValue?.filter_like?.is_ok == undefined ? "blue" : ""} onClick={() => writeToUrl({name: "is_ok", value: undefined})} className="cursor-pointer text-[14px] py-[2px] px-2" >Hammasi</Tag>
      <Tag color={urlValue?.filter_like?.is_ok === '1' ? "blue" : ""} onClick={() => writeToUrl({name: "is_ok", value: 1})} className="cursor-pointer text-[14px] py-[2px] px-2" >Tasdiqlangan</Tag>
      <Tag color={urlValue?.filter_like?.is_ok === '2' ? "blue" : ""} onClick={() => writeToUrl({name: "is_ok", value: 2})} className="cursor-pointer text-[14px] py-[2px] px-2" >Tasdiqlanmagan</Tag>
      <Tag color={urlValue?.filter_like?.is_ok === '0' ? "blue" : ""} onClick={() => writeToUrl({name: "is_ok", value: "0"})} className="cursor-pointer text-[14px] py-[2px] px-2" >Kutilyotgan</Tag>
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
        <OpenFileByModal setVisible={setOpen} visible={open} file={open} width={"100%"} />
      </div>
    </div>
  )
}

export default LetterConfirmation;

// letter_create
// letter_delete
// letter_view
// letter_update
// letter_index