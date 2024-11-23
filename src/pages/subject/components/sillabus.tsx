import { Checkbox, Col, Divider, Form, InputNumber, Row } from 'antd';
import useGetAllData from 'hooks/useGetAllData';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export type TypeSillabusData = {
  edu_semestr_exams_types?: string,
  edu_semestr_subject_category_times?: string,
  refetch?: boolean,
}

type TypeSubjectSillabus = {
  sillabusData: TypeSillabusData
  setSillabusData: React.Dispatch<React.SetStateAction<TypeSillabusData>>
}

const SubjectSillabus: React.FC<TypeSubjectSillabus> = ({ sillabusData, setSillabusData }): JSX.Element => {
  const [_form] = Form.useForm();
  const { t } = useTranslation();
  const [balls, setBalls] = useState<number[]>([]);
  const [hours, setHours] = useState<number[]>([]);
  const [a, setA] = useState<boolean>(false);

  const { data: subjectCategories } = useGetAllData<any>({
    queryKey: ["subject-categories"],
    url: `subject-categories`,
    urlParams: { "per-page": 0 },
  });

  const { data: examTypes } = useGetAllData<any>({
    queryKey: ["exams-types"],
    url: `exams-types`,
    urlParams: { "per-page": 0 },
  });

  useEffect(() => {
    let obj: any = {};
    const _balls: number[] = []
    const _hours: number[] = []

    if (sillabusData?.edu_semestr_exams_types) {
      Object.entries(JSON.parse(sillabusData.edu_semestr_exams_types))?.forEach(([key, value]) => {
        if (examTypes?.items?.find(e => e?.id == key)) {
          obj["ball_" + key] = value;
          if (!balls.includes(Number(key))) _balls.push(Number(key))
        }
      })
    }

    if (sillabusData?.edu_semestr_subject_category_times) {
      Object.entries(JSON.parse(sillabusData.edu_semestr_subject_category_times))?.forEach(([key, value]) => {
        if (subjectCategories?.items?.find(e => e?.id == key)) {
          obj["hour_" + key] = value;
          if (!hours.includes(Number(key))) _hours.push(Number(key))
        }
      })
    }

    setA(p => !p)

    setBalls(_balls);
    setHours(_hours);
    _form.setFieldsValue(obj);
  }, [sillabusData.refetch, examTypes?.items, subjectCategories?.items]);

  useEffect(() => {
    let total_ball = 0;
    let total_hour = 0;

    const edu_semestr_exams_types: { [key: string]: string } = {};
    const edu_semestr_subject_category_times: { [key: string]: string } = {};

    hours?.forEach(item => {
      if (_form.getFieldValue("hour_" + item)) {
        edu_semestr_subject_category_times[`${item}`] = _form.getFieldValue("hour_" + item);
        total_hour += parseInt(_form.getFieldValue("hour_" + item))
      }
    })

    balls?.forEach(item => {
      if (_form.getFieldValue("ball_" + item)) {
        edu_semestr_exams_types[`${item}`] = _form.getFieldValue("ball_" + item);
        total_ball += parseInt(_form.getFieldValue("ball_" + item))
      }
    })

    _form.setFieldsValue({
      total_hour,
      total_ball
    });

    setSillabusData(p => ({
      ...p,
      edu_semestr_exams_types: JSON.stringify(edu_semestr_exams_types),
      edu_semestr_subject_category_times: JSON.stringify(edu_semestr_subject_category_times),
    }))

    if (total_ball > 100) _form.setFields([{ name: "total_ball", errors: [`${t("The total score should not exceed 100")}!!!`] }])
  }, [a, sillabusData.refetch]);

  return (
    <div className="rounded-lg ">
      <Form
        form={_form}
        layout='vertical'
        onFinish={() => { }}
      >
        <Divider orientation='left' orientationMargin={0} ><p className='font-[500]' >{t("Score distribution")}</p></Divider>
        <Row gutter={[12, 12]}>
          {examTypes ? examTypes?.items.map((item: { id: number, name: string }, i: number) =>
            <Col key={i} xs={12} sm={8} md={6} lg={4}>
              <Checkbox checked={balls.includes(item?.id)} onChange={(e) => {
                let s = e?.target?.checked;
                setA(p => !p);
                if (s) {
                  setBalls(p => [...p, item?.id])
                } else {
                  setBalls(p => p.filter(e => e !== item?.id))
                  _form.setFieldValue("ball_" + item?.id, "")
                }
              }}>
                {item.name}
              </Checkbox>
              <Form.Item
                name={"ball_" + item.id}
                rules={[
                  {
                    required: balls.includes(item?.id),
                    message: "Please input" + item?.name
                  }
                ]}
                className="pt-2"
              >
                <InputNumber
                  onChange={() => { setA(p => !p) }}
                  max={100}
                  disabled={!balls.includes(item?.id)}
                  placeholder={"Input" + t(item?.name)}
                  className='w-full'
                />
              </Form.Item>
            </Col>
          ) : null}
          <Col xs={12} sm={8} md={6} lg={4}>
            <Form.Item
              name={"total_ball"}
              label={<span className='textt-[#0a3180]' >{t("Total ball")}</span>}
            >
              <InputNumber readOnly className='w-full' />
            </Form.Item>
          </Col>
        </Row>
        <Divider orientation='left' orientationMargin={0} ><p className='font-[500]'>{t("Distribution of hours")}</p></Divider>
        <Row gutter={24}>
          {
            subjectCategories ? subjectCategories?.items.map((item: {
              id: number, name: string
            }, i: number) =>
              <Col key={i} xs={12} sm={8} md={6} lg={4}>
                <Checkbox
                  checked={hours.includes(item?.id)}
                  onChange={(e) => {
                    setA(p => !p);
                    if (e?.target?.checked) {
                      setHours(p => [...p, item?.id])
                    } else {
                      setHours(p => p.filter(e => e !== item?.id))
                      _form.setFieldValue("hour_" + item?.id, "")
                    }
                  }}
                >
                  {item.name}
                </Checkbox>
                <Form.Item
                  name={"hour_" + item.id}
                  rules={[
                    {
                      required: hours.includes(item?.id),
                      message: "Please input " + item?.name
                    }
                  ]}
                  className="pt-2"
                >
                  <InputNumber
                    onBlur={() => { setA(p => !p) }}
                    max={1000}
                    disabled={!hours.includes(item?.id)}
                    placeholder={"Input " + t(item?.name)}
                    className='w-full'
                  />
                </Form.Item>
              </Col>
            ) : null}
          <Col xs={12} sm={8} md={6} lg={4}>
            <Form.Item
              name={"total_hour"}
              label={t("Total hour")}
            >
              <InputNumber readOnly className='w-full' />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SubjectSillabus;
