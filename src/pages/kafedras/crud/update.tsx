import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Divider, Drawer, Form, Input, Select, Switch, Tag } from "antd";
import { AxiosError } from "axios";
import useGetOneData from "hooks/useGetOneData";
import { IKafedra } from "models/edu_structure";
import React, { useState } from "react";
import { Notification } from "utils/notification";
import { validationErrors } from "utils/validation_error";
import { submitData } from "./request";
import { TitleModal } from "components/Titles";
import { useTranslation } from "react-i18next";
import { IoClose } from "react-icons/io5";
import { globalConstants } from "config/constants";
import useGetAllData from "hooks/useGetAllData";
import { TypeFormUIData } from "pages/common/types";
import MultipleInput from "components/MultipleInput";
import FormUIBuilder from "components/FormUIBuilder";
// import TeacherAccess from "pages/teacher/components/teacherAccess";
// import { generateTeacherAccess } from "utils/generate_access";
import IUsers from "models/user";
import { cf_filterOption } from "utils/others_functions";

const formData: TypeFormUIData[] = [
  {
    name: "faculty_id",
    label: "Faculty",
    required: true,
    type: "select",
    url: "faculties",
    child_names: ["direction_id"],
    span: 24,
  },
  {
    name: "direction_id",
    label: "Direction",
    url: "directions",
    type: "select",
    parent_name: "faculty_id",
    required: false,
    span: 24,
  },
];

type TypeFormProps = {
  id: number | undefined;
  refetch: Function;
  isOpenForm: boolean;
  setisOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
  setId: React.Dispatch<React.SetStateAction<number | undefined>>
}


const KafedraUpdate = ({ id, setId, refetch, isOpenForm, setisOpenForm }: TypeFormProps) => {
  const { t, i18n } = useTranslation()
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [teacherAccess, setTeacherAccess] = useState<any>();
  const [is_teacher, setIsTeacher] = useState<boolean>();
  const [allData, setallData] = useState<IUsers[]>();

  const { data: kafedraHead } = useGetAllData({
    queryKey: ["users"],
    url: `users?expand=teacherAccess&filter={"-role_name":["student"]}`,
    options: {
      onSuccess: (res) => {
        setallData(res?.items)
      },
      enabled: isOpenForm
    }
  });

  React.useEffect(() => {
    if (!id) {
      form.resetFields()
    }
  }, [isOpenForm])

  const { data } = useGetOneData<IKafedra>({
    queryKey: ["kafedras", id],
    url: `kafedras/${id}?expand=description,faculty,direction,user,leader.teacherAccess`,
    options: {
      onSuccess: (res) => {
        form.setFieldsValue({
          name: res?.data?.name,
          description: res?.data?.description,
          faculty_id: res?.data?.faculty?.id,
          direction_id: res?.data?.direction_id,
          status: res?.data?.status === 1,
          user_id: res?.data?.leader?.id,
        })
        setIsTeacher(checkTeacher(res?.data?.leader?.id))
        // setTeacherAccess(generateTeacherAccess(res.data?.leader?.teacherAccess));

      },
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: (isOpenForm && !!id),
    }
  })

  const checkTeacher = (id: number) => {
    const teacher = kafedraHead?.items?.find(e => e?.id === id);
    // setTeacherAccess(generateTeacherAccess(teacher?.teacherAccess));

    return teacher?.role?.includes("teacher")
  }

  const { mutate, isLoading } = useMutation({
    mutationFn: (newVals) => submitData(id, newVals, teacherAccess),
    onSuccess: async (res) => {
      queryClient.setQueryData(["kafedras"], res);
      refetch();
      Notification("success", id ? "update" : "create", res?.message)
      if (id) setisOpenForm(false)
    },
    onError: (error: AxiosError) => {
      validationErrors(form, error?.response?.data)
    },
    retry: 0,
  });
 

  return (
    <>
      <Drawer
        title={
          <div className="flex items-center justify-between">
            <TitleModal>{id ? t("Update kafedra") : t("Create kafedra")}</TitleModal>
            <IoClose
              onClick={() => { setisOpenForm(false); setId(undefined); setIsTeacher(false) }}
              className="text-[24px] cursor-pointer text-[#00000073]"
            />    
          </div>
        }
        placement="right"
        closable={false}
        open={isOpenForm}
        onClose={() => { setisOpenForm(false); setId(undefined); setIsTeacher(false) }}
        width={globalConstants.antdDrawerWidth}
        headerStyle={{ backgroundColor: "#F7F7F7" }}
      >
        <Form
          form={form}
          name="basic"
          layout="vertical"
          initialValues={{ status: true }}
          autoComplete="off"
          onFinish={(values) => mutate(values)}
        >
          {/* <KafedraFormUI id={id} form={form} teacherAccess={teacherAccess} setTeacherAccess={setTeacherAccess} /> */}

          {!id ? (
            <MultipleInput layout="vertical" />
          ) : (
            <div>
              <Form.Item
                label={`${t("Name")} (${i18n.language})`}
                name="name"
                rules={[{ required: true, message: `${t("Please input name")}!` }]}
              >
                <Input placeholder={`${t("Name")}`} />
              </Form.Item>
              <Form.Item
                label={t("Description")}
                name="description"
                shouldUpdate
                rules={[
                  {
                    required: false,
                    message: `${t("Please input kafedra name")}!`,
                  },
                ]}
              >
                <Input.TextArea
                  placeholder={t("Enter description for kafedra") + " ..."}
                />
              </Form.Item>
            </div>
          )}

          <FormUIBuilder data={formData} form={form} load={!!id ? true : false} />
          <div className={is_teacher ? "p-2 rounded-lg border-solid border border-[#8ab1ff]" : ""} >
            <Form.Item name="user_id" label={t("Headmaster")}>
              <Select
              className="w-[100%]"
              placeholder={`${t(`Select employee`)}`}
              allowClear
              showSearch
              filterOption={cf_filterOption}
              >
                {
                  kafedraHead?.items.map((element: any) => (
                    <Select.Option key={element.id} value={element.id} >
                      {element?.first_name} {element?.last_name} &nbsp; <div className="inline-flex gap-1">{element?.role?.map((e: string, idx: number) => <Tag key={idx}>{e}</Tag>)}</div>
                    </Select.Option>
                  ))
                }
              </Select>  
            </Form.Item>

            {/* {is_teacher ? <TeacherAccess teacher_access_list={teacherAccess} setTeacherAccessList={setTeacherAccess} edit={true} /> : null} */}
          </div>

          <Divider />
          <div className="flex justify-between">
            <Form.Item name="status" valuePropName="checked" >
              <Switch
                checkedChildren="Active"
                unCheckedChildren="InActive"
              />
            </Form.Item>
            <div className="flex">
              <Button htmlType="button" danger onClick={() => form.resetFields()}>{t('Reset')}</Button>
              <Button className='mx-3' onClick={() => setisOpenForm(false)}>{t('Cancel')}</Button>
              <Button type="primary" loading={isLoading} htmlType="submit">Submit</Button>
            </div>
          </div>
        </Form>
      </Drawer>
    </>
  )
}

export default KafedraUpdate