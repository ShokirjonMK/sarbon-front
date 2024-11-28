import React from 'react';
import { useTranslation } from "react-i18next";
import HeaderUserView from 'pages/users/components/vewHeader';
import SubjectTopic from 'pages/subject_topic';
import SubjectExamTest from 'pages/exam_subject_tests';
import useBreadCrumb from 'hooks/useBreadCrumb';
import { useParams } from 'react-router-dom';

const SubjectSemestrInfo: React.FC = (): JSX.Element => {

  const { t } = useTranslation();
  const { id: subject_semestr_id, subject_id } = useParams()

  useBreadCrumb({pageTitle: "Fanni ko'rish", breadcrumb: [
    {name: "Subjects", path: "/subjects"}, 
    {name: "Fanni ko'rish", path: `/subjects/view/${subject_id}`},
    {name: "Fan semestrlari", path: `/subjects/`}
  ]})

  return (
    <div className="">
      <HeaderUserView
        breadCrumbData={[]}
        title={""}
        isBack={false}
        tabs={[
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
          // {
          //   key: 'exam-questions', label: t("Exam questions"), children:
          //     <>
          //       <SubjectExamQuestions />
          //     </>
          // },
        ]}
      />
    </div>
  );
};

export default SubjectSemestrInfo;


/**
  * _index
  * _delete
  * _update
  * _view
*/