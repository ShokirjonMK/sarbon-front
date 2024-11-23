import { Button, Divider, Form, FormInstance, Modal, Row } from "antd";
import { FC, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import FormUIBuilder from "components/FormUIBuilder";
import { address_form_data, per_address_data } from "../step_element/address_info";
import { IStudent } from "models/student";
import checkPermission from "utils/check_permission";
import ViewInput from "components/ViewInput";

interface DataType {
  name: string;
  value: ReactNode;
}

const AddressInfoView: FC<{ data: IStudent | undefined, form: FormInstance, saveMutation: UseMutationResult<any, AxiosError<any, any>, void, unknown> }> = ({ data, form, saveMutation }): JSX.Element => {

  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tableData: DataType[] = [
    {
      name: t("Country"),
      value: data?.country?.name ?? "-",
    },
    {
      name: t("Region"),
      value: data?.region?.name ?? "-",
    },
    {
      name: t("Area"),
      value: data?.area?.name ?? "-",
    },
    {
      name: t("Address"),
      value: data?.profile?.address ?? "-"
    },
  ];
  const tableData2: DataType[] = [
    {
      name: t("Country"),
      value: data?.permanentCountry?.name ?? "-",
    },
    {
      name: t("Region"),
      value: data?.permanentRegion?.name ?? "-",
    },
    {
      name: t("Area"),
      value: data?.permanentArea?.name ?? "-",
    },
    {
      name: t("Address"),
      value: data?.profile?.permanent_address ?? "-"
    },
  ];

  useEffect(() => {
    if (saveMutation.isSuccess) setIsModalOpen(false)
  }, [saveMutation.isSuccess])

  const submitVal = () => {
    form.submit()
  }

  return (
    <div className="px-[24px] pt-[30px] pb-[10px]">
      <div className="flex justify-between items-center mb-[12px]">
        <p className="font-medium text-[16px]">{t("Residential address information")}</p>
        { checkPermission("student_update") ? <Button onClick={() => setIsModalOpen(true)}>{t("Edit")}</Button> : null}
      </div>

      <div className="grid xl:grid-cols-4 grid-cols-2 gap-4">
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
      <p className="font-medium text-[16px] mb-4">{t("Permanent address information")}</p>
      <div className="grid xl:grid-cols-4 grid-cols-2 gap-4">
        {
          tableData2?.map((item, index) => (
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
          <Row gutter={[24, 0]} >
            <FormUIBuilder data={address_form_data} form={form} load={true} />
          </Row>
          <Divider orientation='left' orientationMargin={0} ><p className='font-medium mt-[20px] mb-[12px]'>{t("Permanent address information")}</p></Divider>
          <Row gutter={[24, 0]} >
            <FormUIBuilder data={per_address_data} form={form} load={true} />
          </Row>
        </Form> : null}
      </Modal>
    </div>
  )
}
export default AddressInfoView;