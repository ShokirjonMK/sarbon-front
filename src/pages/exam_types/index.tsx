import SimpleIndexPage from 'pages/common/base_page';

const ExamTypes = () => {

  return (
    <>
      <SimpleIndexPage
        queryKey="exams-types"
        url="exams-types"
        indexTitle="Exam types"
        editTitle="Exam type edit"
        viewTitle="Exam type view"
        createTitle="Exam type create"
        search={true}
        isMain={false}
        permissions={{
          view_: "exams-type_view",
          delete_: "exams-type_delete",
          update_: "exams-type_update",
          create_: "exams-type_create"
        }}
      />
    </>
  )
}
export default ExamTypes;


/**
 * exams-type_index
 * exams-type_delete
 * exams-type_update
 * exams-type_view
 */