import React, { ReactNode, useState } from "react";
import { Badge, Button, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { Table } from "antd";
import dayjs from "dayjs";
import useGetOneData from "hooks/useGetOneData";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import checkPermission from "utils/check_permission";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import EmployeeIndexPage from "pages/department/components/employee_index";
import KafedraUpdate from "../crud/update";
import DeleteData from "components/deleteData";

interface DataType {
  name: string;
  value: ReactNode;
  value2?: ReactNode;
  value3?: ReactNode;
}

const ViewsKafedra: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [visibleEdit, setVisibleEdit] = useState<boolean>(false);
  const [_id, setId] = useState<number>();

  const { data, refetch, isLoading } = useGetOneData({
    queryKey: ["kafedras", id],
    url: `kafedras/${id}?expand=description,createdBy,updatedBy,faculty,direction,leader`,
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  });

  const columns: ColumnsType<DataType> = [
    {
      title: t("Name"),
      dataIndex: "name",
      rowScope: "row",
    },
    {
      title: t("Value"),
      dataIndex: "value",
      onCell: (_, index) => ({
        colSpan: index === 2 || index === 5 ? 1 : 3,
      }),
    },
    {
      title: t("Name2"),
      dataIndex: "value2",
      onCell: (_, index) => ({
        colSpan: index === 2 || index === 5 ? 1 : 0,
        className: index === 2 || index === 5 ? "bg-[#FAFAFA]" : "",
      }),
    },
    {
      title: t("Name3"),
      dataIndex: "value3",
      onCell: (_, index) => ({
        colSpan: index === 2 || index === 5 ? 1 : 0,
      }),
    },
  ];

  const tableData: DataType[] = [
    {
      name: t("Name"),
      value: data?.data?.name,
    },
    {
      name: t("Description"),
      value: data?.data?.description,
    },
    {
      name: t("Faculty"),
      value: data?.data ? data?.data?.faculty?.name : null,
      value2: t("Direction"),
      value3: data?.data ? data?.data?.direction?.name : null,
    },
    {
      name: t("Head of kafedra"),
      value: data?.data ? (
        <span>
          {data?.data?.leader?.last_name} {data?.data?.leader?.first_name}
        </span>
      ) : null,
    },
    {
      name: t("Status"),
      value: (
        <Badge
          color={data?.data?.status === 1 ? "green" : "red"}
          text={data?.data?.status === 1 ? "Active" : "InActive"}
        />
      ),
    },
    {
      name: t("CreatedBy"),
      value: (
        <div>
          <span className="text-gray-400">
            {t("name")}/{t("Last Name")}/{t("Role")} :{" "}
          </span>
          {data?.data?.createdBy?.first_name} {data?.data?.createdBy?.last_name}{" "}
          (
          {data?.data?.createdBy?.role.map((item: string) => {
            return item;
          })}
          )
          {/* <p>
            <span className="text-gray-400">{t("Login")}: </span>
            {data?.data?.createdBy?.username}
          </p> */}
          <time>
            <span className="text-gray-400">{t("Date")}: </span>
            {dayjs.unix(data?.data?.created_at).format("MM-DD-YYYY hh:mm:ss a")}
          </time>
        </div>
      ),
      value2: t("UpdateBy"),
      value3: (
        <div>
          <span className="text-gray-400">
            {t("name")}/{t("Last Name")}/{t("Role")} :{" "}
          </span>
          {data?.data?.updatedBy?.first_name} {data?.data?.updatedBy?.last_name}{" "}
          (
          {data?.data?.updatedBy?.role.map((item: string) => {
            return item;
          })}
          )
          {/* <p>
            <span className="text-gray-400">{t("Login")}: </span>
            {data?.data?.updatedBy?.username}
          </p> */}
          <time>
            <span className="text-gray-400">{t("Date")}: </span>
            {dayjs.unix(data?.data?.updated_at).format("MM-DD-YYYY hh:mm:ss a")}
          </time>
        </div>
      ),
    },
  ];

  return (
    <div>
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: "/" },
          { name: "Kafedra", path: "/structural-unit/kafedras" },
          { name: "Kafedra view", path: "" },
        ]}
        title={t(`${data?.data?.name}`)}
        isBack={true}
        btn={
          <div className="flex">
            {checkPermission("kafedra_delete") ? (
              <Tooltip placement="left" title={t("Delete")}>
                <DeleteData
                  permission={"kafedra_delete"}
                  refetch={refetch}
                  url={"kafedras"}
                  id={Number(id)}
                  className="mr-4"
                  navigateUrl="/structural-unit/kafedras"
                >
                  <Button danger >
                    {t("Delete")}
                  </Button>
                </DeleteData>
              </Tooltip>
            ) : null}
            {checkPermission("kafedra_update") ? (<Button onClick={() => setVisibleEdit(true)}>{t("Edit")}</Button>) : null}
          </div>
        }
      />

      {id ? (
        <KafedraUpdate
          id={data?.data?.id}
          isOpenForm={visibleEdit}
          setisOpenForm={setVisibleEdit}
          setId={setId}
          refetch={refetch}
        />
      ) : null}

      <div className="p-6">
        <Table
          columns={columns}
          bordered
          dataSource={tableData}
          showHeader={false}
          pagination={false}
          loading={isLoading}
          className="mb-10"
        />

        <EmployeeIndexPage userAccessTypeId={2} />
      </div>
    </div>
  );
};

export default ViewsKafedra;
