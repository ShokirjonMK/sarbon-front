import React, { ReactNode, useMemo, useState } from "react";
import { IDepartment } from "models/edu_structure";
import { Tree } from "antd";
import Actions from "components/Actions";
import { useNavigate } from "react-router-dom";

type TypeTree = {
  key: number,
  title: ReactNode,
  children?: TypeTree[]
}

type TypeTreeDepartment = {
  data: IDepartment[],
  refetch: any,
  setId: React.Dispatch<React.SetStateAction<number | undefined>>;
  setVisibleEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

const TreeDepartment: React.FC<TypeTreeDepartment> = ({ data, refetch, setVisibleEdit, setId }): JSX.Element => {
  const navigate = useNavigate()
  const [hover, setHover] = useState<number | string>();

  const BuildTree = (arr: IDepartment[], node: IDepartment): TypeTree => {
    const children: any = [];
    let object: TypeTree;

    arr.forEach(child => {
      if (child.parent?.id === node.id) {
        children.push(BuildTree(arr, child));
      }
    });

    object = {
      key: node.id,
      title: <div className="flex">
        <span className="mr-4">{node.name}</span>
        {hover === node.id ? (
          <Actions
            id={node.id}
            url={"departments"}
            refetch={refetch}
            onClickView={() => navigate(`/structural-unit/department/view/${node.id}`)}
            onClickEdit={() => { setId(node.id); setVisibleEdit(true)}}
            viewPermission={"department_view"}
            editPermission={"department_update"}
            deletePermission={"department_delete"}
          />
        ) : null}
      </div>,
      children
    }

    return object;
  }

  const _treeData = useMemo(() => {
    const tree: TypeTree[] = [];
    data.forEach(node => {
      if (node.parent == null) {
        tree.push(BuildTree(data, node));
      }
    })

    return tree;
  }, [hover, data])

  return (
    <Tree
      treeData={_treeData}
      blockNode
      defaultExpandAll
      onMouseEnter={(e) => setHover(e?.node?.key)}
      onMouseLeave={(e) => setHover(0)}
    />

  );
};

export default TreeDepartment;
