import SimpleIndexPage from "pages/common/base_page";

const DiplomTypes: React.FC = (): JSX.Element => {

    return (
        <>
            <SimpleIndexPage
                queryKey="diploma-types"
                url="diploma-types"
                indexTitle="Diplom types"
                editTitle="Diplom type edit"
                viewTitle="Diplom type view"
                createTitle="Diplom type create"
                search={true}
                isMain={false}
                permissions={{
                    view_: "diploma-type_view",
                    delete_: "diploma-type_delete",
                    update_: "diploma-type_update",
                    create_: "diploma-type_create"
                }}
            />
        </>
    )
}

export default DiplomTypes;