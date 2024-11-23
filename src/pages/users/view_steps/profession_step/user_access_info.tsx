import { Button, Form, FormInstance, Modal } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import UserAccess from "pages/users/components/user_access";
import { _generateUserAccess } from "utils/generate_access";
import checkPermission from "utils/check_permission";

const UserAccessInfoUserView = ({ data, form, saveMutation }: { data: any, form: FormInstance, saveMutation: UseMutationResult<any, AxiosError<any, any>, void, unknown> }) => {

  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [userAccess, setUresAccess] = useState<any>();

  useEffect(() => {
    setUresAccess(_generateUserAccess(data?.userAccess))
  }, [data?.userAccess])

  useEffect(() => {
    form.setFieldsValue({
      user_access: JSON.stringify(userAccess)
    })
  }, [userAccess])

  useEffect(() => {
    if (saveMutation.isSuccess) setIsModalOpen(false)
  }, [saveMutation.isSuccess])

  return (
    <div className="px-[24px] pt-[30px] pb-[10px]">
      <div className="flex justify-between items-center mb-[12px]">
        <p className="font-medium text-[16px]">{t("Structural structure")}</p>
        { checkPermission("user_update") ? <Button onClick={() => setIsModalOpen(true)}>{t("Edit")}</Button> : null}
      </div>

      <UserAccess edit={false} userAccess={userAccess} setUserAccess={setUresAccess} />

      {/* edit form */}
      <Modal
        title="Structural structure"
        okText={t("Submit")}
        cancelText={t("Cancel")}
        width={1000}
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
            name="user_access"
          >
            <UserAccess edit={true} userAccess={userAccess} setUserAccess={setUresAccess} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
export default UserAccessInfoUserView;