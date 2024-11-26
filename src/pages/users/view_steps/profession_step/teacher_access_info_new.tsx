import { Button, Col, Form, Modal, Row, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import checkPermission from "utils/check_permission";
import { ColumnsType } from "antd/es/table";
import FormUIBuilder, { TypeFormUIBuilder } from "components/FormUIBuilder";
import useGetAllData from "hooks/useGetAllData";
import { saveTeacherAccess } from "pages/users/crud/request";
import { Notification } from "utils/notification";
import { validationErrors } from "utils/validation_error";
import DeleteData from "components/deleteData";
import { Delete16Filled } from "@fluentui/react-icons";

const TeacherAccessInfoUserViewNew = ({ user_id }: { user_id: number | string | undefined }) => {
  
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teacherAccess, setTeacherAccess] = useState<any>();
  
  const [form] = Form.useForm()

    const first_data: TypeFormUIBuilder[] = [
        {
            name: "kafedra_id",
            label: "Kafedra",
            type: "select",
            url: "kafedras",
            required: true,
            span: {xs: 24, sm: 24, md: 12, lg: 8, xl: 6},
            child_names: ["subject_id", "subject_semestr_id"]
        },
        {
            name: "semestr_id",
            label: "Semestrs",
            type: "select",
            url: "semestrs",
            required: true,
            span: {xs: 24, sm: 24, md: 12, lg: 8, xl: 6},
            child_names: ["subject_id", "subject_semestr_id"]
        },
        {
          name: "edu_year_id",
          label: "Edu years",
          type: "select",
          url: "edu-years",
          required: true,
          span: {xs: 24, sm: 24, md: 12, lg: 8, xl: 6},
          render: (e) => <div>{e?.name}{ e?.status ? <Tag color="success" className="ml-2" >Active</Tag> : null}</div>,
          filter: {status: "all"},
          child_names: ["subject_id", "subject_semestr_id"]
        },
        {
          name: "subject_id",
          label: "Subjects",
          type: "select",
          url: "subjects",
          required: true,
          span: {xs: 24, sm: 24, md: 12, lg: 8, xl: 6},
          child_names: ["subject_semestr_id"],
          parent_name: 'kafedra_id',
        },
        {
            name: "subject_semestr_id",
            label: "Fan semestrlari",
            type: "select",
            url: "subject-semestrs?expand=eduForm,subjectType",
            required: true,
            span: {xs: 24, sm: 24, md: 12, lg: 8, xl: 7},
            parent_name: 'kafedra_id',
            second_parent: "subject_id",
            render(e) {
                return `${e?.name} / ${e?.eduForm?.name} / ${e?.subjectType?.name} / Kredit - ${e?.credit}`
            },
        },
        {
            name: "language_id",
            label: "Language",
            type: "select",
            url: "langs",
            required: true,
            span: {xs: 24, sm: 24, md: 12, lg: 8, xl: 6},
        },
        {
            name: "subject_category_id",
            label: "Subject category",
            type: "multiselect",
            url: "subject-categories",
            required: true,
            span: {xs: 24, sm: 24, md: 12, lg: 8, xl: 6},
        },
    ]
    
    const { data: teacherAccessData, refetch, isLoading } = useGetAllData({
        queryKey: ["teacher-accesses/get", user_id],
        url: `teacher-accesses/get?expand=subject,language,subjectCategory,subject.kafedra,subjectSemestr,subjectSemestr.eduForm,subjectSemestr.subjectType,subjectSemestr.eduYear,subjectSemestr.semestr`,
        urlParams: { "per-page": 0, filter: JSON.stringify({user_id})},
        options: {
            enabled: !!user_id,
            refetchOnWindowFocus: false,
            retry: 1,
        }
    });

    const { mutate, isLoading: saveLoading } = useMutation({
        mutationFn: (data: any) => saveTeacherAccess(user_id, data),
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

  useEffect(() => {
    if (teacherAccessData?.items?.length){
        let arr: any = []
        for (const item of teacherAccessData?.items) {
            if(arr?.some((i: any) => (i?.subject_id === item?.subject_id) && (i?.language_id === item?.language_id))){
                arr = arr?.map((i: any) => {
                    if((i?.subject_id === item?.subject_id) && (i?.language_id === item?.language_id)){
                        return {...i, inArr: [...i?.inArr, item]}
                    }
                    return i
                })
            } else {
                arr.push({
                    subject_id: item?.subject_id,
                    subject: item?.subject,
                    language_id: item?.language_id,
                    language: item?.language,
                    subjectSemestr: item?.subjectSemestr,
                    inArr: [item]
                })
            }
        }
        setTeacherAccess(arr)        
    }
  }, [teacherAccessData])

  const columns: ColumnsType<any> = [
    {
        title: "№",
        key: "order",
        render: (_, __, i) => i + 1,
        width: 40,
    },
    {
        title: t("Subject"),
        dataIndex: "subject",
        render: (e: any) => e?.name,
    },
    {
      title: t("Fan semestri"),
      dataIndex: "subjectSemestr",
      render: (e: any) => `${e?.name} / ${e?.eduForm?.name} / ${e?.subjectType?.name} / Kredit - ${e?.credit}`,
    },
    {
      title: t("Kafedra"),
      dataIndex: "subject",
      render: (e: any) => e?.kafedra?.name,
    },
    {
      title: t("Languages"),
      dataIndex: "language",
      render: (e: any) => e?.name,
    },
    {
        title: t("Semestr"),
        dataIndex: "subjectSemestr",
        render: (e: any) => e?.semestr?.name,
    },
    {
      title: t("Edu year"),
      dataIndex: "subjectSemestr",
      render: (e: any) => e?.eduYear?.name,
  },
    {
        title: t("Subject category"),
        dataIndex: "inArr",
        render: (e) => (
            <div className="lg:flex gap-3">
                {
                    e?.map((t: any) => <Tag key={t?.id} className="text-[16px] flex w-max py-1 px-3 gap-4">
                        {t?.subjectCategory?.name} 
                        <DeleteData
                            permission={"teacher-access_delete"}
                            refetch={refetch}
                            url={"teacher-accesses"}
                            id={t?.id}
                        >
                            <Delete16Filled className="delete text-[#595959] hover:cursor-pointer" />
                        </DeleteData>
                    </Tag>)
                }
            </div>
        ),
    },
  ]
  
  useEffect(() => {
    if(!isModalOpen){
      form.resetFields()
    }
  }, [isModalOpen])

  const saveData = (values: any) => {    
    const makedObj = {[values?.subject_semestr_id]: {[values?.language_id]: values?.subject_category_id}}
    mutate(makedObj)
  }

  return (
    <div className="px-[24px] pt-[30px] pb-[10px]">
      <div className="flex justify-between items-center mb-[12px]">
        <p className="font-medium text-[16px]">Biriktirilgan fanlar</p>
        { checkPermission("teacher-access_create") ? <Button onClick={() => setIsModalOpen(true)}>{t("Create")}</Button> : null}
      </div>

      {/* <TeacherAccess teacher_access_list={teacherAccess} setTeacherAccessList={setTeacherAccess} edit={false} /> */}

      <Table
        dataSource={teacherAccess}
        columns={columns}
        size="small"
        pagination={false}
        loading={isLoading}
      />

      {/* edit form */}
      <Modal
        title="Biriktirilgan fanlar"
        width={1700}
        open={isModalOpen}
        footer={false}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form
          form={form}
          name="basic"
          layout="vertical"
          onFinish={(values) => saveData(values)}
        >
            <Row gutter={[12, 0]} >
              <FormUIBuilder data={first_data} form={form} load={false} />
              <Col xs={24} sm={24} md={12} lg={8} xl={2} >
                <Button loading={saveLoading} htmlType="submit" type="primary" className="md:mt-8 w-full max-md:mb-4">+</Button>
                </Col>
            </Row>

            <Table
                dataSource={teacherAccess}
                columns={columns}
                size="small"
                pagination={false}
                loading={isLoading}
            />
        </Form>
      </Modal>
    </div>
  )
}
export default TeacherAccessInfoUserViewNew;