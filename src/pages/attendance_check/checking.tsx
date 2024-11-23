import { useMutation } from "@tanstack/react-query";
import { Badge, Button, message } from "antd";
import { checkStatus } from "./request";
import { Notification } from "utils/notification";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IStudentAttendReason } from "models/student";

const CheckingReference = ({selectedItem, refetch}: { selectedItem: IStudentAttendReason | undefined, refetch: any }) => {

    const { t } = useTranslation();
    const [type, settype] = useState<1 | 2>();
    
    const { mutate, isLoading } = useMutation({
        mutationFn: () => checkStatus(selectedItem?.id, type),
        onSuccess: async (res) => {
          Notification("success", selectedItem?.id ? "update" : "create", res?.message)
          refetch()
        },
        onError: (error: any) => {            
            message.error(error?.response?.data?.errors[0])
        },
        retry: 0, 
    });

    return(
        <div className="flex justify-center">
            {
                selectedItem?.is_confirmed === 1 ? <Badge color='#52c41a' count={t("Confirmed")} />
                : selectedItem?.is_confirmed === 2 ? <Badge count={t("Canceled")} />
                : selectedItem?.is_confirmed === 0 ?
                <>
                    <Button onClick={() => {mutate(); settype(2)}} loading={isLoading} className="px-2 text-[13px]" danger >{t("Cancellation")}</Button>
                    <Button onClick={() => {mutate(); settype(1)}} loading={isLoading} className="px-2 text-[13px] ml-2">{t("Confirmation")}</Button>
                </> : ""
            }
        </div>
    )
}
export default CheckingReference;