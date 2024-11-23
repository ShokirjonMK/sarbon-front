import React, { useEffect, useMemo, useState } from "react";
import { Button, Col, Form, message, Row, Select, Switch, Table } from "antd";
import { cf_filterOption } from "utils/others_functions";
import useGetAllData from "hooks/useGetAllData";
import { AddFilled, DeleteFilled } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";
import { ColumnsType } from "antd/es/table";
import { IDepartment, IFaculty, IKafedra } from "models/edu_structure";
import { addUserAccess, generateUserAccessType, removeUserAccess } from "utils/generate_access";

type TypeUserAccessData = {
  user_access_type_id: number | string
  department_id: number | string
  is_leader: number | string
  work_rate_id: number | string
  work_load_id: number | string
}

type TypeUserAccess = {
  userAccess: generateUserAccessType,
  setUserAccess: React.Dispatch<React.SetStateAction<generateUserAccessType>>,
  edit?: boolean
}

const UserAccess: React.FC<TypeUserAccess> = ({ userAccess, setUserAccess, edit }): JSX.Element => {
  const [_form] = Form.useForm();
  const { t } = useTranslation();
  const [user_access_type_id, setUserAccessTypeId] = useState<string>();

  const { data: access_types, refetch: access_types_fetch } = useGetAllData({ queryKey: ['/user-access-types'], url: '/user-access-types', urlParams: { "per-page": 0 } });
  const { data: faculties, refetch: faculties_fetch } = useGetAllData<IFaculty>({ queryKey: ['faculties'], url: "faculties", urlParams: { "per-page": 0 } });
  const { data: kafedra, refetch: kafedra_fetch } = useGetAllData<IKafedra>({ queryKey: ['kafedras'], url: "kafedras", urlParams: { "per-page": 0 } });
  const { data: department, refetch: department_fetch } = useGetAllData<IDepartment>({ queryKey: ['departments'], url: "departments", urlParams: { "per-page": 0 } });

  const { data: work_load, refetch: work_load_fetch, isFetching: load_loading } = useGetAllData({ queryKey: ['work-loads'], url: "work-loads", urlParams: { "per-page": 0 } });
  const { data: work_rate, refetch: work_rate_fetch, isFetching: rate_loading } = useGetAllData({ queryKey: ['work-rates'], url: "work-rates", urlParams: { "per-page": 0 } });

  const selectItem = (id: string) => {
    switch (id) {
      case '1': return faculties?.items ?? []
      case '2': return kafedra?.items ?? []
      case '3': return department?.items ?? []
    }
  }

  const getName = (id: number, type?: number): string => {
    if (!type) return access_types?.items?.find(item => item?.id === id)?.name ?? ""
    if (type === 1) return faculties?.items?.find(item => item?.id === id)?.name ?? "";
    if (type === 2) return kafedra?.items?.find(item => item?.id === id)?.name ?? ""
    if (type === 3) return department?.items?.find(item => item?.id === id)?.name ?? ""
    return "";
  };

  const _addUserAccess = () => {
    const user_access_type_id = _form.getFieldValue("user_access_type");
    const table_id = _form.getFieldValue("department");
    const is_leader = _form.getFieldValue("is_leader");
    const work_load_id = _form.getFieldValue("work_load_id");
    const work_rate_id = _form.getFieldValue("work_rate_id");

    if (!user_access_type_id) return message.warning("tarkibiy bo'lim turini tanlang!");
    if (!table_id) return message.warning("Bo'limni tanlang!");
    if (!work_load_id) return message.warning("Ish o'rnini tanlang!");
    if (!work_rate_id) return message.warning("Ish stavkasini tanlang!");

    setUserAccess(p => {
      if(p[user_access_type_id] && p[user_access_type_id][`${table_id}-${is_leader ? 1 : 0}`]){
        if(is_leader && Object.keys(p[user_access_type_id][`${table_id}-${is_leader ? 1 : 0}`])?.length > 0){
          message.error("Boshliq tarkibiy bo'limda bitta bo'lishi kerak!");
          return p;
        }

        if(p[user_access_type_id][`${table_id}-${is_leader ? 1 : 0}`]?.find(e => e === `${work_load_id}-${work_rate_id}`)){
          message.error("Avval kiritilgan!");
          return p;
        }
      }

      return addUserAccess(p, { user_access_type_id, table_id, is_leader: is_leader ? 1 : 0, work_load_id, work_rate_id })
    });
    _form.resetFields();
  };

  const _removeUserAccess = (user_access_type_id: number, table_id: number, is_leader: number, work_load_id: number, work_rate_id: number) => {
    setUserAccess(p => {
      return removeUserAccess(p, { user_access_type_id, table_id, is_leader, work_load_id, work_rate_id });
    });
  };

  const data = useMemo(() => {
    const arr: any = [];

    Object.entries(userAccess ?? {})?.forEach(([key, value]) => {
      Object.entries(value)?.forEach(([_key, _value]) => {
        _value?.forEach(e => {
          arr?.push({
            user_access_type_id: key,
            department_id: _key?.split("-")[0],
            is_leader: _key?.split("-")[1],
            work_load_id: e?.split("-")[0],
            work_rate_id: e?.split("-")[1],
          })
        })
      })
    })

    return arr
  }, [userAccess])

  const columns: ColumnsType<TypeUserAccessData> = [
    {
      title: "№",
      key: "order",
      render: (_, __, i) => i + 1,
      width: 40,
    },
    {
      title: t("Structural structure"),
      key: "type",
      render: (i, e) => getName(Number(e.user_access_type_id)),
    },
    {
      title: t("Division"),
      key: "dep",
      render: (i, e) => getName(Number(e.department_id), Number(e.user_access_type_id)),
    },
    {
      title: t("Work load"),
      key: "work_load",
      render: (i, e) => work_load?.items?.find(a => a?.id == e?.work_load_id)?.name,
    },
    {
      title: t("Work rate"),
      key: "work_rate",
      render: (i, e) => work_rate?.items?.find(a => a?.id == e?.work_rate_id)?.type,
    },
    {
      title: t("Position"),
      dataIndex: "is_leader",
      key: "lead",
      render: e => Number(e) ? "Boshliq" : "Xodim",
    },
    ...(edit ? [
      {
        title: t("Action"),
        key: "action",
        render: (i, e) => <div className="d-flex justify-content-center aligin-items-center">
          <DeleteFilled
            onClick={() => _removeUserAccess(Number(e.user_access_type_id), Number(e.department_id), Number(e.is_leader), Number(e?.work_load_id), Number(e?.work_rate_id))}
            style={{ cursor: "pointer" }}
            className="text-danger"
            fontSize={18}
          />
        </div>,
        width: 60,
        align: "center"
      }
    ] as ColumnsType<TypeUserAccessData> : [])
  ];

  return (
    <div>
      {
        edit ? <Form
          form={_form}
          layout="vertical"
        >
          <Row gutter={[12, 12]} >
            <Col xs={24} sm={24} md={12} lg={8} xl={8} >
              <Form.Item
                name={`user_access_type`}
                label={t`Structural structure`}
              >
                <Select
                  showSearch
                  allowClear
                  className="w-full"
                  placeholder={t("Select userAccess")}
                  filterOption={cf_filterOption}
                  onChange={(e) => setUserAccessTypeId(e)}
                  onFocus={() => !access_types?.items?.length && access_types_fetch}
                  onClear={() => { _form.resetFields(["department"]) }}
                >
                  {access_types?.items?.length ?
                    access_types?.items?.map((item, i) => (
                      <Select.Option key={i} value={item.id}>{item.name}</Select.Option>
                    )) : null}
                </Select>
              </Form.Item>
            </Col>
            <Col sm={24} xs={24} md={12} lg={8} xl={8}>
              <Form.Item
                name={`department`}
                label={t`Division`}
              >
                <Select
                  allowClear
                  showSearch
                  className="w-full"
                  placeholder={t("Select department")}
                  filterOption={cf_filterOption}
                  disabled={!user_access_type_id}
                // onFocus={() => !languages?.items?.length && langFetch()}
                >
                  {selectItem(String(user_access_type_id))?.length ? selectItem(String(user_access_type_id))?.map((item, i) => (
                    <Select.Option key={i} value={item.id}>{item.name}</Select.Option>
                  )) : null}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8} >
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
                // onClear={() => {_form.resetFields(["work_load_id"])}}
                >
                  {work_load?.items?.length ?
                    work_load?.items?.map((item, i) => (
                      <Select.Option key={i} value={item.id}>{item.name}</Select.Option>
                    )) : null}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
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
                // onClear={() => {_form.resetFields(["work_rate_id"])}}
                >
                  {work_rate?.items?.length ?
                    work_rate?.items?.map((item, i) => (
                      <Select.Option key={i} value={item.id}>{item.type}</Select.Option>
                    )) : null}
                </Select>
              </Form.Item>
            </Col>
            <Col sm={20} xs={20} md={12} lg={8} xl={8}>
              <Form.Item
                name={`is_leader`}
                label={t`Employee or leader`}
                valuePropName="checked"
              >
                <Switch checkedChildren="Boshliq" unCheckedChildren="Xodim" />
                {/* <Select
                  allowClear
                  className="w-full"
                  placeholder={t("Employee or leader")}
                >
                  <Select.Option value="0" >Xodim</Select.Option>
                  <Select.Option value="1" >Boshliq</Select.Option>
                </Select> */}
              </Form.Item>
            </Col>
            <Col sm={4} xs={4} md={12} lg={8} xl={8} className="pt-[30px] flex">
              <Button className="flex-center px-4" type="primary"
                onClick={() => _addUserAccess()}
              ><AddFilled /></Button>
            </Col>
          </Row>
        </Form> : ""
      }
      <Col span={24}>
        <Table
          dataSource={data}
          columns={columns}
          size="small"
          pagination={false}
          loading={load_loading || rate_loading}
        />
      </Col>
    </div>
  )

}



export default UserAccess;



/**
 * {
 *    id: [
 *       "23-0-3-4",
 *       "34-1-3-4",
 *    ],
 *    id: [
 *       "23-0-3-4",
 *       "34-1-3-4",
 *    ],
 * }
 */