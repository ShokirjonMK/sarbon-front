import { Button, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import HeaderExtraLayout from 'components/HeaderPage/headerExtraLayout';
import { useState } from 'react';
import useGetOneData from 'hooks/useGetOneData';
import { ITestOption, ITestQuestion } from 'models/test';
import useGetAllData from 'hooks/useGetAllData';
import checkPermission from 'utils/check_permission';
import DeleteData from 'components/deleteData';
import FormExamTestOptionUI from '../crud/option_ui';
import FormExamTestQuestionUI from '../crud/question_ui';

const TestUpdate = () => {

  const { t } = useTranslation();
  const { test_id } = useParams()
  const [options, setOptions] = useState<Array<any>>([]);
  const [isEdit, setisEdit] = useState<boolean>(!test_id);

  const { data, refetch, isLoading } = useGetOneData<ITestQuestion>({
    queryKey: ["tests", test_id],
    url: `tests/${test_id}?expand=testBody`,
    options: {
      enabled: !!test_id,
    },
  });

  const { data: optionsData, refetch: refetchOptions } = useGetAllData<ITestOption>({
    queryKey: ["options", test_id],
    url: `options`,
    urlParams: { filter: { test_id: Number(test_id) } },
    options: {
      onSuccess: () => {
        setOptions([])
      },
      enabled: !!test_id,
    },
  });

  return (
    <Spin spinning={isLoading && !!test_id} size="small">
      <div>
        <HeaderExtraLayout
          title={!test_id ? "Test qo'shish" : "O'zgatirish"}
          isBack={`tests`}
          breadCrumbData={[
            { name: "Home", path: "/" },
            { name: `Tests`, path: `/tests` },
            { name: !test_id ? "Test qo'shish" : "O'zgatirish", path: `/tests/view/${test_id}` },
          ]}
          btn={
            <div className="flex items-center">
              {test_id ? <DeleteData
                permission={"test_delete"}
                refetch={refetch}
                url={"tests"}
                id={Number(test_id)}
                navigateUrl={`/tests`}
              >
                <Button type="primary" className="mr-2" danger ghost>{t("Delete")}</Button>
              </DeleteData> : null}
              {(checkPermission("test_update") && test_id) ? <Button onClick={() => setisEdit(true)} htmlType="submit" >{t("Edit")}</Button> : ""}
            </div>
          }
        />
        <div className="pb-[24px]">
          <FormExamTestQuestionUI data={data?.data} refetch={refetch} isEdit={isEdit} setisEdit={setisEdit} isSubject={true} />
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
                    (test_id != "0" && test_id) && options?.length < 1 ? <Button onClick={() => setOptions([...options, 'prev'])} className='w-[100%]' >+ {t("Add option")}</Button> : ""
                  }
                </div> : ""
            }
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default TestUpdate;