import React from "react";
import Table, { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import { IStudent } from "models/student";
import UserStatusTag from "components/StatusTag/userStatusTag";
import Actions from "components/Actions";
import checkPermission from "utils/check_permission";
import { number_order } from "utils/number_orders";
import { useNavigate } from "react-router-dom";

interface GroupStudentTypeProps {
  data: any,
  allStudent: any,
  urlValue: any,
  isLoading: boolean,
  refetch: any,
}

const sortStudent = (a: any, b: any) => {
  const nameA = a?.user?.last_name?.toUpperCase(); // ignore upper and lowercase
  const nameB = b?.user?.last_name?.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
};

const StudentInfo = ({data,allStudent,urlValue, isLoading, refetch}: GroupStudentTypeProps) => {
  const {t} = useTranslation()
  const navigate = useNavigate()


  const columns: ColumnsType<IStudent> = React.useMemo(() => [
    {
      title: '№',
      width: 45,
      render: (_, __, i) => number_order(urlValue.currentPage, urlValue.perPage, Number(i), isLoading)
    },
    {
      title: t('Last name'),
      dataIndex: 'last_name',
      key: 'last_name',
      render: (i,e) =>
        checkPermission("student_view") ? (
          <span onClick={() => navigate(`/students/view/${e?.id}`)} className="hover:text-[#0a3180] underline cursor-pointer">{e?.user?.last_name} </span>
        ) : (<span>{e?.user?.last_name}</span>),
    },
    {
      title: t('First name'),
      dataIndex: 'name',
      key: 'name',
      render: (i,e) =>
        checkPermission("student_view") ? (
          <span onClick={() => navigate(`/students/view/${e?.id}`)} className="hover:text-[#0a3180] underline cursor-pointer">{e?.user?.first_name} </span>
        ) : (<span>{e?.user?.first_name}</span>),
    },
    {
      title: t('Middle name'),
      dataIndex:'middle_name',
      key: 'middle_name',
      render: (i,e) =>
        checkPermission("student_view") ? (
          <span onClick={() => navigate(`/students/view/${e?.id}`)} className="hover:text-[#0a3180] underline cursor-pointer">{e?.user?.middle_name} </span>
        ) : (<span>{e?.user?.middle_name}</span>),
    },
    {
      title: t('Username (login)'),
      dataIndex:'user_name',
      key: 'user_name',
      render: (i,e) =>
        checkPermission("student_view") ? (
          <span onClick={() => navigate(`/students/view/${e?.id}`)} className="hover:text-[#0a3180] underline cursor-pointer">{e?.user?.username} </span>
        ) : (<span>{e?.user?.username}</span>),
    },
    {
      title: t('Passport seria and number'),
      dataIndex:'pass_number',
      key: 'pass_number',
      render: (i: string, e) => <span>{e?.profile?.passport_serial} {e?.profile?.passport_number}</span>,
    },
    {
      title: t('JSHSHIR'),
      dataIndex:'JSHSHIR',
      key: 'JSHSHIR',
      render: (i: string, e) => <span>{e?.profile?.passport_pin}</span>,
    },
    {
      title: t('Phone'),
      width: 120,
      dataIndex:'phone',
      key: 'phone',
      render: (i: string, e) => <span>{e?.profile?.phone}</span>,
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      key:'status',
      render: (e: string) => <UserStatusTag status={e} />,
    },
    {
      title: t("Actions"),
      width: 120,
      align: "center",
      dataIndex: 'actions',
      key:'actions',
      render: (i, e) => <Actions
        id={e?.id}
        url={'students'}
        refetch={refetch}
        onClickEdit={() => navigate(`/students/update/${e?.id}`)}
        onClickView={() => navigate(`/students/view/${e?.id}`)}
        viewPermission={'student_view'}
        editPermission={"student_update"}
        deletePermission={"student_delete"}
      />,
    },
  ], [data?.data?.student]);


  return(
    <div className="content-card">
      <Table
        columns={columns}
        bordered
        size="middle"
        dataSource={data?.data?.student.length ? data?.data?.student?.sort(sortStudent) : allStudent?.sort(sortStudent)}
        loading={isLoading}
        pagination={false}
      />
    </div>
  )
}

export default StudentInfo