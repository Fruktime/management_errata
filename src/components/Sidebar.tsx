/**
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

import React from 'react';
import {Nav, NavList, PageSidebar, PageSidebarBody} from "@patternfly/react-core";
import {NavLink} from "react-router-dom";
import {siteRoutes} from "../routes/routes";


export default function Sidebar() {
    const setActive = ({isActive}: { isActive: boolean }): string => (isActive ? "pf-v5-c-nav__link pf-m-current" : "pf-v5-c-nav__link");

    const pageNav = <Nav aria-label="Side Nav">
        <NavList>
            <NavLink
                to={siteRoutes.home}
                id={"home-page_nav-link"}
                className={setActive}
                // tabIndex={isNavOpen ? undefined : -1}
            >
                Home page
            </NavLink>
            <NavLink
                to={siteRoutes.erratas}
                id={"erratas_nav-link"}
                className={setActive}
                // tabIndex={isNavOpen ? undefined : -1}
            >
                Erratas
            </NavLink>
            <NavLink
                to={siteRoutes.tasks}
                id={"tasks_nav-link"}
                className={setActive}
                // tabIndex={isNavOpen ? undefined : -1}
            >
                Tasks
            </NavLink>
        </NavList>
    </Nav>;

    return (
        <PageSidebar>
            <PageSidebarBody>{pageNav}</PageSidebarBody>
        </PageSidebar>
    );
};
