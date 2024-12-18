import SimpleIndexPage from 'pages/common/base_page';
import { TypeFormUIData } from 'pages/common/types';
import { useNavigate } from 'react-router-dom';

const Faculties = () => {
    
    const navigate = useNavigate()

    // const formData: TypeFormUIData[] = [
    //     {
    //       name: "dean_deputy_user_id",
    //       label: "Fakultet zamdekani",
    //       required: true,
    //       type: "select",
    //       url: `users`,
    //       filter: {"role_name":"dean_deputy", status: 10},
    //       expand_name:'faculty',
    //       span: 24,
    //     },
    //   ];
      

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
                // formUIData={formData}
            />
        </>
    )
}
export default Faculties