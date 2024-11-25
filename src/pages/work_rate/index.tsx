import SimpleIndexPage from "pages/common/base_page";
import { TypeFormUIData } from "pages/common/types";
import React from "react";

const formData: TypeFormUIData[] = [
  // {
  //   name: "rate",
  //   label: "Rate",
  //   type: "number",
  //   span: 24,
  // },
  // {
  //   name: "weekly_hours",
  //   label: "Weekly hours",
  //   type: "number",
  //   span: 24,
  // },
  // {
  //   name: "hour_day",
  //   label: "Hour day",
  //   type: "number",
  //   span: 24,
  // },
  {
    name: "type",
    label: "Type",
    type: "number",
    max:1000,
    span: 24,
  },
  // {
  //   name: "daily_hours",
  //   label: "Daily hours",
  //   type: "number",
  //   span: 24,
  // },
];

const WorkRate: React.FC = (): JSX.Element => {
  return (
    <div className="p-6">
      <SimpleIndexPage
        queryKey="work-rate"
        url="work-rates"
        indexTitle="Work rate"
        editTitle="Work rate edit"
        viewTitle="Work rate view"
        createTitle="Work rate create"
        search={true}
        isMain={false}
        permissions={{
          view_: "work-rate_view",
          delete_: "work-rate_delete",
          update_: "work-rate_update",
          create_: "work-rate_create",
        }}
        formUIData={formData}
      />
    </div>
  );
};

export default WorkRate;
