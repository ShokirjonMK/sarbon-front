/** @format */

import { changeSidebar } from "store/ui";
import store from "../store/index";

const resizeScreen = (width: number) => {
  if (width > 1024) {
    store.dispatch(changeSidebar("large"));
  }
  if (width < 1024 && width > 768) {
    store.dispatch(changeSidebar("small"));
  }
  if (width < 768) {
    store.dispatch(changeSidebar("none"));
  }
};

export default resizeScreen;
