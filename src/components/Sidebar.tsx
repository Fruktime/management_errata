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

import React from 'react';
import {Nav, NavList, PageContextConsumer, PageSidebar} from "@patternfly/react-core";
import globalBreakpointXl from "@patternfly/react-tokens/dist/esm/global_breakpoint_xl";
import {NavLink} from "react-router-dom";

const NavItem = ({ text, href }: {text: string, href: string}) => {
    const isMobileView = window.innerWidth < Number.parseInt(globalBreakpointXl.value, 10);
    const setActive = ({ isActive }: {isActive: boolean}) => (isActive ? "pf-c-nav__link pf-m-current" : "pf-c-nav__link");

    return (
        <PageContextConsumer key={href + text}>
            {({onNavToggle, isNavOpen }) => (
                <li key={href + text} className="pf-c-nav__item" onClick={() => isMobileView && onNavToggle()}>
                    <NavLink
                        to={href}
                        className={setActive}
                        tabIndex={isNavOpen ? undefined : -1}
                    >
                        {text}
                    </NavLink>
                </li>
            )}
        </PageContextConsumer>
    )
};

export default function Sidebar() {
    const pageNav = <Nav aria-label="Side Nav">
        <NavList>
            <NavItem text={"Home page"} href={"/"} />
            <NavItem text={"Errata"} href={"/errata"} />
        </NavList>
    </Nav>;

    return (
        <PageSidebar nav={pageNav} id={"page-sidebar"}/>
    );
};
