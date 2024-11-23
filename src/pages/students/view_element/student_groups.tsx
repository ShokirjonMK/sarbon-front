import { useMutation } from "@tanstack/react-query";
import { Button, Divider, Drawer, Form, Row, Spin } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { AxiosError } from "axios";
import Actions from "components/Actions";
import FormUIBuilder, { TypeFormUIBuilder } from "components/FormUIBuilder";
import StatusTag from "components/StatusTag";
import { globalConstants } from "config/constants";
import useGetAllData from "hooks/useGetAllData";
import useGetData from "hooks/useGetData";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Notification } from "utils/notification";
import { number_order } from "utils/number_orders";
import { validationErrors } from "utils/validation_error";
import { updateStudentGroup } from "../crud/request";

const span = 24;

export const edu_form_data: TypeFormUIBuilder[] = [
  {
    name: "faculty_id",
    label: "Faculty",
    type: "select",
    required: true,
    url: "faculties",
    child_names: ["direction_id", "edu_plan_id", "group_id"],
    span
  },
  {
    name: "direction_id",
    label: "Direction",
    type: "select",
    required: true,
    url: "directions",
    parent_name: "faculty_id",
    child_names:['edu_plan_id'],
    span
  },
  {
    name: "edu_plan_id",
    label: "Education plan",
    type: "select",
    required: true,
    url: "edu-plans",
    parent_name: "direction_id",
    child_names: ["group_id"],
    span
  },
  {
    name: "group_id",
    label: "Group",
    type: "select",
    required: true,
    url: "groups",
    parent_name: "edu_plan_id",
    render: (e) => e?.unical_name ?? "",
    span
  },
]

const StudentGroups = ({refetch}: {refetch: any}) => {

  const { t } = useTranslation();
  const {user_id} = useParams()
  const [form] = Form.useForm();
  const [allData, setAllData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [actionType, setactionType] = useState<"update" | 'view'>();
  const [selectedStudentGroup, setselectedStudentGroup] = useState<any>();
  const { urlValue } = useUrlQueryParams({ currentPage: 1, perPage: 15 });

  const { data, refetch: refetchStdGroup, isLoading } = useGetAllData({
    queryKey: ["student-groups", user_id],
    url: "student-groups",
    urlParams: { 
      "per-page": urlValue.perPage, 
      page: urlValue.currentPage, 
      filter: JSON.stringify({student_id: user_id}),
      expand: 'group,eduPlan,semestr,faculty,eduYear'
    },
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
      onSuccess: (res) => {
        setAllData(res?.items);
      }
    }
  })

  const { data: studentSemestrSubjects, isLoading: subjectsLoading } = useGetData({
    queryKey: ["student-semestr-subjects", user_id, selectedStudentGroup?.edu_semestr_id],
    url: "student-semestr-subjects",
    urlParams: { 
      "per-page": 0,
      filter: JSON.stringify({student_id: user_id, edu_semestr_id: selectedStudentGroup?.edu_semestr_id}),
      expand: 'eduSemestrSubject.subject,studentVedomst,studentVedomst.studentMark,semestr,studentVedomst.studentMark.examType'
    },
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: (!!selectedStudentGroup?.edu_semestr_id && actionType === "view")
    }
  })

  const columns: ColumnsType<any> = React.useMemo(() => [
    {
      title: '№',
      dataIndex: 'order',
      render: (_, __, i) => number_order(urlValue.currentPage, urlValue.perPage, Number(i), isLoading),
      width: 45,
    },
    {
      title: t('Group'),
      dataIndex: 'group',
      render: (e) => e?.unical_name
    },
    {
      title: t('Faculty'),
      dataIndex: 'faculty',
      render: (e) => e?.name
    },
    {
      title: t('Edu plan'),
      dataIndex: 'eduPlan',
      render: (e) => e?.name
    },
    {
      title: t('Edu semestr'),
      dataIndex: 'semestr',
      render: (e) => e?.name
    },
    {
      title: t('Edu year'),
      dataIndex: 'eduYear',
      render: (e) => e?.name
    },
    {
      title: t('Status'),
      render: (i, e, index) => <StatusTag status={index === (Number(data?.items.length) - 1) ? 1 : 0} />,
      align: "center",
    },
    {
      title: t("Actions"),
      dataIndex: 'actions',
      width: 120,
      align: "center",
      render: (i, e, index) => <Actions
        id={e?.id}
        url={'student-groups'}
        refetch={refetchStdGroup}
        refetchSecond={refetch}
        onClickEdit={() => {
          setOpen(true);
          setactionType("update");
          setselectedStudentGroup(e)
        }}
        onClickView={() => {
          setOpen(true);
          setactionType("view")
          setselectedStudentGroup(e)
        }}
        viewPermission={'student-group_index'}
        editPermission={index === (Number(data?.items.length) - 1) ? "student-group_update" : "_"}
        deletePermission={index === (Number(data?.items.length) - 1) ? "student-group_delete" : "_"}
      />,
    },
  ], [data?.items]);


  const { mutate, isLoading: saveLoading } = useMutation({
    mutationFn: (data) => updateStudentGroup(selectedStudentGroup?.id, data),
    onSuccess: async (res) => {
      if (res?.status === 1) {
        Notification("success", "update", res?.message);
        refetchStdGroup()
        refetch();
        setOpen(false); 
        setactionType(undefined)
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

  return (
    <div className="px-[24px] pt-[15px] pb-[10px]">
      <div className="flex justify-between items-center mb-[12px]">
        <p className="font-medium text-[16px]">{t("Student group")}</p>
        {/* <Button onClick={() => setIsModalOpen(true)}>{t("Edit")}</Button> */}
      </div>
        <Table
          columns={columns}
          dataSource={data?.items.length ? data?.items?.sort((a, b) => a?.semestr_id-b?.semestr_id) : allData}
          pagination={false}
          loading={isLoading}
          size="middle"
          className="mt-3"
          rowClassName="py-[12px]"
          scroll={globalConstants?.tableScroll}
        />
        <Drawer title={actionType === "view" ? `${selectedStudentGroup?.group?.unical_name}, ${selectedStudentGroup?.semestr?.name}` : `Talaba guruhini o'zgartirish. Hozirgi guruhi: ${selectedStudentGroup?.group?.unical_name}`} onClose={() =>{ setOpen(false); setactionType(undefined)}} open={open} width={500}>
          <Spin spinning={actionType === "view" ? subjectsLoading : false} >
              {
                actionType === "update" ? 
                <Form
                  form={form}
                  name="basic"
                  layout="vertical"
                  onFinish={(values) => mutate(values)}
                  >
                    <Row gutter={[24, 0]} >
                      <FormUIBuilder data={edu_form_data} form={form} load={false} />
                    </Row>
                    <div className="flex justify-end">
                      <Button type="primary" htmlType="submit" loading={saveLoading}>{t("Save")}</Button>
                    </div>
                </Form>
                : <div>
                  {
                    studentSemestrSubjects?.items?.map((subject: any, index: number) => (
                      <div key={index} className="bg-slate-50 rounded-lg mb-4 p-2" style={{border: '2px solid #f0f0f0'}} >
                          <h4 className="text-[#595959]">{subject?.eduSemestrSubject?.subject?.name}</h4>
                          {
                            subject?.studentVedomst?.map((vedomst: any, i:number) => (
                              <div key={vedomst?.id}>
                                <Divider orientation="left">{vedomst?.vedomst === 1 ? "1 - shakl" : vedomst?.vedomst === 2 ? "1 - A shakl" : vedomst?.vedomst === 3 ? "1 - B shakl" : ""}</Divider>
                                {
                                  vedomst?.studentMark?.map((mark: any) => (
                                    <p key={mark?.id} className="my-1" >{mark?.examType?.name} - {mark?.ball}</p>
                                  ))
                                }
                              </div>
                            ))
                          }
                      </div>
                    ))
                  }
                </div>
              }
          </Spin>
        </Drawer>
    </div>
  )
}
export default StudentGroups;

// student-group_index
// student-group_delete
// student-group_create
// student-group_update