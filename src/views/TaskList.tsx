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

import React from "react";
import {TaskListElement} from "../models/TaskListResponse";
import {List, ListItem, MenuToggleElement, PaginationVariant} from "@patternfly/react-core/components";
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
    ToolbarToggleGroup
} from "@patternfly/react-core";
import {Table, Tbody, Td, Th, Thead, Tr} from "@patternfly/react-table";
import Loader from "../components/Loader";
import {FilterIcon, SearchIcon} from "@patternfly/react-icons";
import Moment from "moment/moment";
import ToolbarDropdown, {DropdownItem} from "../components/UI/ToolbarDropdown";
import {vulnLabelColor, smartSplit} from "../utils";
import {Link, useNavigate} from "react-router-dom";
import {Paginator} from "../components/Paginator";
import paginatorStore from "../stores/paginatorStore";
import {observer} from "mobx-react";
import taskListStore from "../stores/taskListStore";
import {Search} from "../components/Search";
import searchStore from "../stores/searchStore";
import {constants} from "../misc";
import {useQuery} from "../hooks/useQuery";

interface NestedItemsProps {
    data: TaskListElement;
    columnKey: "vulnerabilities" | "subtasks";
}

/** Column names in the table. */
const columnNames = {
    task_id: "Task ID",
    branch: "Branch",
    owner: "Owner",
    packages: "Packages",
    errata_id: "Errata ID",
    vulnerabilities: "Vulnerabilities",
    changed: "Changed"
};

const TaskList: React.FunctionComponent = (): React.ReactElement => {
    const tasks = taskListStore;
    const query = useQuery();
    const navigate = useNavigate()

    const branchToggleRef = React.useRef<MenuToggleElement>(null);
    const branchMenuRef = React.useRef<MenuToggleElement>(null);
    const branchContainerRef = React.useRef<MenuToggleElement>(null);

    /**
     * Dropdown filters
     */
    const selectFilters: DropdownItem[] = [
        {
            field: "branch",
            name: "Branch",
            filter: tasks.filterBranch,
            setFilter: function (value) {
                tasks.setFilterBranch(value)
            },
            toggleRef: branchToggleRef,
            menuRef: branchMenuRef,
            containerRef: branchContainerRef,
            cssStyle: {"width": "170px"},
            menuItems: tasks.branchList.filter(branch => branch !== "icarus")
        },
    ]

    React.useEffect(() => {
        tasks.getTaskList(
            searchStore.value,
            paginatorStore.page,
            paginatorStore.pageSize
        ).then();
        if (tasks.branchList.length === 0) {
            tasks.getBranches().then();
        }
    }, [searchStore.value, paginatorStore.page, paginatorStore.pageSize, tasks.filterBranch])

    /** Clear ol filter. */
    const clearAllFilters = () => {
        query.delete("branch")
        query.delete(constants.SEARCH_VAR)
        tasks.setFilterBranch("")
        searchStore.setValue("")
        navigate(`?${query}`)
    }

    const NestedItems: React.FunctionComponent<NestedItemsProps> = ({data, columnKey}): React.ReactElement => {

        if (columnKey === "vulnerabilities") {
            return (
                <LabelGroup className={"pf-u-pt-sm pf-u-pb-sm"} numLabels={20} defaultIsOpen={false}>
                    {data[columnKey].map((vuln, vulnIndex) => {
                        if (searchStore.value && smartSplit(searchStore.value).some(word => vuln.id.toLowerCase().includes(word.toLowerCase()))) {
                            return (
                                <Label key={`${data.task_id}-${vuln.id}-${vulnIndex}`}
                                       color={"orange"}>{vuln.id}</Label>
                            )
                        } else {
                            return (
                                <Label key={`${data.task_id}-${vuln.id}-${vulnIndex}`}
                                       color={vulnLabelColor(vuln.type)}>{vuln.id}</Label>
                            )
                        }
                        }
                    )}
                </LabelGroup>
            );
        } else {
            return (
                <LabelGroup className={"pf-u-pt-sm pf-u-pb-sm"} numLabels={20} defaultIsOpen={false}>
                    {data[columnKey].map((subtask, subIndex) => {
                            if (searchStore.value && smartSplit(searchStore.value).some(word => subtask.src_pkg_name.toLowerCase().includes(word.toLowerCase()))) {
                                return (
                                    <Label
                                        key={`${data.task_id}-${subtask.subtask_id}-${subIndex}`}
                                        color={"orange"}
                                        render={({className, content, componentRef}) => (
                                            <Link
                                                target="_blank"
                                                to={`https://packages.altlinux.org/en/${data.branch}/srpms/${subtask.src_pkg_name}/${subtask.src_pkg_hash}`}
                                                className={className}
                                            >{content}</Link>
                                        )}
                                    >{subtask.src_pkg_name}</Label>
                                )
                            }
                            return (
                                <Label
                                    key={`${data.task_id}-${subtask.subtask_id}-${subIndex}`}
                                    color={"green"}
                                    render={({className, content, componentRef}) => (
                                        <Link
                                            target="_blank"
                                            to={`https://packages.altlinux.org/en/${data.branch}/srpms/${subtask.src_pkg_name}/${subtask.src_pkg_hash}`}
                                            className={className}
                                        >{content}</Link>
                                    )}
                                >{subtask.src_pkg_name}</Label>
                            )
                        }
                    )}
                </LabelGroup>
            );
        }
    };

    const renderRows = () => {
        if (tasks.isLoading) {
            return (
                <Tr key={"row-loader"}>
                    <Td colSpan={Object.keys(columnNames).length}>
                        <Loader/>
                    </Td>
                </Tr>
            )
        } else if (tasks.error) {
            return (
                <Tr key={"row-no-result-found"}>
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
                tasks.taskList.map((task, rowIndex) => {
                    return (
                        <Tr key={task.task_id}>
                            <Td component="th" dataLabel={columnNames.task_id}>
                                <Link to={`/tasks/${task.task_id}`}>{task.task_id}</Link>
                            </Td>
                            <Td component="th" dataLabel={columnNames.branch}>{task.branch}</Td>
                            <Td component="th" dataLabel={columnNames.branch}>
                                <Link
                                    target={"_blank"}
                                    to={`https://packages.altlinux.org/en/${task.branch}/maintainers/${task.owner}/`}
                                >
                                    {task.owner}
                                </Link>
                            </Td>
                            <Td component="th" dataLabel={columnNames.packages}>
                                <NestedItems data={task} columnKey={"subtasks"}/>
                            </Td>
                            <Td component="th"
                                dataLabel={columnNames.errata_id}>{task.erratas ?
                                <List isPlain>
                                    {task.erratas.map((errata, errataIndex) => {
                                        return (
                                            <ListItem key={`${errata}-${errataIndex}`}>
                                                <Link to={`/erratas/${errata}/change`}>{errata}</Link>
                                            </ListItem>
                                        )
                                    })}
                                </List> : "-"}</Td>
                            <Td component="th" dataLabel={columnNames.vulnerabilities}>{
                                task.vulnerabilities.length > 0 ?
                                    <NestedItems data={task} columnKey={"vulnerabilities"}/>
                                    :
                                    "-"
                            }</Td>
                            <Td dataLabel={columnNames.changed}>
                                {Moment(task.changed).format('D MMMM YYYY, h:mm:ss a')}
                            </Td>
                        </Tr>
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
                        key={"toolbar-search-tasks"}
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
                            ariaLabel={"Find tasks by #task ID, @owner, Errata ID, bug:bug number"}
                            placeholder={"Find tasks by #task ID, @owner, Errata ID, bug:bug number"}
                        />

                    </ToolbarFilter>
                    <ToolbarItem variant="pagination">
                        <Paginator
                            isCompact={true}
                            totalCount={tasks.totalCount}
                            variant={PaginationVariant.top}
                        />
                    </ToolbarItem>
                </ToolbarContent>
            </Toolbar>
            <Table variant={"compact"} isStickyHeader>
                <Thead key={"table-head-tasks"}>
                    <Tr>
                        <Th>{columnNames.task_id}</Th>
                        <Th>{columnNames.branch}</Th>
                        <Th>{columnNames.owner}</Th>
                        <Th width={30}>{columnNames.packages}</Th>
                        <Th width={15}>{columnNames.errata_id}</Th>
                        <Th width={25}>{columnNames.vulnerabilities}</Th>
                        <Th width={15}>{columnNames.changed}</Th>
                    </Tr>
                </Thead>
                <Tbody key={"table-body-tasks"}>
                    {renderRows()}
                </Tbody>
            </Table>
            <Paginator
                isCompact={false}
                totalCount={tasks.totalCount}
                variant={PaginationVariant.bottom}
            />
        </PageSection>
    );
}

export default observer(TaskList);