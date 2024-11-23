/** @format */

import { IconType } from "react-icons/lib";

export type TypeRoutesSubmenu = {
  name: string;
  path: string;
  component: React.FC | "";
  config: {
    permission: string | "*";
    icon?: IconType;
    structure: "layout" | "nonlayout";
    exact?: boolean; 
    isMenu: boolean;
    extraMenuType?: "menu" | "tab",
    not_allowed_roles?: Array<"admin" | "dean" | "dean_deputy" | "dep_lead" | "edu_admin" | "edu_moderator" | "hr" | "mudir" | "prorector" | "rector" | "student" | "teacher" | "tutor">,
    for_roles?: Array<string>,
  };
};

type a<T> = T & {submenu?: T[]}


type b<T> = T & {submenu?: a<T>[]}

export type TypeRoutes = b<TypeRoutesSubmenu>