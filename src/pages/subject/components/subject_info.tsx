import React from 'react';
import { useTranslation } from "react-i18next";
import { Button, Tooltip } from "antd";
import HeaderUserView from 'pages/users/components/vewHeader';
import checkPermission from 'utils/check_permission';
import DeleteData from 'components/deleteData';
import { useNavigate, useParams } from 'react-router-dom';
import { ISubject } from 'models/subject';
import useGetOneData from 'hooks/useGetOneData';
import ViewSubject from '../crud/view';
import SubjectTopic from 'pages/subject_topic';
import SubjectExamTest from 'pages/exam_subject_tests';
import SubjectExamQuestions from '../subject_exam_questions';
import { DeleteRegular, EditRegular } from '@fluentui/react-icons';

const SubjectInfo: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, refetch } = useGetOneData<ISubject>({
    queryKey: ["subjects", id],
    url: `subjects/${id}?expand=description,parent,kafedra,semestr,eduForm,eduType,updatedBy,createdBy`,
    options: {},
  });

  return (
    <div className="">
      <HeaderUserView
        breadCrumbData={[]}
        title={""}
        isBack={false}
        btn={
          <div className='flex'>
            {checkPermission("subject_delete") ? (
              <Tooltip placement="left" title={t("Delete")}>
                <DeleteData
                  permission={"subject_delete"}
                  refetch={refetch}
                  url={"subjects"}
                  id={Number(id)}
                  className="mr-4"
                  navigateUrl="/subjects"
                >
                  <Button 
                    icon={
                      <DeleteRegular className='text-[20px]' />
                    }
                    className='flex gap-1 items-center'
                    danger
                  >
                    {t("Delete")}
                  </Button>
                </DeleteData>
              </Tooltip>
            ) : null}
            {
              checkPermission("subject_update") ?
              <Button
                type="primary"
                htmlType="submit"
                className="flex gap-1 items-center px-5 ml-2"
                onClick={() => navigate(`/subjects/update/${id}`)}
                icon={
                  <EditRegular className='text-[20px]' />
                }
                // className='flex gap-1 items-center'
              >
                {" "}
                {t("Update")}{" "}
              </Button> : ""
            }
          </div>
        }
        tabs={[
          {
            key: "main-info", label: t("Basic information"), children:
              <ViewSubject data={data?.data} />
          },
          {
            key: 'topic-info', label: t("Topics"), children:
              <>
                <SubjectTopic />
              </>
          },
          {
            key: 'exam-tests', label: t("Exam tests"), children:
              <>
                <SubjectExamTest />
              </>
          },
          {
            key: 'exam-questions', label: t("Exam questions"), children:
              <>
                <SubjectExamQuestions />
              </>
          },
        ]}
      />
    </div>
  );
};

export default SubjectInfo;


/**
  * _index
  * _delete
  * _update
  * _view
*/