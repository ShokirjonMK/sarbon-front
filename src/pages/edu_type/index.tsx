import SimpleIndexPage from 'pages/common/base_page';

const EduTypes = () => {

    return (
        <>
            <SimpleIndexPage
                queryKey="edu-types"
                url="edu-types"
                indexTitle="Edu types"
                editTitle="Edu type edit"
                viewTitle="Edu type view"
                createTitle="Edu type create"
                search={true}
                isMain={false}
                permissions={{
                    view_: "edu-type_view",
                    delete_: "edu-type_delete",
                    update_: "edu-type_update",
                    create_: "edu-type_create"
                }}
            />
        </>
    )
}
export default EduTypes;


/**
 * edu-type_index
 * edu-type_delete
 * edu-type_update
 * edu-type_view
 */