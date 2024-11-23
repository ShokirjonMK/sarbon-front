import { createSlice } from "@reduxjs/toolkit";

export interface IUi {theme: "flat" | "dark" | "light" | "blue", sidebar: "large" | "small" | "none", language: string, pageTitle: string, breadcrumb: Array<{name: string, path: string}>};

const defaultInitialState: IUi = {
  theme: "light", 
  sidebar: "large", 
  language: "uz",
  pageTitle: "General",
  breadcrumb: [{name: "Dashboard", path: "/"}]
};

const Ui = createSlice({
  name: "ui",
  initialState: defaultInitialState,
  reducers: {
    changeTheme: (state, { payload }) => {
      localStorage.setItem('theme', payload);
      state.theme = payload
    },
    changeSidebar: (state, { payload }) => {
      sessionStorage.setItem("sidebar", payload)
      state.sidebar = payload
    },
    changeLocaleLanguage: (state, { payload }) => {
      sessionStorage.setItem("i18lang", payload)
      state.language = payload
    },
    changePage: (state, {payload}) => {
      state.pageTitle = payload.pageTitle;
      state.breadcrumb = payload.breadcrumb;
    }
  }
});


export const {changeTheme, changeSidebar, changeLocaleLanguage, changePage} = Ui.actions;
export default Ui.reducer;