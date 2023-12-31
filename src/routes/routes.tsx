/*
Management Erratas
Copyright (C) 2021-2023  BaseALT Ltd

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import {ReactElement} from "react";
import LoginPageHideShowPassword from "../views/Login";
import Home from "../views/Home";
import ErrataList from "../views/ErrataList";
import TaskList from "../views/TaskList";
import TaskInfo from "../views/TaskInfo";
import ErrataChange from "../views/ErrataChange";
import NotFound from "../views/NotFound";


interface Routes {
    path: string;
    element: ReactElement;
}

export const siteRoutes = {
    erratas: "/erratas",
    errataInfo: "/erratas/:errataId/change",
    tasks: "/tasks",
    taskInfo: "/tasks/:taskId",
    home: "/",
    login: "/login"
}

export const privateRoutes: Routes[] = [
    {path: siteRoutes.erratas, element: <ErrataList />},
    {path: siteRoutes.tasks, element: <TaskList />},
    {path: siteRoutes.taskInfo, element: <TaskInfo />},
    {path: siteRoutes.errataInfo, element: <ErrataChange />},
    {path: siteRoutes.home, element: <Home />},
    {path: "*", element: <NotFound />},
]

export const publicRoutes: Routes[] = [
    { path: siteRoutes.login, element: <LoginPageHideShowPassword />},
]
