import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { Col, Row, Form, Button, DatePicker, UploadFile, Select, Input, Spin } from "antd";
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
import FileUploader from 'components/fileUploader';
import useGetAllData from 'hooks/useGetAllData';
import { EXAMCONTROLTYPES } from 'config/constants/staticDatas';
import { renderFullName } from 'utils/others_functions';
import { submitExamControl } from './requests';
import { FILE_URL } from 'config/utils';
const { RangePicker } = DatePicker;

const dateParserToDatePicker = (second: number) => dayjs(dayjs((new Date(Number(second)*1000))).format('DD-MM-YYYY HH:mm'), 'DD-MM-YYYY HH:mm')

const ExamControlUpdate: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { id } = useParams()
  const [faculty_id, setfaculty_id] = useState<number | undefined>()

  const formData: TypeFormUIData[] = [
    {
      name: "faculty_id",
      label: "Faculty",
      required: true,
      type: "select",
      disabled: !!id,
      url: "faculties",
      span: 12,
      child_names: ["group_id"],
      onchange(e) {
        setfaculty_id(e)
      },
    },
  ];

  const navigate = useNavigate()
  const [form] = Form.useForm();
  const [fileList, setfileList] = useState<UploadFile[]>([] as UploadFile[]);
  const [selectedGroup_id, setselectedGroup_id] = useState<number | undefined>();
  const [selectedGroup, setselectedGroup] = useState<any>();
  const [subjectsData, setsubjectsData] = useState<any[]>();
  const [semestrExamTypes, setsemestrExamTypes] = useState<any[]>();
  const [subjectCategories, setsubjectCategories] = useState<any[]>();
  const [selectedSubject_id, setselectedSubject_id] = useState<number | undefined>();
  const [selectedType, setselectedType] = useState<number | undefined>();

  const { mutate, isLoading } = useMutation({
    mutationFn: (newVals) => submitExamControl(id, newVals),
    onSuccess: async (res) => {
      Notification("success", id ? "update" : "create", res?.message)
      navigate(-1)
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", id ? "update" : "create", error?.response?.data ? error?.response?.data?.message : "");
      validationErrors(form, error?.response?.data)
    },
    retry: 0,
  });

  const { data: groups } = useGetAllData({
    queryKey: ["groups", faculty_id],
    url: "groups?sort=-id&expand=subject,subject.subject,subject.eduSemestrExamsTypes,subject.eduSemestrExamsTypes.examsType,activeEduSemestr",
    urlParams: { "per-page": 0, filter: JSON.stringify({faculty_id}) },
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!faculty_id
    }
  })

  const { data: timeTables } = useGetAllData({
    queryKey: ["time-tables", selectedGroup_id, selectedGroup?.activeEduSemestr?.id],
    url: "time-tables?sort=-id&expand=subjectCategory",
    urlParams: { "per-page": 0, filter: JSON.stringify({group_id: selectedGroup_id, edu_semestr_id: selectedGroup?.activeEduSemestr?.id})},
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: (!!selectedGroup_id && !!selectedGroup?.activeEduSemestr?.id)
    }
  })

  const { data: users } = useGetAllData({
    queryKey: ["users"],
    url: "users?sort=-id&expand=profile",
    urlParams: { "per-page": 0, filter: JSON.stringify({role_name: ['teacher', "tutor"]})},
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
    }
  })

  const { data, isFetching: getIsLoading } = useGetOneData({
    queryKey: ['exam-controls', id],
    url: `exam-controls/${id}`,
    options: {
      onSuccess: (res) => {
        form.setFieldsValue({
          faculty_id: res?.data?.faculty_id,
          group_id: res?.data?.group_id,
          edu_semestr_subject_id: res?.data?.edu_semestr_subject_id,
          type: res?.data?.type,
          duration: res?.data?.duration,
          user_id: res?.data?.user_id,
          subject_category_id: res?.data?.subject_category_id,
          edu_semestr_exam_type_id: res?.data?.edu_semestr_exam_type_id,
          date: [dateParserToDatePicker(res?.data?.start_time), dateParserToDatePicker(res?.data?.finish_time)],
          question: res?.data?.question,
          question_count: res?.data?.question_count
        })
        
        setselectedGroup_id(res?.data?.group_id);
        setselectedSubject_id(res?.data?.edu_semestr_subject_id);
        setfaculty_id(res?.data?.faculty_id);
        setselectedType(res?.data?.type)

        if(res?.data?.file){
          setfileList([{
            uid: '-1',
            name: 'Oraliq nazorat',
            status: 'done',
            url: FILE_URL + res?.data?.file,
          }])
        }

      },
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: (!!id && id != '0'),
    }
  })

  useEffect(() => {
    const subjects = groups?.items?.find((item) => item?.id == selectedGroup_id)?.subject;
    setsubjectsData(subjects)
    setselectedGroup(groups?.items?.find((item) => item?.id == selectedGroup_id))
  }, [selectedGroup_id, groups?.items?.length])

  useEffect(() => {
    const eduSemestrExamsTypes = subjectsData?.find((item) => item?.id == selectedSubject_id)?.eduSemestrExamsTypes;
    setsemestrExamTypes(eduSemestrExamsTypes)

    const timetableBySubject = timeTables?.items?.filter(i => i?.edu_semestr_subject_id == selectedSubject_id)

    if(timetableBySubject?.length) {
      const res = Object.values(timetableBySubject?.reduce((acc, curr) => {
        if(!acc[curr.subjectCategory.id]) {
          acc[curr.subjectCategory.id] = curr
        }
        return acc;
      }, {}));
      setsubjectCategories(res)
    } else {
      setsubjectCategories([])
    }

  }, [selectedSubject_id, subjectsData?.length, timeTables?.items])

  const title = id ? data?.data?.name : `Exam control create`
  return (
    <Spin spinning={getIsLoading} >
      <HeaderExtraLayout title={title}
        breadCrumbData={[
          { name: "Home", path: '/' },
          { name: "Exam controls", path: '/exam-controls' },
          { name: title, path: '/exam-controls/create' }
        ]}
        isBack={true}
      />
      <div className="px-[24px] py-[20px]">
        <Form
          initialValues={{ status: true }}
          form={form}
          layout="vertical"
          onFinish={(values) => mutate({...values, upload_file: fileList[0]?.originFileObj})}
        >
          <Row gutter={24} className="mb-[50px]">
            <Col xxl={16} lg={20}>
              <Row gutter={24}>
                <FormUIBuilder data={formData} form={form} load={!!Number(id)} />
                <Col md={12} span={24}>
                  <Form.Item
                    label={t("Group")}
                    name={`group_id`}
                    shouldUpdate
                    rules={[{required: true, message: `Please select Group`}]}
                  >
                    <Select
                      showSearch
                      placeholder={t("Select a group")}
                      optionFilterProp="children"
                      onChange={(e) => {
                        setselectedGroup_id(e);
                        form.setFieldsValue({
                          edu_semestr_subject_id: undefined
                        })
                      }}
                      disabled={id ? true : (!faculty_id)}
                      filterOption={(input, option) => (option?.label ?? '')?.toLowerCase()?.includes(input?.toLowerCase())}
                      options={groups?.items?.map((item) => ({label: item?.unical_name, value: item?.id}))}
                    />
                  </Form.Item>
                </Col>
                <Col md={12} span={24}>
                  <Form.Item
                    label={t("Subject")}
                    name={`edu_semestr_subject_id`}
                    shouldUpdate
                    rules={[{required: true, message: `Please select subject`}]}
                  >
                    <Select
                      showSearch
                      placeholder={t("Select a subject")}
                      optionFilterProp="children"
                      onChange={(e) => {
                        setselectedSubject_id(e);
                        form.setFieldsValue({
                          edu_semestr_exam_type_id: undefined,
                          subject_category_id: undefined,
                        })
                      }}
                      disabled={!selectedGroup_id}
                      filterOption={(input, option) => (option?.label ?? '')?.toLowerCase()?.includes(input?.toLowerCase())}
                      options={subjectsData?.map((i: any) => ({label: i?.subject?.name, value: i?.id}))}
                    />
                  </Form.Item>
                </Col>
                <Col md={12} span={24}>
                  <Form.Item
                    label={t("Exams")}
                    name={`edu_semestr_exam_type_id`}
                    shouldUpdate
                    rules={[{required: true, message: `Please select exam type`}]}
                  >
                    <Select
                      showSearch
                      placeholder={t("Select a exam")}
                      optionFilterProp="children"
                      disabled={!selectedSubject_id}
                      filterOption={(input, option) => (option?.label ?? '')?.toLowerCase()?.includes(input?.toLowerCase())}
                      options={semestrExamTypes?.filter((i: any) => (i?.examsType?.order == 1 || i?.examsType?.order == 2))?.map((i: any) => ({label: i?.examsType?.name, value: i?.id}))}
                    />
                  </Form.Item>
                </Col>
                <Col md={12} span={24}>
                  <Form.Item
                    label={t("Subject category")}
                    name={`subject_category_id`}
                    shouldUpdate
                    rules={[{required: true, message: `Please select subject category`}]}
                  >
                    <Select
                      showSearch
                      placeholder={t("Select a subject category")}
                      optionFilterProp="children"
                      disabled={!selectedSubject_id}
                      filterOption={(input, option) => (option?.label ?? '')?.toLowerCase()?.includes(input?.toLowerCase())}
                      options={subjectCategories?.map((i: any) => ({label: i?.subjectCategory?.name, value: i?.subjectCategory?.id}))}
                    />
                  </Form.Item>
                </Col>
                <Col md={12} span={24}>
                  <Form.Item
                    label={t("Exam form")}
                    name={`type`}
                    shouldUpdate
                    rules={[{required: true, message: `Please select exam type`}]}
                  >
                    <Select
                      showSearch
                      placeholder={t("Select a exam type")}
                      optionFilterProp="children"
                      onChange={(e) => setselectedType(e)}
                      filterOption={(input, option) => (option?.label ?? '')?.toLowerCase()?.includes(input?.toLowerCase())}
                      options={EXAMCONTROLTYPES?.map((i: any) => ({label: i?.name, value: i?.id}))}
                    />
                  </Form.Item>
                </Col>
                <Col md={12} span={24}>
                  <Form.Item
                    label={t("Exam taker")}
                    name={`user_id`}
                    shouldUpdate
                    rules={[{required: true, message: `Please select the user`}]}
                  >
                    <Select
                      showSearch
                      placeholder={t("Select the taker")}
                      optionFilterProp="children"
                      filterOption={(input, option) => (option?.label ?? '')?.toLowerCase()?.includes(input?.toLowerCase())}
                      options={users?.items?.map((i: any) => ({label: renderFullName(i?.profile), value: i?.id}))}
                    />
                  </Form.Item>
                </Col>
                <Col md={12} span={24}>
                  <Form.Item
                    label={t("Exam date")}
                    name={`date`}
                    shouldUpdate
                    rules={[{required: false, message: `Please input date`}]}
                  >
                    <RangePicker
                        className="w-[100%]"
                        showTime={{ format: 'HH:mm' }}
                        format="DD-MM-YYYY HH:mm"
                    />
                  </Form.Item>
                </Col>
                <Col md={12} span={24}>
                  <Form.Item
                    label={`${t("Duration")} (minut)`}
                    name={`duration`}
                    shouldUpdate
                    rules={[{required: true, message: `Please input start date`}]}
                  >
                    <Input placeholder={`${t("Duration")}`} type='number' min={1} max={200} />
                  </Form.Item>
                </Col>
                {
                  selectedType === 2 ?
                  <Col md={12} span={24}>
                    <Form.Item
                      label={t("Question count")}
                      name={`question_count`}
                      shouldUpdate
                      rules={[{required: true, message: `Please input question count`}]}
                    >
                      <Input placeholder='Question count' type='number' min={1} max={200} />
                    </Form.Item>
                  </Col>
                  : (selectedType === 1) ?
                  <>
                    <Col md={12} span={24}>
                        <Form.Item
                          label={t("File")}
                          name={`file`}
                          shouldUpdate
                          rules={[{required: false, message: `Please input question`}]}
                        >
                        <FileUploader passportFile={fileList} setPassportFile={setfileList} title={t("File upload")} />
                      </Form.Item>
                    </Col>
                    <Col md={24} span={24}>
                    <Form.Item
                      label={t("Question")}
                      name={`question`}
                      shouldUpdate
                      rules={[{required: true, message: `Please input question`}]}
                    >
                      <Input.TextArea placeholder='Time' rows={4} />
                    </Form.Item>
                  </Col>
                  </>
                   : ""
                }

              </Row>
            </Col>
          </Row>

          <div className="flex justify-end fixed bottom-0 right-0 bg-white w-[100%] px-[24px] py-[16px] shadow-2xl">
            <Button htmlType="button" onClick={() => form.resetFields()}>{t("Reset")}</Button>
            <Button type="primary" loading={isLoading} className="ml-3" htmlType="submit">{t("Submit")}</Button>
          </div>
        </Form>
      </div>
    </Spin>
  );
};

export default ExamControlUpdate;


/**
  * exam-control_index
  * exam-control_delete
  * exam-control_update
  * exam-control_view
*/