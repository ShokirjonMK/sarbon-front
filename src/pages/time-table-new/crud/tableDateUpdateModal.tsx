import { useMutation } from "@tanstack/react-query";
import { Button, Checkbox, Col, Form, Modal, Row, Select, Tag, message } from "antd"
import { AxiosError } from "axios";
import FormUIBuilder, { TypeFormUIBuilder } from "components/FormUIBuilder";
import useGetAllData from "hooks/useGetAllData";
import { Dispatch, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Notification } from "utils/notification";
import { renderFullName } from "utils/others_functions";
import { validationErrors } from "utils/validation_error";
import { changeTimeTableByDay } from "./request";

const TimeTableDateUpdateModal = (
    {
        isModalOpen, 
        setIsModalOpen, 
        selectedItem, 
        setselectedItem, 
        subjectCategoryTime,
        dates,
        refetch
    }: {
        isModalOpen: boolean, 
        setIsModalOpen: Dispatch<boolean>, 
        selectedItem: any, 
        setselectedItem: Dispatch<any>, 
        subjectCategoryTime: any, 
        dates: any,
        refetch: any
    }) => {

    const { t } = useTranslation();
    const [form] = Form.useForm();

    const { time_table_id } = useParams();
    const [selectedDates, setselectedDates] = useState<{[data_id: number]: {para_id: number, date: string}}>({});

    useEffect(() => {
        if(selectedItem) setselectedDates({[selectedItem?.id]: {para_id: selectedItem?.para_id, date: selectedItem?.date}})
        
    }, [selectedItem])

    useEffect(() => {
        if(!isModalOpen){
            setselectedItem(undefined);
            form.resetFields();
            setselectedDates({})
        }
    }, [isModalOpen])
    
    const buildingsFormData: TypeFormUIBuilder[] = [
        {
            name: "building_id",
            label: "Building", 
            required: true,
            url: "buildings",
            type: "select",
            span: 12,
            child_names: ["room_id"],
        },
        {
            name: "room_id",
            label: "Room",
            required: true,
            url: "rooms",
            type: "select",
            span: 12,
            render(i) {
                return i?.name + ", " + i?.capacity + " - " + i?.room_type?.name
            },
            parent_name: "building_id",
        },
        {
            name: "para_id",
            label:`Para ${selectedItem?.two_group === 1 ? "(Parani o'zgartirish 2 patok uchun ham amal qiladi!)" : 1}`,
            required: true,
            url: "paras",
            type: "select",
            span: 12,
        },
    ];

    const { data: teacher_asscess, isFetching: teacher_asscess_loader } = useGetAllData({
        queryKey: ["free-teacher-accesses", subjectCategoryTime?.id, selectedItem?.edu_semestr_subject_id],
        url: "teacher-accesses/free",
        urlParams: { 
            "per-page": 0, 
            edu_semestr_subject_category_time: subjectCategoryTime?.id,
            expand: 'profile'
        },
        options: {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: (!!selectedItem?.edu_semestr_subject_id)
        },
    });

    useEffect(() => {
        form.setFieldsValue({
            building_id: selectedItem?.building_id,
            room_id: selectedItem?.room_id,
            week_id: selectedItem?.week_id,
            para_id: selectedItem?.para_id,
            teacher_access_id: selectedItem?.teacher_access_id
        })
    }, [selectedItem])

    const { mutate, isLoading } = useMutation({
        mutationFn: (newVals) => changeTimeTableByDay(selectedItem?.ids_id, {
            ...Object(newVals),
            type: selectedItem?.two_group === 0 ? 2 : 1,
            group_type: selectedItem?.group_type
        }, selectedDates),
        onSuccess: async (res) => {
            setIsModalOpen(false)
            refetch()
            Notification("success", "update", res?.message)
        },
        onError: (error: AxiosError) => {
            validationErrors(form, error?.response?.data)
        },
        retry: 0,
    });
        
    return (
        <Modal 
            title={selectedItem?.date} 
            open={isModalOpen} 
            onOk={() => setIsModalOpen(false)} 
            onCancel={() => setIsModalOpen(false)}
            footer={false}
            width={1000}
        >
            <Form
                initialValues={{ status: true }}
                form={form}
                layout="vertical"
                onFinish={(values) => !selectedDates ? message.warning("Kamida bitta sana tanlanishi shart!") : mutate(values)}
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            label={t("Teacher")}
                            name="teacher_access_id"
                            shouldUpdate
                            rules={[{ required: true, message: `${t("Please select teacher")}!` }]}
                        >
                            <Select
                                showSearch
                                allowClear
                                disabled={!selectedItem?.edu_semestr_subject_id}
                                loading={teacher_asscess_loader}
                                placeholder={t("Select a teacher")}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={(teacher_asscess?.items ? [...teacher_asscess?.items] : [])?.filter(i => !!i?.id)?.map((i) => ({ label: `${renderFullName(i?.profile)} - ${i?.language_id === 1 ? "O'zbek tili" : i?.language_id === 2 ? "Ingliz tili" : i?.language_id === 3 ? "Rus tili" : ""}`, value: i?.id }))}
                            />
                        </Form.Item>
                    </Col>
                    <FormUIBuilder data={buildingsFormData} form={form} load={!!Number(time_table_id)} />
                    
                </Row>
                <div className="time-table-update-dates">
                    <p className="mb-2">Qaysi kunlar uchun</p>
                    {
                        dates?.map((i: any) => (
                            <Tag color="geekblue" key={i?.id} className="py-2 mb-2" >
                                <Checkbox 
                                    value={i?.date} 
                                    checked={i?.id in selectedDates}
                                    onChange={(e) => setselectedDates(p => {
                                         if(i?.id in p) {
                                            let obj:any = {}
                                            for (const key in selectedDates) {
                                                if (key != i?.id) {
                                                    obj[key] = selectedDates[key]
                                                }
                                            }
                                            return obj
                                        } else {
                                            return {...p, [i?.id]: {para_id: i?.para_id, date: e.target.value}}
                                        }
                                    })}
                            >
                                {i?.date}
                            </Checkbox>
                            </Tag>
                        ))
                    }
                </div>
                <div className="flex justify-end bottom-0 right-0 w-[100%]">
                    <Button htmlType="button" onClick={() => setIsModalOpen(false)}>{t("Cancel")}</Button>
                    <Button type="primary" loading={isLoading} className="ml-3" htmlType="submit">{t("Submit")}</Button>
                </div>
            </Form>
        </Modal>
    )
}
export default TimeTableDateUpdateModal;