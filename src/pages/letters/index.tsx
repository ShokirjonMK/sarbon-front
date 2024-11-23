import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import useGetAllData from "hooks/useGetAllData";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import CustomPagination from "components/Pagination";
import { number_order } from "utils/number_orders";
import { Button, Popover, Switch, Table, Tag, message } from "antd";
import { ColumnsType } from "antd/es/table";
import { CreateBtn } from "components/Buttons";
import { useNavigate } from "react-router-dom";
import { FILE_URL } from "config/utils";
import { DocumentText24Regular, Send20Regular, Send24Regular } from "@fluentui/react-icons";
import Actions from "components/Actions";
import { useMutation } from "@tanstack/react-query";
import { Notification } from "utils/notification";
import { AxiosError } from "axios";
import { changeLetterStatus } from "./crud/request";
import checkPermission from "utils/check_permission";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import OpenFileByModal from "components/openFileByModal";

const Letters = () : JSX.Element =>  {

  const { t } = useTranslation();
  const [allData, setAllData] = useState<any[]>([]);
  const { urlValue, writeToUrl } = useUrlQueryParams({ currentPage: 1, perPage: 15 });
  const navigate = useNavigate();
  const [open, setOpen] = useState<any>()

  const { data, refetch, isLoading } = useGetAllData({
    queryKey: ["letters", urlValue.perPage, urlValue.currentPage, urlValue.filter_like?.sort, ...(Object.values(urlValue?.filter) ?? []), urlValue?.filter_like?.is_ok],
    url: `letters?sort=-id&expand=user,user.profile,description,documentWeight,importantLevel&filter=${JSON.stringify(urlValue.filter)}`,
    urlParams: { "per-page": urlValue.perPage, page: urlValue.currentPage, sort: urlValue.filter_like?.sort ?? "-id", filter: {is_ok: urlValue?.filter_like?.is_ok}},
    options: {
      onSuccess: (res) => {
        setAllData(res?.items);
      }
    }
  });

  const { mutate } = useMutation({
    mutationFn: (vals: {id: number, isTrue: any}) => changeLetterStatus({id: vals?.id, isTrue: vals?.isTrue}),
    onSuccess: async (res) => {
      refetch();
      Notification("success","update", res?.message)
    },
    onError: (error: AxiosError<any>) => {
      message.error(error?.response?.data?.message);
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
      title: t('Topshiriq muhimligi'),
      render: (i: string, e) => <span>{e?.importantLevel?.name}</span>,
    },
    {
      title: t('Topshiriq og\'irligi'),
      render: (i: string, e) => <span>{e?.documentWeight?.name}</span>,
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
      title: t('Tasdiqlash uchun jonatish'),
      render: (i, e) => e?.status !== 1 ? <Button disabled={!checkPermission("letter_update")} onClick={() => mutate({id: e?.id, isTrue: true})} loading={isLoading} className="flex items-center">
      <span className="text-[#000]">Xatni tasdiqlovchiga yuborish </span><Send20Regular className="ml-3 text-[#000]" />
    </Button> : <Tag className="py-1">Xat tasdiqlovchiga yuborildi!</Tag>,
    },
    {
      title: t('Status'),
      render: (i, e) => e?.is_ok === 1 ?
        <Tag color="success" className="py-1">Tasdiqlangan</Tag>
        : e?.is_ok === 2 ? <Popover content={e?.message} title={t("Description")}><Tag color="error" className="py-1">Bekor qilingan</Tag> </Popover>
          : e?.status === 1 ? <Tag color="warning" className="py-1">Kutilmoqda</Tag> : <Tag className="py-1">Yuborilmagan</Tag>,
    },
    {
      title: t("Actions"),
      width: 120,
      align: "center",
      render: (i, e) => <Actions
        id={e?.id}
        url={'letters'}
        refetch={refetch}
        onClickEdit={() => navigate(`/letters/update/${e?.id}`)}
        onClickView={() => navigate(`/letters/view/${e?.id}`)}
        viewPermission={'letter_view'}
        editPermission={e?.status !== 1 ? "letter_update" : "none"}
        deletePermission={e?.status !== 1 ? "letter_delete" : "none"}
      />,
    },
  ], [data?.items]);

  return (
    <div>
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: '/' },
          { name: "Xatlar", path: '/come-letters' }
        ]}
        title={t("Xatlar")}
        btn={
          <CreateBtn className="ml-auto" onClick={() => {navigate("/letters/create")}} permission={"letter_create"} text={"Create"} />
        }
      />

      <div className="p-4">
        <Tag color={urlValue?.filter_like?.is_ok == undefined ? "blue" : ""} onClick={() => writeToUrl({name: "is_ok", value: undefined})} className="cursor-pointer text-[14px] py-[2px] px-2" >Hammasi</Tag>
        <Tag color={urlValue?.filter_like?.is_ok === '1' ? "blue" : ""} onClick={() => writeToUrl({name: "is_ok", value: 1})} className="cursor-pointer text-[14px] py-[2px] px-2" >Tasdiqlangan</Tag>
        <Tag color={urlValue?.filter_like?.is_ok === '2' ? "blue" : ""} onClick={() => writeToUrl({name: "is_ok", value: 2})} className="cursor-pointer text-[14px] py-[2px] px-2" >Tasdiqlanmagan</Tag>
        <Tag color={urlValue?.filter_like?.is_ok === '0' ? "blue" : ""} onClick={() => writeToUrl({name: "is_ok", value: "0"})} className="cursor-pointer text-[14px] py-[2px] px-2" >Kutilyotgan</Tag>

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

export default Letters;

// letter_create
// letter_delete
// letter_view
// letter_update
// letter_index