import { Badge, Tag } from "antd"
import { useTranslation } from "react-i18next";


const StatusTag = ({status}:{status: number | undefined}) => {
    const { t } = useTranslation();

    return status === 1 ? <Tag color="green">{t("Active")}</Tag> : <Tag color="red">{t("InActive")}</Tag>
}
export  default StatusTag;

export const StatusBadge: React.FC<{status: number | undefined}> = ({status}): JSX.Element => {
    const { t } = useTranslation();

    return <Badge
          color={status === 1 ? "green" : "red"}
          text={status === 1 ? t("Active") : t("InActive")}
        />
    // return status === 1 ? <Tag color="#52C41A" className="rounded-lg">{t("Active")}</Tag> : <Tag color="#F5222D" className="rounded-lg">{t("InActive")}</Tag>
}