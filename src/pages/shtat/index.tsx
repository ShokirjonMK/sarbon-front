import SimpleIndexPage from "pages/common/base_page";

const Shtats: React.FC = (): JSX.Element => {

    return (
        <>
            <SimpleIndexPage
                queryKey="work-loads"
                url="work-loads"
                indexTitle="Shtats"
                editTitle="Work load edit"
                viewTitle="Work load view"
                createTitle="Work load create"
                search={true}
                isMain={false}
                permissions={{
                    view_: "work-load_view_",
                    delete_: "work-load_delete_",
                    update_: "work-load_update_",
                    create_: "work-load_create_"
                }}
            />
        </>
    )
}

export default Shtats;