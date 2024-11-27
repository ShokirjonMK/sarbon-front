import { useMutation } from "@tanstack/react-query";
import { Button, Drawer, Form, Input, Row, Spin, Tag } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { AxiosError } from "axios";
import Actions from "components/Actions";
import FormUIBuilder, { TypeFormUIBuilder } from "components/FormUIBuilder";
import StatusTag from "components/StatusTag";
import { globalConstants } from "config/constants";
import useGetAllData from "hooks/useGetAllData";
import useGetData from "hooks/useGetData";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Notification } from "utils/notification";
import { number_order } from "utils/number_orders";
import { validationErrors } from "utils/validation_error";
import { updateSubjectSemestr } from "../crud/request";
import CustomPagination from "components/Pagination";
import checkPermission from "utils/check_permission";

const span = 24;

const formData: TypeFormUIBuilder[] = [
  // {
  //   name: "name",
  //   label: "Name",
  //   required: true,
  //   type: "input",
  //   span
  // },
  {
    name: "description",
    label: "Description",
    required: true,
    type: "textarea",
    row: 3,
    span
  },
  {
    name: "edu_year_id",
    label: "Edu year",
    required: true,
    url: "edu-years",
    type: "select",
    filter: {status: "all"},
    render: (e) => <div>{e?.name}{ e?.status ? <Tag color="success" className="ml-2" >Active</Tag> : null}</div>,
    span
  },
  {
    name: "edu_form_id",
    label: "Edu form",
    required: true,
    type: "select",
    url: "edu-forms",
    span
  },
  {
    name: "semestr_id",
    label: "Semestr",
    required: true,
    type: "select",
    url: "semestrs",
    span
  },
  {
    name: "subject_type_id",
    label: "Subject type",
    required: true,
    url: "subject-types",
    type: "select",
    span
  },
  {
    name: "credit",
    label: "Credit",
    required: true,
    type: "number",
    span
  },
  {
    name: "status",
    label: "Status",
    type: "switch",
    span
  },
];

const SubjectSemestrs = () => {

  const { t } = useTranslation();
  const {user_id} = useParams()
  const {id} = useParams()
  const [form] = Form.useForm();
  const [allData, setAllData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedSubjectSemestr, setselectedSubjectSemestr] = useState<any>();
  const { urlValue } = useUrlQueryParams({ currentPage: 1, perPage: 15 });  

  const { data, refetch, isLoading } = useGetAllData({
    queryKey: ["subject-semestrs", user_id],
    url: "subject-semestrs",
    urlParams: { 
      "per-page": urlValue.perPage, 
      page: urlValue.currentPage, 
      filter: JSON.stringify({subject_id: id}),
      expand: 'eduYear,semestr,subjectType,eduForm,kafedra'
    },
    options: {
      refetchOnWindowFocus: false,
      enabled: (!!id),
      retry: 0,
      onSuccess: (res) => {
        setAllData(res?.items);
      }
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
      title: t("Name"),
      dataIndex: 'name',
    },
    {
      title: t("Kafedra"),
      dataIndex: 'kafedra',
      render: (e) => e?.name
    },
    {
      title: t("Edu year"),
      dataIndex: 'eduYear',
      render: (e) => e?.name
    },
    {
      title: t('Edu form'),
      dataIndex: 'eduForm',
      render: (e) => e?.name
    },
    {
      title: t('Semestr'),
      dataIndex: 'semestr',
      render: (e) => e?.name
    },
    {
      title: t('subject type'),
      dataIndex: 'subjectType',
      render: (e) => e?.name
    },
    {
      title: t('Credit'),
      dataIndex: 'credit',
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      render: (i) => <StatusTag status={i} />,
      align: "center",
    },
    {
      title: t("Actions"),
      dataIndex: 'actions',
      width: 120,
      align: "center",
      render: (i, e, index) => <Actions
        id={e?.id}
        url={'subject-semestrs'}
        refetch={refetch}
        onClickEdit={() => {
          setOpen(true);
          setselectedSubjectSemestr(e)
        }}
        onClickView={() => {
          setOpen(true);
          setselectedSubjectSemestr(e)
        }}
        viewPermission={'subject-semestr_view'}
        editPermission={"subject-semestr_update"}
        deletePermission={"subject-semestr_delete"}
      />,
    },
  ], [data?.items]);

  const { mutate, isLoading: saveLoading } = useMutation({
    mutationFn: (data: any) => updateSubjectSemestr(selectedSubjectSemestr?.id, {...data, subject_id: id}),
    onSuccess: async (res) => {
      if (res?.status === 1) {
        Notification("success", "update", res?.message);
        refetch()
        form.resetFields()
        setselectedSubjectSemestr(undefined)
        setOpen(false)
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

  useEffect(() => {
    form.setFieldsValue({
      name: selectedSubjectSemestr?.name,
      description: selectedSubjectSemestr?.description,
      edu_year_id: selectedSubjectSemestr?.edu_year_id,
      edu_form_id: selectedSubjectSemestr?.edu_form_id,
      semestr_id: selectedSubjectSemestr?.semestr_id,
      subject_type_id: selectedSubjectSemestr?.subject_type_id,
      credit: selectedSubjectSemestr?.credit,
      status: selectedSubjectSemestr?.status == 1,
    })
  }, [selectedSubjectSemestr, open])

  useEffect(() => {
    const name = form.getFieldValue("name");
    console.log("namenamename", name);
  }, [form])

  return (
    <div className="pt-[15px] pb-[10px]">
      <div className="flex justify-end">
        {
          checkPermission("subject-semestr_create") ?
          <Button onClick={() => {setOpen(true); form.resetFields(); setselectedSubjectSemestr(undefined)}} type="primary">Semestr qo'shish</Button> : ""
        }
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
        {(data?._meta?.totalCount ?? 0) > 10 ? (
          <CustomPagination
            totalCount={data?._meta.totalCount}
            currentPage={urlValue.currentPage}
            perPage={urlValue.perPage}
          />
        ) : undefined}

        <Drawer 
          title={"Fanga semestr qo'shish"} 
          onClose={() =>{ setOpen(false)}} 
          open={open} 
          width={500}
        >
          <Spin spinning={false} >
            <Form
              form={form}
              name="basic"
              layout="vertical"
              initialValues={{status: true}}
              onFinish={(values) => mutate(values)}
              >
                <Form.Item
                  label="Nomi"
                  name="name"
                  rules={[{ required: true, message: 'Nomini kiriting!' }]}
                >
                  <Input 
                    onInput={(e: any) => {
                      const capitalizedValue = e.target.value.toUpperCase();
                      e.target.value = capitalizedValue;
                    }}
                    maxLength={10}
                  />
                </Form.Item>
                <Row gutter={[24, 0]}>
                  <FormUIBuilder data={formData} form={form} load={!!Number(id)} />
                </Row>
                <div className="flex justify-end">
                  <Button type="primary" htmlType="submit" loading={saveLoading}>{t("Save")}</Button>
                </div>
            </Form>
          </Spin>
        </Drawer>
    </div>
  )
}
export default SubjectSemestrs;

// subject-semestr_view
// subject-semestr_index
// subject-semestr_delete
// subject-semestr_create
// subject-semestr_update