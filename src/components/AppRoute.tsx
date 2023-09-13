/**
 Management Erratas
 Copyright (C) 2021-2023  BaseALT Ltd

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See theц
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React from "react";
import {AuthContext} from "../context/AuthProvide";
import Header from "./Header";
import {Route, Routes, Navigate, useNavigate, useLocation} from "react-router-dom";
import {Page} from "@patternfly/react-core";
import {privateRoutes, publicRoutes} from "../routes/routes";
import {observer} from "mobx-react";
import Sidebar from "./Sidebar";
import {IUser} from "../models/IUser";
import {AutoLogOut} from "./AutoLogOut";


const AppRouter: React.FunctionComponent = () => {
    const {auth} = React.useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const mainContainerId = "main-content";
    
    React.useEffect(() => {
        if (location.pathname !== "/login") {
            if (localStorage.getItem(`${process.env.REACT_APP_ACCESS_TOKEN_KEY}`)) {
                auth.checkAuth()
                navigate(location)
            } else {
                auth.setAuth(false)
                auth.setUser({} as IUser)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        auth.isAuth || auth.isLoading
            ?
            <AutoLogOut>
                <Page header={<Header />} sidebar={<Sidebar />} isManagedSidebar
                      mainContainerId={mainContainerId}>
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
            </AutoLogOut>
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

export default observer(AppRouter);
