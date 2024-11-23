import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Button, Divider } from "antd";
import { ArrowLeftRegular, ArrowRightRegular } from '@fluentui/react-icons';
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import { FILE_URL } from 'config/utils/index - Copy';
// import { IExamControlStudent, IExamControlTest } from 'models/exam';

type TypeIncorrectTest = {
  data: any;
};

const StudentTestResult: React.FC<TypeIncorrectTest> = ({ data }): JSX.Element => {
  const { t } = useTranslation();
  const { urlValue, writeToUrl } = useUrlQueryParams({});
  const [tests, setTests] = useState<any[]>([]);

  useEffect(() => {
    setTests(data?.examControlTest ?? []);

    if (!urlValue.filter_like?.test){
      writeToUrl({ name: "test", value: 1 });
    }
  }, [data]);

  return (
    <div className="">
      <div className="flex max-md:flex-col gap-6">
        <div className="w-full max-w-[980px] mx-auto">
          <div className="min-h-[260px] bg-[#F7F7F7] rounded-lg border border-solid border-gray-200 p-4 my-2 mt-6 max-md:mt-2">
            {
              tests?.map((e, i) => i + 1 == Number(urlValue.filter_like.test) && (
                <div className="test" key={i}>
                  <div className="flex max-md:flex-col gap-3">
                    <div className='w-1/2 max-md:w-full' dangerouslySetInnerHTML={{ __html: e?.test?.text ?? "" }} />
                    {e?.test?.file ? <>
                      <img src={FILE_URL + e?.test?.file} alt='image' className='w-1/2 max-md:w-full rounded-lg' />
                    </> : null}
                  </div>
                  <Divider className='-ml-4 w-[calc(100%+32px)]' />
                  <div className="variants flex flex-col gap-4 my-4">
                    {
                      e?.test?.options?.map((v: any, idx: number) => (
                        <div key={idx} className="flex gap-2" >
                          {/* <div className={`h-[44px] w-[44px] flex-center rounded-lg border border-solid p-3 ${e?.exam_test_option_id == v.id ? "bg-[#FCE8E6] text-[#C5221F] border-[#ffb3ac]" : "bg-[#fff] border-gray-200"}`}>{idx == 0 ? "A" : idx === 1 ? "B" : idx === 2 ? "C" : idx === 3 ? "D" : "E"}</div> */}
                          <div className={`w-full flex max-md:flex-col gap-3 rounded-lg border border-solid p-3 ${e?.exam_test_option_id == v.id ? e?.isCorrect ? "bg-[#dff3e5] text-[#399b5a] border-[#a2d8b2]" : "bg-[#FCE8E6] text-[#C5221F] border-[#ffb3ac]" : "bg-[#fff] border-gray-200"}`}>
                            <div className='w-3/5 max-md:w-full' dangerouslySetInnerHTML={{ __html: v.text ?? "" }} />
                            {v.file ? <>
                              <img src={FILE_URL + v.file} alt='image' className='w-2/5 max-md:w-full rounded-lg' />
                            </> : null}
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              ))
            }
          </div>
          <div className="flex-center my-5">
            <Button type='primary' ghost className='me-3' disabled={1 === Number(urlValue.filter_like?.test)} onClick={() => { writeToUrl({ name: "test", value: Number(urlValue.filter_like?.test) - 1 }) }} ><div className="d-f"><ArrowLeftRegular className='me-5' /> {("Back")}</div></Button>
            <Button type='primary' disabled={tests?.length <= Number(urlValue.filter_like?.test)} onClick={() => { writeToUrl({ name: "test", value: Number(urlValue.filter_like?.test) + 1 }) }} ><div className="d-f" >{("Next")} <ArrowRightRegular className='ms-5' /></div></Button>
          </div>
        </div>
        <div className="w-96 max-md:w-full h-max min-h-[320px] flex flex-col justify-between gap-4 sticky top-5 bg-[#F7F7F7] rounded-lg border border-solid border-gray-200 shadow-md- p-3 my-6">
          <div>
            <div className="flex flex-wrap gap-2 mt-4">
              {
                tests?.map((e, i) => (
                  <div key={i} onClick={() => { writeToUrl({ name: "test", value: i + 1 }) }} className={`h-[36px] w-[36px] flex-center rounded-lg border border-solid cursor-pointer ${Number(urlValue.filter_like?.test) === i + 1 ? (e?.exam_test_option_id ? "text-[#3776E7] bg-[#EAF0FD]" : "text-[#3776E7] bg-white") : e?.exam_test_option_id ? e?.isCorrect ? "bg-[#dff3e5] text-[#399b5a] border-[#a2d8b2]" : "bg-[#FCE8E6] text-[#C5221F] border-[#ffb3ac]" : "bg-white border-gray-200"} hover:border-[#3776E7]`}>{i + 1}</div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTestResult;