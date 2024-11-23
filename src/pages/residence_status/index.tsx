import SimpleIndexPage from "pages/common/base_page";
import React from "react";

const ResidenceStatus : React.FC = () : JSX.Element => {
  return(
    <>
    <SimpleIndexPage
      queryKey="residence-statuses"
      url="residence-statuses"
      indexTitle="Residence Status"
      editTitle="Residence Status edit"
      viewTitle="Residence Status view"
      createTitle="Residence Status create"
      search={true}
      isMain={false}
      permissions={{
        view_: "residence-status_view",
        delete_: "residence-status_delete",
        update_: "residence-status_update",
        create_: "residence-status_create",
      }}
    />
    </>
  )
}

export default ResidenceStatus

/**
 * residence-status_index
 * residence-status_delete
 * residence-status_update
 * residence-status_view
 */