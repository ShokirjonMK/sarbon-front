import SimpleIndexPage from 'pages/common/base_page';

const EduForms = () => {

    return (
        <>
            <SimpleIndexPage
                queryKey="edu-forms"
                url="edu-forms"
                indexTitle="Edu forms"
                editTitle="Edu form edit"
                viewTitle="Edu form view"
                createTitle="Edu form create"
                search={true}
                isMain={false}
                permissions={{
                    view_: "edu-form_view",
                    delete_: "edu-form_delete",
                    update_: "edu-form_update",
                    create_: "edu-form_create"
                }}
            />
        </>
    )
}
export default EduForms;



/**
 * edu-form_index
 * edu-form_delete
 * edu-form_update
 * edu-form_view
 */