import { useRef, useState } from "react";

export declare type InternalNamePath = (string | number)[];
export declare type NamePath = string | number | InternalNamePath;
export declare type StoreValue = any;
// export declare type Store = Record<string, StoreValue>;
export interface Meta {
    touched: boolean;
    validating: boolean;
    errors: string[];
    warnings: string[];
    name: InternalNamePath;
}
export interface InternalFieldData extends Meta {
    value: StoreValue;
}
export interface FieldData extends Partial<Omit<InternalFieldData, 'name'>> {
  name: NamePath;
}
declare type RecursivePartial<T> = T extends object ? {
  [P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[] : T[P] extends object ? RecursivePartial<T[P]> : T[P];
} : any;
// export declare type ValidateFields<Values = any> = (nameList?: NamePath[]) => Promise<Values>;
// export interface FieldError {
//   name: InternalNamePath;
//   errors: string[];
//   warnings: string[];
// }

export interface FormInstance<Values = any> {
  ref: any
  getFieldValue: (name: NamePath) => StoreValue;
  getFieldsValue: (nameList?: NamePath[]) => Values;
  // getFieldError: (name: NamePath) => string[];
  // getFieldsError: (nameList?: NamePath[]) => FieldError[];
  // isFieldTouched: (name: NamePath) => boolean;
  // isFieldValidating: (name: NamePath) => boolean;
  // isFieldsValidating: (nameList: NamePath[]) => boolean;
  resetFields: (fields?: NamePath[]) => void;
  // setFields: (fields: FieldData[]) => void;
  setFieldsValue: (values: RecursivePartial<Values>) => void;
  // submit: () => void;
}

const useForm = () => {

  const ref: any = useRef(null);

  const getFieldsValue = (nameList?: NamePath[]) => {
    let obj = {};
    if(nameList && nameList.length){
      [...ref.current.elements].forEach(element => {
        if(nameList.includes(element.name))
          obj = { ...obj, [element.name]: element.value ?? undefined }
      });
    } else {
      [...ref.current.elements].forEach(element => {
        obj = { ...obj, [element.name]: element.value ?? undefined }
      });
    }
    return obj
  };

  const getFieldValue = (name: NamePath) => [...ref.current.elements].find(element => element.name === name )?.value;

  const resetFields = (fields?: NamePath[]) => {
    if(fields && fields.length){
      [...ref.current.elements].forEach(element => {
        if(fields.includes(element?.name))
          element!.value = null;
      })
    } else ref.current.reset()
  }

  const setFieldsValue = (values: RecursivePartial<any>) => {
    if(values){
      [...ref.current.elements].forEach(element => {
        if(values[element?.name])
          element!.value = values[element?.name];
      })
    }
  }


  const form: FormInstance = { ref, getFieldsValue, getFieldValue, resetFields, setFieldsValue }
  return form
}

export default useForm;