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
import useGetOneData from "hooks/useGetOneData";
import FormUIBuilder, { TypeFormUIBuilder } from "components/FormUIBuilder";
import { IEduSemestr, IGroup } from 'models/education';
import useGetAllData from 'hooks/useGetAllData';
import { TIMETABLETYPES } from 'config/constants/staticDatas';
import { globalConstants } from 'config/constants';

const TimeTableUpdate = () => {

    const { t } = useTranslation();
    const navigate = useNavigate()
    const [form] = Form.useForm();

    const { time_table_id: id, edu_plan_id, group_id, week_id, para_id, type } = useParams();
    const [currentGroup, setCurrentGroup] = useState<IGroup>();
    const [currentSubCatecoryId, setCurrentSubCatecoryId] = useState<number>();
    const [isDivide, setisDivide] = useState<boolean>(false);
    const [edu_semestr_subject_id, setedu_semestr_subject_id] = useState<number>();
    const [buildingId, setbuildingId] = useState<number>();
    const [secondBuildingId, setsecondBuildingId] = useState<number>();
    const [edu_semestr_id, setedu_semestr_id] = useState<number>();
    const [edu_year_id, setedu_year_id] = useState<number>();
    const [lesson_type, setlesson_type] = useState<number>(type == '1' ? 2 : type == '2' ? 1 : 0);

    const isLecture = currentSubCatecoryId == globalConstants.lectureIdForTimeTable;

    const { data: groupOne } = useGetOneData<IGroup>({
        queryKey: ["groups", group_id],
        url: `groups/${group_id}`,
        urlParams: { expand: "eduPlan,eduPlan.eduSemestrs" },
        options: {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: (!!group_id && !!edu_plan_id),
            onSuccess: (res) => {
                setCurrentGroup(res?.data)
                setedu_semestr_id(res?.data?.eduPlan?.eduSemestrs?.find((i: IEduSemestr) => i?.status == 1)?.id);
                setedu_year_id(res?.data?.eduPlan?.eduSemestrs?.find((i: IEduSemestr) => i?.status == 1)?.edu_year_id)
            }
        },
    })

    const { data, isLoading: getIsLoading } = useGetOneData({
        queryKey: ['time-tables', id],
        url: `time-tables/${id}?expand=teacher,room,twoGroups,twoGroups.teacher,twoGroups.room,patok,patok.group,eduSemestrSubject,eduSemestrSubject.subject,eduSemestr,subjectCategory`,
        options: {
            onSuccess: (res) => {
                const timeTres = res?.data;
                const groups = timeTres?.patok?.length ? [...timeTres?.patok?.map((group: any) => group?.group_id), timeTres?.group_id] : [timeTres?.group_id];
                form.setFieldsValue({
                    ...timeTres,
                    groups: groups,
                    edu_semestr_subject_id: timeTres?.eduSemestrSubject?.id,
                    edu_semestr_id: timeTres?.edu_semestr_id,
                    subject_category_id: timeTres?.subject_category_id,
                    two_groups: timeTres?.two_groups == 1,
                    second_building_id: timeTres?.twoGroups?.building_id,
                    second_room_id: timeTres?.twoGroups?.room_id,
                    second_teacher_access_id: timeTres?.twoGroups?.teacher_access_id,
                });
                setCurrentSubCatecoryId(timeTres?.subject_category_id)
                setisDivide(timeTres?.two_groups == 1)
                setedu_semestr_subject_id(timeTres?.edu_semestr_subject_id)
                setbuildingId(timeTres?.building_id)
                setsecondBuildingId(timeTres?.twoGroups?.building_id)
                setlesson_type(timeTres?.type)
            },
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: (!!id && id != '0'),
        }
    })

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
            disabled: true,
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
        queryKey: ["free-teacher-accesses", edu_semestr_subject_id, para_id, week_id, edu_semestr_id, edu_year_id, currentSubCatecoryId, lesson_type, currentGroup?.language_id],
        url: "teacher-accesses/free",
        urlParams: { "per-page": 0, edu_semestr_subject_id, para_id, week_id, edu_semestr_id, edu_year_id: edu_year_id, language_id: currentGroup?.language_id, subject_category_id: currentSubCatecoryId, type: lesson_type },
        options: {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: (!!edu_semestr_subject_id && !!(lesson_type == 1 || lesson_type == 0 || lesson_type == 2))
        },
    });

    const { data: free_rooms, isFetching: free_rooms_loader } = useGetAllData({
        queryKey: ["free-rooms", buildingId, para_id, week_id, edu_semestr_id, edu_year_id, lesson_type],
        url: "rooms/free",
        urlParams: { "per-page": 0, building_id: buildingId, para_id, edu_year_id: edu_year_id, week_id, edu_semestr_id, type: lesson_type },
        options: {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: (!!buildingId && !!(lesson_type == 1 || lesson_type == 0 || lesson_type == 2) && !!edu_semestr_id)
        },
    });

    const { data: second_free_rooms, isFetching: second_free_rooms_loader } = useGetAllData({
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
        mutationFn: (newVals) => submitTimeTable(id, {
            ...Object(newVals),
            week_id,
            para_id,
        }, type),
        onSuccess: async (res) => {
            Notification("success", id != "0" ? "update" : "create", res?.message)
            navigate(-1)
        },
        onError: (error: AxiosError) => {
            validationErrors(form, error?.response?.data)
        },
        retry: 0,
    });

    return (
        <Spin spinning={getIsLoading && id != "0"} size="small">
            <div> 
                <HeaderExtraLayout
                    title={"Time table update"}
                    isBack={true}
                    breadCrumbData={[
                        { name: "Home", path: '/' },
                        { name: "Time tables", path: '/time-tables' },
                        { name: "Time table update", path: `/time-tables` },
                    ]}
                />
                <div className="px-[24px] py-[20px]">
                    <Form
                        initialValues={{ status: true }}
                        form={form}
                        layout="vertical"
                        onFinish={(values) => mutate({
                            ...values,
                        })}
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
                                                disabled={true}
                                                mode={(isLecture) ? "multiple" : undefined}
                                                placeholder="Select a group"
                                                optionFilterProp="children"
                                                options={[...(data?.data?.patok || []), {group: groupOne?.data}]?.map((i:any) => ({ label: i?.group?.unical_name, value: i?.group?.id }))}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label={t("Edu semestr")}
                                            name="edu_semestr_id"
                                            shouldUpdate
                                            rules={[{ required: true, message: `${t("Please select semestr")}!` }]}
                                        >
                                            <Select
                                                showSearch
                                                allowClear
                                                disabled={true}
                                                placeholder="Select a edu semestr"
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                }
                                                options={[{ label: data?.data?.eduSemestr?.name, value: data?.data?.edu_semestr_id }]}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item
                                            label={t("Subject")}
                                            name="edu_semestr_subject_id"
                                            shouldUpdate
                                            rules={[{ required: true, message: `${t("Please select subject")}!` }]}
                                        >
                                            <Select
                                                showSearch
                                                allowClear
                                                disabled={true}
                                                placeholder="Select a edu semestr"
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                }
                                                options={[{ label: data?.data?.eduSemestrSubject?.subject?.name, value: data?.data?.eduSemestrSubject?.id }]}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item
                                            label={t("Subject category")}
                                            name="subject_category_id"
                                            shouldUpdate
                                            rules={[{ required: true, message: `${t("Please select subject")}!` }]}
                                        >
                                            <Select
                                                showSearch
                                                allowClear
                                                disabled={true}
                                                placeholder="Select a edu semestr"
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                }
                                                options={[{ label: data?.data?.subjectCategory?.name, value: data?.data?.subject_category_id }]}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <FormUIBuilder data={typesFormData} form={form} load={!!Number(id)} />

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
                                                disabled={!edu_semestr_subject_id || !(lesson_type == 1 || lesson_type == 0 || lesson_type == 2)}
                                                loading={teacher_asscess_loader}
                                                placeholder={t("Select a teacher")}
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                }
                                                options={(teacher_asscess?.items ? [...teacher_asscess?.items, { id: data?.data?.teacher_access_id, teacher: data?.data?.teacher }] : [])?.filter(i => !!i?.id)?.map((i) => ({ label: i?.teacher?.first_name + " " + i?.teacher?.last_name + " " + i?.teacher?.middle_name, value: i?.id }))}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <FormUIBuilder data={buildingsFormData} form={form} load={!!Number(id)} />
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
                                                options={(free_rooms?.items ? [...free_rooms?.items, data?.data?.room?.building_id == buildingId ? data?.data?.room : null] : [])?.filter(i => !!i?.id).map((i) => ({ label: i?.name + ", " + i?.capacity + " - " + i?.room_type?.name, value: i?.id }))}
                                            />
                                        </Form.Item>
                                    </Col>

                                    {!isLecture ? <FormUIBuilder data={formDataSecondForm} form={form} load={!!Number(id)} /> : null}

                                    {
                                        isDivide && !isLecture ?
                                            <>

                                                <Col span={12}>
                                                    <Form.Item
                                                        label={t("Second group teacher")}
                                                        name="second_teacher_access_id"
                                                        shouldUpdate
                                                        rules={[{ required: true, message: `${t("Please select teacher")}!` }]}
                                                    >
                                                        <Select
                                                            showSearch
                                                            allowClear
                                                            disabled={!edu_semestr_subject_id || !(lesson_type == 1 || lesson_type == 0 || lesson_type == 2)}
                                                            loading={teacher_asscess_loader}
                                                            placeholder={t("Select a teacher")}
                                                            optionFilterProp="children"
                                                            filterOption={(input, option) =>
                                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                            }
                                                            options={(teacher_asscess?.items ? [...teacher_asscess?.items, { id: data?.data?.twoGroups?.teacher_access_id, teacher: data?.data?.twoGroups?.teacher }] : [])?.filter(i => !!i?.id)?.map((i) => ({ label: i?.teacher?.first_name + " " + i?.teacher?.last_name + " " + i?.teacher?.middle_name, value: i?.id }))}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <FormUIBuilder data={secondBuildingsFormData} form={form} load={!!Number(id)} />
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
                                                            placeholder={t("Select a room")}
                                                            optionFilterProp="children"
                                                            filterOption={(input, option) =>
                                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                            }
                                                            options={
                                                                (second_free_rooms?.items ?
                                                                    [...second_free_rooms?.items,
                                                                    data?.data?.twoGroups?.room?.building_id == secondBuildingId ?
                                                                        data?.data?.twoGroups?.room : null] :
                                                                    [])?.filter(i => !!i?.id)?.map((i) => ({ label: i?.name + ", " + i?.capacity + " - " + i?.room_type?.name, value: i?.id }))
                                                            }
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
export default TimeTableUpdate;