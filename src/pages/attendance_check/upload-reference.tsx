import { useMutation } from "@tanstack/react-query";
import { Button, DatePicker, Divider, Form, Input, Popover, Select, Spin, Tag, UploadFile } from "antd";
import FormUIBuilder from "components/FormUIBuilder";
import { TypeFormUIData } from "pages/common/types";
import { submitReasonAttend } from "./request";
import { AxiosError } from "axios";
import { validationErrors } from "utils/validation_error";
import { Notification } from "utils/notification";
import FileUploader from "components/fileUploader";
import { Dispatch, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IStudent, IStudentAttendReason } from "models/student";
import { renderFullName } from "utils/others_functions";
import useGetAllData from "hooks/useGetAllData";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import dayjs from "dayjs";
import { FILE_URL } from "config/utils";
const { RangePicker } = DatePicker;

const dateParserToDatePicker = (second: number) => dayjs(dayjs((new Date(Number(second)*1000))).format('YYYY-MM-DD HH:mm'), 'YYYY-MM-DD HH:mm')

const UploadingReference = ({selectedItem, refetch, setselectedItem}: { selectedItem: IStudentAttendReason | undefined, refetch: any, setselectedItem: Dispatch<IStudentAttendReason> }) => {
    
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [fileList, setfileList] = useState<UploadFile[]>([] as UploadFile[]);
    const [loader, setloader] = useState<boolean>(false);
    const { urlValue } = useUrlQueryParams({ currentPage: 1, perPage: 15 });
    
    const formData: TypeFormUIData[] = [
        {
            name: "edu_semestr_id",
            label: "Edu semestr",
            required: true,
            type: "select",
            url: "edu-semestrs?expand=semestr",
            filter: {status: "all", edu_plan_id: urlValue?.filter?.edu_plan_id},
            disabled: !urlValue?.filter?.edu_plan_id,
            render(e) {
                return <div>{e?.semestr?.name} {e?.status === 1 ? <Tag color="success" className="ml-2">Aktiv</Tag> : ""}</div>
            },
            span: 24,
        },
    ];

    useEffect(() => {
        if(selectedItem?.id) {
            setloader(true)
            form.setFieldsValue({
                student_id: selectedItem?.student_id,
                description: selectedItem?.description,
                edu_year_id: selectedItem?.edu_year_id,
                date: [dateParserToDatePicker(selectedItem?.start), dateParserToDatePicker(selectedItem?.end)]
            })
            if(selectedItem?.file){
                setfileList([{
                    uid: '-1',
                    name: 'Malumotnoma',
                    status: 'done',
                    url: FILE_URL + selectedItem?.file,
                }])
            } else {
                setfileList([])
            }

            setTimeout(() => {
                setloader(false)
            }, 200);
        }
    }, [selectedItem?.id])

    const { data, isLoading: studentLoading } = useGetAllData<IStudent>({
        queryKey: [...(Object.values(urlValue?.filter) ?? [])],
        url: `students?sort=-id&expand=profile&filter=${JSON.stringify(urlValue.filter)}`,
        urlParams: { "per-page": 0 },
        options: {
          enabled: (!!urlValue?.filter?.course_id && !!urlValue?.filter?.edu_plan_id)
        }
    })

    const { mutate, isLoading } = useMutation({
        mutationFn: (newVals) => submitReasonAttend(selectedItem?.id, newVals),
        onSuccess: async (res) => {
          form.resetFields();
          setfileList([] as UploadFile[])
          Notification("success", selectedItem?.id ? "update" : "create", res?.message)
          refetch()
        },
        onError: (error: AxiosError) => {
          validationErrors(form, error?.response?.data)
        },
        retry: 0,
    });

    const StudentsSelect = <Select
        disabled={!data?.items}
        loading={studentLoading}
        showSearch
        placeholder="Select a student"
        optionFilterProp="option"
        filterOption={(input, option) => (option?.label ?? '')?.toLowerCase()?.includes(input?.toLowerCase())}
        options={data?.items?.map(i => ({label: renderFullName(i?.profile), value: i?.id}))}
    />

    return(
        <Spin spinning={loader}>
            <div className=" p-3 rounded-md border-neutral-100 border-solid border-2 shadow-sm">
                <p><strong>Talabaning qoldirgan darslari uchun ma'lumotnoma yuklash.</strong></p>
                <Divider className="my-2" />
                <Form
                    initialValues={{status: true, type: true}}
                    form={form}
                    layout="vertical"
                    onFinish={(values) => mutate({...values, file: fileList[0]?.originFileObj})}
                >
                    {selectedItem?.student_id ?
                    <div className="my-4">
                        <strong>{renderFullName(selectedItem?.student?.profile)}</strong>
                    </div>
                    : <Form.Item
                        label={t("Students")}
                        name={`student_id`}
                        shouldUpdate
                        className="mt-4 mb-4 w-[100%]"
                        rules={[
                            {
                                required: true,
                                message: `Please select student`,
                            },
                        ]}
                    >
                        {!data?.items ? <Popover content={"Talabalarni olish uchun filter qilishingiz kerak!"} title="Diqqat!" >
                            {StudentsSelect}
                        </Popover> :
                        StudentsSelect}
                    </Form.Item>}
                    {
                        selectedItem?.student_id ? 
                            selectedItem?.eduSemestr?.semestr?.name
                            : <FormUIBuilder data={formData} form={form} load={true} />
                    }
                    <Form.Item
                        label={t("Date")}
                        name={`date`}
                        shouldUpdate
                        className="mt-4 mb-4 w-[100%]"
                        rules={[
                            {
                                required: false,
                                message: `Please input date`,
                            },
                        ]}
                    >
                        <RangePicker
                            className="w-[100%]"
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm"
                        />
                    </Form.Item>
                    <label htmlFor="" className="block mb-2">Ma'lumotnoma</label>
                    <FileUploader passportFile={fileList} setPassportFile={setfileList} title={t("Ma'lumotnoma faylini yuklash")} />
                    <Form.Item
                        label={t("Description")}
                        name={`description`}
                        shouldUpdate
                        className="mt-4 mb-0 w-[100%]"
                        rules={[
                            {
                                required: false,
                                message: `Please input description`,
                            },
                        ]}
                    >
                        <Input.TextArea rows={4} placeholder={`${t("Enter the description")}`} />
                    </Form.Item>
                    <div className="flex justify-end">
                        <Button className="mt-4 mr-3" onClick={() => {setfileList([] as UploadFile[]); setselectedItem({} as IStudentAttendReason)}} htmlType="reset">{t("Reset")}</Button>
                        <Button className="mt-4" loading={isLoading} htmlType="submit" type="primary">{t("Submit")}</Button>
                    </div>
                </Form>
            </div>
        </Spin>
    )
}
export default UploadingReference;