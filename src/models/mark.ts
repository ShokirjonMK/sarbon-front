import { IGroup } from "./education";
import { IStudent } from "./student";
import IUsers, { IUserField } from "./user";


export interface IStudentVedmost {
    created_at: number
    created_by: number
    id: number
    order: number
    passed: number
    status: number
    student_id: number
    student_mark_id: number
    student_user_id: number
    type: number
    updated_at: number
    updated_by: number
    user_id: number
    vedomst: number
}


export interface IStudentMark {
    ball: number
    course_id: number
    created_at: number
    created_by: number
    direction_id: number
    edu_plan_id: number
    edu_semestr_id: number
    edu_semestr_subject_id: number
    exam_type_id: number
    faculty_id: number
    group_id: number
    id: number
    order: number
    semestr_id: number
    status: number
    student_id: number
    subject_id: number
    type: number
    updated_at: number
    updated_by: number
    edu_semestr_exams_type_id?: number
    vedomst?: number,
    max_ball: number
    student?: IStudent
    studentUser?: IUserField
    passed?: number
    studentVedomst?: any
    attend: number,
    group?: IGroup,
    attendStatus?: any
}