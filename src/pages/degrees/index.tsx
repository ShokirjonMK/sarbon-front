import SimpleIndexPage from "pages/common/base_page";

const Degrees: React.FC = (): JSX.Element => {

    return (
        <>
            <SimpleIndexPage
                queryKey="degrees"
                url="degrees"
                indexTitle="Degrees"
                editTitle="Degree edit"
                viewTitle="Degree view"
                createTitle="Degree create"
                search={true}
                isMain={false}
                permissions={{
                    view_: "degree_view",
                    delete_: "degree_delete",
                    update_: "degree_update",
                    create_: "degree_create"
                }}
            />
        </>
    )
}

export default Degrees;