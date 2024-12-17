import { Button, Form, FormInstance, Modal } from "antd";
import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import PrefessionElements from "pages/users/form_elements/profession_elements";
import checkPermission from "utils/check_permission";
import ViewInput from "components/ViewInput";

interface DataType {
    name: string;
    value: ReactNode;
    value2?: ReactNode;
    value3?: ReactNode;
}

const JobInfoUserView = ({data, form, saveMutation} : {data: any, form: FormInstance, saveMutation: UseMutationResult<any, AxiosError<any, any>, void, unknown>}) => {

    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const tableData: DataType[] = [
      {
        name: t("Diplom type"),
        value: data?.diplomaType?.name,
      },
      {
        name: t("Degree"),
        value: data?.degree?.name,
      },
      {
        name: t("Academic degree"),
        value: data?.academikDegree?.name,
      },
      {
        name: t("Degree information"),
        value: data?.degreeInfo?.name,
      },
      {
        name: t("Membership party"),
        value: data?.partiya?.name
      }
    ];

    useEffect(() => {
      if(saveMutation.isSuccess) setIsModalOpen(false)
    }, [saveMutation.isSuccess])

    return (
        <div className="px-[24px] pt-[15px] pb-[10px]">
            <div className="flex justify-between items-center mb-[12px]">
                <p className="font-medium text-[16px]">{t("Professional information")}</p>
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
              title="Professional information"
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
                  <PrefessionElements form={form} />
              </Form>
          </Modal>
        </div>
    )
}
export default JobInfoUserView;