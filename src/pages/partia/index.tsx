import SimpleIndexPage from "pages/common/base_page";

const Parties: React.FC = (): JSX.Element => {

    return (
        <>
            <SimpleIndexPage
                queryKey="partiyas"
                url="partiyas"
                indexTitle="Parties"
                editTitle="Partiya edit"
                viewTitle="Partiya view"
                createTitle="Partiya create"
                search={true}
                isMain={false}
                permissions={{
                    view_: "partiya_view",
                    delete_: "partiya_delete",
                    update_: "partiya_update",
                    create_: "partiya_create"
                }}
            />
        </>
    )
}

export default Parties;