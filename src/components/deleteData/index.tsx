import { Button, Modal, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import checkPermission from "utils/check_permission";
import { DeleteRegular } from '@fluentui/react-icons'
import { ReactNode, useState } from "react";
import { delete_data } from "services";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

type TypeDeleteData = {
  children: ReactNode,
  id: number | string,
  url: string,
  permission: string,
  refetch: any,
  className?: string,
  placement?: "left" | "right" | "top" | "bottom",
  navigateUrl?: string,
  data?: any,
  refetchSecond?: any,
}

const DeleteData: React.FC<TypeDeleteData> = ({ permission, children, className, url, id, refetch, placement, navigateUrl, data, refetchSecond }) => {
  const { t } = useTranslation();
  const navigate = useNavigate()
  const [visible, setVisible] = useState<boolean>(false);

  const { mutate, isLoading } = useMutation({
    mutationFn: () => delete_data(url, id, data),
    onSuccess: () => {
      setVisible(false);
      if (navigateUrl) {
        navigate(navigateUrl)
        // if(refetch) refetch();
      } else {
        refetch();
        if(refetchSecond) refetchSecond()
      }      
    }
  });

  return (
    <>
      {checkPermission(permission) ?
        <Tooltip placement={placement ?? "topLeft"} title={t("Delete")}>
          <span onClick={() => setVisible(true)} className={className ?? "flex-center"}>
            {children}
          </span>
        </Tooltip> : null}
      <Modal
        open={visible}
        footer={null}
        title={null}
        closable={false}
        centered
        width={416}
      >
        <div className="flex">
          <div className="me-[20px]" ><DeleteRegular color="#FF4D4F" fontSize={24} display={"inline-block"} /></div>
          <div className="" >
            <h5 className="text-[16px] font-medium" >{t("Do you want to delete information?")}</h5>
            <span className="text-[14px] font-light opacity-75" >{t("Once the data is deleted, it cannot be recovered.")}</span>
          </div>
        </div>
        <div className="flex flex-end justify-end mt-[24px]">
          <Button className="me-2" onClick={() => setVisible(false)} >{t("No")}</Button>
          <Button type="primary" danger loading={isLoading} onClick={() => mutate()} >{t("Yes")}</Button>
        </div>
      </Modal>
    </>
  )
}

export default DeleteData;