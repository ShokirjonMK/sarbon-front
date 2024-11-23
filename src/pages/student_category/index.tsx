import SimpleIndexPage from "pages/common/base_page";
import React from "react";


const StudentCategory : React.FC = () : JSX.Element => {
  return(
    <>
    <SimpleIndexPage
      queryKey="student-categories"
      url="student-categories"
      indexTitle="Student Categories"
      editTitle="Student category edit"
      viewTitle="Student category view"
      createTitle="Student category create"
      search={true}
      permissions={{
        view_: "student-category_view",
        delete_: "student-category_delete",
        update_: "student-category_update",
        create_: "student-category_create",
      }}
    />
    </>
  )
}


export default StudentCategory


/**
 * student-category_index
 * student-category_delete
 * student-category_update
 * student-category_view
 */