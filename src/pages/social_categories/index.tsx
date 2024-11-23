import SimpleIndexPage from 'pages/common/base_page'
import React from 'react'


const SocialCategories : React.FC = () : JSX.Element => {
  return (
    <>
      <SimpleIndexPage
        queryKey="social-categories"
        url="social-categories"
        indexTitle="Social categories"
        editTitle="Social Category edit"
        viewTitle="Social Category view"
        createTitle="Social Category create"
        search={true}
        isMain={false}
        permissions={{
          view_: "social-category_view",
          delete_: "social-category_delete",
          update_: "social-category_update",
          create_: "social-category_create",
        }}
      />
    </>
  )
}

export default SocialCategories;


/**
 * social-category_index
 * social-category_delete
 * social-category_update
 * social-category_view
 * social-category_create
*/