import SimpleIndexPage from 'pages/common/base_page'
import React from 'react'

const Weeks : React.FC = () : JSX.Element => {
  return(
      <>
        <SimpleIndexPage
        queryKey="weeks"
        url="weeks"
        indexTitle="Week"
        editTitle="Week edit"
        viewTitle="Week view"
        createTitle="Week create"
        search={true}
        isMain={false}
        permissions={{
          view_: "week_view",
          delete_: "week_delete",
          update_: "week_update",
          create_: "week_create",
        }}
      />
      </>
  )
}

export default Weeks