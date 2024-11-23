import SimpleIndexPage from "pages/common/base_page";


const Nationalities: React.FC = (): JSX.Element => {

    return (
        <>
            <SimpleIndexPage
                queryKey="nationalities"
                url="nationalities"
                indexTitle="Nationalities"
                editTitle="Nationality edit"
                viewTitle="Nationality view"
                createTitle="Nationality create"
                search={true}
                isMain={false}
                permissions={{
                    view_: "nationality_view",
                    delete_: "nationality_delete",
                    update_: "nationality_update",
                    create_: "nationality_create"
                }}
            />
        </>
    )
}

export default Nationalities;