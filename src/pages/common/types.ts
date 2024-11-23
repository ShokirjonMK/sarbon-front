import { ColumnProps } from "antd/es/table";
import { TypeFilterSelect } from "components/FilterSelect";
import { TypeFormUIBuilder } from "components/FormUIBuilder";

export type TypeFormUIData = TypeFormUIBuilder & {
  label: string,
  disabledTable?: boolean,
  onlyTable?: boolean,
  expand_name?: string,
  render?: ColumnProps<any>["render"],
}

export type TypeSimpleIndexPageProps = {
  queryKey?: string,
  url: string,
  indexTitle: string,
  createTitle: string,
  editTitle: string,
  viewTitle: string,
  permissions: {
    view_: string,
    delete_: string,
    update_: string,
    create_: string
  },
  onEdit?: (id: number) => void,
  onView?: (id: number) => void,
  onCreate?: () => void,
  search?: boolean,
  isMain?: boolean,
  formUIData?: TypeFormUIData[],
  selectData?: TypeFilterSelect[],
}

export type TypeSimpleViewModalProps = {
  visible: boolean,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>,
  setEditVisible: React.Dispatch<React.SetStateAction<boolean>>,
  url: string,
  id: number | undefined,
  title: string,
  permissions: {
    delete_: string,
    update_: string,
  },
  refetch: any,
  formUIData?: TypeFormUIData[],
}

export type TypeSimpleUpdateModalProps = {
  url: string,
  id: number,
  visible: boolean,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>,
  refetch: Function,
  title: string,
  formUIData?: TypeFormUIData[],
}

export type TypeSimpleCreateModalProps = {
  url: string,
  visible: boolean,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>,
  refetch: Function,
  title: string
  formUIData?: TypeFormUIData[],
}