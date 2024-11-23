/** @format */

import store from "store";

const checkOnlyForRoles = (for_roles?: Array<string>) => {
  const auth = store.getState().auth;

  // ------- old ------------
  // return auth.user?.role?.some(role => for_roles?.includes(role))

  // ------- old ------------
  return for_roles?.includes(auth.user?.active_role ?? "")

};

export default checkOnlyForRoles;