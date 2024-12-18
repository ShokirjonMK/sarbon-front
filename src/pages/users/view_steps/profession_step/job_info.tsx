import { Button, Form, FormInstance, Modal, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import PrefessionElements from "pages/users/form_elements/profession_elements";
import checkPermission from "utils/check_permission";

interface DataType {
    name: string;
    value: ReactNode;
    value2?: ReactNode;
    value3?: ReactNode;
}

const JobInfoUserView = ({data, form, saveMutation} : {data: any, form: FormInstance, saveMutation: UseMutationResult<any, AxiosError<any, any>, void, unknown>}) => {

    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const sharedOnCell = (_: DataType, index: number | undefined, type?: "last") => {
        if(index || index == 0){
            if (index >= 2) {
                return { colSpan: 0, rowSpan: 0 };
            }
        }
        return {};
    };

    const columns: ColumnsType<DataType> = [
        {
          title: t("Surname"),
          dataIndex: "name",
          rowScope: "row",
        },
        {
          title: t("Value"),
          dataIndex: "value",
          onCell: (_, index) => ({
            colSpan: (index == 2) ? 3 : 1
          }),
        },
        {
          title: t("Name2"),
          dataIndex: "value2",
          onCell: (_, index) => sharedOnCell(_, index),
          className: "bg-[#FAFAFA]"
        },
        {
          title: t("Name3"),
          dataIndex: "value3",
          onCell: (_, index) => sharedOnCell(_, index, "last"),
        },
    ];

    const tableData: DataType[] = [
      {
        name: t("Diplom type"),
        value: data?.diplomaType?.name,
        value2: t("Degree"),
        value3: data?.degree?.name
      },
      {
        name: t("Academic degree"),
        value: data?.academikDegree?.name,
        value2: t("Degree information"),
        value3: data?.degreeInfo?.name
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
            <Table
                columns={columns}
                bordered
                dataSource={tableData}
                showHeader={false}
                pagination={false}
            />


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