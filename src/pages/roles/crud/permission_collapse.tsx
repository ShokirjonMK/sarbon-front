import { Checkbox, Collapse } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { IPermission } from "models/role_permissions";
import { useState, useEffect, Dispatch } from "react";
import { useTranslation } from "react-i18next";
import type { CheckboxValueType } from 'antd/es/checkbox/Group';


const CheckboxGroup = Checkbox.Group;

type IPermissionItem = Array<{name: string, title: string}>
export type IPermissionNewType = { [key: string]: IPermissionItem }

const PermissionCollapse = ({ permissions, setcheckedPermissions, defaultVals, type }: { permissions: any | undefined, setcheckedPermissions: Dispatch<string[]>, defaultVals:any, type: "view" | "update" }) => {

  const [selectedPermissions, setselectedPermissions] = useState<IPermissionNewType>({});
  const [allPermissions, setallPermissions] = useState<IPermissionNewType>({});
  const { t } = useTranslation()  

  useEffect(() => {
    const obj:IPermissionNewType = {}
    if(permissions?.length){
        for (const item of permissions) {
            obj[item?.category] = item?.permissions
        }
        setallPermissions(obj)
    }
  }, [permissions?.length])

  useEffect(() => {
    const arr: string[] = []
    for (const index in selectedPermissions) {
      for (const item of selectedPermissions[index]) {
        arr.push(item?.name)
      }
    }
    setcheckedPermissions(arr);
  }, [selectedPermissions])

  useEffect(() => {
    const obj: IPermissionNewType = {}    
    if(defaultVals && defaultVals?.length) {
      for (const item of defaultVals) {
        if(obj[item?.category]?.length){
          obj[item?.category]?.push({name: item?.name, title: item?.pretty_name})
        } else {
          obj[item?.category] = [{name: item?.name, title: item?.pretty_name}];
        }
      }
    }
    setselectedPermissions(obj)
  }, [defaultVals])

  const onChange = (list: CheckboxValueType[], item: IPermission, key: string) => {
    setselectedPermissions({
      ...selectedPermissions,
      [key]: item?.permissions?.filter(i => list?.includes(i?.name)),
    });    
  };

  const onCheckAllChangeByCategory = ( e: CheckboxChangeEvent, list: IPermissionItem, key: string ) => {
    setselectedPermissions({
      ...selectedPermissions,
      [key]: e.target.checked ? list : [],
    });
    
  };

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setselectedPermissions(e.target.checked ? allPermissions : {});
  }

  const checkboxValue = (name: string) => {
    const title = name?.split("_")[1]?.replaceAll("-", " ")
    //@ts-ignore
    return {label: title?.length ? `${title[0]?.toUpperCase()}${title?.slice(1)}` : "", value: name}
  }

  return (
    <>
      <div className="mb-3 mt-5">
        {
          type === "update" ? 
          <Checkbox
            onClick={(e) => e.stopPropagation()}
            indeterminate={!!Object.keys(selectedPermissions)?.length && Object.keys(selectedPermissions)?.length < Object.keys(allPermissions)?.length }
            onChange={(e) => onCheckAllChange(e)}
            checked={Object.keys(selectedPermissions)?.length === Object.keys(allPermissions)?.length}
          ><h3 className="mr-4">{t("Check all")}</h3></Checkbox> : ""
        }
      </div>
        <Collapse defaultActiveKey={[1]} className={type === "update"  ? "mb-[70px]" : "mb-5"}>
          {(permissions?.length ? permissions : [])?.map((item: IPermission, index: number) => (
            type === "view" ? 
              selectedPermissions[item?.category]?.length > 0 ?
                <Collapse.Panel
                  header={item?.category}
                  key={index + 1}
                >
                  <div className="pl-[28px] bg-transparent">
                    <CheckboxGroup
                      options={ item?.permissions?.map((per) => (checkboxValue(per?.name)))}
                      value={selectedPermissions[item?.category]?.map(i => i?.name)}
                      onChange={(e) => onChange(e, item, item?.category)}
                      disabled={type === "view"}
                    />
                  </div>
                </Collapse.Panel>
                : ""
             :
             <Collapse.Panel
              header={
               <>
                 <Checkbox
                   onClick={(e) => e.stopPropagation()}
                   indeterminate={
                     !!selectedPermissions[item?.category]?.length &&
                     selectedPermissions[item?.category]?.length <
                       item?.permissions?.length
                   }
                   onChange={(e) => onCheckAllChangeByCategory(e, item?.permissions, item?.category)}
                   checked={selectedPermissions[item?.category]?.length === item?.permissions?.length}
                   className="mr-[12px] ml-[4px]"
                 ></Checkbox>
                 {item?.category}
               </>
             }
             key={index + 1}
           >
             <div className="pl-[56px]">
              <CheckboxGroup
                options={item?.permissions?.length ? item?.permissions?.map((per) => (checkboxValue(per?.name))) : []}
                value={selectedPermissions[item?.category]?.map(i => i?.name)}
                onChange={(e) => onChange(e, item, item?.category)}
              />
             </div>
              </Collapse.Panel>
          ))}
        </Collapse>
    </>
  );
};
export default PermissionCollapse;
