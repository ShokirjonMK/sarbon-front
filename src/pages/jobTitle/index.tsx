import SimpleIndexPage from "pages/common/base_page";
import { TypeFormUIData } from "pages/common/types";
import React from "react";

const formData: TypeFormUIData[] = [
  {
    name: "type",
    label: "Type",
    type: "number",
    max:9,
    span: 24,
  },
  {
    name: "user_access_type_id",
    label: "User access type id",
    type: "number",
    max: 3,
    span: 24,
  },
  {
    name: "is_leader",
    label: "Leader",
    type: "number",
    max:1,
    span: 24,
  },
  {
    name: "table_id",
    label: "Table id",
    type: "input",
    span: 24,
  },
];

const JobTitle: React.FC = (): JSX.Element => {
  return (
    <div className="p-6">
      <SimpleIndexPage
        queryKey="job-title"
        url="job-titles"
        indexTitle="Job Title"
        editTitle="Job Title edit"
        viewTitle="Job Title view"
        createTitle="Job Title create"
        search={true}
        isMain={false}
        permissions={{
          view_: "job-title_view",
          delete_: "job-title_delete",
          update_: "job-title_update",
          create_: "job-title_create",
        }}
        formUIData={formData}
      />
    </div>
  );
};

export default JobTitle;
