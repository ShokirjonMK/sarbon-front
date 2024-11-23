import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { data as _data } from '../static_data';
import useGetData from 'hooks/useGetData';

const FacultyStatistcs: React.FC = (): JSX.Element => {
  const {t} = useTranslation();

  const {data} = useGetData({
    queryKey: [""],
    url: `statistics/faculty-statistic?expand=studentStatistic`,
  })

  const columns: ColumnsType<any> = [
    {
      title: t('Name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t("Women"),
      dataIndex: 'studentStatistic',
      render: (e) => e?.woman,
      key: 'age',
    },
    {
      title: t('Men'),
      dataIndex: 'studentStatistic',
      render: (e) => e?.male,
      key: 'men',
    },
    {
      title: t("Barcha talabalar"),
      key: 'total_student',
      dataIndex:'studentStatistic',
      render: (e) => (e?.male ?? 0) + (e?.woman ?? 0),
    },
    {
      title: t('Teachers'),
      dataIndex: 'teachers',
      key: 'teachers',
    },
    {
      title: t("Barcha foydalanuvchilar"),
      key: 'total',
      dataIndex:'total'
    },
  ];

  return (
    <div className="box h_16 p-4  e-card-shadow bg-white rounded-2xl" style={{height:'auto'}}>
      <h4 className="mb-3">{t("The number of requests for directions")}</h4>
      <Table columns={columns} dataSource={data?.items} pagination={false} scroll={{y:400}}/>
    </div>
  );
};

export default FacultyStatistcs;