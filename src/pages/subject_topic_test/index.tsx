import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderExtraLayout from 'components/HeaderPage/headerExtraLayout';
import { CreateBtn } from 'components/Buttons';
import { useTranslation } from 'react-i18next';
import useGetAllData from 'hooks/useGetAllData';
import { ITestQuestion } from 'models/test';
import { Avatar, Button, Spin, Switch } from 'antd';
import { FILE_URL } from 'config/utils';
import CustomPagination from 'components/Pagination';
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import { number_order } from 'utils/number_orders';
import DeleteData from 'components/deleteData';
import { Delete16Filled, Eye20Filled } from '@fluentui/react-icons';
import checkPermission from 'utils/check_permission';
import { updateTestStatus } from './crud/request';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Notification } from 'utils/notification';

const SubjectTopicTest: React.FC = (): JSX.Element => {

  const [testId, settestId] = useState<number>();

  const navigate = useNavigate();
  const { t } = useTranslation();
  const { subject_id, topic_id } = useParams()
  const { urlValue } = useUrlQueryParams({
    currentPage: 1,
    perPage: 10,
  });

  const { data, isLoading, refetch } = useGetAllData<ITestQuestion>({ 
    queryKey: ["tests", topic_id, urlValue.perPage, urlValue.currentPage],
    urlParams:{"per-page": urlValue.perPage, page: urlValue.currentPage, filter: {topic_id}}, 
    url: `tests?sort=-id&expand=options`,
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: (topic_id != "0"),
    },
  });

  const { mutate, isLoading: statusLoading } = useMutation({
    mutationFn: (newVals:{idd: number, data: number}) => updateTestStatus(newVals.idd, newVals.data),
    onSuccess: async (res) => {
      refetch()
      Notification("success", "update", res?.message)
    },
    onError: (error: AxiosError<any>) => {
      Notification("error", "update", error?.response?.data ? error?.response?.data?.message : "");
    },
    retry: 0,
  });


  return (
    <Spin spinning={isLoading} size="small">
      <HeaderExtraLayout
        breadCrumbData={[
          { name: "Home", path: "/" },
          { name: `Subjects`, path: `/subjects` },
          { name: `Subject topics`, path: `/subjects/view/${subject_id}?user-block=topic-info` },
          { name: `Topic tests`, path: `/subject/tests` },
        ]}
        isBack={true}
        title={t("Topic tests")}
        btn={
          <CreateBtn
            onClick={() => navigate(`/subject/tests/update/${subject_id}/${topic_id}/0`)}
            permission={"subject-topic-test_index"}
          />
        }
      />
      <div className="px-6 py-5">
        {
          data?.items?.map((item, index) => (
              <div key={item?.id} className='bg-zinc-50 p-3 rounded-md mb-5 hover:shadow-lg relative test-list-actions-wrapper'>
                <div className='absolute top-3 right-3 p-1 bg-zinc-50 test-list-actions'>
                  {checkPermission("test_update") ? <Switch className='mt-1' checked={item?.status == 1} onChange={(e) => {mutate({idd: item?.id, data: e ? 1 : 0}); settestId(item?.id)}} loading={testId == item?.id && statusLoading} defaultChecked /> : ""}
                  <DeleteData
                    permission={"test_delete"}
                    refetch={refetch}
                    url={"tests"}
                    id={item?.id}
                  >
                    <Button type="primary" className="mx-2" danger ghost>
                      <Delete16Filled className="text-red-500" />
                    </Button>
                  </DeleteData>
                  {checkPermission("test_view") ? <Button onClick={() => navigate(`/subject/tests/update/${subject_id}/${topic_id}/${item?.id}`)} ><Eye20Filled className="view" /></Button> : ""}
                </div>
                <p className='flex items-center'>
                  <Avatar style={{ color: '#000', backgroundColor: '#eeeeee' }} className='mr-2'>{number_order( urlValue.currentPage, urlValue.perPage, Number(index), isLoading)}</Avatar>
                  <p dangerouslySetInnerHTML={{__html: item?.text ?? ""}} />
                </p>
                {item?.file ? <img width={200} className='ml-[50px] mt-4' src={FILE_URL + item?.file} alt="" /> : ""}
                <div className='pl-5 pt-4'>
                  {
                    item?.options?.map(option => (
                      <div key={option?.id} className={`bg-[#f0f0f0] p-3 rounded-md mb-3`}>
                        <p dangerouslySetInnerHTML={{__html: option?.text ?? ""}} />
                        {option?.file ? <img width={120} className='mt-2'  src={FILE_URL + option?.file} alt="" /> : ""}
                      </div>
                    ))
                  }
                </div>
              </div>
          ))
        }
        {(data?._meta?.totalCount ?? 0) > 10 ? (
          <CustomPagination
            totalCount={data?._meta.totalCount}
            currentPage={urlValue.currentPage}
            perPage={urlValue.perPage}
          />
        ) : undefined}
      </div>
    </Spin>
  );
};

export default SubjectTopicTest;


// test_create
// test_update
// test_index
// test_delete
// test_view