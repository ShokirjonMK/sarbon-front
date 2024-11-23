import React, { Dispatch } from 'react';
import { Divider, Drawer, Spin } from "antd";
import { MAIN_URL } from 'config/utils';
import useGetData from 'hooks/useGetData';
import { FaDotCircle, FaRegCircle } from 'react-icons/fa';

const TestViewDrawer = React.memo(({ setIsModalOpen, isModalOpen, selectedTestId }: {isModalOpen: boolean, setIsModalOpen: Dispatch<boolean>, selectedTestId: number | undefined}) => {

  const { data, isFetching } = useGetData({
    queryKey: ['final-exam-test-starts/get', selectedTestId],
    url: `final-exam-test-starts/get/${selectedTestId}`,
    urlParams: {
      "per-page": 0, 
      expand: "test"
    },
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!selectedTestId
    },
  });

  return (
    <Drawer title="Testlar" onClose={() => setIsModalOpen(false)} open={isModalOpen} width={700}>
      <Spin spinning={isFetching}>
        {/* <div>
          {
            data?.items?.map((item: any, index: number) => (
              <div 
                key={index} 
                className={`border border-solid border-slate-400 rounded-xl px-3 py-2 mb-4 ${item?.option_id ? (item?.is_correct == 1 ? "bg-green-200" : item?.is_correct === 0 ? "bg-red-100"  : "") : ""}`}
              >
                  <p dangerouslySetInnerHTML={{__html: item?.test?.question?.text}} />
                  {item?.test?.question?.file ? <img className='w-[200px]' src={MAIN_URL + item?.test?.question?.file} alt="" /> : ""}
                  <Divider className='my-2' />
                  <div>
                    {
                      item?.test?.options?.map((op: any, i: number) => (
                        <ul key={i}>
                          <li className='mb-2' dangerouslySetInnerHTML={{__html: op?.text}} />
                          {op?.file ? <img className='w-[200px]' src={MAIN_URL + op?.file} alt="" /> : ""}
                        </ul>
                      ))
                    }
                  </div>
              </div>
            ))
          }
        </div> */}
        <div>
          {
            data?.items?.map((item: any, index: number) => (
              <div 
                key={index} 
                className={`border border-solid border-slate-400 rounded-xl px-3 py-2 mb-4 ${item?.option_id ? (item?.is_correct == 1 ? "bg-green-200" : item?.is_correct === 0 ? "bg-red-100"  : "") : ""}`}
              >
                  <p dangerouslySetInnerHTML={{__html: item?.test?.question?.text}} />
                  {item?.test?.question?.file ? <img className='w-[200px]' src={MAIN_URL + item?.test?.question?.file} alt="" /> : ""}
                  <Divider className='my-2' />
                  <div>
                    {
                      item?.test?.options?.map((op: any, i: number) => (
                        <div className='pl-5 py-2'>
                            <div className="flex items-center gap-3">
                              {item?.option_id === op?.id ? <FaDotCircle className='text-[18px] flex-shrink-0' /> : <FaRegCircle className='text-[18px] flex-shrink-0' />}
                              <p className='text-left' dangerouslySetInnerHTML={{__html: op?.text}} />
                            </div>
                            {op?.file ? <img className='w-[200px]' src={MAIN_URL + op?.file} alt="" /> : ""}
                        </div>
                      ))
                    }
                  </div>
              </div>
            ))
          }
        </div>
      </Spin>
    </Drawer>
  );
})

export default TestViewDrawer;