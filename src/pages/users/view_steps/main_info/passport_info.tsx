import { Button, Form, FormInstance, Modal, Table } from "antd";
import { FILE_URL } from "config/utils";
import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import PassportElements from "pages/users/form_elements/passport_elements";
import checkPermission from "utils/check_permission";
import ViewInput from "components/ViewInput";

const PassportInfoUserView = ({data, form, saveMutation} : {data: any, form: FormInstance, saveMutation: UseMutationResult<any, AxiosError<any, any>, void, unknown>}) => {

    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
      if(saveMutation.isSuccess) setIsModalOpen(false)
    }, [saveMutation.isSuccess])
    
    return (
        <div className="px-[24px] pt-[30px] pb-[10px]">
            <div className="px-6 py-4">
              <div className="grid grid-cols-3 gap-4">
                <ViewInput 
                  label={t("Birthday")} 
                  value={data?.profile?.birthday} 
                  placeholder={t("Birthday")}
                />
                <ViewInput 
                  label={t("Gender")} 
                  value={data?.profile?.gender == 1 ? t("Male") : data?.profile?.gender === 0 ? t("Female") : ""}
                  placeholder={t("Gender")}
                />
                <ViewInput 
                  label={t("Citizenship")} 
                  value={data?.citizenship?.name}
                  placeholder={t("Citizenship")}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <ViewInput 
                  label={t("Nationality")} 
                  value={data?.nationality?.name}
                  placeholder={t("Nationality")}
                />
                <div></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <ViewInput 
                  label={t("Document series and number")} 
                  value={`${data?.profile?.passport_serial ? data?.profile?.passport_serial : ""}${data?.profile?.passport_number ? data?.profile?.passport_number : ""}`}
                  placeholder={t("Document series and number")}
                />
                <ViewInput 
                  label={t("JSHSHIR")} 
                  value={data?.profile?.passport_pin}
                  placeholder={t("JSHSHIR")}
                />
                <div></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <ViewInput 
                  label={t("Date of issue of the document")} 
                  value={data?.profile?.passport_given_date}
                  placeholder={t("Date of issue of the document")}
                />
                <ViewInput 
                  label={t("Validity period")} 
                  value={data?.profile?.passport_issued_date}
                  placeholder={t("Validity period")}
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <ViewInput 
                  label={t("Address")} 
                  value={data?.profile?.passport_given_by}
                  placeholder={t("Address")}
                />
              </div>
              <ViewInput 
                label={t("Document file")} 
                value={data?.profile?.passport_file ? <a href={FILE_URL + data?.profile?.passport_file} target="_blank">{t("Download")}</a> : "----"}
                placeholder={t("Document file")}
              />
              <div className="flex justify-end">
                {checkPermission("user_update") ? <Button onClick={() => setIsModalOpen(true)}>{t("Edit")}</Button> : null}
              </div>
            </div>

            {/* edit form */}
            <Modal
              title={t("Identity document")}
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
                  <PassportElements form={form} passport_file={data?.profile?.passport_file} />
              </Form>
          </Modal>
        </div>
    )
}
export default PassportInfoUserView;