/*
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

import {ReactElement} from "react";
import LoginPageHideShowPassword from "../views/Login";
import Home from "../views/Home";
import ErrataList from "../views/ErrataList";
import TaskList from "../views/TaskList";


interface Routes {
    path: string;
    element: ReactElement;
}

export const privateRoutes = [
    {path: '/errata-list', element: <ErrataList />, exact: true},
    {path: '/tasks', element: <TaskList />, exact: true},
    {path: '/', element: <Home />},
]

export const publicRoutes: Routes[] = [
    { path: '/login', element: <LoginPageHideShowPassword />},
]
