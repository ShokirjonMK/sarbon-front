import { Avatar, Button, Divider, Form, FormInstance, Image, Modal } from "antd";
import { FILE_URL } from "config/utils";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PersonalElements from "pages/users/form_elements/personal_elements";
import { UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import checkPermission from "utils/check_permission";
import { AiOutlineUser } from "react-icons/ai";
import { renderFullName } from "utils/others_functions";
import ViewInput from "components/ViewInput";

const MainInfoUserView = ({
  data,
  form,
  saveMutation,
}: {
  data: any;
  form: FormInstance;
  saveMutation: UseMutationResult<any, AxiosError<any, any>, void, unknown>;
}) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (saveMutation.isSuccess) setIsModalOpen(false);
  }, [saveMutation.isSuccess]);
  
  return (
    <>
      <div className="e-card-shadow bg-white rounded-2xl">
        <div className="px-6 py-4 flex justify-between items-center">
          <h3
            className="text-[20px] font-semibold"
            style={{ letterSpacing: "0.6px" }}
          >
            {t("Personal information")}
          </h3>
          {checkPermission("user_update") ? (
            <Button onClick={() => setIsModalOpen(true)}>{t("Edit")}</Button>
          ) : null}
        </div>
        <Divider
          className="m-0"
          style={{ borderColor: "rgba(106, 113, 133, 0.3)" }}
          dashed
        />
        <div className="px-6 py-4">
          <div className="flex gap-3 items-center mb-4">
            {data?.profile?.image ? (
              <a href={FILE_URL + data?.profile?.image} target="_blank">
                <Image
                  width={120}
                  src={FILE_URL + data?.profile?.image}
                />
              </a>
            ) : (
              <Avatar size={70} icon={<AiOutlineUser />} />
            )}
            <div>
              <h4 className="text-[20px] font-semibold text-[#3D434A]">
                {renderFullName(data?.profile)}
              </h4>
              <p>Talaba</p>
            </div>
          </div>
          <ViewInput
            label={t("Bio")}
            value={data?.profile?.description}
            placeholder={t("Bio")}
            className="min-h-[80px]"
          />
          <ViewInput
            label={t("Main phone number")}
            value={data?.profile?.phone}
            placeholder={t("Main phone number")}
          />
          <ViewInput
            label={t("Additional phone number")}
            value={data?.profile?.phone_secondary}
            placeholder={t("Additional phone number")}
          />
          <ViewInput
            label={t("Email")}
            value={data?.profile?.email}
            placeholder={t("Email")}
          />
        </div>
      </div>
      <Modal
        title={t("Personal information")}
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
          <PersonalElements form={form} avatar={data?.profile?.image} />
        </Form>
      </Modal>
    </>
  );
};
export default MainInfoUserView;
