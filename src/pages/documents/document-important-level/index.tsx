import SimpleIndexPage from 'pages/common/base_page';

const DocumentImortantLevel = () => {

    return (
        <>
            <SimpleIndexPage
                queryKey="important-levels"
                url="important-levels"
                indexTitle="Document important levels"
                editTitle="Document important level edit"
                viewTitle="Document important level view"
                createTitle="Document important level create"
                search={true}
                isMain={true}
                permissions={{
                    view_: "important-level_view",
                    delete_: "important-level_delete",
                    update_: "important-level_update",
                    create_: "important-level_create",
                }}
            />
        </>
    )
}
export default DocumentImortantLevel;