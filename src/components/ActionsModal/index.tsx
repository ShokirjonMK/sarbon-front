import { Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import checkPermission from "utils/check_permission";
import {
  Eye16Filled,
  Edit16Filled,
  Delete16Filled,
} from "@fluentui/react-icons";
import DeleteData from "components/deleteData";

type TypeActionsModal = {
  id: number;
  url: string;
  setId: React.Dispatch<React.SetStateAction<number | undefined>>;
  setVisibleView: React.Dispatch<React.SetStateAction<boolean>>;
  setVisibleEdit: React.Dispatch<React.SetStateAction<boolean>>;
  viewPermission: string;
  editPermission: string;
  deletePermission: string;
  refetch?: any;
};

const ActionsModal: React.FC<TypeActionsModal> = ({
  id,
  url,
  setId,
  setVisibleView,
  setVisibleEdit,
  viewPermission,
  editPermission,
  deletePermission,
  refetch,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="actions">
        {checkPermission(viewPermission) ? (
          <Tooltip placement="topLeft" title={t("View")}>
            <Eye16Filled
              className="view text-[#595959]"
              onClick={() => {
                setVisibleView(true);
                setId(id);
              }}
            />
          </Tooltip>
        ) : null}
        {checkPermission(editPermission) ? (
          <Tooltip placement="topLeft" title={t("Edit")}>
            <Edit16Filled
              className="edit text-[#595959]"
              onClick={() => {
                setVisibleEdit(true);
                setId(id);
              }}
            />
          </Tooltip>
        ) : null}
        <DeleteData
          permission={deletePermission}
          refetch={refetch}
          url={url}
          id={id}
        >
          <Delete16Filled className="delete text-[#595959]" />
        </DeleteData>
      </div>
    </>
  );
};

export default ActionsModal;
