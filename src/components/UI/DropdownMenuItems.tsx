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

import React from "react";
import {Menu, MenuContent, MenuList, MenuToggle, Popper, ToolbarFilter} from "@patternfly/react-core";
import FilterIcon from "@patternfly/react-icons/dist/esm/icons/filter-icon";


export interface DropdownItem {
        field: string,
        name: string,
        filter: any,
        setFilter: any,
        toggleRef: any,
        menuRef: any,
        containerRef: any,
        cssStyle: React.CSSProperties,
        menuItems: any
}

export default function DropdownMenuItems({items}: {items: DropdownItem[]}) {
    const [isMenuOpen, setMenuOpen] = React.useState<{[key: string]: boolean}>({})

    const onToggleClick = ({event, field}: {event: any, field: DropdownItem}) => {
        event.stopPropagation();
        setTimeout(() => {
            if (field.menuRef.current) {
                const firstElement = field.menuRef.current.querySelector('li > button:not(:disabled)');
                firstElement && firstElement.focus();
            }
        }, 0);
        setMenuOpen({...isMenuOpen, [field.field]: !isMenuOpen[field.field]});
    };

    function onSelect({itemId, field}: {itemId: string | number | undefined, field: DropdownItem}) {
        if (typeof itemId === 'undefined') {
            return;
        }
        field.setFilter(itemId.toString());
        setMenuOpen({...isMenuOpen, [field.field]: !isMenuOpen[field.field]});
    }

    const toggle = (field: DropdownItem) => {
        return (
            <MenuToggle style={field.cssStyle} ref={field.toggleRef} onClick={(event) => {
                onToggleClick({event, field})
            }} isExpanded={isMenuOpen[field.field] ? isMenuOpen[field.field] : false} icon={<FilterIcon />}>
                {field.name}
            </MenuToggle>
        )
    }


    const renderMenu = (field: DropdownItem) => {

        return (
            <Menu isScrollable ref={field.menuRef} id={`mixed-group-${field.field}-menu`} onSelect={(event, itemId) => {
                onSelect({itemId, field})
            }} selected={field.filter}>
                <MenuContent>
                    <MenuList>
                        {field.menuItems}
                    </MenuList>
                </MenuContent>
            </Menu>
        )
    }

    return (
        <React.Fragment>
            {items.map((field, fieldIndex) => {
                return (
                    <ToolbarFilter chips={field.filter !== '' ? [field.filter] : []}
                                   deleteChip={() => field.setFilter('')} categoryName={field.name}>
                        <div ref={field.containerRef}>
                            <Popper trigger={toggle(field)} popper={renderMenu(field)} appendTo={field.containerRef.current || undefined} isVisible={isMenuOpen[field.field] || false} />
                        </div>
                    </ToolbarFilter>
                )
            })
            }
        </React.Fragment>
    )
}