import { ReactNode, useState } from "react";
import { Alert, Button, Col, Divider, Form, Row, Select, Spin } from "antd";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import useGetOneData from 'hooks/useGetOneData';
import Table, { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { renderFullName } from "utils/others_functions";
import checkPermission from "utils/check_permission";
import { useMutation } from "@tanstack/react-query";
import { Notification } from "utils/notification";
import { addGroupToTimeTable } from "./request";
import { AxiosError } from "axios";
import { validationErrors } from "utils/validation_error";
import { globalConstants } from "config/constants";
import useGetAllData from "hooks/useGetAllData";
import useGetData from "hooks/useGetData";

interface DataType {
    name: string;
    value: ReactNode;
    value2?: ReactNode;
    value3?: ReactNode;
  }

const TimeTableView = () => {
    
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [isHasSubject, setisHasSubject] = useState<boolean>(false)
    const [isNewGroupForm, setisNewGroupForm] = useState<boolean>(false)
    const [direction_id, setDirection_id] = useState<number>()
  
    const {time_table_id} = useParams()
    const sharedOnCell = (_: DataType, index: number | undefined) => {
        if (index || index == 0) {
            if (index < 1) {
            return { colSpan: 0 };
            }
        }
        return {};
    };

    const { data, isLoading: getIsLoading } = useGetOneData({
        queryKey: ['time-tables', time_table_id],
        url: `time-tables/${time_table_id}?expand=teacher,room,building,twoGroups,twoGroups.teacher,twoGroups.building,twoGroups.room,updateBy,createdBy,subject,subjectCategory,group,week,para,eduPlan,semestr,language,faculty,direction`,
        options: {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: !!time_table_id,
        }
    })

  const { data: directions } = useGetData({
    queryKey: ["directions", data?.data?.faculty_id],
    url: "directions?sort=-id",
    urlParams: { "per-page": 0, filter: JSON.stringify({faculty_id: data?.data?.faculty_id}) },
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!data?.data?.faculty_id
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



  
    const columns: ColumnsType<DataType> = [
        {
          title: t("Name"),
          dataIndex: "name",
          rowScope: "row",
        },
        {
          title: t("Value"),
          dataIndex: "value",
          onCell: (_, index) => ({
            colSpan: (index == 0) ? 3 : 1,
          }),
        },
        {
          title: t("Name2"),
          dataIndex: "value2",
          onCell: (_, index) => sharedOnCell(_, index),
          className: "bg-[#FAFAFA]"
        },
        {
          title: t("Name3"),
          dataIndex: "value3",
          onCell: (_, index) => sharedOnCell(_, index),
        },
      ];
    
      const tableData: DataType[] = [
        {
          name: t("Group"),
          value: data?.data?.group?.unical_name,
        },
        {
          name: t("Subject"),
          value: data?.data?.subject?.name,
          value2: t("Subject category"),
          value3: data?.data?.subjectCategory?.name,
        },
        {
          name: t("Faculty"),
          value: data?.data?.faculty?.name,
          value2: t("Direction"),
          value3: data?.data?.direction?.name,
        },
        {
          name: t("Week"),
          value: data?.data?.week?.name,
          value2: t("Para"),
          value3: data?.data?.para?.name + ", " + data?.data?.para?.start_time + " - " + data?.data?.para?.end_time,
        },
        {
            name: t("Start date"),
            value: data?.data?.start_study,
            value2: t("End date"),
            value3: data?.data?.end_study,
          },
        {
          name: t("Building"),
          value: data?.data?.building?.name,
          value2: t("Room"),
          value3: data?.data?.room?.name,
        },
        {
          name: t("Teacher"),
          value: renderFullName(data?.data?.teacher),
          value2: t("Language"),
          value3: data?.data?.language?.name,
        },
        {
          name: t("Edu plan"),
          value: data?.data?.eduPlan?.name,
          value2: t("Semestr"),
          value3: data?.data?.semestr?.name,
        },
        {
          name: t("CreatedBy"),
          value: (
            <div>
              <span className="text-gray-400">
                {t("name")}/{t("Last Name")}/{t("Role")} :{" "}
              </span>
              {data?.data?.createdBy?.first_name} {data?.data?.createdBy?.last_name}{" "}
              (
              {data?.data?.createdBy?.role.map((item: string) => {
                return item;
              })}
              )
              {/* <p>
                <span className="text-gray-400">{t("Login")}: </span>
                {data?.data?.createdBy?.username}
              </p> */}
              <time>
                <span className="text-gray-400">{t("Date")}: </span>
                {data?.data?.created_at ? dayjs.unix(data?.data?.created_at).format("MM-DD-YYYY hh:mm:ss a") : null}
              </time>
            </div>
          ),
          value2: t("UpdateBy"),
          value3: (
            <div>
              <span className="text-gray-400">
                {t("name")}/{t("Last Name")}/{t("Role")} :{" "}
              </span>
              {data?.data?.updatedBy?.first_name} {data?.data?.updatedBy?.last_name}{" "}
              (
              {data?.data?.updatedBy?.role.map((item: string) => {
                return item;
              })}
              )
              {/* <p>
                <span className="text-gray-400">{t("Login")}: </span>
                {data?.data?.updatedBy?.username}
              </p> */}
              <time>
                <span className="text-gray-400">{t("Date")}: </span>
                {data?.data?.updated_at ? dayjs.unix(data?.data?.updated_at).format("MM-DD-YYYY hh:mm:ss a") : null}
              </time>
            </div>
          )
        }
      ];

      const tableDataForSecondG: DataType[] = [
        {
          name: t("Teacher"),
          value: renderFullName(data?.data?.twoGroups?.teacher),
        },
        {
          name: t("Patok"),
          value: 2,
        },
        {
            name: t("Building"),
            value: data?.data?.twoGroups?.building?.name,
            value2: t("Room"),
            value3: data?.data?.twoGroups?.room?.name,
          },
      ];

      const { mutate, isLoading } = useMutation({
        mutationFn: (group_id: number) => addGroupToTimeTable(time_table_id, group_id),
        onSuccess: async (res) => {
            Notification("success", "update", res?.message);
            form.resetFields()
        },
        onError: (error: AxiosError) => {
            validationErrors(form, error?.response?.data)
        },
        retry: 0,
    });

    const onSelectGroup = (id: number) => {
      let obj = ''
      if(id) obj = groups?.items?.find((item: any) => item?.id === id)?.activeEduSemestr?.eduSemestrSubjects?.find((item: any) => item?.subject_id === data?.data?.subject_id)
      setisHasSubject(obj !== Object(obj))

    }

    return(
        <Spin spinning={getIsLoading} size="small">
            <div>
                <HeaderExtraLayout
                    title={data?.data?.subject?.name}
                    isBack={true}
                    breadCrumbData={[
                        {name: "Home", path: '/'},
                        {name: "Time tables", path: '/time-tables'},
                        {name: data?.data?.subject?.name, path: `/time-tables`},
                    ]}
                    btn={
                        checkPermission("time-table_update") ? <Link to={`/time-tables/update/${data?.data?.type}/${data?.data?.edu_plan_id}/${data?.data?.group_id}/${data?.data?.week_id}/${data?.data?.para_id}/${data?.data?.id}`}>
                            <Button>{t("Update")}</Button>
                        </Link> : ""
                    }
                />
                <div className="px-[24px] py-[20px]">
                  <div className="table-none-hover">
                      <Table
                          columns={columns}
                          bordered
                          dataSource={tableData}
                          showHeader={false}
                          pagination={false}
                      />
                  </div>
                  {
                      data?.data?.two_groups == 1 ?
                      <>
                          <Divider orientation="left" plain>{t("Second group")}</Divider>
                          <div className="table-none-hover">
                              <Table
                                  columns={columns}
                                  bordered
                                  dataSource={tableDataForSecondG}
                                  showHeader={false}
                                  pagination={false}
                              />
                          </div>
                      </> : ""
                  }
                {(data?.data?.subject_category_id === globalConstants.lectureIdForTimeTable && checkPermission("time-table_create-add-group")) ? <Button className="my-4" onClick={() => setisNewGroupForm(prev => !prev)}>Boshqa yo'nalishdan guruh qo'shish</Button> : null}

                {isNewGroupForm ? <div className="bg-gray-100 rounded-md px-3 pt-3 mb-3">
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
                            {checkPermission("time-table_create-add-group") ? <Button type="primary" loading={isLoading} disabled={isHasSubject} htmlType="submit">{t("Submit")}</Button> : ""}
                          </Form.Item>
                        </Col>
                      </Row>
                  </Form>
                </div> : null}
                {
                  isHasSubject ? 
                  <Alert
                    message=""
                    description={`${data?.data?.subject?.name} fani bu guruh semestr faniga to'g'ri kelmaydi!`}
                    type="warning"
                  /> : ""
                }
              </div>
            </div>
        </Spin>
    )
}
export default TimeTableView;