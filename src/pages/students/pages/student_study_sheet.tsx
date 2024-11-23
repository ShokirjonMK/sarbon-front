import React, { useRef } from 'react';
import { Button } from "antd";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import StudentStudySheetFirstPage from 'pages/student_study_sheet/first_page';
import { useParams } from 'react-router-dom';
import StudentStudySheetSecondPage from 'pages/student_study_sheet/second_page';
import { PrintRegular } from '@fluentui/react-icons';
import useGetOneData from 'hooks/useGetOneData';
import { IStudent } from 'models/student';
import { renderFullName } from 'utils/others_functions';
import useGetAllData from 'hooks/useGetAllData';

const StudentStudySheet: React.FC = (): JSX.Element => {

  const { student_id } = useParams();
  const iframe_ref = useRef<HTMLIFrameElement | null>(null);
  const print_ref = useRef<any>(null);


  const { data } = useGetOneData<IStudent>({
    queryKey: ["students", student_id],
    url: `students/${student_id}?expand=profile,user,citizenship,country,region,area,permanentCountry,permanentRegion,permanentArea,faculty,direction,eduPlan,group,eduType,eduForm,eduYear,course,eduLang`,
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!student_id,
    }
  })

  const { data:studentSemestrSubjects } = useGetAllData({
    queryKey: ["student-semestr-subjects"],
    url: `student-semestr-subjects`,
    urlParams: {
      "per-page": 0,
      filter: JSON.stringify({student_id}),
      expand: "studentVedomst,studentVedomst,subject"
    },
    options: {
      refetchOnWindowFocus: false,
      retry: 1,
      enabled: !!student_id
    },
  });


  function printPage() {
    if (iframe_ref?.current) {
        const _iframe = iframe_ref.current;
        _iframe.contentDocument?.open()
        if (print_ref?.current) {
            _iframe.contentDocument?.write(print_ref.current?.innerHTML)
        }
        _iframe.contentDocument?.close();
        _iframe.focus();
        _iframe.contentWindow?.print()

    }
  }

  return (
    <div className="">
      <HeaderExtraLayout title={`Student study sheet`} isBack
        breadCrumbData={[
          { name: "Home", path: '/' },
          { name: "Students", path: '/students' },
          { name: renderFullName(data?.data?.profile), path: `/students/view/${student_id}` },
          { name: "Student study sheet", path: 'Student study sheet' }
        ]}
        btn={<Button onClick={printPage} className='d-f' ><PrintRegular fontSize={16} />&nbsp;&nbsp;Chop etish</Button>}
      />
      <iframe ref={iframe_ref} style={{ height: '0px', width: '0px', position: 'absolute' }}></iframe>
      <div className="my-6 px-5" ref={print_ref} >
        <StudentStudySheetFirstPage data={data?.data} user_id={student_id ?? ""} />
        <StudentStudySheetSecondPage studentSemestrSubjects={studentSemestrSubjects?.items} />
      </div>
    </div>
  );
};

export default StudentStudySheet;

/**
  * student-study-sheet_index
  * student-study-sheet_delete
  * student-study-sheet_update
  * student-study-sheet_view
*/