import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Row, Select } from "antd";
import { useTranslation } from "react-i18next";
import { Dismiss20Regular } from "@fluentui/react-icons";
import { getLanguages } from "services/language";
import useGetData from "hooks/useGetData";
import { ILanguage } from "components/Structure/header/components/types";

const { Option } = Select;

function SingleInputLanguage(): JSX.Element {

    const { t } = useTranslation();
    const [names, setNames] = React.useState<Array<string>>(['uz']);

    const { data: languages } = useGetData<ILanguage>({
        queryKey: ["languages"],
        url: "languages",
        options: { staleTime: Infinity, refetchOnWindowFocus: false, retry: 0 },
    });

    const onAddNewForm = React.useCallback(() => {
        const langId = languages?.items.filter((e: any) => !names.includes(e.lang_code))
        if (langId?.length) {
            setNames(prevState => ([...prevState, langId[0].lang_code]))
        }
    }, [languages, names])


    const removeInput = React.useCallback((id: string) => {
        const newNames = names.filter(e => e !== id);
        setNames(newNames)
    }, [names]);


    const selectLanguage = React.useCallback((event_lang_code: string, element_lang_code: string) => {

        const index = names.indexOf(element_lang_code);

        if (!names.includes(event_lang_code)) {

            names.splice(index, 1, event_lang_code);
            setNames([...names]);

        } else {
            return
        }

    }, [names])

    return (
        <Row gutter={[12, 0]}>
            {
                names?.map((e: any) => {
                    return (
                        <React.Fragment key={e} >
                            <Col span={16}>
                                <Form.Item
                                    label={`${t("Name")} (${e})`}
                                    name={`name[${e}]`}
                                    shouldUpdate
                                    rules={[{ required: true, message: `Please input name(${e}) ...` }]}
                                    className="mb-2"
                                >
                                    <Input placeholder={`${t("Enter the name")} (${e}) ...`} className="ant_input_custom" />
                                </Form.Item>
                            </Col>
                            <Col span={8} style={{ marginTop: '30px', display: "flex" }}>
                                <Select defaultValue={e} className="me-2 w_150 w-[100%]" onChange={(event_lang_code: string) => selectLanguage(event_lang_code, e)}>
                                    {
                                        languages?.items?.length && languages.items?.map((l: any) => {
                                            if (!names.includes(l.lang_code) || l.lang_code === e) {
                                                return <Option key={l.id} value={l.lang_code}>{l.name}</Option>
                                            }
                                        })
                                    }
                                </Select>
                                <Button danger ghost className="bg-white" onClick={() => removeInput(e)} disabled={names.length === 1} >
                                    <Dismiss20Regular />
                                </Button>
                            </Col>
                        </React.Fragment>
                    )
                })
            }
            <Button type="link" className="ps-0 mb-4" disabled={names.length === languages?.items.length} onClick={onAddNewForm}>+ {t("Add translation")}</Button>
        </Row>
    )
}



export default SingleInputLanguage;