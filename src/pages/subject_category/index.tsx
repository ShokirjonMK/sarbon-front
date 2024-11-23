import SimpleIndexPage from 'pages/common/base_page'
import React from 'react'


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