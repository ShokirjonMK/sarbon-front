import { useTranslation } from "react-i18next";
import { Button, Switch, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { Link, useNavigate, useParams } from "react-router-dom";
import { globalConstants } from "config/constants";
import StatusTag from "components/StatusTag";
import { IEduSemestr } from "models/education";
import Actions from "components/Actions";
import checkPermission from "utils/check_permission";
import { useEffect, useState } from "react";

const EduSemestrSubject = ({ eduSemestrs, isEduSemestrFetching, eduSemestrRefetch }: { eduSemestrs?: IEduSemestr, isEduSemestrFetching: boolean, eduSemestrRefetch: any }) => {

  const [vedmostData, setvedmostData] = useState<{[name: number]: {[vedmost_id: number]: number}}>()
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { edu_semestr_id, edu_plan_id } = useParams()

  const columns: ColumnsType<any> = [
    {
      title: '№',
      dataIndex: 'order',
      render: (_, __, i) => i + 1,
      width: 45,
    },
    {
      title: t('Name'),
      dataIndex: 'name',
      render: (e, item) => item?.subject?.name
    },
    {
      title: t('Subject type'),
      dataIndex: 'subjectType',
      render: (e, item) => item?.subjectType?.name
    },
    {
      title: t('Credit'),
      dataIndex: 'credit'
    },
    {
      title: t('Total score'),
      dataIndex: 'max_ball'
    },
    // {
    //   title: t('1 shakl'),
    //   dataIndex: 'auditory_time',
    //   render: (index, item) => <Switch
    //                               onChange={event => {
    //                                   // setmarksForSend(prev => ({...prev, [student_id]: event ? 1 : 0})); 
    //                                   // setmarks(prev => ({...prev, [`${student_id}-1`]: event ? 1 : 0}))
    //                                 }
    //                               }
    //                               // checked={marks ? marks[`${student_id}-1`] === 1 : false}
    //                               checkedChildren={"Faol"}
    //                               unCheckedChildren={t("InActive")}
    //                               disabled={!checkPermission("student-mark_create") || true}
    //                             />
    // },
    {
      title: t('Total hour'),
      dataIndex: 'auditory_time'
    },
    {
      title: t('Status'),
      render: (e) => <StatusTag status={e?.status} />,
      align: "center",
    },
    {
      title: t("Actions"),
      dataIndex: 'actions',
      width: 120,
      align: "center",
      render: (i, e) => <Actions
        id={e?.id}
        url={'edu-semestr-subjects'}
        refetch={eduSemestrRefetch}
        onClickEdit={() => navigate(`/edu-plans/semestrs/subject/update/${e?.id}`)}
        onClickView={() => { }}
        viewPermission={'edu-semestr-subject_view'}
        editPermission={"edu-semestr-subject_update"}
        deletePermission={"edu-semestr-subject_delete"}
      />
    },
  ]


  return (
    <div className="">
      <div className="px-[24px] py-[20px]">
        <div className="flex justify-between mb-[24px] items-center">
          <h3 className="text-[16px] font-medium items-center">{t("Semestr subjects")}</h3>
          {checkPermission("edu-semestr-subject_create") ?
            <Link to={`/edu-plans/semestrs/subject/attachment/${edu_plan_id}/${edu_semestr_id}`} >
              <Button type="primary">{t("Create")}</Button>
            </Link> : ""
          }
        </div>
        <Table
          columns={columns}
          dataSource={eduSemestrs?.eduSemestrSubjects.length ? eduSemestrs?.eduSemestrSubjects : []}
          pagination={false}
          loading={isEduSemestrFetching}
          size="middle"
          className="mt-3"
          rowClassName="py-[12px]"
          scroll={globalConstants?.tableScroll}
        />
      </div>
    </div>
  )
}

export default EduSemestrSubject;
