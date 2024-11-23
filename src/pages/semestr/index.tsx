import React from "react";
import SimpleIndexPage from "pages/common/base_page";
import { TypeFormUIData } from "pages/common/types";
import { TypeFilterSelect } from "components/FilterSelect";

const formData: TypeFormUIData[] = [
  {
    name: "course_id",
    label: "Course",
    required: true,
    type: "select",
    url: "courses",
    expand_name: "course",
    span: 24,
  },
  // {
  //   name: "type",
  //   label: "Type",
  //   required: true,
  //   type: "number",
  //   max: 10,
  //   span: 24,
  // },
];

const selectData: TypeFilterSelect[] = [
  {
    name: "course_id",
    label: "Course",
    url: "courses",
    permission: "course_index"
  }
]


const Semestr: React.FC = (): JSX.Element => {

  return (
    <SimpleIndexPage
      queryKey="semestrs"
      url="semestrs"
      indexTitle="Semestr"
      editTitle="Semestr edit"
      viewTitle="Semestr view"
      createTitle="Semestr create"
      search={true}
      isMain={false}
      permissions={{
        view_: "semestr_view",
        delete_: "semestr_delete_",
        update_: "semestr_update_",
        create_: "semestr_create_",
      }}
      formUIData={formData}
      selectData={selectData}
    />
  );
};

export default Semestr;


/**
 * semestr_index
 * semestr_delete
 * semestr_update
 * semestr_view
 */