import SimpleIndexPage from 'pages/common/base_page';

const DocumentWeights = () => {

    return (
        <>
            <SimpleIndexPage
                queryKey="document-weights"
                url="document-weights"
                indexTitle="Document weights"
                editTitle="Document weight edit"
                viewTitle="Document weight view"
                createTitle="Document weight create"
                search={true}
                isMain={true}
                permissions={{
                    view_: "document-weight_view",
                    delete_: "document-weight_delete",
                    update_: "document-weight_update",
                    create_: "document-weight_create",
                }}
            />
        </>
    )
}
export default DocumentWeights;