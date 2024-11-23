import { Collapse,Tag } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { EXAMCONTROLTYPES } from 'config/constants/staticDatas';
import { IExamStudent, IFinalExamGroup } from 'models/exam';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { renderFullName } from 'utils/others_functions';

const FinalExamGroups : React.FC<{groups: IFinalExamGroup[] | undefined, examStudents: IExamStudent[] | undefined}> = ({groups, examStudents}) : JSX.Element => {
  
  const { t } = useTranslation()

  const columns: ColumnsType<IExamStudent> = React.useMemo(() =>  [
    {
      title: '№',
      width: 45,
      render: (_, __, i) => i + 1
    },
    {
      title: t('FullName'),
      key: 'name',
      render: (i, e: any) => renderFullName(e?.student?.profile)
    },
    {
      title: t('Type'),
      dataIndex: 'task_completed',
      render: (i, e) => <Tag>{EXAMCONTROLTYPES?.find(i => i?.id === e?.type)?.name}</Tag>
    },
    {
      title: t('Yakuniy bahosi'),
      dataIndex: 'intermediate_grade',
      key: 'intermediate_grade',
      render: (i, e) =><span>{e?.student_ball !== null ? e?.student_ball : "_"} / {e?.max_ball}</span>
    },
    {
      title: t('Status'),
      render: (i, e) => e?.status === 1 ? <Tag color="warning">Talaba imtihonda</Tag> : e?.status === 2 ? <Tag color="processing">Imtihonni yakunlagan</Tag> : e?.status === 3 ? <Tag color="success">Talaba baholandi!</Tag> : ""
    },
  ], [groups?.length]);

  return(
    <>
      {
        groups?.map((item, index) => {
            const groupStudents = examStudents?.filter(eStudent => eStudent?.group_id === item?.id);
            return <Collapse key={index} className='mb-3'>
            <Collapse.Panel header={`${item?.unical_name} - ${t("Group")}, ${t("Talabalar soni")} ${groupStudents?.length}` } key={index+1}>
              <Table
                className='mt-4'
                columns={columns}
                dataSource={groupStudents || []}
                pagination={false}
                loading={false}
              />
            </Collapse.Panel>
        </Collapse>
        })
      }
    </>
  )
}

export default FinalExamGroups;