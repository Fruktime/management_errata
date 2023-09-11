/**
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
import Moment from 'moment';
import {
    Bullseye,
    EmptyState,
    EmptyStateIcon,
    EmptyStateVariant,
    Label,
    LabelGroup,
    PageSection,
    Title,
    Toolbar,
    ToolbarContent,
    ToolbarFilter,
    ToolbarGroup,
    ToolbarItem,
    ToolbarToggleGroup,
} from "@patternfly/react-core";
import {Table, Tbody, Td, Th, Thead, Tr} from "@patternfly/react-table";
import {FilterIcon, SearchIcon} from "@patternfly/react-icons";
import Loader from "../components/Loader";
import {MenuToggleElement, PaginationVariant} from "@patternfly/react-core/components";
import {ErrataListElement} from "../models/ErrataListResponse";
import ToolbarDropdown, {DropdownItem} from "../components/UI/ToolbarDropdown";
import {vulnLabelColor} from "../utils";
import {Link, useNavigate} from "react-router-dom";
import {Paginator} from "../components/Paginator";
import paginatorStore from "../stores/paginatorStore";
import {observer} from "mobx-react";
import {useQuery} from "../hooks/useQuery";
import errataListStore from "../stores/errataListStore";
import searchStore from "../stores/searchStore";
import {constants} from "../misc";
import {Search} from "../components/Search";

interface NestedItemsProps {
    data: ErrataListElement;
    columnKey: "vulnerabilities" | "packages"
}

function ErrataList() {
    const erratas = errataListStore;
    const query = useQuery();
    const navigate = useNavigate()

    const errataTypeToggleRef = React.useRef<MenuToggleElement>(null);
    const branchToggleRef = React.useRef<MenuToggleElement>(null);
    const errataTypeMenuRef = React.useRef<MenuToggleElement>(null);
    const branchMenuRef = React.useRef<MenuToggleElement>(null);
    const errataTypeContainerRef = React.useRef<MenuToggleElement>(null);
    const branchContainerRef = React.useRef<MenuToggleElement>(null);

    const columnNames = {
        errata: 'Errata ID',
        branch: 'Branch',
        task_id: 'Task ID',
        vulnerabilities: 'Vulnerabilities',
        packages: 'Affected packages',
        changed: 'Changed'
    };

    const selectFilters: DropdownItem[] = [
        {
            field: "branch",
            name: "Branch",
            filter: erratas.filterBranch,
            setFilter: function (value: string) {
                erratas.setFilterBranch(value)
            },
            toggleRef: branchToggleRef,
            menuRef: branchMenuRef,
            containerRef: branchContainerRef,
            cssStyle: {"width": "170px"},
            menuItems: erratas.branchList.filter(branch => branch !== "icarus")
        },
        {
            field: "eh_type",
            name: "Errata type",
            filter: erratas.filterType,
            setFilter: function (value: string) {
                erratas.setFilterType(value)
            },
            toggleRef: errataTypeToggleRef,
            menuRef: errataTypeMenuRef,
            containerRef: errataTypeContainerRef,
            cssStyle: {},
            menuItems: erratas.errataTypes
        },
    ]

    React.useEffect(() => {
        erratas.getErrataList(
            searchStore.value,
            paginatorStore.page,
            paginatorStore.pageSize
        ).then();
        if (erratas.branchList.length === 0) {
            erratas.getBranches().then();
        }
    }, [searchStore.value, paginatorStore.page, paginatorStore.pageSize, erratas.filterBranch, erratas.filterType])

    const clearAllFilters = () => {
        query.delete("branch")
        query.delete(constants.SEARCH_VAR)
        query.delete("eh_type")
        erratas.setFilterBranch("")
        erratas.setFilterType("")
        searchStore.setValue("")
        navigate(`?${query}`)
    }

    const NestedItems: React.FunctionComponent<NestedItemsProps> = ({data, columnKey}): React.ReactElement => {
        // return a LabelGroup with the names of affected packages or vulnerabilities errata
        if (columnKey === "vulnerabilities") {
            return (
                <LabelGroup className={"pf-u-pt-sm pf-u-pb-sm"} numLabels={20} defaultIsOpen={false}>
                    {data[columnKey].map((vuln, vulnIndex) => {
                            return (
                                <Label key={vuln.id} color={vulnLabelColor(vuln.type)}>{vuln.id}</Label>
                            )
                        }
                    )}
                </LabelGroup>
            );
        } else {
            return (
                <LabelGroup className={"pf-u-pt-sm pf-u-pb-sm"} numLabels={20} defaultIsOpen={false}>
                    {data[columnKey].map((pkg, pkgIndex) => {
                            return (
                                <Label
                                    key={pkg.pkghash}
                                    color={"green"}
                                    render={({className, content, componentRef}) => (
                                        <Link
                                            target="_blank"
                                            to={`https://packages.altlinux.org/en/${data.branch}/srpms/${pkg.pkg_name}/${pkg.pkghash}`}
                                            className={className}
                                        >{content}</Link>
                                    )}
                                >{pkg.pkg_name}</Label>
                            )
                        }
                    )}
                </LabelGroup>
            );
        }
    };

    const renderRows = () => {
        if (erratas.isLoading) {
            return (
                <Tr>
                    <Td colSpan={Object.keys(columnNames).length}>
                        <Loader/>
                    </Td>
                </Tr>
            )
        } else if (erratas.error) {
            return (
                <Tr>
                    <Td colSpan={Object.keys(columnNames).length}>
                        <Bullseye>
                            <EmptyState variant={EmptyStateVariant.sm}>
                                <EmptyStateIcon icon={SearchIcon}/>
                                <Title headingLevel="h2" size="lg">
                                    No results found
                                </Title>
                            </EmptyState>
                        </Bullseye>
                    </Td>
                </Tr>
            )
        } else {
            return (
                erratas.errataList.map((errata, rowIndex) => {
                    return (
                        <Tbody key={errata.errata_id}>
                            <Tr>
                                <Td component="th" dataLabel={columnNames.errata}><Link
                                    to={`/errata/${errata.errata_id}/change`}>{errata.errata_id}</Link></Td>
                                <Td component="th" dataLabel={columnNames.branch}>{errata.branch}</Td>
                                <Td component="th" dataLabel={columnNames.task_id}>{
                                    errata.task_id ?
                                        <Link to={`/tasks/${errata.task_id}`}>{errata.task_id}</Link> :
                                        '-'
                                }</Td>
                                <Td component="th" dataLabel={columnNames.vulnerabilities}><NestedItems data={errata}
                                                                                                        columnKey={"vulnerabilities"}/></Td>
                                <Td component="th" dataLabel={columnNames.packages}><NestedItems data={errata}
                                                                                                 columnKey={"packages"}/></Td>
                                <Td dataLabel={columnNames.changed}>{Moment(errata.changed).format('D MMMM YYYY, h:mm:ss a')}</Td>
                            </Tr>
                        </Tbody>
                    )
                })
            )
        }
    }

    return (
        <PageSection>
            <Toolbar id="filters-toolbar" clearAllFilters={clearAllFilters}>
                <ToolbarContent>
                    <ToolbarToggleGroup toggleIcon={<FilterIcon/>} breakpoint="xl">
                        <ToolbarGroup variant="filter-group">
                            <ToolbarDropdown items={selectFilters}/>
                        </ToolbarGroup>
                    </ToolbarToggleGroup>
                    <ToolbarFilter
                        key={"toolbar-search-errata"}
                        chips={searchStore.value !== "" ? [searchStore.value] : []}
                        deleteChip={() => {
                            searchStore.setValue("")
                            query.delete(constants.SEARCH_VAR)
                            navigate(`?${query}`);
                        }}
                        categoryName="Search"
                        showToolbarItem={true}
                    >
                        <Search
                            ariaLabel={"Find errata by Errata ID, vulnerability ID or package name"}
                            placeholder={"Find errata by Errata ID, vulnerability ID or package name"}
                        />

                    </ToolbarFilter>
                    <ToolbarItem variant="pagination">
                        <Paginator
                            isCompact={true}
                            totalCount={erratas.totalCount}
                            variant={PaginationVariant.top}
                        />
                    </ToolbarItem>
                </ToolbarContent>
            </Toolbar>
            <Table variant={"compact"} isStickyHeader>
                <Thead>
                    <Tr>
                        <Th width={15}>{columnNames.errata}</Th>
                        <Th>{columnNames.branch}</Th>
                        <Th>{columnNames.task_id}</Th>
                        <Th>{columnNames.vulnerabilities}</Th>
                        <Th>{columnNames.packages}</Th>
                        <Th width={15}>{columnNames.changed}</Th>
                    </Tr>
                </Thead>
                {renderRows()}
            </Table>
            <Paginator
                isCompact={false}
                totalCount={erratas.totalCount}
                variant={PaginationVariant.bottom}
            />
        </PageSection>
    )
}

export default observer(ErrataList);
