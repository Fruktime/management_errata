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

import React, {FC} from 'react';
import {
    Dropdown,
    DropdownItem,
    DropdownList,
    Masthead,
    MastheadContent,
    MastheadMain,
    MastheadToggle, MenuToggle,
    PageToggleButton,
    Text,
    Toolbar,
    ToolbarContent, ToolbarGroup,
    ToolbarItem
} from "@patternfly/react-core";
import BarsIcon from "@patternfly/react-icons/dist/esm/icons/bars-icon";
import {AuthContext} from "../context/AuthProvide";
import {observer} from "mobx-react";
import {MenuToggleElement} from "@patternfly/react-core/components";
import {EllipsisVIcon} from "@patternfly/react-icons";

const Header: FC = () => {
    const {auth} = React.useContext(AuthContext);
    const [isDropdownOpen, setIsDropdownOpen] = React.useState<boolean>(false);
    const [isFullKebabDropdownOpen, setIsFullKebabDropdownOpen] = React.useState<boolean>(false);

    const onDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    const onDropdownSelect = () => {
        setIsDropdownOpen(false);
    };

    const onFullKebabDropdownToggle = () => {
        setIsFullKebabDropdownOpen(!isFullKebabDropdownOpen);
    };
    const onFullKebabDropdownSelect = () => {
        setIsFullKebabDropdownOpen(!isFullKebabDropdownOpen);
    };

    const userDropdownItems = (
        <>
            <DropdownItem key="logout button" onClick={() => auth.logout()}>Logout</DropdownItem>
        </>
    );

    const fullKebabDropdownItems = (
        <>
            <DropdownItem key="username button">User: {auth.user.nickname}</DropdownItem>
            <DropdownItem key="logout button" onClick={() => auth.logout()}>Logout</DropdownItem>
        </>
    );

    const headerToolbar = (
        <Toolbar id="toolbar" isFullHeight isStatic>
            <ToolbarContent>
                <ToolbarGroup
                    variant="icon-button-group"
                    align={{ default: 'alignRight' }}
                    spacer={{ default: 'spacerNone', md: 'spacerMd' }}
                >
                    <ToolbarGroup variant="icon-button-group" align={{
                        default: 'alignRight'
                    }} spacer={{
                        default: 'spacerNone',
                        md: 'spacerMd'
                    }}>

                        <ToolbarItem visibility={{ md: 'hidden' }}>
                            <Dropdown
                                isOpen={isFullKebabDropdownOpen}
                                onSelect={onFullKebabDropdownSelect}
                                onOpenChange={(isOpen: boolean) => setIsFullKebabDropdownOpen(isOpen)}
                                popperProps={{ position: 'right' }}
                                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                    <MenuToggle
                                        ref={toggleRef}
                                        onClick={onFullKebabDropdownToggle}
                                        isExpanded={isFullKebabDropdownOpen}
                                        variant="plain"
                                        aria-label="Toolbar menu"
                                    >
                                        <EllipsisVIcon aria-hidden="true" />
                                    </MenuToggle>
                                )}
                            >
                                <DropdownList>{fullKebabDropdownItems}</DropdownList>
                            </Dropdown>
                        </ToolbarItem>
                    </ToolbarGroup>
                    <ToolbarItem visibility={{
                        default: 'hidden',
                        md: 'visible'
                    }}>
                        <Dropdown
                            onSelect={onDropdownSelect}
                            isOpen={isDropdownOpen}
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                <MenuToggle
                                    ref={toggleRef}
                                    onClick={onDropdownToggle}
                                    isFullHeight
                                    isExpanded={isDropdownOpen}
                                    >
                                    {auth.user.nickname}
                                </MenuToggle>)}>
                                <DropdownList>{userDropdownItems}</DropdownList>
                        </Dropdown>
                    </ToolbarItem>
                </ToolbarGroup>
            </ToolbarContent>
        </Toolbar>
    );

    return (
        <Masthead>
            <MastheadToggle>
                <PageToggleButton variant="plain" aria-label="Global navigation">
                    <BarsIcon />
                </PageToggleButton>
            </MastheadToggle>
            <MastheadMain>
                <Text>
                    Management CVE
                </Text>
            </MastheadMain>
            <MastheadContent>{headerToolbar}</MastheadContent>
        </Masthead>
    );
};

export default observer(Header)
