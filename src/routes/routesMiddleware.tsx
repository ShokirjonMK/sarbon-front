import Layout from "components/Structure/layout";
import ExtraLayout from "components/Structure/layout/extraLayout";
import NoLayout from "components/Structure/layout/noLayout";
import Login from "pages/login";
import NotFound from "pages/notFound";
import React from "react";
import { ReactNode } from "react";
import { Route, Routes } from "react-router-dom";
import { prived_routes, public_routes } from "routes";
import { useAppSelector } from "store";
import checkAllowedRole from "utils/check_allowed_roles";
import checkOnlyForRoles from "utils/check_only_for_roles";
import checkPermission from "utils/check_permission";

const RoutesMiddleware = () => {

  const auth = useAppSelector(state => state.auth);  

  const createComponent = (Component: any): ReactNode => {
    return <Component />;
  }

  if (auth.isAuthenticated) {
    return (
      <Layout>
        <Routes>
          {
            prived_routes.length && prived_routes.map((element, index) => {
              if (element?.submenu?.length) {
                return element.submenu.map((childElement, childIndex) => {
                  if (childElement?.submenu?.length) {
                    return childElement?.submenu?.map((childSubElement, childSIndex) => {
                      if(childSubElement.config?.for_roles?.length){
                        if(checkOnlyForRoles(childSubElement.config?.for_roles)){
                          if(checkAllowedRole(childSubElement.config?.not_allowed_roles)){
                            return (
                              checkPermission(childSubElement.config.permission) || childSubElement.config.permission === "*" ?
                                <Route key={index + "_" + childSIndex} path={childSubElement?.path}
                                  element={
                                    childSubElement?.config?.isMenu ?
                                      <ExtraLayout
                                        menus={childElement?.submenu?.filter(e => e?.config?.isMenu)}
                                        title={childElement?.name}
                                        type={childElement.config?.extraMenuType}
                                      >{createComponent(childSubElement?.component)}
                                      </ExtraLayout> : createComponent(childSubElement?.component)
                                  }
                                />
                                : null
                            )
                          }
                        }
                      } else {
                        if(checkAllowedRole(childSubElement.config?.not_allowed_roles)){
                          return (
                            checkPermission(childSubElement.config.permission) || childSubElement.config.permission === "*" ?
                              <Route key={index + "_" + childSIndex} path={childSubElement?.path}
                                element={
                                  childSubElement?.config?.isMenu ?
                                    <ExtraLayout
                                      menus={childElement?.submenu?.filter(e => e?.config?.isMenu)}
                                      title={childElement?.name}
                                      type={childElement.config?.extraMenuType}
                                    >{createComponent(childSubElement?.component)}
                                    </ExtraLayout> : createComponent(childSubElement?.component)
                                }
                              />
                              : null
                          )
                        }
                      }
                    })
                  }
                  

                  if(childElement.config?.for_roles?.length){
                    if(checkOnlyForRoles(childElement.config?.for_roles)){
                      return (
                        checkPermission(childElement.config.permission) || childElement.config.permission === "*" ?
                          <Route key={index + "_" + childIndex} element={createComponent(childElement?.component)} path={childElement?.path} />
                          : null
                      )
                    }
                  } else {
                    if(checkAllowedRole(childElement.config?.not_allowed_roles)){
                      return (
                        checkPermission(childElement.config.permission) || childElement.config.permission === "*" ?
                          <Route key={index + "_" + childIndex} element={createComponent(childElement?.component)} path={childElement?.path} />
                          : null
                      )
                    }
                  }
                })
              } else {
                if(element.config?.for_roles?.length){
                  if(checkOnlyForRoles(element.config?.not_allowed_roles)){
                    return (
                      checkPermission(element.config.permission) || element.config.permission === "*" ?
                        <Route key={index} element={createComponent(element?.component)} path={element?.path} />
                        : null
                    )
                  }
                } else {
                  if(checkAllowedRole(element.config?.not_allowed_roles)){
                    return (
                      checkPermission(element.config.permission) || element.config.permission === "*" ?
                        <Route key={index} element={createComponent(element?.component)} path={element?.path} />
                        : null
                    )
                  }
                }

              }
            })
          }
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    )
  } else {
    return (
      <NoLayout>
        <Routes>
          {
            public_routes.length && public_routes.map((element, index) => {
              if (element?.submenu?.length) {
                return element.submenu.map((childElement, childIndex) => (
                  <Route key={childIndex} element={createComponent(childElement?.component)} path={childElement?.path} />
                )
                )
              } else {
                return (
                  <Route key={index} element={createComponent(element?.component)} path={element?.path} />
                )
              }
            })
          }
          <Route path="*" element={<Login />} />
          {/* <Route path="*" element={<Navigate to={!localStorage.getItem('access_token') ? '/' : window.location.pathname} replace />} /> */}
        </Routes>
      </NoLayout>
    )
  }
}

export default React.memo(RoutesMiddleware);