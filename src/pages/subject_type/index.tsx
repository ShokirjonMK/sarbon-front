import SimpleIndexPage from 'pages/common/base_page'
import React from 'react'


const SubjectType : React.FC = () : JSX.Element => {
  return(
    <>
    <SimpleIndexPage
      queryKey="subject-types"
      url="subject-types"
      indexTitle="Subject Types"
      editTitle="Subject type edit"
      viewTitle="Subject type view"
      createTitle="Subject type create"
      search={true}
      permissions={{
        view_: "subject-type_view",
        delete_: "subject-type_delete",
        update_: "subject-type_update",
        create_: "subject-type_create",
      }}
    />
    </>
  )
}

export default SubjectType


/**
 * subject-type_index
 * subject-type_delete
 * subject-type_update
 * subject-type_view
 */