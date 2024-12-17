import { Button, Form, FormInstance, Modal } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { generateTeacherAccess } from "utils/generate_access";
import TeacherAccess from "pages/teacher/components/teacherAccess";
import checkPermission from "utils/check_permission";

const TeacherAccessInfoUserView = ({ data, form, saveMutation }: { data: any, form: FormInstance, saveMutation: UseMutationResult<any, AxiosError<any, any>, void, unknown> }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teacherAccess, setTeacherAccess] = useState<any>();

  useEffect(() => {
    setTeacherAccess(generateTeacherAccess(data?.teacherAccess))
  }, [data?.teacherAccess])

  useEffect(() => {
    form.setFieldsValue({
      teacher_access: JSON.stringify(teacherAccess)
    })
  }, [teacherAccess])

  useEffect(() => {
    if (saveMutation.isSuccess) setIsModalOpen(false)
  }, [saveMutation.isSuccess])

  return (
    <div className="px-[24px] pt-[30px] pb-[10px]">
      <div className="flex justify-between items-center mb-[12px]">
        <p className="font-medium text-[16px]">Biriktirilgan fanlar</p>
        { checkPermission("user_update") ? <Button onClick={() => setIsModalOpen(true)}>{t("Edit")}</Button> : null}
      </div>

      <TeacherAccess teacher_access_list={teacherAccess} setTeacherAccessList={setTeacherAccess} edit={false} />

      {/* edit form */}
      <Modal
        title="Biriktirilgan fanlar"
        okText={t("Submit")}
        cancelText={t("Cancel")}
        width={1700}
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form
          form={form}
          name="basic"
          layout="vertical"
          onFinish={(values) => saveMutation.mutate(values)}
        >
          <Form.Item
            name="teacher_access"
          >
            <TeacherAccess edit={true} teacher_access_list={teacherAccess} setTeacherAccessList={setTeacherAccess} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
export default TeacherAccessInfoUserView;