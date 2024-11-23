import { Button, Col, Divider, Form, Input, Row, Select, Spin } from 'antd';
import FormUIBuilder, { TypeFormUIBuilder } from 'components/FormUIBuilder';
import MultipleInput from 'components/MultipleInput';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SubjectSillabus, { TypeSillabusData } from '../components/sillabus';
import { SUBJECTTYPES } from 'config/constants/staticDatas';
import useGetOneData from 'hooks/useGetOneData';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { requesrData } from './request';
import { Notification } from 'utils/notification';
import { AxiosError } from 'axios';
import { validationErrors } from 'utils/validation_error';
import { useTranslation } from 'react-i18next';
import { cf_filterOption, generateAntdColSpan } from 'utils/others_functions';
import useGetAllData from 'hooks/useGetAllData';
import { ISubject } from 'models/subject';
import useBreadCrumb from 'hooks/useBreadCrumb';

const span = { md: 24, lg: 12, xl: 12, xxl: 12 };

const breadCrumb = (id: string | undefined) => [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Subjects",
    path: "/subjects",
  },
  {
    name: `${id ? "Update" : "Create"} Subject`,
    path: "/subjects/update/:id",
  },
]

const UpdateSubject: React.FC = (): JSX.Element => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate()
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [sillabusData, setSillabusData] = React.useState<TypeSillabusData>({ refetch: false })
  const [filter, setFilter] = useState<{ semestr_id: undefined | number, edu_form_id: undefined | number, kafedra_id: undefined | number }>({ semestr_id: undefined, edu_form_id: undefined, kafedra_id: undefined })
  
  useBreadCrumb({pageTitle: `${id ? "Update" : "Create"} subject`, breadcrumb: breadCrumb(id)})

  const formData: TypeFormUIBuilder[] = [
    {
      name: "kafedra_id",
      label: "Kafedra",
      required: true,
      type: "select",
      url: "kafedras",
      onchange: (e) => { setFilter(p => ({...p, kafedra_id: e})); form.resetFields(["parent_id"]) },
      span
    },
    {
      name: "semestr_id",
      label: "Semestr",
      required: true,
      type: "select",
      url: "semestrs",
      // child_names: ["parent_id"],
      onchange: (e) => { setFilter(p => ({...p, semestr_id: e - 1})); form.resetFields(["parent_id"]) },
      span
    },
    {
      name: "edu_form_id",
      label: "Edu form",
      required: true,
      type: "select",
      url: "edu-forms",
      // child_names: ["parent_id"],
      onchange: (e) => { setFilter(p => ({...p, edu_form_id: e})); form.resetFields(["parent_id"]) },
      span
    },
    {
      name: "edu_type_id",
      label: "Edu type",
      required: true,
      type: "select",
      url: "edu-types",
      filter: {status: 1},
      span
    },
    // {
    //   name: "parent_id",
    //   label: "Parent",
    //   required: false,
    //   type: "select",
    //   url: "subjects",
    //   // expand: "eduForm",
    //   query_key: "subjects_parent",
    //   parent_name: "semestr_id",
    //   second_parent: "edu_form_id",
    //   // render(e) {
    //   //   return <>{e?.name} <span className="text-blue-900 font-bold"> - {e?.eduForm?.name}</span></>
    //   // },
    //   span
    // },
    {
      name: "subject_type_id",
      label: "Subject type",
      required: true,
      url: "subject-types",
      type: "select",
      span
    },
    {
      name: "type",
      label: "Type",
      required: true,
      type: "select",
      data: SUBJECTTYPES,
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

  const { isFetching } = useGetOneData({
    queryKey: ['subjects', id],
    url: `subjects/${id}`,
    options: {
      onSuccess: (res) => {
        form.setFieldsValue({
          [`name[${i18n.language}]`]: res.data?.name,
          [`description[${i18n.language}]`]: res.data?.description,
          kafedra_id: res?.data?.kafedra_id,
          semestr_id: res.data?.semestr_id,
          edu_form_id: res.data?.edu_form_id,
          edu_type_id: res.data?.edu_type_id,
          parent_id: res.data?.parent_id,
          type: res.data?.type,
          subject_type_id: res.data?.subject_type_id,
          credit: res.data?.credit,
          status: res.data?.status ? true : false
        })
        setSillabusData({
          edu_semestr_exams_types: res.data?.edu_semestr_exams_types,
          edu_semestr_subject_category_times: res.data?.edu_semestr_subject_category_times,
          refetch: true,
        });
        setFilter({semestr_id: res.data?.semestr_id - 1, edu_form_id: res.data?.edu_form_id, kafedra_id: res?.data?.kafedra_id})
      },
      enabled: !!id
    },
  })

  useEffect(() => {
    if (!id) {
      form.setFieldValue("status", true);
    }
  }, []);

  const {data, isFetching: loading} = useGetAllData<ISubject>({
    queryKey: ["subjects", filter.semestr_id, filter.edu_form_id, filter.kafedra_id],
    url: `subjects`,
    urlParams: {"per-page": 0, filter},
    options: {
      enabled: !!filter.semestr_id && !!filter.edu_form_id && !!filter.kafedra_id
    }
  })

  const { mutate, isLoading: clicked } = useMutation({
    mutationFn: (data) => requesrData(Number(id), data, sillabusData),
    onSuccess: async (res) => {
      queryClient.setQueryData(["students", id], res);
      if (res?.status === 1) {
        Notification("success", id ? "update" : "create", res?.message);
        // navigate("/subjects");
      } else {
        Notification("error", id ? "update" : "create", res?.message);
      }
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", id ? "update" : "create", error?.response?.data ? error?.response?.data?.message : "");
      validationErrors(form, error?.response?.data);
    },
    retry: 0,
  });

  return (
    <div className="">
      <Form
        form={form}
        layout='vertical'
        onFinish={mutate}
      >
        <Spin spinning={isFetching && !!id} >
          <Row className='content-card'>
            <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={16}>
              <Row gutter={[12, 12]} >
                {!id ? <MultipleInput />
                  : <>
                    <Col span={24}>
                      <Form.Item
                        name={`name[${i18n?.language}]`}
                        label={t("Name")}
                        rules={[
                          {
                            required: true,
                            message: "Please input name"
                          }
                        ]}
                      >
                        <Input className='w-full' />
                      </Form.Item>
                    </Col>
                    <Col span={24} >
                      <Form.Item
                        name={`description[${i18n?.language}]`}
                        label={t("Description")}
                      >
                        <Input.TextArea rows={2} className='w-full' />
                      </Form.Item>
                    </Col>
                  </>
                }
                <FormUIBuilder data={formData} form={form} load={!!Number(id)} />
                <Col {...generateAntdColSpan(span)}>
                  <Form.Item
                    name={`parent_id`}
                    label={t("Parent")}
                  >
                    <Select
                      className="w-[100%]"
                      placeholder={`${t(`Select subject`)}`}
                      allowClear
                      disabled={!(filter.semestr_id && filter.edu_form_id && filter.kafedra_id)}
                      onFocus={() => {}}
                      showSearch
                      filterOption={cf_filterOption}
                      loading={loading}
                    >
                      {
                        data?.items?.map((subject, i) => (
                          <Select.Option key={i} value={subject.id} >{subject.name}</Select.Option>
                        ))
                      }
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <SubjectSillabus sillabusData={sillabusData} setSillabusData={setSillabusData} />
            </Col>
          </Row>
          <Divider />
          <div className='flex justify-end px-6' >
            <Button danger htmlType='submit' className='px-5' onClick={() => navigate(-1)} > {t("Cancel")} </Button>
            <Button type='primary' htmlType='submit' className='px-5 ml-2' loading={clicked} > {t("Save")} </Button>
          </div>
        </Spin>
      </Form>
    </div>
  );
};

export default UpdateSubject;
