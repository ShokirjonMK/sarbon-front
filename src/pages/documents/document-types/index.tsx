import SimpleIndexPage from 'pages/common/base_page';

const DocumentTypes = () => {

    return (
        <>
            <SimpleIndexPage
                queryKey="document-types"
                url="document-types"
                indexTitle="Document types"
                editTitle="Document types edit"
                viewTitle="Document types view"
                createTitle="Document types create"
                search={true}
                isMain={true}
                permissions={{
                    view_: "document-type_view",
                    delete_: "document-type_delete",
                    update_: "document-type_update",
                    create_: "document-type_create",
                }}
            />
        </>
    )
}
export default DocumentTypes;