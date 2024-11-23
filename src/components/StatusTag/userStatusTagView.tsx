import { Badge } from "antd"
import { useTranslation } from "react-i18next";


const UserStatusBadge = ({ status }:{ status: number | undefined | string }) => {

    const { t } = useTranslation();

    return status == 10 ? 
            <Badge color="#52C41A" text={t("Active")} /> 
            : status == 5 ?
             <Badge color="#F5222D" text={t("Banned")} />
             : status == 0 ?
              <Badge color="#ffc069" text={t("Pending")} />
              : status == 1 ?
               <Badge color="#F5222D" text={t("Deleted")}  />
               : <span></span>
}
export  default UserStatusBadge;