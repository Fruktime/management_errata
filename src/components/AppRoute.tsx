import React from 'react';
import {AuthContext} from "../context/AuthProvide";
import Header from "./Header";
// import Sidebar from "./Sidebar";
import {Route, Routes, Navigate} from "react-router-dom";
import {Page, SkipToContent} from "@patternfly/react-core";
import {privateRoutes, publicRoutes} from "../routes/routes";
import {observer} from "mobx-react";
import Sidebar from "./Sidebar";
import {IUser} from "../models/IUser";


const AppRouter: React.FunctionComponent = () => {
    const {auth} = React.useContext(AuthContext);
    const mainContainerId = 'main-content';
    const pageSkipToContent = <SkipToContent href={`#${mainContainerId}`}>Skip to content</SkipToContent>;
    React.useEffect(() => {
        if (localStorage.getItem(`${process.env.REACT_APP_ACCESS_TOKEN_KEY}`)) {
            auth.checkAuth()
        } else {
            auth.setAuth(false)
            auth.setUser({} as IUser)
        }
    }, [])

    return (
        auth.isAuth
            ?
            <Page header={<Header />} sidebar={<Sidebar />} isManagedSidebar skipToContent={pageSkipToContent}
                  mainContainerId={mainContainerId} isBreadcrumbWidthLimited breadcrumbProps={{
                stickyOnBreakpoint: {
                    md: 'top'
                }
            }}>
                <Routes>
                    {privateRoutes.map(route =>
                        <Route key={route.path} path={route.path} element={route.element}/>
                    )}
                    <Route
                        path="/login"
                        element={<Navigate to="/" replace/>}
                    />
                </Routes>
            </Page>
            :
            <Routes>
                {publicRoutes.map(route =>
                    <Route key={route.path} path={route.path} element={route.element}/>
                )}
                <Route
                    path="*"
                    element={<Navigate to="/login" replace/>}
                />
            </Routes>
    )
};

export default observer(AppRouter)
