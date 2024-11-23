import SimpleIndexPage from "pages/common/base_page";
import React from "react";


const StudentCommands: React.FC = (): JSX.Element => {
  return (
    <>
      <SimpleIndexPage
        queryKey="student-commands"
        url="commands"
        indexTitle="Student Commands"
        editTitle="Student commands edit"
        viewTitle="Student commands view"
        createTitle="Student commands create"
        isMain={false}
        search={true}
        permissions={{
          view_: "commands_view",
          delete_: "commands_delete",
          update_: "commands_update",
          create_: "commands_create",
        }}
      />
    </>
  )
}


export default StudentCommands


/**
 * commands_index
 * commands_delete
 * commands_update
 * commands_view
 */