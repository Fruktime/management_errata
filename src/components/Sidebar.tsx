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
