import SimpleIndexPage from "pages/common/base_page";

const DegreeInfos: React.FC = (): JSX.Element => {

    return (
        <>
            <SimpleIndexPage
                queryKey="degree-infos"
                url="degree-infos"
                indexTitle="Degree infos"
                editTitle="Degree info edit"
                viewTitle="Degree info view"
                createTitle="Degree info create"
                search={true}
                isMain={false}
                permissions={{
                    view_: "degree-info_view",
                    delete_: "degree-info_delete",
                    update_: "degree-info_update",
                    create_: "degree-info_create"
                }}
            />
        </>
    )
}

export default DegreeInfos;