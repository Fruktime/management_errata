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

interface IApiRoutes {
    logIn: string;
    logOut: string;
    refreshToken: string;
    errataBranches: string;
    errataList: string;
    taskList: string;
    taskInfo: string;
    allTasksBranches: string;
    errataPackagesUpdates: string;
    errataBranchesUpdates: string;
    vulns: string;
}

export const routes: IApiRoutes = {
    logIn: "/auth/login",
    logOut: "/auth/logout",
    refreshToken: "/auth/refresh-token",
    errataBranches: "/errata/errata_branches",
    errataList: "/errata/find_erratas",
    taskList: "/management/task_list",
    taskInfo: "/management/task_info",
    allTasksBranches: "/task/progress/all_tasks_branches",
    errataPackagesUpdates: "/errata/packages_updates",
    errataBranchesUpdates: "/errata/branches_updates",
    vulns: "/management/vulns",
}