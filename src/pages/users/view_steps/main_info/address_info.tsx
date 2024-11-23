import { Button, Form, FormInstance, Modal } from "antd";
import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import AddressElements from "pages/users/form_elements/address_elements";
import checkPermission from "utils/check_permission";
import ViewInput from "components/ViewInput";

interface DataType {
    name: string;
    value: ReactNode;
}

const AddressInfoUserView = ({data, form, saveMutation} : {data: any, form: FormInstance, saveMutation: UseMutationResult<any, AxiosError<any, any>, void, unknown>}) => {

    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const tableData: DataType[] = [
      {
        name: t("Country"),
        value: data?.country?.name,
      },
      {
        name: t("Region"),
        value: data?.region?.name,
      },
      {
        name: t("Area"),
        value: data?.area?.name,
      },
      {
        name: t("Address"),
        value: data?.profile?.address
      },
      {
        name: t("Additional Information"),
        value: data?.profile?.description
      },
    ];

    useEffect(() => {
      if(saveMutation.isSuccess) setIsModalOpen(false)
    }, [saveMutation.isSuccess])

    const submitVal = () => {
        form.submit()
    }

    return (
        <div className="px-[24px] pt-[15px] pb-[10px]">
            <div className="flex justify-between items-center mb-[12px]">
                <p className="font-medium text-[16px]">{t("Residential address information")}</p>
                { checkPermission("user_update") ? <Button onClick={() => setIsModalOpen(true)}>{t("Edit")}</Button> : null}
            </div>
            <div className="grid xl:grid-cols-3 grid-cols-2 gap-x-4">
              {
                tableData?.map((item, index) => (
                  <ViewInput
                    key={index}
                    label={item?.name} 
                    value={item?.value} 
                    placeholder={item?.name}
                  />
                ))
              }
            </div>

            {/* edit form */}
            <Modal
              title={t("Residential address information")}
              okText={t("Submit")}
              cancelText={t("Cancel")}
              width={1000}
              open={isModalOpen}
              onOk={submitVal}
              onCancel={() => setIsModalOpen(false)}
            >
              {isModalOpen ? <Form
                  form={form}
                  name="basic"
                  layout="vertical"
                  onFinish={(values) => saveMutation.mutate(values)}
              >
                  <AddressElements form={form} />
              </Form> : null}
          </Modal>
        </div>
    )
}
export default AddressInfoUserView;