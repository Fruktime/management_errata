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


interface Routes {
    path: string;
    element: ReactElement;
}

export const privateRoutes: Routes[] = [
    {path: '/errata-list', element: <ErrataList />},
    {path: '/tasks', element: <TaskList />},
    {path: '/tasks/:taskId', element: <TaskInfo />},
    {path: '/errata/:errataId/change', element: <ErrataChange />},
    {path: '/', element: <Home />},
]

export const publicRoutes: Routes[] = [
    { path: '/login', element: <LoginPageHideShowPassword />},
]
