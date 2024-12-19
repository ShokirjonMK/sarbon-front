import { SUBJECTCATEGORYTYPES } from 'config/constants/staticDatas';
import SimpleIndexPage from 'pages/common/base_page'
import { TypeFormUIData } from 'pages/common/types';
import React from 'react'

const formData: TypeFormUIData[] = [
  {
    name: "type",
    label: "Turi",
    required: true,
    type: "select",
    data: SUBJECTCATEGORYTYPES,
    span: 24,
  },
];

const SubjectCategory : React.FC = () : JSX.Element => {
  return(
    <>
    <SimpleIndexPage
      queryKey="subject-categories"
      url="subject-categories"
      indexTitle="Subject Categories"
      editTitle="Subject category edit"
      viewTitle="Subject category view"
      createTitle="Subject category create"
      search={true}
      permissions={{
        view_: "subject-category_view",
        delete_: "subject-category_delete",
        update_: "subject-category_update",
        create_: "subject-category_create",
      }}
      formUIData={formData}
    />
    </>
  )
}

export default SubjectCategory


/**
 * subject-category_index
 * subject-category_delete
 * subject-category_update
 * subject-category_view
 */