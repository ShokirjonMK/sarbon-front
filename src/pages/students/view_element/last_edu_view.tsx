import { Button, Form, FormInstance, Modal, Row } from "antd";
import { FC, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import FormUIBuilder from "components/FormUIBuilder";
import { last_edu_form_data } from "../step_element/addition_info";
import { IStudent } from "models/student";
import { FILE_URL } from "config/utils";
import checkPermission from "utils/check_permission";
import ViewInput from "components/ViewInput";

interface DataType {
  name: string;
  value: ReactNode;
}

type LastEduInfoViewPropsType = {
  data: IStudent | undefined,
  saveMutation: UseMutationResult<any, AxiosError<any, any>, void, unknown>,
  form: FormInstance
}

const LastEduInfoView: FC<LastEduInfoViewPropsType> = ({ data, saveMutation, form }): JSX.Element => {

  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tableData: DataType[] = [
    {
      name: t("Last education name"),
      value: data?.last_education ?? "-",
    },
    {
      name: t("Diplom seria and number"),
      value: `${data?.diplom_seria ?? "-"} ${data?.diplom_number ?? "-"}`,
    },
    {
      name: t("Diplom file"),
      value: data?.diplom_file ? <a href={FILE_URL + data?.diplom_file} target="_blank">{t("Download")}</a> : t("Not downloaded"),
    },
  ]

  useEffect(() => {
    if (saveMutation.isSuccess) setIsModalOpen(false)
  }, [saveMutation.isSuccess])

  return (
    <div className="px-[24px] pt-[30px] pb-[10px]">
      <div className="flex justify-between items-center mb-[12px]">
        <p className="font-medium text-[16px]">{t("Last Education information")}</p>
        { checkPermission("student_update") ? <Button onClick={() => setIsModalOpen(true)}>{t("Edit")}</Button> : null}
      </div>

      <div className="grid grid-cols-3 gap-x-4">
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
        title={t("Last Education information")}
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
          <Row gutter={[24, 0]} >
            <FormUIBuilder data={last_edu_form_data} form={form} load={true} />
          </Row>
        </Form>
      </Modal>
    </div>
  )
}
export default LastEduInfoView;