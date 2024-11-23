/** @format */

import store from "store";

//  amtd select search
export const cf_filterOption = (input: string, option: any) => {  
  return (
    String(option?.children)
      .toLowerCase()
      .indexOf(String(input).toLowerCase()) >= 0
  );
};

/**
 * check the role from the user's role list
 * @param role role_name (string)
 * @returns true or false (boolean)
 */
export const checkRole = (role: string) => {
  const roles = store.getState().auth?.user?.role;

  if (roles?.length && role) return roles.includes(role);
  return false;
};

// generate antd Col span
export const generateAntdColSpan = (span: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number; xxl?: number } | undefined) => {
  if (typeof span === "number") return { span };

  let initialSpan: any = { xs: 24, sm: 24, md: 12, lg: 8, xl: 6 };
  if (span) {
    Object.entries(span)?.forEach(([key, value]) => {
      initialSpan = { ...initialSpan, [key]: value };
    });
  }
  return initialSpan;
};

export const renderFullName = (item: any) => {
  return item?.last_name + " " + item?.first_name + " " + item?.middle_name;
};
