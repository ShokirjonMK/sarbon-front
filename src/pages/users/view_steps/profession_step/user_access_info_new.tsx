import { Button, Col, Form, Modal, Radio, Row, Select, Spin, Tag } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {  useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { _generateUserAccess } from "utils/generate_access";
import checkPermission from "utils/check_permission";
import useGetAllData from "hooks/useGetAllData";
import Table, { ColumnsType } from "antd/es/table";
import { Delete16Filled } from "@fluentui/react-icons";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import DeleteData from "components/deleteData";
import { Notification } from "utils/notification";
import { saveUserAccess } from "pages/users/crud/request";
import { validationErrors } from "utils/validation_error";

const UserAccessInfoUserViewNew = ({ user_id, roles }: {user_id: number|string|undefined, roles: any }) => {

  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { urlValue, writeToUrl } = useUrlQueryParams({});
  const [form] = Form.useForm()

  const columns: ColumnsType<any> = [
    {
      title: "№",
      key: "order",
      render: (_, __, i) => i + 1,
      width: 40,
    },
    {
      title: t("Structural structure"),
      key: "type",
      dataIndex: "department",
      render: (e) => e?.table,
    },
    {
      title: t("Division"),
      key: "dep",
      dataIndex: "department",
      render: (e) => e?.model,
    },
    {
      title: t("Position"),
      dataIndex: "is_leader",
      key: "lead",
      render: e => Number(e) ? "Boshliq" : "Xodim",
    },
    {
      title: t("Work load"),
      key: "loadRate",
      dataIndex: "loadRate",
      render: (e: any) => (
        <div className="lg:flex gap-3">
            {
                e?.map((t: any) => <Tag key={t?.id} className="text-[16px] flex w-max py-1 px-3 gap-4">
                    {t?.workLoad?.name} - {t?.workRate?.type}
                    <DeleteData
                        permission={"user-access_delete"}
                        refetch={refetch}
                        url={"user-accesses"}
                        id={t?.id}
                    >
                        <Delete16Filled className="delete text-[#595959] hover:cursor-pointer" />
                    </DeleteData>
                </Tag>)
            }
        </div>
      ),
    },
  ];

  const { data: userAccessData, refetch, isLoading } = useGetAllData({
      queryKey: ["user-accesses", user_id],
      url: `user-accesses?expand=department,loadRate.workLoad,loadRate.workRate`,
      urlParams: { "per-page": 0, filter: JSON.stringify({user_id})},
      options: {
          enabled: !!user_id,
          refetchOnWindowFocus: false,
          retry: 1,
      }
  });

  const { data: workLoads } = useGetAllData({ 
    queryKey: ['work-loads', isModalOpen],
    url: "work-loads",
    options:{
      enabled: isModalOpen
    }
  });
  const { data: workRates } = useGetAllData({ 
    queryKey: ['work-rates', isModalOpen], 
    url: "work-rates", 
    options:{
      enabled: isModalOpen
    }
  });

  const { data: userAccessTypes } = useGetAllData({
    queryKey: ["user-access-types", user_id, isModalOpen],
    url: `user-access-types`,
    urlParams: { "per-page": 0},
    options: {
        enabled: isModalOpen,
        refetchOnWindowFocus: false,
        retry: 1,
    }
  });

  const { data: bolinmalar } = useGetAllData({
    queryKey: [urlValue?.filter_like?.user_access_url],
    url: urlValue?.filter_like?.user_access_url,
    urlParams: { "per-page": 0},
    options: {
        enabled: !!user_id && (urlValue?.filter_like?.user_access_url === "faculties" || urlValue?.filter_like?.user_access_url === "kafedras" || urlValue?.filter_like?.user_access_url === "departments"),
        refetchOnWindowFocus: false,
        retry: 1,
    }
  });

  useEffect(() => {
    if(!isModalOpen){
      writeToUrl({name: "user_access_url", value: undefined})
      form.resetFields()
    }
  }, [isModalOpen])


  useEffect(() => {
    form.setFieldsValue({table_id: undefined})
  }, [urlValue?.filter_like?.user_access_url])


  const { mutate, isLoading: saveLoading } = useMutation({
    mutationFn: (data: any) => saveUserAccess(user_id, {...data, user_access_type_id: userAccessTypes?.items.find(i => i?.url === urlValue?.filter_like?.user_access_url)?.id}),
    onSuccess: async (res) => {
      if (res?.status === 1) {
        Notification("success", "update", res?.message);
        refetch();
        form.resetFields()
      } else {
        Notification("error", "update", res?.message);
      }
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", "update", error?.response?.data ? error?.response?.data?.message : "");
      validationErrors(form, error?.response?.data);
    },
    retry: 0,
});
  
  const saveData = (values: any) => {

    const smiliarObj = userAccessData?.items?.find((item:any) => {
      if(item?.user_access_type_id == userAccessTypes?.items.find(i => i?.url === urlValue?.filter_like?.user_access_url)?.id && item?.table_id == values?.table_id){
        return !!item?.loadRate?.find((t: any) => (t?.work_rate_id == values?.work_rate_id && t?.work_load_id == values?.work_load_id))
      }
      return false    
    })

    if(smiliarObj){
      form.setFields([{name: "work_rate_id", errors: ["Bu bo'limga bu stavkaga kiritilgan!"]}, {name: "work_load_id", errors: ["Bu bo'limga bu yuklamaga kiritilgan!"]}])
    } else {
      mutate(values);
    }
  }

  return (
    <div className="px-[24px] pt-[30px] pb-[10px]">
      <Spin spinning={isLoading} >
        <div className="flex justify-between items-center mb-[12px]">
          <p className="font-medium text-[16px]">{t("Structural structure")}</p>
          { checkPermission("user-access_create") ? <Button onClick={() => setIsModalOpen(true)}>{t("Create")}</Button> : null}
        </div>

        <Table
          dataSource={userAccessData?.items}
          columns={columns}
          size="small"
          pagination={false}
          loading={false}
        />
      </Spin>


      {/* edit form */}
      <Modal
        title={t`Structural structure`}
        width={1700}
        open={isModalOpen}
        footer={false}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form
          form={form}
          name="basic"
          layout="vertical"
          initialValues={{is_leader: "0"}}
          onFinish={(values) => saveData(values)}
        >
          <Row gutter={[12, 0]} >
            <Col xs={24} sm={24} md={12} lg={8} xl={8} >
              <Form.Item
                name={`user_access_type_id`}
                label={t`Structural structure`}
                rules={[{ required: true, message: 'Tarkibiy tuzilmani tanlang!' }]}
              >
                <Select
                  allowClear
                  className="w-full"
                  placeholder={t("Select userAccess")}
                  onChange={(e) => {writeToUrl({name: "user_access_url", value: e})}}
                >
                  {userAccessTypes?.items?.length ?
                    userAccessTypes?.items?.map((item, i) => (
                      <Select.Option key={i} value={item.url}>{item.name}</Select.Option>
                    )) : null}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8} >
              <Form.Item
                name={`table_id`}
                label={t`Bo'linma`}
                rules={[{ required: true, message: "Bo'linmani tanlang!" }]}
              >
                <Select
                  allowClear
                  className="w-full"
                  disabled={!urlValue?.filter_like?.user_access_url}
                  placeholder={t("Bo'linma")}
                >
                  {bolinmalar?.items?.length ?
                    bolinmalar?.items?.map((item, i) => (
                      <Select.Option key={i} value={item.id}>{item.name}</Select.Option>
                    )) : null}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8} >
              <Form.Item
                name={`role_name`}
                label={t`Roles`}
                rules={[{ required: true, message: 'Roleni tanlang!' }]}
              >
                <Select
                  allowClear
                  className="w-full"
                  placeholder={t("Bo'linma")}
                >
                  {roles?.length ?
                    roles?.map((item: string, i: number) => (
                      <Select.Option key={i} value={item}>{item}</Select.Option>
                    )) : null}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8} >
              <Form.Item
                name={`work_load_id`}
                label={t`Ish yuklamasi`}
                rules={[{ required: true, message: 'Ish yuklamasini tanlang!' }]}
              >
                <Select
                  allowClear
                  className="w-full"
                  placeholder={t("Ish yuklamasi")}
                >
                  {workLoads?.items?.length ?
                    workLoads?.items?.map((item: any, i: number) => (
                      <Select.Option key={i} value={item?.id}>{item?.name}</Select.Option>
                    )) : null}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8} >
              <Form.Item
                name={`work_rate_id`}
                label={t`Ish stavkasi`}
                rules={[{ required: true, message: 'Ish stavkasini tanlang!' }]}
              >
                <Select
                  allowClear
                  className="w-full"
                  placeholder={t("Ish stavkasi")}
                >
                  {workRates?.items?.length ?
                    workRates?.items?.map((item: any, i: number) => (
                      <Select.Option key={i} value={item?.id}>{item?.type}</Select.Option>
                    )) : null}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={6} >
              <Form.Item
                name={`is_leader`}
                label={t`Lavosimi`}
              >
                <Radio.Group>
                  <Radio value={"1"}>Boshliq</Radio>
                  <Radio value={"0"}>Xodim</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={2} >
              <Button loading={saveLoading} htmlType="submit" type="primary" className="md:mt-8 w-full max-md:mb-4">{t("Save")}</Button>
            </Col>
          </Row>
          <Table
            dataSource={userAccessData?.items}
            columns={columns}
            size="small"
            pagination={false}
            loading={false}
          />
        </Form>
      </Modal>
    </div>
  )
}
export default UserAccessInfoUserViewNew;