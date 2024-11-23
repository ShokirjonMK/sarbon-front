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
import { IEduSemestr, IGroup } from 'models/education';
import useGetAllData from 'hooks/useGetAllData';
import { TIMETABLETYPES } from 'config/constants/staticDatas';
import { globalConstants } from 'config/constants';
import useGetData from 'hooks/useGetData';

const TimeTableCreate = () => {

    const { t } = useTranslation();
    const navigate = useNavigate()
    const [form] = Form.useForm();

    const { edu_plan_id, group_id, week_id, para_id, type } = useParams()
    const [currentGroup, setCurrentGroup] = useState<IGroup>()
    const [currentSubCatecoryId, setCurrentSubCatecoryId] = useState<number>()
    const [isDivide, setisDivide] = useState<boolean>(false)
    const [edu_semestr_subject_id, setedu_semestr_subject_id] = useState<number>()
    const [buildingId, setbuildingId] = useState<number>()
    const [secondBuildingId, setsecondBuildingId] = useState<number>()
    const [edu_semestr_id, setedu_semestr_id] = useState<number>()
    const [edu_year_id, setedu_year_id] = useState<number>()
    const [lesson_type, setlesson_type] = useState<number>(Number(type));

    const isLecture = currentSubCatecoryId == globalConstants.lectureIdForTimeTable;

    const { data: groups } = useGetAllData<IGroup>({
        queryKey: ["groups", edu_plan_id, group_id, week_id, para_id],
        url: "groups",
        urlParams: { "per-page": 0, filter: { edu_plan_id }, expand: "eduPlan,eduPlan.eduSemestrs" },
        options: {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: !!edu_plan_id,
            onSuccess: (res) => {
                const group_res = res?.items?.find(i => i?.id == Number(group_id));
                setCurrentGroup(res?.items?.find(i => i?.id == Number(group_id)))
                setedu_semestr_id(group_res?.eduPlan?.eduSemestrs?.find((i: IEduSemestr) => i?.status == 1)?.id);
                setedu_year_id(group_res?.eduPlan?.eduSemestrs?.find((i: IEduSemestr) => i?.status == 1)?.edu_year_id)
            }
        },
    });

    const formDataFirst: TypeFormUIBuilder[] = [
        {
            name: "edu_semestr_id",
            label: "Edu semestr",
            required: true,
            url: `edu-semestrs`,
            type: "select",
            span: 12,
            filter: { edu_plan_id, status: 1 },
            child_names: ["edu_semestr_subject_id"],
        },
        {
            name: "edu_semestr_subject_id",
            label: "Edu subjects",
            required: true,
            url: `edu-semestr-subjects`,
            type: "select",
            expand: "subject",
            is_expand_id: false,
            span: 12,
            parent_name: "edu_semestr_id",
            child_names: ["teacher_access_id", 'second_teacher_access_id', "subject_category_id"],
            onchange(e) {
                setedu_semestr_subject_id(e)
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
            onchange(e) {
                setbuildingId(e)
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
            onchange(e) {
                setsecondBuildingId(e)
            },
        },
    ];


    const typesFormData: TypeFormUIBuilder[] = [
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
        queryKey: ["free-teacher-accesses", edu_semestr_subject_id, para_id, week_id, edu_semestr_id, edu_year_id, currentGroup?.language_id, currentSubCatecoryId, lesson_type],
        url: "teacher-accesses/free",
        urlParams: { "per-page": 0, edu_semestr_subject_id, para_id, week_id, edu_semestr_id, edu_year_id: edu_year_id, language_id: currentGroup?.language_id, subject_category_id: currentSubCatecoryId, type: lesson_type },
        options: {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: (!!edu_semestr_subject_id && !!(lesson_type == 1 || lesson_type == 0 || lesson_type == 2) && !!currentSubCatecoryId)
        },
    });

    const { data: free_rooms, isFetching: free_rooms_loader } = useGetAllData({
        queryKey: ["free-rooms", buildingId, para_id, week_id, edu_semestr_id, edu_year_id, lesson_type],
        url: "rooms/free",
        urlParams: { "per-page": 0, building_id: buildingId, para_id, edu_year_id: edu_year_id, week_id, edu_semestr_id, type: lesson_type },
        options: {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: (!!buildingId && !!(lesson_type == 1 || lesson_type == 0 || lesson_type == 2))
        },
    });

    const { data: second_free_rooms, isFetching: second_free_rooms_loader } = useGetData({
        queryKey: ["second-free-rooms", secondBuildingId, para_id, week_id, edu_semestr_id, edu_year_id, lesson_type],
        url: "rooms/free",
        urlParams: { "per-page": 0, building_id: secondBuildingId, para_id, edu_year_id: edu_year_id, week_id, edu_semestr_id, type: lesson_type },
        options: {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: (!!secondBuildingId && !!(lesson_type == 1 || lesson_type == 0 || lesson_type == 2))
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
            week_id,
            para_id,
        }, type),
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
                        { name: "Time tables", path: '/time-tables' },
                        { name: "Time table create", path: `/time-tables` },
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

                                    <FormUIBuilder data={typesFormData} form={form} load={false} />

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
                                                disabled={!edu_semestr_subject_id || !(lesson_type == 1 || lesson_type == 0 || lesson_type == 2) || !currentSubCatecoryId}
                                                loading={teacher_asscess_loader}
                                                placeholder={t("Select a teacher")}
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                }
                                                options={teacher_asscess?.items?.map((i) => ({ label: i?.teacher?.first_name + " " + i?.teacher?.last_name + " " + i?.teacher?.middle_name, value: i?.id }))}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <FormUIBuilder data={buildingsFormData} form={form} load={false} />
                                    <Col span={12}>
                                        <Form.Item
                                            label={t("Rooms")}
                                            name="room_id"
                                            shouldUpdate
                                            rules={[{ required: true, message: `${t("Please select room")}!` }]}
                                        >
                                            <Select
                                                showSearch
                                                allowClear
                                                disabled={!buildingId || !(lesson_type == 1 || lesson_type == 0 || lesson_type == 2)}
                                                loading={free_rooms_loader}
                                                placeholder={t("Select a room")}
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                }
                                                options={free_rooms?.items?.map((i) => ({ label: i?.name + ", " + i?.capacity + " - " + i?.room_type?.name, value: i?.id }))}
                                            />
                                        </Form.Item>
                                    </Col>

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
                                                            disabled={!edu_semestr_subject_id || !(lesson_type == 1 || lesson_type == 0 || lesson_type == 2) || !currentSubCatecoryId}
                                                            loading={teacher_asscess_loader}
                                                            placeholder="Select a teacher"
                                                            optionFilterProp="children"
                                                            filterOption={(input, option) =>
                                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                            }
                                                            options={teacher_asscess?.items?.map((i) => ({ label: i?.teacher?.first_name + " " + i?.teacher?.last_name + " " + i?.teacher?.middle_name, value: i?.id }))}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <FormUIBuilder data={secondBuildingsFormData} form={form} load={false} />
                                                <Col span={12}>
                                                    <Form.Item
                                                        label={t("Rooms")}
                                                        name="second_room_id"
                                                        shouldUpdate
                                                        rules={[{ required: true, message: `${t("Please select room")}!` }]}
                                                    >
                                                        <Select
                                                            showSearch
                                                            allowClear
                                                            disabled={!secondBuildingId || !(lesson_type == 1 || lesson_type == 0 || lesson_type == 2)}
                                                            loading={second_free_rooms_loader}
                                                            placeholder="Select a room"
                                                            optionFilterProp="children"
                                                            filterOption={(input, option) =>
                                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                            }
                                                            options={second_free_rooms?.items?.map((i) => ({ label: i?.name + ", " + i?.capacity + " - " + i?.room_type?.name, value: i?.id }))}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </> : ""
                                    }
                                </Row>
                            </Col>
                        </Row>

                        <div className="flex justify-end fixed bottom-0 right-0 bg-white w-[100%] px-[24px] py-[16px] shadow-2xl">
                            <Button htmlType="button" onClick={() => form.resetFields()}>{t("Reset")}</Button>
                            <Button type="primary" loading={isLoading} className="ml-3" htmlType="submit">{t("Submit")}</Button>
                        </div>
                    </Form>
                </div>
            </div>
        </Spin>
    )
}
export default TimeTableCreate;