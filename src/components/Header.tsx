import React, {FC} from 'react';
import {
    Avatar,
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
// import imgAvatar from '@patternfly/react-core/src/components/Avatar/examples/avatarImg.svg';

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
                <Dropdown isFullHeight onSelect={onDropdownSelect} isOpen={isDropdownOpen} toggle={<DropdownToggle icon={<Avatar src={""} alt="Avatar" />} onToggle={onDropdownToggle}>
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
