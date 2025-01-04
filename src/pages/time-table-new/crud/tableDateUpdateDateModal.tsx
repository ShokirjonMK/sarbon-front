import { useMutation } from "@tanstack/react-query";
import { Button, Col, DatePicker, Form, Modal, Row, Select, Spin } from "antd"
import { AxiosError } from "axios";
import FormUIBuilder, { TypeFormUIBuilder } from "components/FormUIBuilder";
import useGetAllData from "hooks/useGetAllData";
import React, { Dispatch, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Notification } from "utils/notification";
import { renderFullName } from "utils/others_functions";
import { validationErrors } from "utils/validation_error";
import { changeTimeTableDate } from "./request";
import dayjs from "dayjs";

const TimeTableDateDateUpdateModal = (
    {
        isModalOpen, 
        setIsModalOpen, 
        selectedItem, 
        setselectedItem, 
        subjectCategoryTime,
        refetch,
        mainData,
    }: {
        isModalOpen: boolean, 
        setIsModalOpen: Dispatch<boolean>, 
        selectedItem: any, 
        setselectedItem: Dispatch<any>, 
        subjectCategoryTime: any, 
        refetch: any,
        mainData: any
    }) => {

    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [second_building_id, setsecond_building_id] = useState();

    useEffect(() => {
        if(!isModalOpen){
            setselectedItem(undefined);
            form.resetFields();
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
    ]

    const buildingsFormDataSecondGroup: TypeFormUIBuilder[] = [
        {
            name: "second_building_id",
            label: "Building", 
            required: true,
            url: "buildings",
            type: "select",
            span: 12,
            child_names: ["second_room_id"],
            onchange(e) {
                setsecond_building_id(e)
            },
        },
        {
            name: "second_room_id",
            label: "Room",
            required: true,
            url: "rooms",
            type: "select",
            span: 12,
            filter: {
                building_id: second_building_id
            },
            render(i) {
                return i?.name + ", " + i?.capacity + " - " + i?.room_type?.name
            },
            parent_name: "second_building_id",
        },
        {
            name: "para_id",
            label:`Para ${selectedItem?.two_group === 1 ? "(Parani o'zgartirish 1 patok uchun ham amal qiladi!)" : 1}`,
            required: true,
            url: "paras",
            type: "select",
            span: 12,
        },
    ]

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
            para_id: selectedItem?.para_id,
            teacher_access_id: selectedItem?.teacher_access_id,
            date: dayjs(selectedItem?.date)
        })
        if(selectedItem?.two_group == 1){
            const secondGrp = mainData?.secondGroup?.timeTableDate?.find((i: any) => i?.date === selectedItem?.date);
            setsecond_building_id(secondGrp?.building_id)
            form.setFieldsValue({
                second_building_id: secondGrp?.building_id,
                second_room_id: secondGrp?.room_id,
                second_para_id: secondGrp?.para_id,
                second_teacher_access_id: secondGrp?.teacher_access_id,
            })
        }
    }, [selectedItem?.id])

    const { mutate, isLoading } = useMutation({
        mutationFn: (newVals : any) => changeTimeTableDate(selectedItem?.ids_id, {
            ...Object(newVals),
            old_para_id: selectedItem?.para_id,
            type: selectedItem?.two_group === 1 ? 5 : 4,
            new_date: dayjs(newVals?.date).format("YYYY-MM-DD"),
            date: selectedItem?.date,
        }),
        onSuccess: async (res) => {
            setIsModalOpen(false)
            refetch()
            Notification("success", "update", res?.message)
        },
        onError: (error: AxiosError) => {
            validationErrors(form, error?.response?.data)
            Notification("error", "update", error?.message)
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
            <Spin spinning={teacher_asscess_loader} >
                <Form
                    initialValues={{ status: true }}
                    form={form}
                    layout="vertical"
                    onFinish={(values) => mutate(values)}
                >
                    <Col span={12}>
                        <Form.Item
                            label={t("Dars sanasi")}
                            name='date'
                            rules={[{ required: true, message: `Please select date` }]}
                        >
                            <DatePicker
                                format="YYYY-MM-DD"
                                className='w-[100%]' 
                            />
                        </Form.Item>
                    </Col>
                    <div className="bg p-3 rounded-lg">
                        {selectedItem?.two_group === 1 ? <h3>1 - patok</h3> : ""}
                        <Row gutter={24} >
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
                            
                            <FormUIBuilder data={buildingsFormData} form={form} load={!!Number(selectedItem?.id)} />
                        </Row>
                    </div>
                    {
                        selectedItem?.two_group === 1 ?
                        <div className="bg p-3 rounded-lg my-4">
                            <h3>2 - patok</h3>
                            <Row gutter={24}>
                                <Col span={12}>
                                    <Form.Item
                                        label={t("Teacher")}
                                        name="second_teacher_access_id"
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
                                
                                <FormUIBuilder data={buildingsFormDataSecondGroup} form={form} load={!!Number(selectedItem?.id)} />
                            </Row>
                        </div> : ""
                    }
                    <div className="flex justify-end bottom-0 right-0 w-[100%]">
                        <Button htmlType="button" onClick={() => setIsModalOpen(false)}>{t("Cancel")}</Button>
                        <Button type="primary" loading={isLoading} className="ml-3" htmlType="submit">{t("Submit")}</Button>
                    </div>
                </Form>
            </Spin>
        </Modal>
    )
}
export default TimeTableDateDateUpdateModal;