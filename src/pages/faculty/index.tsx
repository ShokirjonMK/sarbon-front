import SimpleIndexPage from 'pages/common/base_page';
import { useNavigate } from 'react-router-dom';

const Faculties = () => {
    const navigate = useNavigate()

    return (
        <>
            <SimpleIndexPage
                queryKey="faculties"
                url="faculties"
                indexTitle="Faculties"
                editTitle="Faculty edit"
                viewTitle="Faculty view"
                createTitle="Faculty create"
                search={true}
                isMain={false}
                permissions={{
                    view_: "faculty_view",
                    delete_: "faculty_delete",
                    update_: "faculty_update",
                    create_: "faculty_create"
                }}
                onView={(id) => navigate(`/structural-unit/faculties/view/${id}`)}
            />
        </>
    )
}
export default Faculties