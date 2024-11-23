import { Button, Form, FormInstance, Modal, Row, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { FC, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import FormUIBuilder from "components/FormUIBuilder";
import { edu_form_data } from "../step_element/edu_info";
import { IStudent } from "models/student";
import ViewInput from "components/ViewInput";
import checkPermission from "utils/check_permission";

interface DataType {
  name: string;
  value: ReactNode;
}

type EduInfoViewPropsType = {
  data: IStudent | undefined,
  saveMutation: UseMutationResult<any, AxiosError<any, any>, void, unknown>,
  form: FormInstance
}

const EduInfoView: FC<EduInfoViewPropsType> = ({ data, saveMutation, form }): JSX.Element => {

  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tableData: DataType[] = [
    {
      name: t("Faculty"),
      value: data?.faculty?.name ?? "-",
    },
    {
      name: t("Direction"),
      value: data?.direction?.name ?? "-",
    },
    {
      name: t("Education plan"),
      value: data?.eduPlan?.name ?? "-",
    },
    {
      name: t("Group"),
      value: data?.group?.unical_name ?? "-",
    },
    {
      name: t("Education type"),
      value: data?.eduType?.name ?? "-",
    },
    {
      name: t("Education form"),
      value: data?.eduForm?.name ?? "-",
    },
    {
      name: t("Education year"),
      value: data?.eduYear?.name ?? "-",
    },
    {
      name: t("Course"),
      value: data?.course?.name ?? "-",
    },
    {
      name: t("Education language"),
      value: data?.eduLang?.name ?? "-",
    },
    {
      name: t("Payment form"),
      value: data?.is_contract ? t("Contract") : t("Grand"),
    }
  ]

  useEffect(() => {
    if (saveMutation.isSuccess) setIsModalOpen(false)
  }, [saveMutation.isSuccess])

  return (
    <div className="px-[24px] pt-[30px] pb-[10px]">
      <div className="flex justify-between items-center mb-[12px]">
        <p className="font-medium text-[16px]">{t("Education information")}</p>
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
        title={t("Education information")}
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
            <FormUIBuilder data={edu_form_data} form={form} load={true} />
          </Row>
        </Form>
      </Modal>
    </div>
  )
}
export default EduInfoView;