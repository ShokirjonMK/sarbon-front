import { IExamType, ISubject } from "./subject";

export interface ITestQuestion {
    created_at: number,
    created_by: number,
    testBody: {
        text: string,
        file: string,
        updated_at: number,
        updated_by: number,
        created_at: number,
        created_by: number,
    }
    id: number,
    level: string,
    order: number,
    status: number,
    topic_id: string,
    updated_at: number,
    updated_by: number,
    exam_type_id: number | null
    subject_id: number | null
    lang_id: number | null
    examType?: IExamType
    subject?: ISubject
    options?:ITestOption[],
    is_checked?: 0 | 1
}

export interface ITestOption {
    created_at: number,
    created_by: number,
    file: string,
    id: number,
    is_correct: number,
    order: number,
    status: number,
    test_id: string,
    text: string,
    updated_at: number,
    updated_by: number
}
