import { useMutation } from "@tanstack/react-query";
import { Alert, Button, Form, Modal, Row } from "antd"
import { AxiosError } from "axios";
import FormUIBuilder, { TypeFormUIBuilder } from "components/FormUIBuilder";
import { Dispatch, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Notification } from "utils/notification";
import { validationErrors } from "utils/validation_error";
import { addTimeTableDay } from "./request";

const AddDayModal = (
    {
        isModalOpen, 
        setIsModalOpen, 
        refetch,
        freeHour,
        ids,
        type
    }: {
        isModalOpen: boolean, 
        setIsModalOpen: Dispatch<boolean>, 
        refetch: any,
        freeHour: number,
        ids: number,
        type: "2" | "1"
    }) => {

    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [errors, setErrors] = useState<any>()
    const { time_table_id } = useParams();
    

    useEffect(() => {
        form.resetFields()
    }, [isModalOpen]);

    const buildingsFormData: TypeFormUIBuilder[] = [
        {
            name: "hour",
            label: `Dars parasi (${ freeHour ? `Maksilmal ${freeHour} para qo'shish mumkin!` : ""})`,
            required: true,
            type: "number",
            max: freeHour,
            span: 24,
            child_names: ["room_id"],
        },
    ];

    const { mutate, isLoading } = useMutation({
        mutationFn: (newVals) => addTimeTableDay(ids, {...Object(newVals), type}),
        onSuccess: async (res) => {
            setIsModalOpen(false)
            refetch()
            form.resetFields()
            Notification("success", "update", res?.message)
        },
        onError: (error: AxiosError<any>) => {
            validationErrors(form, error?.response?.data);
            setErrors(error?.response?.data?.errors?.errors[0])
        },
        retry: 0,
    });
    
    return (
        <Modal 
            title={"Darsga para qo'shish"} 
            open={isModalOpen} 
            onOk={() => setIsModalOpen(false)} 
            onCancel={() => setIsModalOpen(false)}
            footer={false}
        >
            <Form
                initialValues={{ status: true }}
                form={form}
                layout="vertical"
                onFinish={(values) => mutate(values)}
            >
                <Alert type="warning" message={"Dars parasi oxirgi dars ma'lumot(O'qituvchi, Xona, Hafta kuni) bo'yicha qo'shiladi!"} className="mb-4" />
                {
                    freeHour ?
                    <Row gutter={24}>
                        <FormUIBuilder data={buildingsFormData} form={form} load={!!Number(time_table_id)} />
                    </Row>
                    : <Alert type="warning" message={"Bu fan uchun maksimal dars soatlari jadvalga kiritilgan!"} className="mb-4" />
                }
                {(errors && errors['room_id']) ? <Alert type="error"  message={errors['room_id']} className="mb-2" /> : ""}
                {(errors && errors['group_id']) ? <Alert type="error"  message={errors['group_id']} className="mb-2" /> : ""}
                {(errors && errors['teacher_access_id']) ? <Alert type="error"  message={errors['teacher_access_id']} className="mb-2" /> : ""}
                <div className="flex justify-end bottom-0 right-0 w-[100%]">
                    <Button htmlType="button" onClick={() => setIsModalOpen(false)}>{t("Cancel")}</Button>
                    <Button type="primary" loading={isLoading} className="ml-3" htmlType="submit">{t("Submit")}</Button>
                </div>
            </Form>
        </Modal>
    )
}
export default AddDayModal;