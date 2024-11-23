import { useEffect, useState } from 'react'
import { Button, Col, Form, Row, Select, Spin } from "antd";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { submitTimeTable } from "./request";
import { Notification } from "utils/notification";
import { AxiosError } from "axios";
import { validationErrors } from "utils/validation_error";
import { useNavigate, useParams } from "react-router-dom";
import FormUIBuilder, { TypeFormUIBuilder } from "components/FormUIBuilder";
import { IGroup } from 'models/education';
import useGetAllData from 'hooks/useGetAllData';
import { TIMETABLETYPES } from 'config/constants/staticDatas';
import { globalConstants } from 'config/constants';
import { renderFullName } from 'utils/others_functions';

const TimeTableCreateNew = () => {

    const { t } = useTranslation();
    const navigate = useNavigate()
    const [form] = Form.useForm();

    const { edu_plan_id, group_id, week_id, para_id, type, edu_semestr_id, start_time, week } = useParams()
    const [currentSubCatecoryId, setCurrentSubCatecoryId] = useState<number>()
    const [isDivide, setisDivide] = useState<boolean>(false)
    const [edu_semestr_subject_id, setedu_semestr_subject_id] = useState<number>()
    const [lesson_type, setlesson_type] = useState<number>(Number(type));
    const [subjectSillabus, setsubjectSillabus] = useState<any>();    
    
    const isLecture = currentSubCatecoryId == globalConstants.lectureIdForTimeTable;

    const { data: groups } = useGetAllData<IGroup>({
        queryKey: ["groups", edu_plan_id, group_id, week_id, para_id ],
        url: "groups",
        urlParams: { "per-page": 0, filter: { edu_plan_id }, expand: "eduPlan,eduPlan.eduSemestrs" },
        options: {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: !!edu_plan_id,
        },
    });

    const calcSubjectHours = () => subjectSillabus?.find((t:any) => t?.subject_category_id === currentSubCatecoryId)?.freeHour;

    const formDataFirst: TypeFormUIBuilder[] = [
        {
            name: "edu_semestr_subject_id",
            label: "Edu subjects",
            required: true,
            url: `edu-semestr-subjects?group_id=${group_id}`,
            type: "select",
            expand: "subject,eduSemestrSubjectCategoryTimes,eduSemestrSubjectCategoryTimes.freeHour",
            is_expand_id: false,
            filter: {edu_semestr_id},
            query_key: [edu_plan_id, group_id, week_id, para_id, type, edu_semestr_id, start_time, week],
            span: 12,
            child_names: ["teacher_access_id", 'second_teacher_access_id', "subject_category_id"],
            render(e) {
                return e?.subject?.name
            },
            onchange(e, t) {
                setedu_semestr_subject_id(e)
                setsubjectSillabus(t?.eduSemestrSubjectCategoryTimes)
            },
        },
        {
            name: "subject_category_id",
            label: "Subject category",
            required: true,
            url: "edu-semestr-subject-category-times",
            type: "select",
            expand: "subjectCategory",
            is_expand_id: true,
            span: 12,
            parent_name: "edu_semestr_subject_id",
            onchange: (e: any) => setCurrentSubCatecoryId(e)
        },
        {
            name: "type",
            label: "Lesson type",
            required: true,
            type: "select",
            data: TIMETABLETYPES,
            span: type == "0" ? 12 : 0,
            onchange(e) {
                setlesson_type(e)
            },
        },
        {
            name: "hour",
            label: `Dars parasi(Jami paralar soni) ${ calcSubjectHours() ? `Max ${calcSubjectHours()} para` : ""}`,
            max: calcSubjectHours() || 50,
            required: true,
            type: "number",
            span: 12,
        },
    ]

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
            parent_name: "building_id",
            render(e) {
                return `${e?.name}, ${e?.capacity} - ${e?.room_type?.name}`
            },
        },
    ];

    const secondBuildingsFormData: TypeFormUIBuilder[] = [
        {
            name: "second_building_id",
            label: "Building",
            required: true,
            url: "buildings",
            type: "select",
            span: 12,
            child_names: ["second_room_id"],
        },
        {
            name: "second_room_id",
            label: "Room",
            required: true,
            query_key: ["rooms", "second"],
            url: "rooms",
            type: "select",
            span: 12,
            parent_name: "second_building_id",
            render(e) {
                return `${e?.name}, ${e?.capacity} - ${e?.room_type?.name}`
            },
        },
    ];


    const formDataSecondForm: TypeFormUIBuilder[] = [
        {
            name: "two_groups",
            label: "Two divide",
            required: isDivide,
            type: "switch",
            span: 24,
            onchange: (e: boolean) => setisDivide(e)
        }
    ]

    const { data: teacher_asscess, isFetching: teacher_asscess_loader } = useGetAllData({
        queryKey: ["free-teacher-accesses", subjectSillabus?.find((t:any) => t?.subject_category_id === currentSubCatecoryId)?.id, edu_semestr_subject_id],
        url: "teacher-accesses/free",
        urlParams: { "per-page": 0, edu_semestr_subject_category_time: subjectSillabus?.find((t:any) => t?.subject_category_id === currentSubCatecoryId)?.id, expand: "profile" },
        options: {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: (!!edu_semestr_subject_id && !!currentSubCatecoryId)
        },
    });

    useEffect(() => {
        form.setFieldsValue({
            groups: [Number(group_id)],
            type: 0
        })
    }, [group_id])

    const { mutate, isLoading } = useMutation({
        mutationFn: (newVals) => submitTimeTable(0, {
            ...Object(newVals),
            start_date: start_time,
            week_id,
            para_id,
            week: Number(week) % 2 === 1 ? 1 : 2
        }, lesson_type),
        onSuccess: async (res) => {
            Notification("success", "create", res?.message)
            navigate(-1)
        },
        onError: (error: AxiosError) => {
            validationErrors(form, error?.response?.data)
        },
        retry: 0,
    });

    return (
        <Spin spinning={false} size="small">
            <div>
                <HeaderExtraLayout
                    title={"Time table create"}
                    isBack={true}
                    breadCrumbData={[
                        { name: "Home", path: '/' },
                        { name: "Time tables", path: `/time-tables-new` },
                        { name: "Time table create", path: `/time-tables-new` },
                    ]}
                />
                <div className="px-[24px] py-[20px]">
                    <Form
                        initialValues={{ status: true }}
                        form={form}
                        layout="vertical"
                        onFinish={(values) => mutate(values)}
                    >
                        <Row gutter={24} className='pb-[80px]'>
                            <Col xxl={16} lg={20}>
                                <Row gutter={24}>
                                    <Col span={12}>
                                        <Form.Item
                                            label={t("Groups")}
                                            name="groups"
                                            shouldUpdate
                                            rules={[{ required: true, message: `${t("Please select groups")}!` }]}
                                        >
                                            <Select
                                                showSearch
                                                allowClear
                                                mode={(isLecture) ? "multiple" : undefined}
                                                placeholder={t("Select a group")}
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                }
                                                options={groups?.items?.map((i) => ({ label: i?.unical_name, value: i?.id }))}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <FormUIBuilder data={formDataFirst} form={form} load={false} />

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
                                                disabled={!edu_semestr_subject_id || !currentSubCatecoryId}
                                                loading={teacher_asscess_loader}
                                                placeholder={t("Select a teacher")}
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                }
                                                options={teacher_asscess?.items?.map((i) => ({ label: `${renderFullName(i?.profile)} - ${i?.language_id === 1 ? "O'zbek tili" : i?.language_id === 2 ? "Ingliz tili" : i?.language_id === 3 ? "Rus tili" : ""}`, value: i?.id }))}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <FormUIBuilder data={buildingsFormData} form={form} load={false} />

                                    {!isLecture ? <FormUIBuilder data={formDataSecondForm} form={form} load={false} /> : null}

                                    {
                                        isDivide && !isLecture ?
                                            <>

                                                <Col span={12}>
                                                    <Form.Item
                                                        label={t("Ikkinchi guruh o'qituvchisi")}
                                                        name="second_teacher_access_id"
                                                        shouldUpdate
                                                        rules={[{ required: true, message: `${t("Please select teacher")}!` }]}
                                                    >
                                                        <Select
                                                            showSearch
                                                            allowClear
                                                            disabled={!edu_semestr_subject_id || !currentSubCatecoryId}
                                                            loading={teacher_asscess_loader}
                                                            placeholder="Select a teacher"
                                                            optionFilterProp="children"
                                                            filterOption={(input, option) =>
                                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                            }
                                                            options={teacher_asscess?.items?.map((i) => ({ label: `${renderFullName(i?.profile)} - ${i?.language_id === 1 ? "O'zbek tili" : i?.language_id === 2 ? "Ingliz tili" : i?.language_id === 3 ? "Rus tili" : ""}`, value: i?.id }))}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <FormUIBuilder data={secondBuildingsFormData} form={form} load={false} />
                                            </> : ""
                                    }
                                </Row>
                            </Col>
                        </Row>

                        <div className="flex justify-end fixed bottom-0 right-0 bg-white w-[100%] px-[24px] py-[16px] shadow-2xl">
                            <Button htmlType="button" onClick={() => form.resetFields()}>{t("Reset")}</Button>
                            <Button type="primary" loading={isLoading} className="ml-3" htmlType="submit" >{t("Submit")}</Button>
                        </div>
                    </Form>
                </div>
            </div>
        </Spin>
    )
}
export default TimeTableCreateNew;