/** @format */

import { IUserAccess } from "models/edu_structure";

export type generateTeacherAccessType = {
  id: number;
  is_lecture: number;
  language_id: number;
  subject_id: number;
  user_id: number;
};

export type generateUserAccessType = {
  [key: number]: { [key: string]: string[] };
};

export type addUserAccessType = {
  is_leader: number;
  table_id: number;
  user_access_type_id: number;
  work_rate_id: number;
  work_load_id: number;
};

// {1:{4:[1,3,4]}}

/**
 * array_teacher_access generate object_teacher_access
 * @param data teacherAccess type (array)
 * @returns /{subject_id: {lang_id: [subject_category_id, ...], ...}, ...}  (object)
 */
export const generateTeacherAccess = (data: generateTeacherAccessType[]) => {
  const obj: { [key: number]: { [key: number]: number[] } } = {};

  data?.forEach((e) => {
    obj[e?.subject_id] = {
      ...(obj ? obj[e?.subject_id] ?? {} : {}),
      [e?.language_id]: [
        ...(obj && obj[e?.subject_id]
          ? obj[e?.subject_id][e?.language_id] ?? []
          : []),
        e?.is_lecture,
      ],
    };
  });

  return obj;
};


/**
 * array_user_access generate object_user_access
 * @param data userAccess type (array)
 * @returns /{ user_access_type_id: { "table_id - is_leader": [ "work_load_id - work_rate_id" ... ], ... }, ... }  (object)
 * @example { 1: { "12-1": [ "1-4", "2-2", ... ], ... }, ... }  (object)
 */
// export const generateUserAccess = (data: IUserAccess[]) => {
//   const obj: { [key: number]: string[] } = {};

//   data?.forEach((e) => {
//     if (e?.loadRate) {
//       e?.loadRate?.forEach((a) => {
//         obj[e?.user_access_type_id] = [
//           ...(obj ? obj[e?.user_access_type_id] ?? [] : []),
//           `${e?.table_id}-${e?.is_leader}-${a?.work_load_id}-${a?.work_rate_id}`,
//         ];
//       });
//     }
//   });

//   return obj;
// };

export const _generateUserAccess = (data: IUserAccess[]) => {
  const _obj: generateUserAccessType = {};

  data?.forEach((e) => {
    if (e?.loadRate) {
      e?.loadRate?.forEach((a) => {
        _obj[e?.user_access_type_id] = {
          ...(_obj ? _obj[e?.user_access_type_id] ?? {} : {}),
          [`${e?.table_id}-${e?.is_leader}`]: [
            ...(_obj[e?.user_access_type_id]
              ? _obj[e?.user_access_type_id][
                  `${e?.table_id}-${e?.is_leader}`
                ] ?? []
              : []),
            `${a?.work_load_id}-${a?.work_rate_id}`,
          ],
        };
      });
    }
  });

  // console.log(_obj);
  return _obj;
};

export const addUserAccess = (
  data: generateUserAccessType,
  {
    user_access_type_id,
    table_id,
    is_leader,
    work_load_id,
    work_rate_id,
  }: addUserAccessType
) => {
  const _obj = {
    ...data,
    [user_access_type_id]: {
      ...(data ? data[user_access_type_id] ?? {} : {}),
      [`${table_id}-${is_leader}`]: [
        ...(data[user_access_type_id]
          ? data[user_access_type_id][`${table_id}-${is_leader}`] ?? []
          : []),
        `${work_load_id}-${work_rate_id}`,
      ],
    }
  };

  // console.log(_obj);
  return _obj;
};

export const removeUserAccess = (
  data: generateUserAccessType,
  {
    user_access_type_id,
    table_id,
    is_leader,
    work_load_id,
    work_rate_id,
  }: addUserAccessType
) => {
  let obj = {...data};

  if( obj[user_access_type_id] && Object.keys(obj[user_access_type_id])?.length < 2 && obj[user_access_type_id][`${table_id}-${is_leader}`] && obj[user_access_type_id][`${table_id}-${is_leader}`]?.length < 2){
    delete(obj[user_access_type_id]);
  } else if( obj[user_access_type_id] && obj[user_access_type_id][`${table_id}-${is_leader}`] && obj[user_access_type_id][`${table_id}-${is_leader}`]?.length < 2){
    delete(obj[user_access_type_id][`${table_id}-${is_leader}`] );
  } else {
    if(obj[user_access_type_id] && obj[user_access_type_id][`${table_id}-${is_leader}`]){
      const _new = obj[user_access_type_id][`${table_id}-${is_leader}`]?.filter(e => e !== `${work_load_id}-${work_rate_id}`);

      obj = {
        ...obj,
        [user_access_type_id]: {
          ...(obj ? obj[user_access_type_id] ?? {} : {}),
          [`${table_id}-${is_leader}`]: _new,
        }
      };
    }
  }

  // console.log(obj);
  return obj;
};
