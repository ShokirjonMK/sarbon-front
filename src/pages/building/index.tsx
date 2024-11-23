import SimpleIndexPage from "pages/common/base_page";

const Buildings: React.FC = (): JSX.Element => {

    return (
        <>
            <SimpleIndexPage
                queryKey="buildings"
                url="buildings"
                indexTitle="Buildings"
                editTitle="Building edit"
                viewTitle="Building view"
                createTitle="Building create"
                search={true}
                isMain={false}
                permissions={{
                    view_: "building_view",
                    delete_: "building_delete",
                    update_: "building_update",
                    create_: "building_create"
                }}
            />
        </>
    )
}

export default Buildings;