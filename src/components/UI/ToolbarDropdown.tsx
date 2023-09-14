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

import React from "react";
import {Menu, MenuContent, MenuItem, MenuList, MenuToggle, Popper, ToolbarFilter} from "@patternfly/react-core";
import FilterIcon from "@patternfly/react-icons/dist/esm/icons/filter-icon";
import {useQuery} from "../../hooks/useQuery";
import {useNavigate} from "react-router-dom";


export interface DropdownItem {
    /** Field name */
    field: string;
    /** Field name for human */
    name: string;
    /** Filter state */
    filter: any;
    /** Function for set filter */
    setFilter: (value: string) => void;
    /**
     * Allows getting a ref to the component instance.
     * Once the component unmounts, React will set `ref.current` to `null` (or call the ref with `null` if you passed a callback ref).
     * @see https://react.dev/learn/referencing-values-with-refs#refs-and-the-dom
     */
    toggleRef: any;
    menuRef: any;
    containerRef: any;
    /** CSS styles */
    cssStyle: React.CSSProperties,
    /** Menu items */
    menuItems: string[];
}

interface onToggleClickProps {
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.MouseEvent<HTMLDivElement, MouseEvent>;
    field: DropdownItem;
}

interface onSelectProps {
    itemId: string | number | undefined;
    field: DropdownItem;
}

export default function ToolbarDropdown({items}: {items: DropdownItem[]}): React.ReactElement {
    const query = useQuery();
    const navigate = useNavigate()
    const [isMenuOpen, setMenuOpen] = React.useState<{[key: string]: boolean}>({})

    const validateQueryParams = () => {
        items.forEach((item) => {
            if (query.get(item.field) !== null && !item.filter) {
                item.setFilter(query.get(item.field) as string)
            }
            if (item.menuItems.length > 0 && query.has(item.field)) {
                console.log("1")
                if (item.menuItems.includes(query.get(item.field) as string)) {
                    console.log("2")
                    item.setFilter(query.get(item.field) as string);
                } else {
                    console.log("3")
                    query.delete(item.field)
                    item.setFilter("")
                    navigate(`?${query}`)
                }
            } else if (!query.has(item.field) && item.filter) {
                item.setFilter("")
            }
        })
    }

    validateQueryParams();

    const onToggleClick = ({event, field}: onToggleClickProps) => {
        event.stopPropagation();
        setTimeout(() => {
            if (field.menuRef.current) {
                const firstElement = field.menuRef.current.querySelector('li > button:not(:disabled)');
                firstElement && firstElement.focus();
            }
        }, 0);
        setMenuOpen({...isMenuOpen, [field.field]: !isMenuOpen[field.field]});
    };

    const onSelect = ({itemId, field}: onSelectProps) => {
        if (typeof itemId === 'undefined') {
            return;
        }
        query.set(`${field.field}`, itemId.toString())
        navigate(`?${query}`)
        field.setFilter(itemId.toString())
        setMenuOpen({...isMenuOpen, [field.field]: !isMenuOpen[field.field]});
    }

    const toggle = (field: DropdownItem) => {
        return (
            <MenuToggle
                key={`menu-toggle-${field.field}`}
                style={field.cssStyle}
                ref={field.toggleRef}
                onClick={(event) => {onToggleClick({event, field})}}
                isExpanded={isMenuOpen[field.field] ? isMenuOpen[field.field] : false}
                icon={<FilterIcon />}
            >
                {field.name}
            </MenuToggle>
        )
    }


    const renderMenu = (field: DropdownItem) => {

        return (
            <Menu
                isScrollable
                ref={field.menuRef}
                id={`mixed-group-${field.field}-menu`}
                key={`mixed-group-${field.field}-menu`}
                onSelect={(event, itemId) => {onSelect({itemId, field})}}
                selected={field.filter}
            >
                <MenuContent>
                    <MenuList>
                        {field.menuItems.map((item) => {
                            return (
                                <MenuItem key={`filter-${item}`} itemId={item}>{item}</MenuItem>
                            )
                        })}
                    </MenuList>
                </MenuContent>
            </Menu>
        )
    }

    return (
        <React.Fragment>
            {items.map((field, fieldIndex) => {
                return (
                    <ToolbarFilter
                        key={`toolbar-filter-${fieldIndex}`}
                        chips={field.filter !== undefined && field.filter !== '' ? [field.filter] : []}
                        deleteChip={() => {
                            field.setFilter("")
                            query.delete(field.field)
                            navigate(`?${query}`);
                        }}
                        categoryName={field.name}
                    >
                        <div ref={field.containerRef}>
                            <Popper
                                trigger={toggle(field)}
                                popper={renderMenu(field)}
                                appendTo={field.containerRef.current || undefined}
                                isVisible={isMenuOpen[field.field] || false}
                            />
                        </div>
                    </ToolbarFilter>
                )
            })
            }
        </React.Fragment>
    )
}
