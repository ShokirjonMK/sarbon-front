import { Badge, Button, Drawer, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import useGetOneData from "hooks/useGetOneData";
import { globalConstants } from "config/constants";
import UpdatedBy from "components/UpdatedBy";
import { IEduYear } from "models/education";
import { TitleModal } from "components/Titles";
import { IoClose } from "react-icons/io5";
import { TypeSimpleViewModalProps } from "pages/common/types";
import checkPermission from "utils/check_permission";
import DeleteData from "components/deleteData";

const ViewData = ({
    visible,
    setVisible,
    id,
    url,
    title,
    refetch,
    setEditVisible,
    permissions,
}: TypeSimpleViewModalProps) => {

    const { t } = useTranslation();

    const { data } = useGetOneData<IEduYear>({
        queryKey: ["edu-years", id],
        url: `edu-years/${id}?expand=createdBy,updatedBy`,
        options: {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: (visible && !!id),
        }
    })

    return (
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
                            <DeleteData className="inline" permission={permissions.delete_} id={id ?? 0} url={url} refetch={refetch} placement="top" ><Button danger className="mr-2" >{t("Delete")}</Button></DeleteData>
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
            <div className="flex my-3">
                <p className="opacity-60">{t("Name")}:</p>
                <p className="ml-4">{data?.data?.name}</p>
            </div>
            <div className="flex my-3">
                <p className="opacity-60">{t("Type")}:</p>
                <p className="ml-4">{data?.data?.type}</p>
            </div>
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
        </Drawer>
    )
}

export default ViewData