import React, { useMemo, useState } from "react";
import { Button, Col, Form, FormInstance, message, Row, Select, Table } from "antd";
import { cf_filterOption } from "utils/others_functions";
import useGetAllData from "hooks/useGetAllData";
import { AddFilled, DeleteFilled } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";
import { ColumnsType } from "antd/es/table";

type TypeUserAccess = {
  form: FormInstance<any>
  edit?: boolean
}

const LoadRate: React.FC<TypeUserAccess> = ({ form, edit }): JSX.Element => {
  const [_form] = Form.useForm();
  const { t } = useTranslation();
  const [change, setChange] = useState<boolean>(false);

  const { data: work_rate, refetch: work_rate_fetch } = useGetAllData({ queryKey: ['work-rates'], url: "work-rates", urlParams: { "per-page": 0 } });
  const { data: work_load, refetch: work_load_fetch } = useGetAllData({ queryKey: ['work-loads'], url: "work-loads", urlParams: { "per-page": 0 } });

  const _add = () => {
    const work_load_id = _form.getFieldValue("work_load_id");
    const work_rate_id = _form.getFieldValue("work_rate_id");

    if (!work_load_id) return message.warning("Ish o'rnini tanlang!");
    if (!work_rate_id) return message.warning("Ish stavkasini tanlang!");

    const arr = JSON.parse(form.getFieldValue("load_rate") ?? "[]");

    if(form.getFieldValue("is_leader") && arr.length > 0) {
      message.error("Boshliq tarkibiy bo'limda bitta bo'lishi kerak!");
      _form.resetFields();
      return
    }

    if(!arr.includes(`${work_load_id}-${work_rate_id}`)){
      arr.push(`${work_load_id}-${work_rate_id}`);
      form.setFieldValue("load_rate", JSON.stringify(arr));

      setChange(p => !p);
      _form.resetFields();
    } else {
      message.error("Avval tanlangan!");
    }
  };

  const _remove = (e: string) => {
    const arr = JSON.parse(form.getFieldValue("load_rate") ?? "[]");

      form.setFieldValue("load_rate", JSON.stringify(arr?.filter((a: string) => a !== e)));

      setChange(p => !p);
      _form.resetFields();
  };

  const columns: ColumnsType<any> = useMemo(() => [
    {
      title: "№",
      key: "order",
      render: (_, __, i) => i + 1,
      width: 40,
    },
    {
      title: t("Work load"),
      key: "work_load",
      render: (e) => work_load?.items?.find(a => a?.id == e?.split("-", 1))?.name,
    },
    {
      title: t("Work rate"),
      key: "work_rate",
      render: (e) => work_rate?.items?.find(a => a?.id == e?.split("-")[1])?.type,
    },
    ...(edit ? [
      {
        title: t("Action"),
        key: "action",
        render: (e) => <div className="d-flex justify-content-center aligin-items-center">
          <DeleteFilled
            onClick={() => _remove(e)}
            style={{ cursor: "pointer" }}
            className="text-danger"
            fontSize={18}
          />
        </div>,
        width: 60,
        align: "center"
      }
    ] as ColumnsType<any> : [])
  ], [work_load, work_rate]);

  return (
    <div className="my-2 p-2 border border-solid border-blue-500 rounded-xl" >
      {
        edit ? <Form
          form={_form}
          layout="vertical"
        >
          <Row gutter={[12, 12]} >
            <Col xs={24} sm={10} md={10} lg={10} xl={10} >
              <Form.Item
                name={`work_load_id`}
                label={t`Work load`}
              >
                <Select
                  showSearch
                  allowClear
                  className="w-full"
                  placeholder={t("Select work load")}  
                  filterOption={cf_filterOption}
                  onFocus={() => !work_load?.items?.length && work_load_fetch}
                >
                  {work_load?.items?.length ?
                    work_load?.items?.map((item, i) => (
                      <Select.Option key={i} value={item.id}>{item.name}</Select.Option>
                    )) : null}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={10} md={10} lg={10} xl={10}>
              <Form.Item
                name={`work_rate_id`}
                label={t`Work rate`}
              >
                <Select
                  showSearch
                  allowClear
                  className="w-full"
                  placeholder={t("Select work rate")}
                  filterOption={cf_filterOption}
                  onFocus={() => !work_rate?.items?.length && work_rate_fetch}
                >
                  {work_rate?.items?.length ?
                    work_rate?.items?.map((item, i) => (
                      <Select.Option key={i} value={item.id}>{item.type}</Select.Option>
                    )) : null}
                </Select>
              </Form.Item>
            </Col>
            <Col sm={4} xs={4} md={4} lg={4} xl={4} className="pt-[30px] flex">
              <Button className="flex-center px-4 w-full" type="primary"
                onClick={() => _add()}
              ><AddFilled /></Button>
            </Col>
          </Row>
        </Form> : ""
      }
      <Col span={24}>
        <Table
          dataSource={JSON.parse(form.getFieldValue("load_rate") ?? "[]")}
          columns={columns}
          size="small"
          pagination={false}
        />
      </Col>
    </div>
  )

}

export default LoadRate;