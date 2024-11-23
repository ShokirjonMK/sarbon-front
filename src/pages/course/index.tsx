import SimpleIndexPage from "pages/common/base_page";
import React from "react";

const Course: React.FC = (): JSX.Element => {
  return (
    <>
      <SimpleIndexPage
        url="courses"
        indexTitle="Course"
        createTitle="Create course"
        editTitle="Update course"
        viewTitle="View course"
        isMain={false}
        permissions={{
          view_: "course_view",
          update_: "course_update_",
          delete_: "course_delete_",
          create_: "course_create_",
        }}
      />
    </>
  );
};

export default Course;
