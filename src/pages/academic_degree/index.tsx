import SimpleIndexPage from "pages/common/base_page";

const AcademicDegrees: React.FC = (): JSX.Element => {

    return (
        <>
            <SimpleIndexPage
                queryKey="academic-degrees"
                url="academic-degrees"
                indexTitle="Academic degrees"
                editTitle="Academic degree edit"
                viewTitle="Academic degree view"
                createTitle="Academic degree create"
                search={true}
                isMain={false}
                permissions={{
                    view_: "academic-degree_view",
                    delete_: "academic-degree_delete",
                    update_: "academic-degree_update",
                    create_: "academic-degree_create"
                }}
            />
        </>
    )
}

export default AcademicDegrees;