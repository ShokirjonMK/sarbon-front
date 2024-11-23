import { Button, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import {
  Eye16Filled,
  Edit16Filled,
  Delete16Filled,
} from "@fluentui/react-icons";
import checkPermission from "utils/check_permission";
import DeleteData from "components/deleteData";
import { IoEyeOutline, IoEyeSharp } from "react-icons/io5";
import { RiDeleteBinFill, RiEdit2Fill } from "react-icons/ri";

type TypeActions = {
  id: number;
  url: string;
  onClickView: () => void;
  onClickEdit: () => void;
  viewPermission: string;
  editPermission: string;
  deletePermission: string;
  refetch?: any;
  refetchSecond?: any;
};

const Actions: React.FC<TypeActions> = ({
  id,
  url,
  onClickView,
  onClickEdit,
  viewPermission,
  editPermission,
  deletePermission,
  refetch,
  refetchSecond,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="actions">
        {checkPermission(viewPermission) ? (
          <Tooltip placement="topLeft" title={t("View")}>
            <Button onClick={onClickView} className="flex items-center">
              <IoEyeSharp className="view" />
            </Button>
          </Tooltip>
        ) : null}
        {checkPermission(editPermission) ? (
          <Tooltip placement="topLeft" title={t("Edit")}>
            <Button onClick={onClickEdit} className="flex items-center">
              <RiEdit2Fill className="edit text-orange-400" />
            </Button>
          </Tooltip>
        ) : null}
        {checkPermission(deletePermission) ? (
          <Tooltip placement="left" title={t("Delete")}>
              <DeleteData
                permission={deletePermission}
                refetch={refetch}
                refetchSecond={refetchSecond}
                url={url}
                id={id}
              >
                <Button className="flex items-center">
                  <RiDeleteBinFill className="delete hover:cursor-pointer" />
                </Button>
              </DeleteData>
          </Tooltip>
        ) : null}
      </div>
    </>
  );
};

export default Actions;
