import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { Col, Row, Form, Button, Spin, Tag, DatePicker } from "antd";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { TypeFormUIData } from 'pages/common/types';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Notification } from 'utils/notification';
import { AxiosError } from 'axios';
import { validationErrors } from 'utils/validation_error';
import useGetOneData from 'hooks/useGetOneData';
import dayjs from 'dayjs';
import FormUIBuilder from 'components/FormUIBuilder';
import { submitFinalExamControl } from './requests';
import { IFinalExam } from 'models/exam';
import { renderFullName } from 'utils/others_functions';
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import { dateParserToDatePicker } from 'utils/second_to_date';
import useBreadCrumb from 'hooks/useBreadCrumb';

const span = { xs: 24, md: 24, lg: 12, xl: 12 };

const NewExamUpdate: React.FC = (): JSX.Element => {

  const { RangePicker } = DatePicker;

  const { t } = useTranslation(); 
  const { id } = useParams()
  const navigate = useNavigate()
  const [form] = Form.useForm();
  const { urlValue, writeToUrl } = useUrlQueryParams({});
  const [time, settime] = useState<{start_time: string, finish_time: string}>()

  const [click, setClick] = useState(false)

  const formDataForLang: TypeFormUIData[] = [
    {
      name: "lang_id",
      label: "Language",
      url: `/langs`,
      type: "select",
      required: true,
      span,
    }
  ]

  const formData: TypeFormUIData[] = [
      {
        name: "exam_type",
        label: "Imtihon turi",
        url: "faculties",
        type: "select",
        data: [
          {id: 1, name: "Test"}, 
          {id: "0", name: "Yozma"}, 
        ],
        onchange(e) {
          writeToUrl({name: "exam_form_type", value: undefined})
          writeToUrl({name: "exam_type", value: e})
        },
        required: true,
        span,
      },
      {
        name: "exam_form_type",
        label: "Imtihon shakli",
        url: "faculties",
        type: "select",
        data: [
          {id: 2, name: "Biriktirilgan xonada"}, 
          {id: 3, name: "Ixtiyoriy lokatsiyada"}, 
        ],
        onchange(e, obj) {
          writeToUrl({name: "exam_form_type", value: e})
        },
        required: true,
        span,
      },
      {
        name: "faculty_id",
        label: "Faculty",
        url: "faculties",
        type: "select",
        child_names: ["edu_semestr_id", "group_id", "edu_plan_id"],
        onchange: (e: any) => writeToUrl({name: "faculty_id", value: e}),
        required: true,
        span,
      },
      {
        name: "edu_plan_id",
        label: "Edu plan",
        url: "edu-plans",
        type: "select",
        parent_name: "faculty_id",
        child_names: ["edu_semestr_id", "group_id"],
        required: true,
        span,
      },
      {
        name: "edu_semestr_id",
        label: "Edu semestr",
        url: "/edu-semestrs",
        type: "select",
        parent_name: "edu_plan_id",
        child_names: ["edu_semestr_subject_id"],
        render: (e) => <div>{e?.name} {e?.status == 1 ? <Tag color="green" className="ml-3">Active</Tag>: ""}</div>,
        required: true,
        span,
      },
      {
        name: "edu_semestr_subject_id",
        label: "Subject",
        url: "/edu-semestr-subjects",
        type: "select",
        expand: "subject",
        render: (e) => e?.subject?.name,
        parent_name: "edu_semestr_id",
        required: true,
        span,
      },
      id != "0" ? {
        name: "vedomst",
        label: "Vedmost",
        type: "select",
        required: true,
        data: [{id: 1, name: "1 - shakl"}, {id: 2, name: "1 - A shakl"}, {id: 3, name: "1 - B shakl"}],
        span,
      } : {} as TypeFormUIData,
      {
        name: "group_id",
        label: "Group",
        url: "/groups",
        type: "multiselect",
        parent_name: "edu_plan_id",
        render: (e) => e?.unical_name,
        required: true,
        span,
      },
  ];

  const formData2: TypeFormUIData[] = [
    !!time?.start_time && !!time?.finish_time ? 
    {
      name: "user_id",
      label: "Mas'ul shaxs",
      url: `/teacher-accesses/free-exam?expand=profile&faculty_id=${urlValue?.filter?.faculty_id}&start_time=${time?.start_time}&finish_time=${time?.finish_time}`,
      render: (e) => renderFullName(e?.profile),
      filter: {role_name: (urlValue?.filter?.faculty_id == 6 && urlValue?.filter_like?.exam_type == "1") ? ["tutor"] : ["tutor", "teacher"], status: 10},
      type: "select",
      required: true,
      span,
    } : {} as TypeFormUIData,
    urlValue?.filter_like?.exam_form_type == "2" ?
    {
      name: "building_id",
      label: "Building",
      url: "/buildings",
      type: "select",
      child_names: ["room_id"],
      onchange: (e) => writeToUrl({name: "building_id", value: e}),
      required: true,
      span,
    } : {} as TypeFormUIData,
    (urlValue?.filter_like?.exam_form_type == "2" && !!time?.start_time && !!time?.finish_time) ? 
    {
      name: "room_id",
      label: "Rooms",
      url: `/rooms/free-exam?building_id=${urlValue?.filter?.building_id}&start_time=${time?.start_time}&finish_time=${time?.finish_time}`,
      type: "select",
      parent_name: "building_id",
      filter: {status: 1},
      required: true,
      render: (e) => `${e?.name} ${e?.room_type?.name}`,
      span,
    } : {} as TypeFormUIData,
  ]

  const { data, isFetching: getIsLoading } = useGetOneData<IFinalExam>({
    queryKey: ['final-exams', id],
    url: `final-exams/${id}?expand=eduPlan,eduPlan.faculty,eduSemestr.semestr,eduSemestrSubject.subject,eduSemestrSubject.subjectVedomst,groups`,
    options: {
      onSuccess: (res) => {
        form.setFieldsValue({
          edu_plan_id: res?.data?.edu_plan_id,
          faculty_id: res?.data?.eduPlan?.faculty_id,
          edu_semestr_id: res?.data?.edu_semestr_id,
          edu_semestr_subject_id: res?.data?.edu_semestr_subject_id,
          group_id: res?.data?.groups?.map((e: any) => e?.group_id),
          date: [dayjs(res?.data?.start_time * 1000), dayjs(res?.data?.finish_time * 1000)],
          para_id: res?.data?.para_id,
          user_id: res?.data?.user_id,
          building_id: res?.data?.building_id,
          room_id: res?.data?.room_id,
          lang_id: res?.data?.lang_id ?? 1,
          vedomst: res?.data?.vedomst,
          exam_type: res?.data?.exam_type,
          exam_form_type: res?.data?.exam_form_type,
        })        
        writeToUrl({name: "faculty_id", value: res?.data?.building_id})
        writeToUrl({name: "building_id", value: res?.data?.building_id})
        writeToUrl({name: "exam_type", value: res?.data?.exam_type})
        writeToUrl({name: "exam_form_type", value: res?.data?.exam_form_type})
        settime({start_time: dateParserToDatePicker(res?.data?.start_time), finish_time: dateParserToDatePicker(res?.data?.finish_time)})
      },
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: (!!id && id != '0'),
    }
  })  

  const { mutate, isLoading } = useMutation({
    mutationFn: (newVals) => submitFinalExamControl(id, newVals),
    onSuccess: async (res) => {
      Notification("success", id ? "update" : "create", res?.message)
      navigate('/exams');
      // if(click) navigate('/exams');
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", id ? "update" : "create", error?.response?.data ? error?.response?.data?.message : "");
      validationErrors(form, error?.response?.data)
    },
    retry: 0,
  });

  const title = id ? (data?.data?.name ? data?.data?.name : "Final exam update") : `Final exam create`;

  useBreadCrumb({pageTitle: title, breadcrumb: [
    { name: "Home", path: '/' },
    { name: "Final exam control", path: '/exams' },
    { name: title, path: '/exams/create' }
  ]})

  return (
    <Spin spinning={getIsLoading} >
      <div className="content-card">
        <Form
          initialValues={{ status: true, lang_id: 1 }}
          form={form}
          layout="vertical"
          onFinish={(values) => mutate({...values, date: time})}
        >
          <Row gutter={24} className="mb-[50px]">
            <Col xxl={16} lg={20}>
              <Row gutter={24}>
                <FormUIBuilder data={formData} form={form} load={!!Number(id)} />
                <Col span={12}>
                  <Form.Item label={t("Boshlanish va tugash vaqti")} name="date">
                    <RangePicker
                      className='w-full'
                      showTime={{ format: 'HH:mm' }}
                      format="YYYY-MM-DD HH:mm"
                      onChange={(value, dateString) => {
                        settime({start_time: dateString[0], finish_time: dateString[1]});
                      }}
                    />
                  </Form.Item>
                </Col>
                <FormUIBuilder data={formData2} form={form} load={!!Number(id)} />
              </Row>
              <Row gutter={24}>
                <FormUIBuilder data={formDataForLang} form={form} load={true} />
              </Row>
            </Col>
          </Row>

          <div className="flex justify-end fixed bottom-0 right-0 bg-white w-[100%] px-[24px] py-[16px] shadow-2xl">
            <Button htmlType="button" onClick={() => form.resetFields()}>{t("Reset")}</Button>
            {/* <Button type="primary" loading={isLoading} className="ml-3" htmlType="submit" onClick={() => setClick(false)} >{t("Submit")}</Button> */}
            <Button type="primary" loading={isLoading} className="ml-3" htmlType="submit" onClick={() => setClick(true)} >{t("Submit")}</Button>
          </div>
        </Form>
      </div>
    </Spin>
  );
};

export default NewExamUpdate;