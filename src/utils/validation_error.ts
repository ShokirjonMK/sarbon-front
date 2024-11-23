import { FormInstance } from "antd"

export const validationErrors = (form: FormInstance, error_data: any) => {
    const obj:Array<{name: string, errors: Array<string>}> = []
    for (const key in error_data?.errors[0]) {
        obj.push({name: key, errors: [error_data?.errors[0][key]]})
    }    
    form.setFields(obj);
}
  