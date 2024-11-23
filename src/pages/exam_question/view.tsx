import React, { ReactNode} from "react";
import useGetOneData from "hooks/useGetOneData";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import Table, { ColumnsType } from "antd/es/table";
import { Badge, Button, Tag, Tooltip } from "antd";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { DocumentText24Regular } from "@fluentui/react-icons";
import { FILE_URL } from "config/utils";
import checkPermission from "utils/check_permission";
import DeleteData from "components/deleteData";

interface DataType {
  name: string;
  value: ReactNode;
  value2?: ReactNode;
  value3?: ReactNode;
}

const sharedOnCell = (_: DataType, index: number | undefined) => {
  if(index || index == 0){
    if (index < 4) {
        return { colSpan: 0 };
    }
  }
  return {};
};

const ExamQuestionView : React.FC = () : JSX.Element => {
  const {t} = useTranslation()
  const {id} = useParams()
  const navigate = useNavigate()

  const { data, refetch } = useGetOneData({
    queryKey: ['exam-controls', id],
    url: `tests/${id}?expand=language,subject,createdBy,updatedBy`,
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  });

  const columns: ColumnsType<DataType> =  [
    {
      title: t("Name"),
      width: 40,
      dataIndex: "name",
      rowScope: "row",
    },
    {
      title: t("Value"),
      dataIndex: "value",
      onCell: (_, index) => ({
        colSpan: (index == 4 || index == 5) ? 1 : 3,
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
      onCell: (_, index) => sharedOnCell(_, index),
    },
  ];

  const tableData: DataType[] = [
    {
      name: t("Question"),
      value: <div dangerouslySetInnerHTML={{__html: data?.data?.text ?? ''}}/>
    },
    {
      name: t("Subject"),
      value: data?.data?.subject?.name,
    },
    {
      name: t("Language"),
      value: data?.data?.language?.name,
    },
    {
      name: t("File"),
      value: data?.data?.file ? <a href={FILE_URL + data?.data?.file} target='_blank'><DocumentText24Regular /></a> : 'Fayl yuklanmagan'
    },
    {
      name: t("Type"),
      value: data?.data?.type === 1 ? <Tag>{t("Write")}</Tag> : <Tag>{t('Test')}</Tag>,
      value2: t("Status"),
      value3: <Badge color={data?.data?.status === 1 ? "green" : "red"} text={data?.data?.status === 1 ? t('Active') : t("InActive")}/>,
    },
    {
      name: t("CreatedBy"),
      value: <div>
        <span className="text-gray-400"> {t("name")}/{t("Last Name")}/{t("Role")} :{" "} </span>{data?.data?.createdBy?.first_name} {data?.data?.createdBy?.last_name} (
        {data?.data?.createdBy?.role.map((item: string) => { return item; })})
        </div>,
      value2: t("UpdateBy"),
      value3: <div>
        <span className="text-gray-400"> {t("name")}/{t("Last Name")}/{t("Role")} :{" "} </span>
        {data?.data?.updatedBy?.first_name} {data?.data?.updatedBy?.last_name}{" "}
        ( {data?.data?.updatedBy?.role.map((item: string) => { return item; })} )
      </div>,
    },
  ];
  return(
    <>
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: "/" },
          { name: "Exam questions", path: "/exam-questions" },
          { name: "Exam questions view", path: "" },
        ]}
        title={t(`${data?.data?.subject?.name}`)}
        isBack={true}
        btn={
          <div>
            {checkPermission("test_delete") ? (
              <Tooltip placement="left" title={t("Delete")}>
                <DeleteData permission={"test_delete"} refetch={refetch} url={"tests"} id={Number(id)} className="mr-4" navigateUrl="/exam-questions">
                  <Button danger > {t("Delete")} </Button>
                </DeleteData>
              </Tooltip>
            ) : null}
            { checkPermission("test_update") ? ( <Button onClick={() => { navigate(`/exam-questions/update/${id}`) }} > {t("Edit")}</Button>) : null }
          </div>
        }
      />
      <div className="py-3 px-6">
        <Table
          columns={columns}
          bordered
          dataSource={tableData}
          showHeader={false}
          pagination={false}
        />
      </div>
    </>
  )
}

export default ExamQuestionView