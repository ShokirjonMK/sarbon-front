import { TypeRoutes } from "./types";
import Dashboard from "pages/dashboards";
import Users from "pages/users";
import Login from "pages/login";
import Buildings from "pages/building";
import Course from "pages/course";
import Semestr from "pages/semestr";
import Rooms from "pages/rooms";
import Kafedras from "pages/kafedras";
import EduForms from "pages/edu_form";
import EduTypes from "pages/edu_type";
import Department from "pages/department";
import RoomTypes from "pages/room_types";
import Faculties from "pages/faculty";
import Citizenships from "pages/citizenships";
import Direction from "pages/direction";
import Subjects from "pages/subject";
import SubjectType from "pages/subject_type";
import StudentCategory from "pages/student_category";
import ResidenceStatus from "pages/residence_status";
import UpdateUser from "pages/users/crud/update";
import SocialCategories from "pages/social_categories";
import CategoryOfCohabitant from "pages/category_of_cohabitant";
import Students from "pages/students";
import UpdateStudent from "pages/students/crud/update";
import ViewStudent from "pages/students/crud/view";
import FacultyView from "pages/faculty/pages/view";
import Roles from "pages/roles";
import ViewsKafedra from "pages/kafedras/pages/view";
import ViewDepartment from "pages/department/pages/view";
import UpdateRole from "pages/roles/crud/update";
import { Home20Regular, ShapeIntersect20Regular, HatGraduation20Regular, BookOpen20Regular, Database20Regular, Settings20Regular, CalendarLtr20Regular, Book20Regular, Briefcase20Regular, ClipboardTaskListLtr20Regular, CheckboxPerson20Regular, DocumentSync20Regular, DocumentCatchUp20Regular } from '@fluentui/react-icons';
import RoleView from "pages/roles/crud/view";
import EduPlan from "pages/edu_plan";
import UpdateEduPlan from "pages/edu_plan/crud/update";
import EduSemestr from "pages/edu_semestr";
import ExamTypes from "pages/exam_types";
import SubjectInfo from "pages/subject/components/subject_info";
import UpdateSubject from "pages/subject/crud/update";
import Nationalities from "pages/nationalities";
import UserView from "pages/users/crud/view";
import AcademicDegrees from "pages/academic_degree";
import Degrees from "pages/degrees";
import DegreeInfos from "pages/degree_info";
import DiplomTypes from "pages/diplom_type";
import Parties from "pages/partia";
import SubjectCategory from "pages/subject_category";
import Teacher from "pages/teacher";
import UpdateTeacher from "pages/teacher/crud/update";
import ViewTeacher from "pages/teacher/crud/view";
import Employees from "pages/employees";
import Group from "pages/group";
import ViewGroup from "pages/group/crud/view";
import EduPlanView from "pages/edu_plan/crud/view";
import Weeks from "pages/weeks";
import Para from "pages/para";
import EduSemestrView from "pages/edu_semestr/crud/view";
import AttachEduSemestrSubject from "pages/edu_semestr_subjects/attach_subject";
import EduSemestrSubjectUpdate from "pages/edu_semestr_subjects/update";
import SubjectContent from "pages/subject_content";
import Attendance from "pages/attendance/attendance";
import ToAttend from "pages/attend_student";
import AttendanceByFaculty from "pages/attendanceby_faculty";
import AttendanceByGroup from "pages/attendanceby_faculty/attendanceby_group";
import MainStudentMark from "pages/student_mark/main";
import EduYears from "pages/edu_year";
import SubjectTopicTest from "pages/subject_topic_test";
import UpdateTopicTest from "pages/subject_topic_test/crud/update";
import TopicView from "pages/subject_topic/crud/view";
import StudentMark from "pages/students/pages/student_mark";
import StudentAttends from "pages/students/pages/student_attends";
import StudentTimeTable from "pages/students/pages/student_time_table";
import Profile from "pages/profile";
import WorkRate from "pages/work_rate";
import Shtats from "pages/shtat";
import CheckAttances from "pages/attendance_check";
import ExpulsionStudents from "pages/expulsion_students";
import StudentCommands from "pages/student_commands";
import UpdateSubjectExamTest from "pages/exam_subject_tests/crud/update";
import StudentStudySheet from "pages/students/pages/student_study_sheet";
import ExamControl from "pages/exam_control";
import ExamControlUpdate from "pages/exam_control/crud/update";
// import ExamControlView from "pages/exam_control/students";
import StudentExamResponse from "pages/exam_control/students/responses";
import ExamControlView from "pages/exam_control/crud/view";
import SubjectExamQuestionUpdate from "pages/subject/subject_exam_questions/crud/update";
import SubjectExamQuestionView from "pages/subject/subject_exam_questions/crud/view";
import ExamQuestions from "pages/exam_question";
import ExamQuestionsCreate from "pages/exam_question/create";
import FinalExamChecking from "pages/exam_final_cheking";
import StudentResponses from "pages/exam_final_cheking/student_works_list";
import StudentResponseChecking from "pages/exam_final_cheking/checking_responses";
import ExamQuestionView from "pages/exam_question/view";
import ExamEnteredStudents from "pages/exam_entered_students";
import ContentTeachers from "pages/subject_content/pages/content_teacher";
import DocumentTypes from "pages/documents/document-types";
import MyDocuments from "pages/documents/all_documents/my_documents";
import UpdateDocument from "pages/documents/all_documents/crud/update";
import DocumentWeights from "pages/documents/document-weight";
import DocumentInfo from "pages/documents/all_documents/components/view_tab";
import DocumentImortantLevel from "pages/documents/document-important-level";
import UpdateLetter from "pages/letters/crud/update";
import Tests from "pages/exam_subject_tests/pages/tests";
import TestUpdate from "pages/exam_subject_tests/pages/test_update";
import TeacherTimeTable from "pages/teacher/pages/teacher_time_table";
import ComeLetters from "pages/letter_reply/come_letters";
import ReplyLetter from "pages/letter_reply/reply_letter";
import Letters from "pages/letters";
import StudentStatistics from "pages/statistics/student_statistics";
import StudentDegreStatistics from "pages/statistics/student_degre_statistic";
import LetterInfo from "pages/letters/components/view_tab";
import ComeLetterView from "pages/letter_reply/crud/view";
import TeacherStatistics from "pages/dashboards/components/teacher_statistics";
import LetterConfirmation from "pages/letter-confirmation";
import ViewLetterConfirmation from "pages/letter-confirmation/crud/view";
import UsersStatistic from "pages/statistics/user_statistics";
import LetterSigning from "pages/letter-signing";
import ViewLetterSigning from "pages/letter-signing/crud/view";
// import DocSigning from "pages/doc_signing";
// import ViewDocSigning from "pages/doc_signing/crud/view";
import DocNotice from "pages/documents/doc_notice";
import DocNoticeView from "pages/documents/doc_notice/crud/view";
import DocNoticeUpdate from "pages/documents/doc_notice/crud/update";
import DocNoticeConfirmation from "pages/documents/doc_notice_confirmation";
import StudentsLoginTime from "pages/statistics/student_login";
import ActionLog from "pages/statistics/action_log";
import DocSigning from "pages/doc_signing";
import ViewDocSigning from "pages/doc_signing/crud/view";
import DocNoticeConfirmView from "pages/documents/doc_notice_confirmation/crud/view";
import DocNoticeSign from "pages/documents/doc_notice_sign";
import DocNoticeSignView from "pages/documents/doc_notice_sign/crud/view";
import DocDecreeSign from "pages/documents/doc_decree_sign";
import DocDecreeSignView from "pages/documents/doc_decree_sign/crud/view";
import DocDecreeConfirm from "pages/documents/doc_decree_confirmation";
import DocDecreeConfirmView from "pages/documents/doc_decree_confirmation/crud/view";
import DocDecree from "pages/documents/doc_decree";
import DocDecreeView from "pages/documents/doc_decree/crud/view";
import DocDecreeUpdate from "pages/documents/doc_decree/crud/update";
import AttendsByTimetableStatistics from "pages/statistics/attends_by_time-table_statistics";
import StudentAttendStatistics from "pages/statistics/student_attendance_statistics";
import MainFinalExamPermission from "pages/final_exam_permission/main";
import NewExam from "pages/new_exam";
import NewExamUpdate from "pages/new_exam/crud/update";
import NewExamView from "pages/new_exam/crud/view";
import ExamStudentMark from "pages/new_exam/pages/exam_student_mark";
import ExamSheet from "pages/new_exam/pages/exam_sheet";
import TimeTablesNew from "pages/time-table-new";
import TimeTableDataNew from "pages/time-table-new/table";
import TimeTableCreateNew from "pages/time-table-new/crud/create";
import TimeTableNewView from "pages/time-table-new/crud/view_main_tab";
import StudentSemestrTransfer from "pages/student_transfer/semestrToSemestr";
import StudentGroupTransfer from "pages/student_transfer/grouptoGroup";
import TimeTableNewByRoom from "pages/time-table-new-by-room";
import TimeTableDataNewForTutor from "pages/time-table-new/table_for_tutor";
import StudentMarksView from "pages/student_mark_more";
import ProfileNew from "pages/profile-new";
import TimeTables from "pages/time-table";
import TimeTableData from "pages/time-table/table";
import TimeTableCreate from "pages/time-table/crud/create";
import TimeTableUpdate from "pages/time-table/crud/update";
import TimeTableView from "pages/time-table/crud/view";
import ControlExam from "pages/control_exam";
import NewExamControlUpdate from "pages/control_exam/crud/update";
import NewControlExamView from "pages/control_exam/crud/view";
import StudentAcademicInfo from "pages/student_academic_info_sheet";

export const public_routes: Array<TypeRoutes> = [
  {
    name: "Login",
    path: "/",
    component: Login,
    config: {
      permission: "*",
      icon: CalendarLtr20Regular,
      structure: "layout",
      isMenu: false,
    },
    submenu: [],
  },
];

export const prived_routes: Array<TypeRoutes> = [
  {
    name: "Dashboard",
    path: "/",
    component: Dashboard,
    config: {
      permission: "*",
      icon: Home20Regular,
      structure: "layout",
      isMenu: true
    },
    submenu: [],
  },
  {
    name: "Profile",
    path: "/profile",
    component: ProfileNew,
    config: {
      permission: "*",
      icon: Home20Regular,
      structure: "layout",
      isMenu: false
    },
    submenu: [],
  },
  // {
  //   name: "Documents",
  //   path: "/documents",
  //   component: "",
  //   config: {
  //     permission: "*",
  //     icon: DocumentSync20Regular,
  //     structure: "layout",
  //     isMenu: true
  //   },
  //   submenu: [
  //     {
  //       name: "My documents",
  //       path: "/documents",
  //       component: MyDocuments,
  //       config: {
  //         permission: "document_index",
  //         icon: Home20Regular,
  //         structure: "layout",
  //         isMenu: true
  //       },
  //       submenu: [],
  //     },
  //     {
  //       name: "Add document",
  //       path: "/documents/create",
  //       component: UpdateDocument,
  //       config: {
  //         permission: "document_create",
  //         icon: Home20Regular,
  //         structure: "layout",
  //         isMenu: false
  //       },
  //       submenu: [],
  //     },
  //     {
  //       name: "Update document",
  //       path: "/documents/update/:id",
  //       component: UpdateDocument,
  //       config: {
  //         permission: "document_update",
  //         icon: Home20Regular,
  //         structure: "layout",
  //         isMenu: false
  //       },
  //       submenu: [],
  //     },
  //     {
  //       name: "View document",
  //       path: "/documents/view/:id",
  //       component: DocumentInfo,
  //       config: {
  //         permission: "document_view",
  //         icon: Home20Regular,
  //         structure: "layout",
  //         isMenu: false
  //       },
  //       submenu: [],
  //     },


  //     // Bildirgi
  //     {
  //       name: "Bildirgi",
  //       path: "/doc-notice",
  //       component: DocNotice,
  //       config: {
  //         permission: "document-notification_index",
  //         icon: Home20Regular,
  //         structure: "layout",
  //         isMenu: true,
  //       },
  //     },
  //     {
  //       name: "Bildirgini ko'rish",
  //       path: "/doc-notice/view/:id",
  //       component: DocNoticeView,
  //       config: {
  //         permission: "document-notification_view",
  //         icon: Home20Regular,
  //         structure: "layout",
  //         isMenu: false,
  //       },
  //     },
  //     {
  //       name: "Bildirgi tahrirlash",
  //       path: "/doc-notice/update/:id",
  //       component: DocNoticeUpdate,
  //       config: {
  //         permission: "document-notification_update",
  //         icon: Home20Regular,
  //         structure: "layout",
  //         isMenu: false,
  //       },
  //     },
  //     {
  //       name: "Bildirgi yaratish",
  //       path: "/doc-notice/create",
  //       component: DocNoticeUpdate,
  //       config: {
  //         permission: "document-notification_create",
  //         icon: Home20Regular,
  //         structure: "layout",
  //         isMenu: false,
  //       },
  //     },


  //     // Farmoyish
  //     {
  //       name: "Farmoyish",
  //       path: "/doc-decree",
  //       component: DocDecree,
  //       config: {
  //         permission: "document-execution_index",
  //         icon: Home20Regular,
  //         structure: "layout",
  //         isMenu: true,
  //       },
  //     },
  //     {
  //       name: "Farmoyishni ko'rish",
  //       path: "/doc-decree/view/:id",
  //       component: DocDecreeView,
  //       config: {
  //         permission: "document-execution_view",
  //         icon: Home20Regular,
  //         structure: "layout",
  //         isMenu: false,
  //       },
  //     },
  //     {
  //       name: "Farmoyish tahrirlash",
  //       path: "/doc-decree/update/:id",
  //       component: DocDecreeUpdate,
  //       config: {
  //         permission: "document-execution_update",
  //         icon: Home20Regular,
  //         structure: "layout",
  //         isMenu: false,
  //       },
  //     },
  //     {
  //       name: "Farmoyish yaratish",
  //       path: "/doc-decree/create",
  //       component: DocDecreeUpdate,
  //       config: {
  //         permission: "document-execution_create",
  //         icon: Home20Regular,
  //         structure: "layout",
  //         isMenu: false,
  //       },
  //     },


  //     // letters
  //     {
  //       name: "Xatlar",
  //       path: "/letters",
  //       component: Letters,
  //       config: {
  //         permission: "letter_index",
  //         icon: Home20Regular,
  //         structure: "layout",
  //         isMenu: true,
  //       },
  //     },
  //     {
  //       name: "Add letters",
  //       path: "/letters/create",
  //       component: UpdateLetter,
  //       config: {
  //         permission: "letter_create",
  //         icon: Home20Regular,
  //         structure: "layout",
  //         isMenu: false
  //       },
  //     },
  //     {
  //       name: "Update letters",
  //       path: "/letters/update/:id",
  //       component: UpdateLetter,
  //       config: {
  //         permission: "letter_update",
  //         icon: Home20Regular,
  //         structure: "layout",
  //         isMenu: false
  //       },
  //     },
  //     {
  //       name: "View letters",
  //       path: "/letters/view/:id",
  //       component: LetterInfo,
  //       config: {
  //         permission: "letter_view",
  //         icon: Home20Regular,
  //         structure: "layout",
  //         isMenu: false
  //       },
  //     },

  //     // Letter reply
  //     {
  //       name: "Kelgan topshiriq xatlari",
  //       path: "/come-letters",
  //       component: ComeLetters,
  //       config: {
  //         permission: "letter-forward_index",
  //         icon: Home20Regular,
  //         structure: "layout",
  //         isMenu: true
  //       },
  //       submenu: [],
  //     },
  //     {
  //       name: "Kelgan topshiriq xatini ko'rish",
  //       path: "/come-letters/view/:id",
  //       component: ComeLetterView,
  //       config: {
  //         permission: "letter-forward_view",
  //         icon: Home20Regular,
  //         structure: "layout",
  //         isMenu: false
  //       },
  //       submenu: [],
  //     },
  //     {
  //       name: "Reply letter",
  //       path: "letter-reply/:letter_forward_item_id/create",
  //       component: ReplyLetter,
  //       config: {
  //         permission: "letter-reply_create",
  //         icon: Home20Regular,
  //         structure: "layout",
  //         isMenu: false
  //       },
  //       submenu: [],
  //     },
  //     {
  //       name: "Reply letter",
  //       path: "letter-reply/:letter_forward_item_id/update/:id",
  //       component: ReplyLetter,
  //       config: {
  //         permission: "letter-reply_update",
  //         icon: Home20Regular,
  //         structure: "layout",
  //         isMenu: false
  //       },
  //       submenu: [],
  //     },

  //     // document-confirmation

  //     {
  //       name: "Hujjatni tasdiqlash",
  //       path: "/document-confirmations/letters",
  //       component: '',
  //       config: {
  //         permission: "*",
  //         for_roles: ["admin", "hr"],
  //         icon: Home20Regular,
  //         structure: "layout",
  //         isMenu: true,
  //         extraMenuType: "tab"
  //       },
  //       submenu: [
  //         {
  //           name: "Xatni tasdiqlash",
  //           path: "/document-confirmations/letters",
  //           component: LetterConfirmation,
  //           config: {
  //             permission: "letter-outgoing_index",
  //             icon: Home20Regular,
  //             structure: "layout",
  //             isMenu: true,
  //           },
  //         },
  //         {
  //           name: "View letters",
  //           path: "/document-confirmations/letters/:id",
  //           component: ViewLetterConfirmation,
  //           config: {
  //             permission: "letter_view",
  //             icon: Home20Regular,
  //             structure: "layout",
  //             isMenu: false
  //           },
  //         },

  //         // incoming letters
  //         {
  //           name: "Buyruqni tasdiqlash",
  //           path: "/document-confirmations/docs",
  //           component: LetterConfirmation,
  //           config: {
  //             permission: "letter_index",
  //             icon: Home20Regular,
  //             structure: "layout",
  //             isMenu: true,
  //           },
  //         },
  //         {
  //           name: "View letters",
  //           path: "/incoming-letters/view/:id",
  //           component: ViewLetterConfirmation,
  //           config: {
  //             permission: "letter_view",
  //             icon: Home20Regular,
  //             structure: "layout",
  //             isMenu: false
  //           },
  //         },


  //         // Bildirgini tasdiqlash
  //         {
  //           name: "Bildirgini tasdiqlash",
  //           path: "/document-confirmations/notice",
  //           component: DocNoticeConfirmation,
  //           config: {
  //             permission: "document-notification_index",
  //             icon: Home20Regular,
  //             structure: "layout",
  //             isMenu: true,
  //           },
  //         },
  //         {
  //           name: "Bildirgini tasdiqlash",
  //           path: "/doc-notice/confirm/:id",
  //           component: DocNoticeConfirmView,
  //           config: {
  //             permission: "document-notification_view",
  //             icon: Home20Regular,
  //             structure: "layout",
  //             isMenu: false,
  //           },
  //         },


  //         // Farmoyishni tasdiqlash
  //         {
  //           name: "Farmoyishni tasdiqlash",
  //           path: "/document-confirmations/decree",
  //           component: DocDecreeConfirm,
  //           config: {
  //             permission: "document-execution_index",
  //             icon: Home20Regular,
  //             structure: "layout",
  //             isMenu: true,
  //           },
  //         },
  //         {
  //           name: "Farmoyishni tasdiqlash",
  //           path: "/doc-decree/confirm/:id",
  //           component: DocDecreeConfirmView,
  //           config: {
  //             permission: "document-execution_view",
  //             icon: Home20Regular,
  //             structure: "layout",
  //             isMenu: false,
  //           },
  //         },
  //       ],
  //     },


  //     // document-sign

  //     {
  //       name: "Hujjatni imzolash",
  //       path: "/document-sign/letters",
  //       component: '',
  //       config: {
  //         permission: "*",
  //         for_roles: ["rector", "prorector", "admin"],
  //         icon: Home20Regular,
  //         structure: "layout",
  //         isMenu: true,
  //         extraMenuType: "tab"
  //       },
  //       submenu: [
  //         {
  //           name: "Xatni imzolash",
  //           path: "/document-sign/letters",
  //           component: LetterSigning,
  //           config: {
  //             permission: "letter-outgoing_index",
  //             icon: Home20Regular,
  //             structure: "layout",
  //             isMenu: true,
  //           },
  //         },
  //         {
  //           name: "View letters",
  //           path: "/document-sign/letters/:id",
  //           component: ViewLetterSigning,
  //           config: {
  //             permission: "letter-outgoing_view",
  //             icon: Home20Regular,
  //             structure: "layout",
  //             isMenu: false
  //           },
  //         },

  //         // sign letters
  //         {
  //           name: "Buyruqni imzolash",
  //           path: "/document-sign/docs",
  //           component: DocSigning,
  //           config: {
  //             permission: "letter_index",
  //             icon: Home20Regular,
  //             structure: "layout",
  //             isMenu: true,
  //           },
  //         },
  //         {
  //           name: "Buyruqni imzolash",
  //           path: "/document-sign/docs/:id",
  //           component: ViewDocSigning,
  //           config: {
  //             permission: "letter_view",
  //             icon: Home20Regular,
  //             structure: "layout",
  //             isMenu: false
  //           },
  //         },


  //         // Bildirgini imzolash
  //         {
  //           name: "Bildirgini imzolash",
  //           path: "/document-sign/notice",
  //           component: DocNoticeSign,
  //           config: {
  //             permission: "document-notification_index",
  //             icon: Home20Regular,
  //             structure: "layout",
  //             isMenu: true,
  //           },
  //         },
  //         {
  //           name: "Bildirgini imzolash",
  //           path: "/doc-notice/sign/:id",
  //           component: DocNoticeSignView,
  //           config: {
  //             permission: "document-notification_view",
  //             icon: Home20Regular,
  //             structure: "layout",
  //             isMenu: false,
  //           },
  //         },


  //         // Farmoyishni imzolash
  //         {
  //           name: "Farmoyish tasdiqlash",
  //           path: "/document-sign/decree",
  //           component: DocDecreeSign,
  //           config: {
  //             permission: "document-execution_index",
  //             icon: Home20Regular,
  //             structure: "layout",
  //             isMenu: true,
  //           },
  //         },
  //         {
  //           name: "Farmoyish tasdiqlash",
  //           path: "/doc-decree/sign/:id",
  //           component: DocDecreeSignView,
  //           config: {
  //             permission: "document-execution_view",
  //             icon: Home20Regular,
  //             structure: "layout",
  //             isMenu: false,
  //           },
  //         },
  //       ],
  //     },

  //     // Document weights
  //     {
  //       name: "Document weights",
  //       path: "/document-weights",
  //       component: DocumentWeights,
  //       config: {
  //         permission: "document-weight_index",
  //         icon: Home20Regular,
  //         structure: "layout",
  //         isMenu: true
  //       },
  //       submenu: [],
  //     },

  //     {
  //       name: "Document types",
  //       path: "/document-types",
  //       component: DocumentTypes,
  //       config: {
  //         permission: "document-type_index",
  //         structure: "layout",
  //         isMenu: true,
  //       }
  //     },

  //     {
  //       name: "Document important levels",
  //       path: "/document-important-levels",
  //       component: DocumentImortantLevel,
  //       config: {
  //         permission: "important-level_index",
  //         structure: "layout",
  //         isMenu: true,
  //       }
  //     },
  //   ],
  // },
  {
    name: "Students",
    path: "students",
    component: "",
    config: {
      permission: "*",
      icon: HatGraduation20Regular,
      structure: "layout",
      isMenu: true,
      not_allowed_roles: ["teacher"]
    },
    submenu: [
      {
        name: "Students",
        path: "/students",
        component: Students,
        config: {
          permission: "student_index",
          structure: "layout",
          isMenu: true,
        },
      },
      {
        name: "View students",
        path: "students/view/:user_id",
        component: ViewStudent,
        config: {
          permission: "student_view",
          structure: "layout",
          isMenu: false,
        },
      },
      {
        name: "Create student",
        path: "students/create",
        component: UpdateStudent,
        config: {
          permission: "student_create",
          structure: "layout",
          isMenu: false,
        },
      },
      {
        name: "Udate student",
        path: "students/update/:user_id",
        component: UpdateStudent,
        config: {
          permission: "student_update",
          structure: "layout",
          isMenu: false,
        },
      },
      {
        name: "Student study sheet",
        path: "students/:student_id/student-study-sheet",
        component: StudentStudySheet,
        config: {
          permission: "student_view",
          structure: "layout",
          isMenu: false,
        },
      },
      {
        name: "Student study sheet",
        path: "students/:student_id/student-academic-info-sheet",
        component: StudentAcademicInfo,
        config: {
          permission: "student_view",
          structure: "layout",
          isMenu: false,
        },
      },
      {
        name: "Student mark",
        path: "students/:student_id/:edu_plan_id/mark",
        component: StudentMark,
        config: {
          permission: "student-mark_index",
          structure: "layout",
          isMenu: false,
        },
      },
      {
        name: "Student attends",
        path: "students/:student_id/attends",
        component: StudentAttends,
        config: {
          permission: "timetable-attend_index",
          structure: "layout",
          isMenu: false,
        },
      },
      {
        name: "Student time table",
        path: "students/:student_id/:user_id/time-table",
        component: StudentTimeTable,
        config: {
          permission: "time-table_index",
          structure: "layout",
          isMenu: false,
        },
      },
      {
        name: "Exclusion",
        path: "/students-expulsion",
        component: ExpulsionStudents,
        config: {
          permission: "*",
          structure: "layout",
          isMenu: false,
        },
      },
      {
        name: "Student Categories",
        path: "/student-categories",
        component: StudentCategory,
        config: {
          permission: "student-category_index",
          structure: "layout",
          isMenu: true,
        },
      },
      {
        name: "Ko'chirish (semestr)",
        path: "/student-semestr-transfer",
        component: StudentSemestrTransfer,
        config: {
          permission: "student-group_index",
          structure: "layout",
          isMenu: true,
        },
      },
      {
        name: "Talabalarni ko'chirish",
        path: "/student-group-transfer",
        component: StudentGroupTransfer,
        config: {
          permission: "student-group_index",
          structure: "layout",
          isMenu: true,
        },
      },
    ],
  },

  //subjects
  {
    name: "Subjects",
    path: "subjects_info",
    component: "",
    config: {
      permission: "*",
      icon: BookOpen20Regular,
      structure: "layout",
      isMenu: true,
    },
    submenu: [
      {
        name: "Subjects",
        path: "/subjects",
        component: Subjects,
        config: {
          permission: "subject_index",
          structure: "layout",
          isMenu: true,
        },
      },
      {
        name: "Create subject",
        path: "/subjects/create",
        component: UpdateSubject,
        config: {
          permission: "subject_create",
          structure: "layout",
          isMenu: false,
        },
      },
      {
        name: "Update subject",
        path: "/subjects/update/:id",
        component: UpdateSubject,
        config: {
          permission: "subject_update",
          structure: "layout",
          isMenu: false,
        },
      },
      {
        name: "View subject",
        path: "/subjects/view/:id",
        component: SubjectInfo,
        config: {
          permission: "subject_view",
          structure: "layout",
          isMenu: false,
        },
      },
      {
        name: "Subject exam test update",
        path: "/subject/:subject_id/exam-tests/update/:test_id",
        component: UpdateSubjectExamTest,
        config: {
          permission: "subject_view",
          structure: "layout",
          isMenu: false,
        },
      },
      {
        name: "Subject exam question create",
        path: "/subject/exam-questions/create",
        component: SubjectExamQuestionUpdate,
        config: {
          permission: "test_create",
          structure: "layout",
          isMenu: false,
        },
      },
      {
        name: "Subject exam question update",
        path: "/subject/exam-questions/update/:id",
        component: SubjectExamQuestionUpdate,
        config: {
          permission: "test_update",
          structure: "layout",
          isMenu: false,
        },
      },
      {
        name: "Subject exam question view",
        path: "/subject/exam-questions/view/:id",
        component: SubjectExamQuestionView,
        config: {
          permission: "test_view",
          structure: "layout",
          isMenu: false,
        },
      },
      {
        name: "Subject Types",
        path: "/subject-types",
        component: SubjectType,
        config: {
          permission: "subject-type_index",
          structure: "layout",
          isMenu: true,
        },
      },
      {
        name: "Subject Category",
        path: "/subject-category",
        component: SubjectCategory,
        config: {
          permission: "subject-category_index",
          structure: "layout",
          isMenu: true,
        },
      },

      {
        name: "Subject content",
        path: "/subjects/:subject_id/topics/:topic_id/contents/:teacher_id",
        component: SubjectContent,
        config: {
          permission: "subject-content_index",
          structure: "layout",
          isMenu: false,
        },
      },
      {
        name: "Subject content",
        path: "/subjects/:subject_id/topics/:topic_id/contents",
        component: SubjectContent,
        config: {
          permission: "subject-content_index",
          structure: "layout",
          isMenu: false,
        },
      },

      {
        name: "Subject content teacher",
        path: "/subjects/:subject_id/topics/:topic_id/teachers",
        component: ContentTeachers,
        config: {
          permission: "subject-content_view",
          structure: "layout",
          isMenu: false,
        },
      },

      {
        name: "Topic View",
        path: "/subjects/:subject_id/topic-view/:topic_id",
        component: TopicView,
        config: {
          permission: "subject-topic_view",
          structure: "layout",
          isMenu: false,
        },
      },

      {
        name: "Topic test",
        path: "/subject/tests/:subject_id/:topic_id",
        component: SubjectTopicTest,
        config: {
          permission: "subject-content_index",
          structure: "layout",
          isMenu: false,
        },
      },
      {
        name: "Topic test update",
        path: "/subject/tests/update/:subject_id/:topic_id/:test_id",
        component: UpdateTopicTest,
        config: {
          permission: "subject-content_index",
          structure: "layout",
          isMenu: false,
        },
      },
    ],
  },


  //Educational processes
  {
    name: "Educational processes",
    path: "edu_proses",
    component: "",
    config: {
      permission: "*",
      icon: Book20Regular,
      structure: "layout",
      isMenu: true,
    },
    submenu: [

      // edu plan
      {
        name: "Edu plans",
        path: "/edu-plans",
        component: EduPlan,
        config: {
          permission: "edu-plan_index",
          structure: "layout",
          isMenu: true,
        }
      },
      {
        name: "Edu plan update",
        path: "/edu-plans/:type/:id",
        component: UpdateEduPlan,
        config: {
          permission: "edu-plan_update",
          structure: "layout",
          isMenu: false,
        }
      },
      {
        name: "Edu plan view",
        path: "/edu-plans/view/:id",
        component: EduPlanView,
        config: {
          permission: "edu-plan_view",
          structure: "layout",
          isMenu: false,
        }
      },

      // edu semestr
      {
        name: "Edu semestr",
        path: "/edu-plans/semestrs/:edu_plan_id",
        component: EduSemestr,
        config: {
          permission: "edu-semestr_index",
          structure: "layout",
          isMenu: false,
        },
      },

      {
        name: "Edu semestr",
        path: "/edu-plans/semestrs/view/:edu_plan_id/:edu_semestr_id",
        component: EduSemestrView,
        config: {
          permission: "edu-semestr_view",
          structure: "layout",
          isMenu: false,
        }
      },
      {
        name: "Edu semestr attachment",
        path: "/edu-plans/semestrs/subject/attachment/:edu_plan_id/:edu_semestr_id",
        component: AttachEduSemestrSubject,
        config: {
          permission: "edu-semestr-subject_update",
          structure: "layout",
          isMenu: false,
        },
      },
      {
        name: "Edu semestr attached subject update",
        path: "/edu-plans/semestrs/subject/update/:edu_subject_id",
        component: EduSemestrSubjectUpdate,
        config: {
          permission: "edu-semestr-subject_update",
          structure: "layout",
          isMenu: false,
        },
      },
      //groups
      {
        name: "Groups",
        path: "/group",
        component: Group,
        config: {
          permission: "group_index",
          structure: "layout",
          isMenu: true,
        },
      },
      {
        name: "Group View",
        path: "/group/view/:id",
        component: ViewGroup,
        config: {
          permission: "group_view",
          structure: "layout",
          isMenu: false,
        },
      },

      // time tables
      {
        name: "Time tables",
        path: "/time-tables",
        component: TimeTables,
        config: {
          permission: "time-table_index",
          structure: "layout",
          isMenu: true,
          not_allowed_roles: ["teacher"]
        }
      },

      {
        name: "Time tables",
        path: "/time-tables/:course_id/:edu_form_id",
        component: TimeTableData,
        config: {
          permission: "time-table_index",
          structure: "layout",
          isMenu: false,
        }
      },

      {
        name: "Time table create",
        path: "/time-tables/create/:type/:edu_plan_id/:group_id/:week_id/:para_id",
        component: TimeTableCreate,
        config: {
          permission: "time-table_create",
          structure: "layout",
          isMenu: false,
        }
      },

      {
        name: "Time table update",
        path: "/time-tables/update/:type/:edu_plan_id/:group_id/:week_id/:para_id/:time_table_id",
        component: TimeTableUpdate,
        config: {
          permission: "time-table_update",
          structure: "layout",
          isMenu: false,
        }
      },

      {
        name: "Time table view",
        path: "/time-tables/view/:time_table_id",
        component: TimeTableView,
        config: {
          permission: "time-table_view",
          structure: "layout",
          isMenu: false,
        }
      },

      // new time tables

      {
        name: "Time tables",
        path: "/time-tables-new/tutor",
        component: TimeTableDataNewForTutor,
        config: {
          permission: "timetable-date_index",
          structure: "layout",
          isMenu: true,
          for_roles: ["tutor"]
        }
      },

      {
        name: "Time tables",
        path: "/time-tables-new",
        component: TimeTablesNew,
        config: {
          permission: "timetable_index",
          structure: "layout",
          isMenu: true,
          not_allowed_roles: ["teacher", "tutor"]
        }
      },

      {
        name: "Time tables",
        path: "/time-tables-new/:course_id/:edu_form_id",
        component: TimeTableDataNew,
        config: {
          permission: "timetable-date_index",
          structure: "layout",
          isMenu: false,
        }
      },
      {
        name: "Time table create",
        path: "/time-tables-new/create/:type/:edu_plan_id/:group_id/:week_id/:para_id/:edu_semestr_id/:start_time/:week",
        component: TimeTableCreateNew,
        config: {
          permission: "timetable_create",
          structure: "layout",
          isMenu: false,
        }
      },
      {
        name: "Time table view",
        path: "/time-tables-new/view/table/:time_table_id",
        component: TimeTableNewView,
        config: {
          permission: "timetable_view",
          structure: "layout",
          isMenu: false,
        }
      },

      // time table by date
      {
        name: "Dars jadvali bino kesimida",
        path: "/time-tables-new-by-date",
        component: TimeTableNewByRoom,
        config: {
          permission: "timetable-date_filter",
          structure: "layout",
          isMenu: true,
        }
      },

      //student mark
      {
        name: "Marks",
        path: "/student-marks",
        component: MainStudentMark,
        config: {
          permission: "student-mark_get",
          structure: "layout",
          isMenu: true,
        }
      },

      //student mark
      {
        name: "Baholarni ko'rish",
        path: "/student-marks-view",
        component: StudentMarksView,
        config: {
          permission: "student-mark_get",
          structure: "layout",
          isMenu: true,
          not_allowed_roles: ["teacher"]
        }
      },
    ],
  },

  //Human Resources
  {
    name: "Human Resources",
    path: "hr",
    component: "",
    config: {
      permission: "*",
      icon: Briefcase20Regular,
      structure: "layout",
      isMenu: true,
      not_allowed_roles: ["teacher", "tutor"]
    },
    submenu: [
      {
        name: "Employees",
        path: "/employees",
        component: Employees,
        config: {
          permission: "user_index",
          structure: "layout",
          isMenu: true,
        },
      },
      {
        name: "Teachers",
        path: "/teachers",
        component: Teacher,
        config: {
          permission: "user_index",
          structure: "layout",
          isMenu: true,
        },
      },
      {
        name: "Teachers create",
        path: "/teachers/create",
        component: UpdateTeacher,
        config: {
          permission: "user_create",
          structure: "layout",
          isMenu: false,
        },
      },
      {
        name: "Teachers update",
        path: "/teachers/update/:user_id",
        component: UpdateTeacher,
        config: {
          permission: "user_update",
          structure: "layout",
          isMenu: false,
        },
      },
      {
        name: "Teachers view",
        path: "/teachers/view/:user_id",
        component: ViewTeacher,
        config: {
          permission: "user_view",
          structure: "layout",
          isMenu: false,
        },
      },
      {
        name: "Teachers time table",
        path: "/teachers/:user_id/time-table",
        component: TeacherTimeTable,
        config: {
          permission: "user_view",
          structure: "layout",
          isMenu: false,
        },
      },
    ],
  },

  //davomat
  {
    name: "Attendance",
    path: "attendance",
    component: "",
    config: {
      permission: "*",
      icon: CheckboxPerson20Regular,
      structure: "layout",
      isMenu: true,
      not_allowed_roles: ["teacher"]
    },
    submenu: [
      //attendance
      {
        name: "Attendance",
        path: "/attendance",
        component: Attendance,
        config: {
          permission: "attend_index",
          structure: "layout",
          isMenu: true,
          not_allowed_roles: ["teacher"]
        }
      },
      {
        name: "Student attend",
        path: "/time-table/:time_table_id/to-attend",
        component: ToAttend,
        config: {
          permission: "attend_index",
          structure: "layout",
          isMenu: false,
        },
      },

      //attendance by faculty
      {
        name: "Attendance",
        path: "/attendance-faculty",
        component: AttendanceByFaculty,
        config: {
          permission: "attend_index",
          structure: "layout",
          isMenu: false,
        }
      },

      //attendance by group
      {
        name: "Attendanceby Group",
        path: "/attendance-faculty/group/:id",
        component: AttendanceByGroup,
        config: {
          permission: "attend_index",
          structure: "layout",
          isMenu: false,
        }
      },

      // {
      //   // name: "Confirmation of student attendance",
      //   name: "Sababli qilish eskisi",
      //   path: "/student-attance-check",
      //   component: CheckAttancesOld,
      //   config: {
      //     permission: "timetable-reason_index",
      //     structure: "layout",
      //     isMenu: true,
      //   },
      // },

      //attendance Confirmation
      {
        // name: "Confirmation of student attendance",
        name: "Sababli qilish",
        path: "/student-attance-check",
        component: CheckAttances,
        config: {
          permission: "timetable-reason_index",
          structure: "layout",
          isMenu: true,
        },
      },
    ]
  },

  // imtihonlar
  {
    name: "Exams",
    path: "exams",
    component: "",
    config: {
      permission: "*",
      icon: ClipboardTaskListLtr20Regular,
      structure: "layout",
      isMenu: true,
    },
    submenu: [
      // new finally exam
      {
        name: "Yakuniy nazorat",
        path: "/exams",
        component: NewExam,
        config: {
          permission: "final-exam_index",
          structure: "layout",
          isMenu: true,
        },
      },
      {
        name: "Exam create",
        path: "/exams/create",
        component: NewExamUpdate,
        config: {
          permission: "final-exam_create",
          structure: "layout",
          isMenu: false,
        },
      },
      {
        name: "Exam update",
        path: "/exams/update/:id",
        component: NewExamUpdate,
        config: {
          permission: "final-exam_update",
          structure: "layout",
          isMenu: false,
        },
      },
      {
        name: "Exam view",
        path: "/exams/view/:id",
        component: NewExamView,
        config: {
          permission: "final-exam_view",
          structure: "layout",
          isMenu: false,
        },
      },
      {
        name: "Exam student",
        path: "/exams/:exam_id/students",
        component: ExamStudentMark,
        config: {
          permission: "exam-student_index",
          structure: "layout",
          isMenu: false,
        },
      },
      {
        name: "Baholash qaydnomasi",
        path: "/exams/:exam_id/sheet",
        component: ExamSheet,
        config: {
          permission: "student-vedomst_index",
          structure: "layout",
          isMenu: false,
        },
      },



      // exam controls
      {
        name: "Exam controls",
        path: "/exam-controls",
        component: ControlExam,
        config: {
          permission: "final-exam_index",
          structure: "layout",
          isMenu: true,
        },
      },
      {
        name: "Exam control create",
        path: "/exam-controls/create",
        component: NewExamControlUpdate,
        config: {
          permission: "final-exam_create",
          structure: "layout",
          isMenu: false,
        },
      },
      {
        name: "Exam control view",
        path: "/exam-controls/view/:id",
        component: NewControlExamView,
        config: {
          permission: "final-exam_view",
          structure: "layout",
          isMenu: false,
        },
      },
      {
        name: "Exam control update",
        path: "/exam-controls/update/:id",
        component: NewExamControlUpdate,
        config: {
          permission: "final-exam_update",
          structure: "layout",
          isMenu: false,
        },
      },

    ]
  },

  //exam-question
  {
    name: "Exam questions",
    path: "exam-questions",
    component: "",
    config: {
      permission: "*",
      icon: ClipboardTaskListLtr20Regular,
      structure: "layout",
      isMenu: true,
      not_allowed_roles: ["teacher", "tutor"]
    },
    submenu: [
      {
        name: "Question database",
        path: "/exam-questions",
        component: ExamQuestions,
        config: {
          permission: "test_index",
          structure: "layout",
          isMenu: true,
        }
      },
      {
        name: "Exam questions create",
        path: "/exam-questions/create",
        component: ExamQuestionsCreate,
        config: {
          permission: "test_create",
          structure: "layout",
          isMenu: false,
        }
      },
      {
        name: "Exam questions view",
        path: "/exam-questions/view/:id",
        component: ExamQuestionView,
        config: {
          permission: "test_view",
          structure: "layout",
          isMenu: false,
        }
      },
      {
        name: "Exam questions update",
        path: "/exam-questions/update/:id",
        component: ExamQuestionsCreate,
        config: {
          permission: "test_update",
          structure: "layout",
          isMenu: false,
        }
      },
      {
        name: "Test database",
        path: "/tests",
        component: Tests,
        config: {
          permission: "test_index",
          structure: "layout",
          isMenu: true,
        }
      },
      {
        name: "Test update",
        path: "/tests/update/:test_id",
        component: TestUpdate,
        config: {
          permission: "test_update",
          structure: "layout",
          isMenu: false,
        }
      },
      {
        name: "Test view",
        path: "/tests/view/:test_id",
        component: TestUpdate,
        config: {
          permission: "test_view",
          structure: "layout",
          isMenu: false,
        }
      },
      {
        name: "Test create",
        path: "/tests/create",
        component: TestUpdate,
        config: {
          permission: "test_create",
          structure: "layout",
          isMenu: false,
        }
      },
    ]
  },


  // statistics
  {
    name: "Statistics",
    path: "statistics",
    component: "",
    config: {
      permission: "*",
      icon: DocumentCatchUp20Regular,
      structure: "layout",
      isMenu: true,
      not_allowed_roles: ["teacher"]
    },
    submenu: [
      {
        name: "Users statistic",
        path: "/user-statistic",
        component: UsersStatistic,
        config: {
          permission: "user_index",
          structure: "layout",
          isMenu: true,
        }
      },
      {
        name: "Teacher works",
        path: "/teacher-statistic",
        component: TeacherStatistics,
        config: {
          permission: "user_index",
          structure: "layout",
          isMenu: true,
        }
      },
      {
        name: "Student activity time",
        path: "/students-login-time",
        component: StudentsLoginTime,
        config: {
          permission: "student_index",
          structure: "layout",
          isMenu: true,
        }
      },
      {
        name: "Students attend",
        path: "/student-statistic",
        component: StudentStatistics,
        config: {
          permission: "student_index",
          structure: "layout",
          isMenu: true,
        }
      },
      {
        name: "Student subject attend",
        path: "/student-attend-statistics",
        component: StudentAttendStatistics,
        config: {
          permission: "student_missed-hours",
          structure: "layout",
          isMenu: true,
        }
      },
      {
        name: "Students degre",
        path: "/student-degre",
        component: StudentDegreStatistics,
        config: {
          permission: "student_index",
          structure: "layout",
          isMenu: true,
        }
      },
      {
        name: "Action Log",
        path: "/action-log",
        component: ActionLog,
        config: {
          permission: "action-log_index",
          structure: "layout",
          isMenu: true,
        }
      },
      {
        name: "Dars jadvali bo'yicha davomat tahlili",
        path: "/attends-by-time-table",
        component: AttendsByTimetableStatistics,
        config: {
          permission: "timetable_user",
          structure: "layout",
          isMenu: true,
          for_roles: ["admin", "edu_admin", "rector", "dean", "prorector"]
        }
      },
    ]
  },

  // settitngs
  {
    name: "Settings",
    path: "settings",
    component: "",
    config: {
      permission: "*",
      icon: Settings20Regular,
      structure: "layout",
      isMenu: true,
    },
    submenu: [

      // users
      {
        name: "Users",
        path: "/users",
        component: Users,
        config: {
          permission: "user_index",
          structure: "layout",
          isMenu: true,
        },
        submenu: [],
      },
      {
        name: "Users update",
        path: "/users/create",
        component: UpdateUser,
        config: {
          permission: "user_create",
          structure: "layout",
          isMenu: false,
        },
      },
      {
        name: "Users update",
        path: "/users/update/:user_id",
        component: UpdateUser,
        config: {
          permission: "user_update",
          structure: "layout",
          isMenu: false,
        },
      },
      {
        name: "Users view",
        path: "/users/view/:user_id",
        component: UserView,
        config: {
          permission: "user_view",
          structure: "layout",
          isMenu: false,
        },
      },

      //roles
      {
        name: "Roles",
        path: "/roles",
        component: Roles,
        config: {
          permission: "access-control_roles",
          structure: "layout",
          isMenu: true,
        },
      },
      {
        name: "Roles update",
        path: "/roles/update/:role_name",
        component: UpdateRole,
        config: {
          permission: "access-control_update-role",
          structure: "layout",
          isMenu: false,
        },
      },
      {
        name: "Roles view",
        path: "/roles/view/:role_name",
        component: RoleView,
        config: {
          permission: "access-control_roles",
          structure: "layout",
          isMenu: false,
        },
      },

      {
        name: "Infrastructure",
        path: "/infrastuctura/buildings",
        component: "",
        config: {
          permission: "*",
          structure: "layout",
          isMenu: true,
          extraMenuType: "tab",
        },
        submenu: [
          {
            name: "Building",
            path: "/infrastuctura/buildings",
            component: Buildings,
            config: {
              permission: "building_index",
              structure: "layout",
              isMenu: true,
            },
          },
          {
            name: "Rooms",
            path: "/infrastuctura/rooms",
            component: Rooms,
            config: {
              permission: "room_index",
              structure: "layout",
              isMenu: true,
            },
          },
          {
            name: "Room types",
            path: "/infrastuctura/room-types",
            component: RoomTypes,
            config: {
              permission: "room-type_index",
              structure: "layout",
              isMenu: true,
            },
          },
        ],
      },
      {
        name: "Structural division",
        path: "/structural-unit/faculties",
        component: "",
        config: {
          permission: "*",
          icon: ShapeIntersect20Regular,
          structure: "layout",
          isMenu: true,
          extraMenuType: "tab",
        },
        submenu: [
          {
            name: "Faculties",
            path: "/structural-unit/faculties",
            component: Faculties,
            config: {
              permission: "faculty_index",
              structure: "layout",
              isMenu: true,
            },
          },
          {
            name: "Faculty View",
            path: "/structural-unit/faculties/view/:id",
            component: FacultyView,
            config: {
              permission: "faculty_view",
              structure: "layout",
              isMenu: false,
            },
          },
          {
            name: "Kafedras",
            path: "/structural-unit/kafedras",
            component: Kafedras,
            config: {
              permission: "kafedra_index",
              structure: "layout",
              isMenu: true,
            },
          },
          {
            name: "Kafedra View",
            path: "/structural-unit/kafedras/view/:id",
            component: ViewsKafedra,
            config: {
              permission: "kafedra_view",
              structure: "layout",
              isMenu: false,
            },
          },
          {
            name: "Department",
            path: "/structural-unit/department",
            component: Department,
            config: {
              permission: "department_index",
              structure: "layout",
              isMenu: true,
            },
          },
          {
            name: "Department View",
            path: "/structural-unit/department/view/:id",
            component: ViewDepartment,
            config: {
              permission: "department_view",
              structure: "layout",
              isMenu: false,
            },
          },
          {
            name: "Directions",
            path: "/structural-unit/directions",
            component: Direction,
            config: {
              permission: "direction_index",
              structure: "layout",
              isMenu: true,
            },
          },
        ],
      },
      {
        name: "Education",
        path: "/education/edu-forms",
        component: "",
        config: {
          permission: "*",
          structure: "layout",
          isMenu: true,
          not_allowed_roles: ["teacher", "tutor"]
        },
        submenu: [
          {
            name: "Edu forms",
            path: "/education/edu-forms",
            component: EduForms,
            config: {
              permission: "edu-form_index",
              structure: "layout",
              isMenu: true,
            },
          },
          {
            name: "Edu types",
            path: "/education/edu-types",
            component: EduTypes,
            config: {
              permission: "edu-type_index",
              structure: "layout",
              isMenu: true,
            },
          },
          {
            name: "Edu years",
            path: "/education/edu-years",
            component: EduYears,
            config: {
              permission: "edu-year_index",
              structure: "layout",
              isMenu: true,
            },
          },
          {
            name: "Semestr",
            path: "/education/semestrs",
            component: Semestr,
            config: {
              permission: "semestr_index",
              structure: "layout",
              isMenu: true,
            },
          },
          {
            name: "Course",
            path: "/education/courses",
            component: Course,
            config: {
              permission: "course_index",
              structure: "layout",
              isMenu: true,
            },
          },
          {
            name: "Para",
            path: "/education/para",
            component: Para,
            config: {
              permission: "para_index",
              structure: "layout",
              isMenu: true,
            },
          },
        ],
      },

      {
        name: "Base",
        path: "/base/exam_types",
        component: "",
        config: {
          permission: "*",
          icon: Database20Regular,
          structure: "layout",
          isMenu: true,
          extraMenuType: "menu",
          not_allowed_roles: ["teacher", "tutor"]
        },
        submenu: [
          {
            name: "Exam type",
            path: "/base/exam_types",
            component: ExamTypes,
            config: {
              permission: "exams-type_index",
              structure: "layout",
              isMenu: true,
            },
          },
          {
            name: "Citizenships",
            path: "/base/citizenships",
            component: Citizenships,
            config: {
              permission: "citizenship_index",
              structure: "layout",
              isMenu: true,
            },
          },
          {
            name: "Nationalities",
            path: "/base/nationalities",
            component: Nationalities,
            config: {
              permission: "nationality_index",
              structure: "layout",
              isMenu: true,
            },
          },
          {
            name: "Residence Status",
            path: "/base/residence-status",
            component: ResidenceStatus,
            config: {
              permission: "residence-status_index",
              structure: "layout",
              isMenu: true,
            },
          },
          {
            name: "Category of cohabitants",
            path: "/base/category-of-cohabitants",
            component: CategoryOfCohabitant,
            config: {
              permission: "category-of-cohabitant_index",
              structure: "layout",
              isMenu: true,
            },
          },
          {
            name: "Social categories",
            path: "/base/social-categories",
            component: SocialCategories,
            config: {
              permission: "social-category_index",
              structure: "layout",
              isMenu: true,
            },
          },
          {
            name: "Degrees",
            path: "/base/degrees",
            component: Degrees,
            config: {
              permission: "degree_index",
              structure: "layout",
              isMenu: true,
            },
          },
          {
            name: "Academic degrees",
            path: "/base/academic-degrees",
            component: AcademicDegrees,
            config: {
              permission: "academic-degree_index",
              structure: "layout",
              isMenu: true,
            },
          },
          {
            name: "Degree infos",
            path: "/base/degree-infos",
            component: DegreeInfos,
            config: {
              permission: "degree-info_index",
              structure: "layout",
              isMenu: true,
            },
          },
          {
            name: "Diplom types",
            path: "/base/diploma-types",
            component: DiplomTypes,
            config: {
              permission: "diploma-type_index",
              structure: "layout",
              isMenu: true,
            },
          },
          {
            name: "Parties",
            path: "/base/parties",
            component: Parties,
            config: {
              permission: "partiya_index",
              structure: "layout",
              isMenu: true,
            },
          },
          {
            name: "Weeks",
            path: "/base/weeks",
            component: Weeks,
            config: {
              permission: "week_index",
              structure: "layout",
              isMenu: true,
            },
          },
          // {
          //   name: "Job title",
          //   path: "/base/job-title",
          //   component: JobTitle,
          //   config: {
          //     permission: "job-title_index",
          //     structure: "layout",
          //     isMenu: true,
          //   }
          // },
          {
            name: "Student commands",
            path: "/base/commands",
            component: StudentCommands,
            config: {
              permission: "commands_index",
              structure: "layout",
              isMenu: true,
            }
          },
          {
            name: "Work rate",
            path: "/base/work-rate",
            component: WorkRate,
            config: {
              permission: "work-rate_index",
              structure: "layout",
              isMenu: true,
            }
          },
          {
            name: "Work load",
            path: "/base/work-load",
            component: Shtats,
            config: {
              permission: "work-load_index",
              structure: "layout",
              isMenu: true,
            }
          },
        ],
      },

    ],
  },

];
