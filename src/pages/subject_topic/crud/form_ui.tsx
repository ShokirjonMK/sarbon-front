import { useEffect, useState } from "react"
import { Divider, Form, FormInstance, Select } from "antd";
import FormUIBuilder from "components/FormUIBuilder";
import { TypeFormUIData } from "pages/common/types";
import { useTranslation } from "react-i18next";
import useGetAllData from "hooks/useGetAllData";
import { ISubjectTopic } from "models/subject";
import { globalConstants } from "config/constants";

const TopicFormUI = ({id,form, subject_category_id}: {id: string | undefined, form: FormInstance, subject_category_id?: number}) => {
  const {t} = useTranslation();
  const [childId, setChildId] = useState<number | undefined>()
  const [langId, setLangId] = useState<number | undefined>()

  useEffect(() => {
    setChildId(subject_category_id)
  }, [subject_category_id])

  const { data } = useGetAllData<ISubjectTopic>({
    queryKey: [ "subject-topics", id, langId, childId],
    url: `subject-topics?sort=id&filter={"subject_category_id":${1},"subject_id":${id},"lang_id":${langId}}`,
    options: {
      refetchOnWindowFocus: false,
      retry: 1,
      enabled: !!langId && !!id && (!!childId && (childId !== 1)),
    },
  });  

  const formData: TypeFormUIData[] = [
    {
      name: "name",
      label: "Name",
      required: true,
      type: "input",
      maxLength: 200,
      span: 24,
    },
    {
      name: "hours",
      label: "Hour",
      required: true,
      type: "number",
      max: 10,
      span: 24,
    },
    {
      name: "lang_id",
      label: "Ta'lim tili",
      render: (e) => e?.name ?? "",
      required: true,
      type: "select",
      expand_name:"lang",
      url: "languages",
      span: 24,
      onchange: (e) => {setLangId(e)}
    },
    {
      name: "subject_category_id",
      label: "Occupation category",
      expand_name: "subjectCategory",
      render: (e) => e?.name ?? "",
      expand: "subjectCategory",
      url: "subject-categories",
      type: "select",
      required: true,
      span: 24,
      // child_names: ['parent_id'], 
      onchange: (e) => { setChildId(e)}
    },
    // {
    //   name: "parent_id",
    //   label: "Parent",
    //   render: (e) => e?.name ?? "",
    //   url: `subject-topics?sort=-id&filter={"subject_category_id":${1}}`,
    //   type: "select",
    //   required: true,
    //   span: 24,
    //   parent_name:'subject_category_id',
    //   onchange: (e) => {console.log('parentChangeId',e)}
    // }, 
    {
      name: "description",
      label: "Description",
      type: "textarea",
      maxLength: 500,
      span: 24,
    },
    
  ];
  
  const testFormData: TypeFormUIData[] = [
    {
      name: "allotted_time",
      label: "Allotted time for test",
      required: true,
      type: "time",
      render: (e) => <span>{e}</span>,
      span: 24,
    },
    {
      name: "attempts_count",
      label: "Attempts count",
      required: true,
      type: "number",
      max: 3,
      span: 24,
    },
    {
      name: "duration_reading_time",
      label: "Duration reading time",
      required: true,
      type: "time",
      span: 24,
    },
    {
      name: "test_count",
      label: "Test count",
      required: true,
      type: "number",
      span: 24,
    },
    {
      name: "min_percentage",
      label: "Min prosent",
      required: true,
      type: "number",
      span: 24,
    },
  ]

  return(
    <div>
      <FormUIBuilder data={formData} form={form} load={id ? true : false} />
      {
        childId && childId !== globalConstants.lectureIdForTimeTable ? <Form.Item name='parent_id' label={`${t('Parent')}`} required>
        <Select placeholder={`${t('Select parent')}...`}>
          {
            data?.items?.map((item,i) => (
              <Select.Option value={item?.id}>{item?.name}</Select.Option>
            ))
          }
        </Select>
      </Form.Item> : null
      }
      {
        childId == globalConstants.lectureIdForTimeTable ? 
        <>
          <Divider>{t('Test information')}</Divider>
          <FormUIBuilder data={testFormData} form={form} load={id ? true : false} />
        </> : ""
      }
    </div>
  )
}

export default TopicFormUI