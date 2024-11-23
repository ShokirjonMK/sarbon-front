import { AddFilled, DeleteFilled } from "@fluentui/react-icons";
import { Button, Col, Form, message, Row, Select, Tag, Table, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { ILanguage } from "components/Structure/header/components/types";
import useGetAllData from "hooks/useGetAllData";
import useGetData from "hooks/useGetData";
import { ISubject } from "models/subject";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { cf_filterOption } from "utils/others_functions";

type TypeTeacherAccessData = {
    subject_id: number,
    lang_id: number,
    subject_category_id: number[]
}

type teacherAccessPropType = {
    teacher_access_list: { [key: number]: { [key: number]: number[] } },
    setTeacherAccessList: React.Dispatch<React.SetStateAction<{ [key: number]: { [key: number]: number[] } }>>,
    edit?: boolean,
    className?: string
}

const TeacherAccess: FC<teacherAccessPropType> = ({ teacher_access_list, setTeacherAccessList, edit, className }): JSX.Element => {
    const { t } = useTranslation();
    const [_form] = Form.useForm();

    // console.log("teacher_access_list", teacher_access_list);
    

    const { data: subjects, isFetching, refetch: subjectFetch } = useGetAllData<ISubject>({
        queryKey: ["subjects"],
        url: `subjects?expand=eduForm,semestr,subjectType`,
        urlParams: { "per-page": 0 },
    });

    const { data: languages, refetch: langFetch } = useGetData<ILanguage>({
        queryKey: ["languages"],
        url: `languages`,
        urlParams: { "per-page": 0 },
        options: {
            onSuccess: (res) => {
                _form.setFieldsValue({
                    language: res?.items[0]?.id,
                });
            },
        }
    });

    const { data: subjectCategries, refetch: subjectCategoryFetch } = useGetAllData<ILanguage>({
        queryKey: ["subject-categries"],
        url: `subject-categories`,
        urlParams: { "per-page": 0 },
        options: {
            onSuccess: (res) => {
                _form.setFieldsValue({
                    subject_category: [res?.items[0]?.id],
                });
            },
        }
    });

    const getName = (type: "subject" | "lang" | "subject_category", id: number): string => {
        if (type === "subject") {
            const _subject = subjects?.items?.find(item => item?.id === id)
            return `${_subject?.name} - ${_subject?.eduForm?.name} - ${_subject?.semestr?.name}` ?? ""
        }
        if (type === "lang") return languages?.items?.find(item => item?.id === id)?.name ?? "";
        if (type === "subject_category") return subjectCategries?.items?.find(item => item?.id === id)?.name ?? ""

        return "";
    };

    const data = () => {
        const arr: TypeTeacherAccessData[] = []

        Object.entries(teacher_access_list ?? {})?.forEach(([key, value]) => {
            Object.entries(value ?? {})?.forEach(([_key, _value]) => {
                arr.push({
                    subject_id: Number(key),
                    lang_id: Number(_key),
                    subject_category_id: _value
                })
            })
        })

        return arr
    }

    const addTeacherAccess = () => {
        const subject_id = _form.getFieldValue("subject");
        const lang_id = _form.getFieldValue("language");
        const subject_category_id = _form.getFieldValue("subject_category");

        if (!subject_id) return message.warning("Fanni tanlang!");
        if (!lang_id) return message.warning("Tilni tanlang!");
        if (!subject_category_id) return message.warning("Fan turini tanlang!");

        setTeacherAccessList(p => {
            const subject_category_ids =( p && p[subject_id] && p[subject_id][lang_id]) ? p[subject_id][lang_id] : [];

            subject_category_id?.forEach((e: any) => {
                if (!subject_category_ids?.includes(e)) {
                    subject_category_ids.push(e);
                }
            });

            return {
                ...(p ?? {}),
                [subject_id]: {
                    ...(p ? p[Number(subject_id)] ?? {} : {}),
                    [lang_id]: subject_category_ids
                },
            }
        });
        _form.resetFields();
    };

    const removeTeacherAccess = (sub_id: number, lang_id: number) => {
        let obj: any = { ...teacher_access_list };
        delete obj[sub_id][lang_id];
        if (!Object.keys(obj[sub_id]).length) delete obj[sub_id];
        setTeacherAccessList(obj);
    };

    const columns: ColumnsType<TypeTeacherAccessData> = [
        {
            title: "№",
            key: "order",
            render: (_, __, i) => i + 1,
            width: 40,
        },
        {
            title: t("Subject"),
            dataIndex: "subject_id",
            key: "subject",
            render: (e: number) => getName("subject", e),
        },
        {
            title: t("Languages"),
            dataIndex: "lang_id",
            key: "lang",
            render: (e: number) => <Tag>{getName("lang", e)}</Tag>,
        },
        {
            title: t("Subject category"),
            key: "category",
            render: (i, e) => e?.subject_category_id?.map((a, i) => <Tag>{getName("subject_category", a)}</Tag>),
        },
        ...(edit ? [
            {
                title: t("Action"),
                key: "action",
                render: (i, e) => {
                    console.log("i, e", i, e);
                    return <div className="d-flex justify-content-center aligin-items-center">
                    <DeleteFilled
                        onClick={() => removeTeacherAccess(e.subject_id, e.lang_id)}
                        style={{ cursor: "pointer" }}
                        className="text-danger"
                        fontSize={18}
                    />
                </div>
                    
                },
                width: 60,
                align: "center",
            },
        ] as ColumnsType<TypeTeacherAccessData> : []),
    ];

    return (
        <div>
            {
                edit ? <Form
                    form={_form}
                    layout="vertical"
                >
                    <Row gutter={[12, 12]} >
                        <Col xs={24} sm={24} md={14} lg={11}>
                            <Form.Item
                                name={`subject`}
                                label={t`Subjects`}
                            >
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder={t("Select subject")}
                                    filterOption={cf_filterOption}
                                    onFocus={() => !subjects?.items?.length && subjectFetch}
                                >
                                    {subjects &&
                                        subjects?.items?.map((item, i) => (
                                            <Select.Option key={i} value={item.id}>
                                                {item.name}
                                                <Tooltip title={
                                                    <>
                                                        <p><span className="text-white opacity-70">{t("Subject")}:</span>&nbsp;&nbsp;{item?.name}</p>
                                                        <p><span className="text-white opacity-70">{t("Semestr")}:</span>&nbsp;&nbsp;{item?.semestr?.name}</p>
                                                        <p><span className="text-white opacity-70">{t("Edu form")}:</span>&nbsp;&nbsp;{item?.eduForm?.name}</p>
                                                        <p><span className="text-white opacity-70">{t("Fan krediti")}:</span>&nbsp;&nbsp;{item?.credit}</p>
                                                        <p><span className="text-white opacity-70">{t("Fan turi")}:</span>&nbsp;&nbsp;{item?.subjectType?.name}</p>
                                                    </>
                                                }>
                                                    <span className="text-blue-900 font-bold"> - {item?.eduForm?.name}</span>
                                                </Tooltip>
                                            </Select.Option>
                                        ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col sm={24} xs={24} md={10} lg={5}>
                            <Form.Item
                                name={`language`}
                                label={t`Languages`}
                            >
                                <Select
                                    allowClear
                                    placeholder={t("Select language")}
                                    filterOption={cf_filterOption}
                                    onFocus={() => !languages?.items?.length && langFetch()}
                                >
                                    {languages?.items?.length ? languages?.items.map((item, i) => (
                                        <Select.Option key={i} value={item.id}>{item.name}</Select.Option>
                                    )) : null}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col sm={20} xs={20} md={20} lg={6}>
                            <Form.Item
                                name={`subject_category`}
                                label={t`Subject category`}
                            >
                                <Select
                                    allowClear
                                    mode="multiple"
                                    placeholder={t("Select subject category")}
                                    filterOption={cf_filterOption}
                                    onFocus={() => !subjectCategries?.items?.length && subjectCategoryFetch()}
                                >
                                    {subjectCategries?.items?.length ? subjectCategries?.items.map((item, i) => (
                                        <Select.Option key={i} value={item.id}>{item.name}</Select.Option>
                                    )) : null}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col sm={4} xs={4} md={4} lg={2} className="pt-[30px] flex justify-end">
                            <Button className="ms-5 flex-center px-4" type="primary"
                                onClick={() => addTeacherAccess()}
                            ><AddFilled /></Button>
                        </Col>
                    </Row>
                </Form> : ""
            }
            <Col span={24}>
                <Table
                    dataSource={data()}
                    columns={columns}
                    size="small"
                    pagination={false}
                    loading={isFetching}
                />
            </Col>
        </div>
        // </Form>
    )
}

export default TeacherAccess;