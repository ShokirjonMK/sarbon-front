import { FC, ReactNode } from "react";
import { Col, DatePicker, Form, FormInstance, Input, InputNumber, Switch, TimePicker } from "antd";
import { useTranslation } from "react-i18next";
import { generateAntdColSpan } from "utils/others_functions";
import FormUISelect from "./formUISelect";
import InputMask from 'react-input-mask';

const { Item } = Form;

export type TypeFormUIBuilder<T = any> = {
  name: string;
  label?: string;
  type: "input" | "select" | "multiselect" | "switch" | "number" | "textarea" | "date" | "time" | "phone" | "password";
  required?: boolean;
  url?: string;
  query_key?: any[] | string,
  span?: { xs?: number, sm?: number, md?: number, lg?: number, xl?: number, xxl?: number } | number,
  max?: number,
  row?: number,
  maxLength?: number;
  parent_name?: string,
  child_names?: string[],
  readonly?: boolean,
  disabled?: boolean
  child_keys?: string[],
  data?: { id: number | string, name: string }[],
  expand?: string | undefined,
  filter?: {[key: string]: string | number | undefined | Array<string | number>},
  is_expand_id?: boolean | undefined,
  second_parent?: string,
  render?: (e: T) => ReactNode,
  onchange?: (e: any, obj?: any) => any
}

const FormUIBuilder: FC<{ data: TypeFormUIBuilder[], form: FormInstance<any>, load?: boolean }> = ({ data, form, load = true }): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      {
        data?.map((form_item, i) => (
          <Col {...generateAntdColSpan(form_item.span)} key={i} >
            <Item
              name={form_item.name}
              label={form_item.label ? t(form_item.label) : undefined}
              rules={[{ required: form_item.required, message: `Please input ${form_item?.label?.toLowerCase()} !` }]}
              shouldUpdate
              valuePropName={form_item.type === "switch" ? "checked" : undefined}
            >
              {
                form_item.type === "input" ?
                  <Input maxLength={form_item?.maxLength} onChange={(e) => { form_item?.onchange && form_item?.onchange(e) }} readOnly={form_item?.readonly} disabled={form_item?.disabled} className="w-[100%]" placeholder={t(`Enter ${form_item?.label?.toLowerCase()}`) + " ..."} />
                  : form_item.type === "number" ?
                    <InputNumber onChange={(e) => { form_item?.onchange && form_item?.onchange(e) }} disabled={form_item?.disabled} readOnly={form_item?.readonly} min={0} max={form_item?.max} className="w-[100%]" placeholder={t(`Enter ${form_item?.label?.toLowerCase()}`) + " ..."} />
                    : form_item.type === "textarea" ?
                      <Input.TextArea maxLength={form_item?.maxLength} onChange={(e) => { form_item?.onchange && form_item?.onchange(e) }} disabled={form_item?.disabled} rows={form_item?.row ?? 1} readOnly={form_item?.readonly} className="w-[100%]" placeholder={t(`Enter ${form_item?.label?.toLowerCase()}`) + " ..."} />
                      : form_item.type === "switch" ?
                        <Switch onChange={(e) => { form_item?.onchange && form_item?.onchange(e) }} disabled={form_item?.disabled} checkedChildren={form_item.name === "status" ? "Active" : "Ha"} unCheckedChildren={form_item.name === "status" ? "InActive" : "Yo'q"} />
                        : form_item.type === "date" ?
                          <DatePicker onChange={(e) => { form_item?.onchange && form_item?.onchange(e) }} disabled={form_item?.disabled} className="w-[100%]" />
                          : form_item.type === "time" ?
                            <TimePicker onChange={(e) => { form_item?.onchange && form_item?.onchange(e) }} disabled={form_item?.disabled} format={"HH:mm:ss"} className="w-[100%]" />
                            : form_item.type === "phone" ?
                              <InputMask onChange={(e) => { form_item?.onchange && form_item?.onchange(e) }} mask="+\9\98 (99) 999-99-99" className='input-mask' placeholder='+998 (__) ___-__-__' />
                              : form_item.type === "password" ?
                                <Input.Password onChange={(e) => { form_item?.onchange && form_item?.onchange(e) }} autoComplete={`new-password`} />
                                : form_item.type === "select" ?
                                  <FormUISelect {...form_item} form={form} load={load} />
                                  : form_item.type === "multiselect" ?
                                    <FormUISelect {...form_item} form={form} load={load} multiselect={true} />
                                    : null
              }
            </Item>
          </Col>
        ))
      }
    </>
  )
}

export default FormUIBuilder;