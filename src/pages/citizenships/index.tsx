import SimpleIndexPage from 'pages/common/base_page';

const Citizenships = () => {

    return (
        <>
            <SimpleIndexPage
                queryKey="citizenships"
                url="citizenships"
                indexTitle="Citizenships"
                editTitle="Citizenship edit"
                viewTitle="Citizenships view"
                createTitle="Citizenships create"
                search={true}
                isMain={false}
                permissions={{
                    view_: "citizenship_view",
                    delete_: "citizenship_delete",
                    update_: "citizenship_update",
                    create_: "citizenship_create"
                }}
            />
        </>
    )
}
export default Citizenships