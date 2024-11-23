import { Tag } from "antd"
import { useTranslation } from "react-i18next";


const UserStatusTag = ({status}:{status: number | undefined | string}) => {

    const { t } = useTranslation();

    return status == 10 ? 
            <Tag color="green">{t("Active")}</Tag> 
            : status == 5 ?
             <Tag color="red">{t("Banned")}</Tag>
             : status == 0 ?
              <Tag color="#ffc069">{t("Pending")}</Tag>
              : status == 1 ?
               <Tag color="red">{t("Deleted")}</Tag> 
               : <span></span>
}
export  default UserStatusTag;