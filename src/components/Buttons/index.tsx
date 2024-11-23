import { AddFilled, ArrowDownloadFilled, ArrowUploadFilled, TableRegular } from "@fluentui/react-icons";
import { Button } from "antd";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import checkPermission from "utils/check_permission";

export const CreateBtn: FC<{ onClick: React.MouseEventHandler<HTMLAnchorElement> & React.MouseEventHandler<HTMLButtonElement>, permission: string, className?: string, text?: string }> = ({ onClick, permission, className, text }): JSX.Element => {
  const { t } = useTranslation();

  return (
    checkPermission(permission) ? (
      <Button
        type="primary"
        onClick={onClick}
        className={`${className} rounded-[8px] flex-center`}
      >
        <AddFilled fontSize={13} className="me-2 " />
        {t(text ?? "Create")}
      </Button>
    ) : <></>
  )
}

export const ExcelBtn: FC<{ onClick: any, text?: string, loading?: boolean }> = ({ onClick, text, loading = false }): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Button
      color="#52C41A"
      // icon={<TableRegular fontSize={16} color="#52C41A" />}
      icon={<ArrowDownloadFilled fontSize={16} color="#52C41A" />}
      className="d-f text-[#52C41A] border-[#52C41A]"
      onClick={onClick}
      loading={loading}
    >
      &nbsp;&nbsp;{ text ?? "Export excel"}
    </Button>
  )
}

export const ExcelImportBtn: FC<{ onClick: any, text?: string }> = ({ onClick, text }): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Button
      color="#52C41A"
      icon={<ArrowUploadFilled fontSize={16} color="#52C41A" />}
      className="d-f text-[#52C41A] border-[#52C41A]"
      onClick={onClick}
    >
      &nbsp;&nbsp;{ text ?? "Export import"}
    </Button>
  )
}