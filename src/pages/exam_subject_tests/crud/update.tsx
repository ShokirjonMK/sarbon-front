import { Button, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import useGetOneData from 'hooks/useGetOneData';
import FormTestQuestionUI from './question_ui';
import { ITestOption, ITestQuestion } from 'models/test';
import FormExamTestOptionUI from './option_ui';
import useGetAllData from 'hooks/useGetAllData';
import checkPermission from 'utils/check_permission';
import DeleteData from 'components/deleteData';
import useBreadCrumb from 'hooks/useBreadCrumb';

const UpdateSubjectExamTest = () => {

  const { t } = useTranslation();
  const { subject_semestr_id, test_id, subject_id } = useParams()
  const [options, setOptions] = useState<Array<any>>([]);
  const [isEdit, setisEdit] = useState<boolean>(test_id == "0");

  const { data, refetch, isLoading } = useGetOneData<ITestQuestion>({
    queryKey: ["tests", test_id],
    url: `tests/${test_id}`,
    urlParams: {
      expand: "testBody",
    },
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: (test_id != "0"),
    },
  });  

  const { data: optionsData, refetch: refetchOptions } = useGetAllData<ITestOption>({
    queryKey: ["options", test_id],
    url: `options`,
    urlParams: {filter: {test_id: Number(test_id)}},
    options: {
      onSuccess: () => {
        setOptions([])
      },
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: (test_id != "0"),
    },
  });

  useBreadCrumb({pageTitle: test_id == "0" ? "Test qo'shish" : "O'zgatirish", breadcrumb: [
    { name: "Home", path: "/" },
    { name: `Subjects`, path: `/subjects` },
    { name: `Fanni ko'rish`, path: `/subjects/view/${subject_id}` },
    { name: `Exam tests`, path: `/subjects/semestrs/view/${subject_semestr_id}/${subject_id}?user-block=exam-tests` },
    { name: test_id == "0" ? "Test qo'shish" : "O'zgatirish", path: `/subject/tests/${subject_semestr_id}/${test_id}` },
  ]})

  return (
    <Spin spinning={isLoading && test_id != "0"} size="small">
      <div className='content-card'>
        <div className="flex items-center justify-end mb-3">
          <DeleteData
            permission={"test_delete"}
            refetch={refetch}
            url={"tests"}
            id={Number(test_id)}
            navigateUrl={`/subject/tests/${subject_semestr_id}/${test_id}`}
          >
            <Button type="primary" className="mr-2" danger ghost>{t("Delete")}</Button>
          </DeleteData>
          {checkPermission("test_update") ? <Button onClick={() => setisEdit(true)} htmlType="submit" >{t("Edit")}</Button> : ""}
        </div>
        <div className="pb-[24px]">
          <FormTestQuestionUI data={data?.data} refetch={refetch} isEdit={isEdit} setisEdit={setisEdit} />
          {
            optionsData?.items?.map((item, index) => (
              <FormExamTestOptionUI key={item?.id} data={item} refetch={refetchOptions} />
            ))
          }
          {
            options?.map((item, index) => (
              <FormExamTestOptionUI key={index} data={{} as ITestOption} refetch={refetchOptions} isNew={true} setOptions={setOptions} />
            ))
          }
          <div className="grid grid-cols-12">
            {
              checkPermission("option_create") ?
              <div className="lg:col-span-8 col-span-12 lg:col-start-3">
                {
                  test_id != "0" && options?.length < 1 ? <Button onClick={() => setOptions([...options, 'prev']) } className='w-[100%]' >+ {t("Add option")}</Button> : ""
                }
              </div> : ""
            }
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default UpdateSubjectExamTest;