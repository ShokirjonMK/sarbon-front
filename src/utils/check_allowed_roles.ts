/** @format */

import store from "store";

const checkAllowedRole = (not_allowed_roles?: Array<string>) => {
  const auth = store.getState().auth;

  // ------- old -------
  // return !auth.user?.role?.some(role => not_allowed_roles?.includes(role));


  // ------- now -------
  return !not_allowed_roles?.includes(auth.user?.active_role ?? "")

};

export default checkAllowedRole;