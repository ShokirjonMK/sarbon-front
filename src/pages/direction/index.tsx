import React from "react";
import SimpleIndexPage from "pages/common/base_page";
import { TypeFormUIData } from "pages/common/types";
import { TypeFilterSelect } from "components/FilterSelect";

const formData: TypeFormUIData[] = [
  {
    name: "faculty_id",
    label: "Faculty",
    required: true,
    type: "select",
    url: 'faculties',
    expand_name:'faculty',
    span: 24,
  },
  {
    name: "code",
    label: "Code",
    required: true,
    type: "input",
    span: 24,
  },
];


const selectData: TypeFilterSelect[] = [
  {
      name: "faculty_id",
      label: "Faculty",
      url: "faculties",
      permission: "faculty_index",
      span: {xs:24, sm: 24, md: 6, lg:4, xl:4}
  },
]

const Direction : React.FC = ():JSX.Element => {
  return(
    <>
    <SimpleIndexPage
      queryKey="directions"
      url="directions"
      indexTitle="direction"
      editTitle="Direction edit"
      viewTitle="Direction view"
      createTitle="Direction create"
      search={true}
      isMain={false}
      permissions={{
        view_: "direction_view",
        delete_: "direction_delete",
        update_: "direction_update",
        create_: "direction_create",
      }}
      formUIData={formData}
      selectData={selectData}
    />
    </>
  )
}

export default Direction


/**
 * direction_index
 * direction_delete
 * direction_update
 * direction_view
 */