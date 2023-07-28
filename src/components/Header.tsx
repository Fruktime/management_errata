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
    DropdownGroup,
    DropdownItem,
    DropdownToggle,
    KebabToggle,
    Masthead,
    MastheadContent,
    MastheadMain,
    MastheadToggle,
    PageToggleButton,
    Text,
    Toolbar,
    ToolbarContent,
    ToolbarGroup,
    ToolbarItem
} from "@patternfly/react-core";
import BarsIcon from "@patternfly/react-icons/dist/esm/icons/bars-icon";
import {AuthContext} from "../context/AuthProvide";
import {observer} from "mobx-react";

const Header: FC = () => {
    const {auth} = React.useContext(AuthContext);
    const [isDropdownOpen, setIsDropdownOpen] = React.useState<boolean>(false);
    const [isKebabDropdownOpen, setIsKebabDropdownOpen] = React.useState<boolean>(false);
    const [isFullKebabDropdownOpen, setIsFullKebabDropdownOpen] = React.useState<boolean>(false);

    const onDropdownToggle = (isOpen: boolean) => {
        setIsDropdownOpen(isOpen);
    };
    const onDropdownSelect = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    const onKebabDropdownToggle = (isOpen: boolean) => {
        setIsKebabDropdownOpen(isOpen);
    };
    const onKebabDropdownSelect = () => {
        setIsKebabDropdownOpen(!isKebabDropdownOpen);
    };
    const onFullKebabDropdownToggle = (isOpen: boolean) => {
        setIsFullKebabDropdownOpen(isOpen);
    };
    const onFullKebabDropdownSelect = () => {
        setIsFullKebabDropdownOpen(!isFullKebabDropdownOpen);
    };


    const fullKebabDropdownItems = [
        <DropdownGroup key="group 2">
            <DropdownItem key="group 2 username">{auth.user.nickname}</DropdownItem>
            <DropdownItem key="group 2 logout">Logout</DropdownItem>
        </DropdownGroup>,
    ];

    const userDropdownItems = [
        <DropdownGroup key="group 2">
            <DropdownItem key="group 2 logout" onClick={() => auth.logout()}>Logout</DropdownItem>
        </DropdownGroup>
    ];

    const headerToolbar = <Toolbar id="toolbar" isFullHeight isStatic>
        <ToolbarContent>
            <ToolbarGroup variant="icon-button-group" alignment={{
                default: 'alignRight'
            }} spacer={{
                default: 'spacerNone',
                md: 'spacerMd'
            }}>

                <ToolbarItem visibility={{
                    default: 'hidden',
                    md: 'visible',
                    lg: 'hidden'
                }}>
                    <Dropdown isPlain position="right" onSelect={onKebabDropdownSelect} toggle={<KebabToggle onToggle={onKebabDropdownToggle} />} isOpen={isKebabDropdownOpen} />
                </ToolbarItem>
                <ToolbarItem visibility={{
                    md: 'hidden'
                }}>
                    <Dropdown isPlain position="right" onSelect={onFullKebabDropdownSelect} toggle={<KebabToggle onToggle={onFullKebabDropdownToggle} />} isOpen={isFullKebabDropdownOpen} dropdownItems={fullKebabDropdownItems} />
                </ToolbarItem>
            </ToolbarGroup>
            <ToolbarItem visibility={{
                default: 'hidden',
                md: 'visible'
            }}>
                <Dropdown isFullHeight onSelect={onDropdownSelect} isOpen={isDropdownOpen} toggle={<DropdownToggle onToggle={onDropdownToggle}>
                    {auth.user.nickname}
                </DropdownToggle>} dropdownItems={userDropdownItems} />
            </ToolbarItem>
        </ToolbarContent>
    </Toolbar>;

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
