import verification from "config/_axios/verification";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RoutesMiddleware from "routes/routesMiddleware";
import { useAppDispatch, useAppSelector } from "store";
import { changeSidebar, changeTheme } from "store/ui";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { I18nextProvider } from "react-i18next";
import i18n from "config/i18n";
import { ConfigProvider } from "antd";
import { antdCustomTheme } from "config/constants/theme";
import useWindowSize from "hooks/useWindowSize";
import resizeScreen from "utils/resize_screen";
import MainLoader from "pages/login/loader";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
      retry: false, // default: 3
    },
  },
});

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(state => state.auth);
  const theme = useAppSelector(state => state.ui.theme) as "blue" | "dark" | "light";
  const sidebar = useAppSelector(state => state.ui.sidebar) as "large" | "small" | "none";
  const size = useWindowSize();

  useEffect(() => {
    resizeScreen(size.width)
  }, [size.width]);

  useEffect(() => {

    window.addEventListener('beforeunload', () => {
      if (localStorage.getItem("access_token")) {
        sessionStorage.setItem("page_loading", '_loading_');
      } else {
        sessionStorage.removeItem("page_loading")
      }
    });
    return () => window.removeEventListener('beforeunload', () => sessionStorage.removeItem("page_loading"));
  }, [])

  useEffect(() => {
    if (document.readyState === "complete") {
      verification();
    } else {
      window.addEventListener("load", () => {
        verification();
      });

      return () => window.removeEventListener('load', () => {
        verification()
       });
    }
  }, [])


  useEffect(() => {
    const theme_from_store = localStorage.getItem("theme");
    const sidebar_from_store = sessionStorage.getItem("sidebar");
    if (theme_from_store) {
      dispatch(changeTheme(theme_from_store))
    }
    if (sidebar_from_store) {
      dispatch(changeSidebar(sidebar_from_store))
    }
  }, [])

  if (auth.isLoading || (sessionStorage.getItem('page_loading') === '_loading_')) {
    // return <Loading />
    return <MainLoader />
  };


  return (
    <div data-theme={theme} data-sidebar={sidebar} >
      <ConfigProvider
        theme={antdCustomTheme(theme)}
      >
        <I18nextProvider i18n={i18n}>
          <QueryClientProvider client={queryClient} >
            <RoutesMiddleware />
            <ReactQueryDevtools />
          </QueryClientProvider>
        </I18nextProvider>
      </ConfigProvider>
    </div>
  );
}

export default App;
