import { FC } from "react";
import { Badge, Button, Drawer, Spin, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import useGetOneData from "hooks/useGetOneData";
import { TitleModal } from "components/Titles";
import { globalConstants } from "config/constants";
import { TypeSimpleViewModalProps } from "../types";
import UpdatedBy from "components/UpdatedBy";
import { expandData } from "../utils";
import { IoClose } from "react-icons/io5";
import checkPermission from "utils/check_permission";
import { useMutation } from "@tanstack/react-query";
import { delete_data } from "services";
import DeleteData from "components/deleteData";


const SimpleViewModal: FC<TypeSimpleViewModalProps> = ({
  visible,
  setVisible,
  id,
  url,
  title,
  refetch,
  setEditVisible,
  permissions,
  formUIData,
}): JSX.Element => {
  const { t } = useTranslation();


  const { data, isFetching } = useGetOneData<any>({
    queryKey: [url, id],
    url: `${url}/${id}?expand=createdBy,updatedBy,description${expandData(
      formUIData
    )}`,
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: visible && !!id,
    },
  });

  const { mutate } = useMutation({
    mutationFn: () => delete_data(`${url}`, data?.data?.id),
    onSuccess: () => {
      setVisible(p => !p)
      refetch()
    },
  });

  return (
    <>
      <Drawer
        title={
          <div className="flex items-center justify-between">
            <TitleModal>{title}</TitleModal>
            <IoClose
              onClick={() => setVisible(false)}
              className="text-[24px] cursor-pointer text-[#00000073]"
            />
          </div>
        }
        open={visible}
        onClose={() => setVisible(false)}
        closable={false}
        footer={
          <div className="text-end">
            {checkPermission(permissions.delete_) ? (
              <Tooltip placement="left" title={t("Delete")}>
                <DeleteData className="inline" permission={permissions.delete_} id={id ?? 0} url={url} refetch={refetch} placement="top"><Button danger className="mr-2">{t("Delete")}</Button></DeleteData>
              </Tooltip>
            ) : null}
            {checkPermission(permissions.update_) ?
              <Button onClick={() => { setVisible(false); setEditVisible(true) }}>{t('Edit')}</Button> : null
            }
          </div>
        }
        placement="right"
        width={globalConstants.antdDrawerWidth}
        headerStyle={{ backgroundColor: "#F7F7F7" }}
        footerStyle={{ boxShadow: 'inset 0px 1px 0px #F0F0F0' }}
      >
        <Spin spinning={isFetching}>
          <div className="flex my-3">
            <p className="opacity-60">{t("Name")}:</p>
            <p className="ml-4">{data?.data?.name}</p>
          </div>
          <div className="flex my-3">
            <p className="opacity-60">{t("Description")}:</p>
            <p className="ml-4">{data?.data?.description}</p>
          </div>
          {formUIData?.map((e, idx) => {
            if (e?.type === "select")
              return (
                <div className="flex my-3" key={idx}>
                  <p className="opacity-60">{t(e?.label)}:</p>
                  <p className="ml-4">
                    {data?.data
                      ? data?.data[e?.expand_name ?? e.name.split("_id")[0]]?.name
                      : null}
                  </p>
                </div>
              );
            return (
              <div className="flex" key={idx}>
                <p className="opacity-60">{t(e?.label)}:</p>
                <p className="ml-4">{data?.data ? data?.data[e.name] : null}</p>
              </div>
            );
          })}
          <div className="flex my-3">
            <p className="opacity-60">{t("Status")} :</p>
            <p className="ml-4">
              <Badge
                status={data?.data?.status === 1 ? "success" : "error"}
                text={data?.data?.status === 1 ? t("Active") : t("InActive")}
              />{" "}
            </p>
          </div>
          <UpdatedBy data={data?.data} />
        </Spin>
      </Drawer>
    </>
  );
};

export default SimpleViewModal;
