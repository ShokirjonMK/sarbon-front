import { useMutation } from "@tanstack/react-query";
import { Alert, Button, Col, Form, Row, Select } from "antd";
import { globalConstants } from "config/constants";
import useGetData from "hooks/useGetData";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import checkPermission from "utils/check_permission";
import { addGroupToTimeTable } from "./request";
import { Notification } from "utils/notification";
import { validationErrors } from "utils/validation_error";


const AddTimeTableGroup = ({data, refetch}: {data: any, refetch: any}) => {

    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [isHasSubject, setisHasSubject] = useState<boolean>(false)
    const [isNewGroupForm, setisNewGroupForm] = useState<boolean>(false)
    const [direction_id, setDirection_id] = useState<number>()
    
    const { data: directions } = useGetData({
        queryKey: ["directions", data?.data?.faculty_id],
        url: "directions?sort=-id",
        urlParams: { "per-page": 0, filter: JSON.stringify({faculty_id: data?.data?.faculty_id}) },
        options: {
          refetchOnWindowFocus: false,
          retry: 0,
          enabled: !!data?.data?.faculty_id && isNewGroupForm
        }
    })

    const { data: groups } = useGetData({
        queryKey: ["groups", direction_id],
        url: "groups?sort=-id&expand=activeEduSemestr,activeEduSemestr.eduSemestrSubjects",
        urlParams: { "per-page": 0, filter: JSON.stringify({direction_id}) },
        options: {
          refetchOnWindowFocus: false,
          retry: 0,
          enabled: !!direction_id
        }
    })

    const { mutate, isLoading } = useMutation({
        mutationFn: (group_id: number) => addGroupToTimeTable(data?.data?.ids, group_id),
        onSuccess: async (res) => {
            Notification("success", "update", res?.message);
            form.resetFields()
            refetch()
        },
        onError: (error: any) => {
            Notification("error", "update", String(error?.response?.data?.errors));
            validationErrors(form, error?.response?.data)
        },
        retry: 0,
    });

    const onSelectGroup = (id: number) => {
      let obj = ''
      if(id) obj = groups?.items?.find((item: any) => item?.id === id)?.activeEduSemestr?.eduSemestrSubjects?.find((item: any) => item?.subject_id === data?.data?.subject_id)
      setisHasSubject(obj !== Object(obj))

    }

    return (
        <div>
            {(data?.data?.subject_category_id === globalConstants.lectureIdForTimeTable && checkPermission("timetable_add-group")) ? <Button className="mt-4" type="primary" onClick={() => setisNewGroupForm(prev => !prev)}>Boshqa yo'nalishdan guruh qo'shish</Button> : null}

            {isNewGroupForm ? <div className="bg-gray-100 rounded-md px-3 pt-3 mt-3">
            <Form
                initialValues={{ status: true }}
                form={form}
                layout="vertical"
                onFinish={(values) => mutate(values?.group_id)}
            >
                <Row gutter={24}>
                    <Col span={6}>
                        <Form.Item
                        label={t("Direction")}
                        name={`direction_id`}
                        shouldUpdate
                        rules={[{required: true, message: `Please select direction`}]}
                        >
                        <Select
                            allowClear
                            showSearch
                            placeholder={t("Direction")}
                            optionFilterProp="children"
                            onChange={(e) => {
                            setDirection_id(e);
                            setisHasSubject(false);
                            form.setFieldsValue({group_id: undefined})
                            }}
                            filterOption={(input, option) => (option?.label ?? '')?.toLowerCase()?.includes(input?.toLowerCase())}
                            options={directions?.items?.map((i: any) => ({label: i?.name, value: i?.id}))}
                        />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                        label={t("Group")}
                        name={`group_id`}
                        shouldUpdate
                        rules={[{required: true, message: `Please select group`}]}
                        >
                        <Select
                            showSearch
                            placeholder={t("Direction")}
                            optionFilterProp="children"
                            onChange={onSelectGroup}
                            disabled={!direction_id}
                            filterOption={(input, option) => (option?.label ?? '')?.toLowerCase()?.includes(input?.toLowerCase())}
                            options={groups?.items?.map((i: any) => ({label: i?.unical_name, value: i?.id}))}
                        />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                    <Form.Item label={<p></p>}>
                        {checkPermission("timetable_add-group") ? <Button type="primary" loading={isLoading} disabled={isHasSubject} htmlType="submit">{t("Submit")}</Button> : ""}
                    </Form.Item>
                    </Col>
                </Row>
            </Form>
            </div> : null}
            {
            isHasSubject && isNewGroupForm ? 
            <Alert
                message=""
                description={`${data?.data?.subject?.name} fani bu guruh semestr faniga to'g'ri kelmaydi!`}
                type="warning"
            /> : ""
            }
        </div>
    )
}
export default AddTimeTableGroup;

// timetable_delete-one