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
import {TaskListElement} from "../models/TaskListResponse";
import {TFetch, useFetching} from "../hooks/useFetching";
import api from "../http/api";
import {routes} from "../routes/api-routes";
import {List, ListItem, MenuToggleElement, PaginationVariant} from "@patternfly/react-core/components";
import {
    Bullseye,
    EmptyState,
    EmptyStateIcon,
    EmptyStateVariant,
    FormGroup,
    FormHelperText,
    HelperText,
    HelperTextItem,
    Label,
    LabelGroup,
    MenuItem,
    PageSection,
    Pagination,
    SearchInput,
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
import DropdownMenuItems, {DropdownItem} from "../components/UI/DropdownMenuItems";
import {errataLabelColor, pageSizeOptions, smartSplit} from "../utils";
import {Link} from "react-router-dom";

interface NestedItemsProps {
    data: TaskListElement;
    columnKey: "vulnerabilities" | "subtasks";
}

function TaskList() {
    // list of tasks in DONE status.
    const [taskList, setTaskList] = React.useState<TaskListElement[]>([])
    // branches list for tasks
    const [branchList, setBranchList] = React.useState<string[]>([])
    // number of items per page
    const [pageSize, setPageSize] = React.useState<number>(50)
    // current page number
    const [page, setPage] = React.useState<number>(1)
    // total number of tasks
    const [totalCount, setTotalCount] = React.useState<number>(0);

    // filter by package set name
    const [filterBranch, setFilterBranch] = React.useState<string>('')
    // filter from search input
    const [filterSearch, setFilterSearch] = React.useState<string>('')

    const [validSearch, setValidSearch] = React.useState<string>('')
    const [validSearchText, setValidSearchText] = React.useState<string>('')

    const branchToggleRef = React.useRef<MenuToggleElement>(null);
    const branchMenuRef = React.useRef<MenuToggleElement>(null);
    const branchContainerRef = React.useRef<MenuToggleElement>(null);

    const columnNames = {
        task_id: "Task ID",
        branch: "Branch",
        owner: "Owner",
        packages: "Packages",
        errata_id: "Errata ID",
        vulnerabilities: "Vulnerabilities",
        changed: "Changed"
    };

    const selectFilters: DropdownItem[] = [
        {
            field: "branch",
            name: "Branch",
            filter: filterBranch,
            setFilter: setFilterBranch,
            toggleRef: branchToggleRef,
            menuRef: branchMenuRef,
            containerRef: branchContainerRef,
            cssStyle: {"width": "170px"},
            menuItems: [
                branchList.map((branch, indexBranch) => {
                    // exclude 'icarus' branch from list
                    if (branch !== "icarus") {
                        return (
                            <MenuItem key={branch} itemId={branch}>{branch}</MenuItem>
                        )
                    } else {
                        return undefined
                    }

                })
            ]
        },
    ]

    const tasks: TFetch = useFetching(async (
        pageSize: number,
        page: number,
        filterBranch: string,
        filterSearch: string
    ) => {
        const response = await api.get(routes.taskList, {
            params: {
                limit: pageSize,
                page: page,
                branch: filterBranch !== '' ? filterBranch : null,
                input: filterSearch !== '' ? smartSplit(filterSearch).join(',') : null
            },
            paramsSerializer: {
                indexes: null
            },
        });
        if (response.data.tasks) {
            setTaskList(response.data.tasks)
            setTotalCount(Number(response.headers['x-total-count']))
        } else {
            setTaskList([])
            setTotalCount(0)
        }
    });

    const branches: TFetch = useFetching(async () => {
        const response = await api.get(routes.allTasksBranches)
        if (response.data.branches) {
            setBranchList(response.data.branches)
        } else {
            setBranchList([])
        }
    })

    React.useEffect(() => {
        tasks.fetching(
            pageSize,
            page,
            filterBranch,
            filterSearch
        );

        branches.fetching();

    }, [page, pageSize, filterBranch, filterSearch])

    const clearAllFilters = () => {
        // clear all filters
        setFilterSearch('')
        setFilterBranch("")
    }

    const checkInput = (val: string) => {
        // validation search input
        const splitValue: string[] = smartSplit(val)
        if (splitValue.length > 4) {
            setValidSearch("error")
            setValidSearchText("Input values list should contain no more than 4 elements")
        } else if (splitValue.length === 0) {
            setValidSearch("success")
            setValidSearchText("")
        }
    }

    const onSearchInputChange = (newValue: string) => {
        // set the value in filterSearch when changing the text in the search field.
        checkInput(newValue)
        if (newValue !== "") {
            if (validSearch !== "error") {
                setFilterSearch(newValue)
            }
        } else {
            setFilterSearch('')
            checkInput('')
        }
    };

    const onNameInput = ({event, value}: { event: React.SyntheticEvent<HTMLButtonElement>, value: string }) => {
        // set value in filterSearch when searching.
        if ('key' in event && event.key !== 'Enter') {
            return;
        }
        if (value) {
            setFilterSearch(value)
        } else {
            setFilterSearch('')
        }
    };



    const NestedItems: React.FunctionComponent<NestedItemsProps> = ({data, columnKey}): React.ReactElement => {

        if (columnKey === "vulnerabilities") {
            return (
                <LabelGroup className={"pf-u-pt-sm pf-u-pb-sm"} numLabels={20} defaultIsOpen={false}>
                    {data[columnKey].map((vuln, vulnIndex) => {
                        if (filterSearch && smartSplit(filterSearch).some(word => vuln.id.toLowerCase().includes(word.toLowerCase()))) {
                            return (
                                <Label key={`${data.task_id}-${vuln.id}-${vulnIndex}`}
                                       color={"orange"}>{vuln.id}</Label>
                            )
                        } else {
                            return (
                                <Label key={`${data.task_id}-${vuln.id}-${vulnIndex}`}
                                       color={errataLabelColor(vuln.type)}>{vuln.id}</Label>
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
                            if (filterSearch && smartSplit(filterSearch).some(word => subtask.src_pkg_name.toLowerCase().includes(word.toLowerCase()))) {
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
                <Tr>
                    <Td colSpan={Object.keys(columnNames).length}>
                        <Loader/>
                    </Td>
                </Tr>
            )
        } else if (tasks.error) {
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
                taskList.map((task, rowIndex) => {
                    return (
                        <Tbody key={task.task_id}>
                            <Tr>
                                <Td component="th" dataLabel={columnNames.task_id}><Link to={`/tasks/${task.task_id}`}>{task.task_id}</Link></Td>
                                <Td component="th" dataLabel={columnNames.branch}>{task.branch}</Td>
                                <Td component="th" dataLabel={columnNames.branch}><Link target={"_blank"} to={`https://packages.altlinux.org/en/${task.branch}/maintainers/${task.owner}/`}>{task.owner}</Link></Td>
                                <Td component="th" dataLabel={columnNames.packages}><NestedItems data={task}
                                                                                                 columnKey={"subtasks"}/></Td>
                                <Td component="th"
                                    dataLabel={columnNames.errata_id}>{task.erratas ?
                                    <List isPlain>
                                        {task.erratas.map((errata, errataIndex) => {
                                            return (
                                                <ListItem><Link key={`${errata}-${errataIndex}`} to={'#'}>{errata}</Link></ListItem>
                                            )
                                        })}
                                    </List> : "-"}</Td>
                                <Td component="th" dataLabel={columnNames.vulnerabilities}>{
                                    task.vulnerabilities.length > 0 ?
                                        <NestedItems data={task} columnKey={"vulnerabilities"}/>
                                        :
                                        "-"
                                }</Td>
                                <Td dataLabel={columnNames.changed}>{Moment(task.changed).format('D MMMM YYYY, h:mm:ss a')}</Td>
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
                            <DropdownMenuItems items={selectFilters}/>
                        </ToolbarGroup>
                    </ToolbarToggleGroup>
                    <ToolbarFilter
                        key={"toolbar-search-tasks"}
                        chips={filterSearch !== '' ? [filterSearch] : []}
                        deleteChip={() => {
                            setFilterSearch('')
                        }}
                        categoryName="Search"
                        showToolbarItem={true}
                    >
                        <FormGroup>
                            <SearchInput
                                className={"toolbar-search-input"}
                                style={{"borderBottom": "var(--pf-v5-c-form-control--m-readonly--hover--after--BorderBottomColor)"} as React.CSSProperties}
                                aria-label="Find tasks by #task ID, @owner, Errata ID, bug:bug number"
                                placeholder="Find tasks by #task ID, @owner, Errata ID, bug:bug number"
                                onChange={(_event, value) => onSearchInputChange(value)}
                                value={filterSearch}
                                onClear={() => {
                                    onSearchInputChange('');
                                }}
                                onSearch={(event, value) => onNameInput({event, value})}
                                onClick={(event) => {
                                    checkInput((event.target as HTMLButtonElement).value)
                                }}
                            />
                            {validSearch === "error" && (
                                <FormHelperText>
                                    <HelperText>
                                        <HelperTextItem isDynamic variant="error">
                                            {validSearchText}
                                        </HelperTextItem>
                                    </HelperText>
                                </FormHelperText>
                            )}
                        </FormGroup>

                    </ToolbarFilter>
                    <ToolbarItem variant="pagination">
                        <Pagination
                            isCompact={true}
                            itemCount={totalCount}
                            widgetId={`${PaginationVariant.top}-example`}
                            usePageInsets={true}
                            page={page}
                            perPage={pageSize}
                            perPageOptions={pageSizeOptions}
                            onSetPage={(_evt, newPage) => setPage(newPage)}
                            onPerPageSelect={(_evt, newPageSize) => setPageSize(newPageSize)}
                            variant={PaginationVariant.top}
                            titles={{
                                paginationAriaLabel: `${PaginationVariant.top} pagination`
                            }}
                        />
                    </ToolbarItem>
                </ToolbarContent>
            </Toolbar>
            <Table variant={"compact"} isStickyHeader>
                <Thead>
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
                {renderRows()}
            </Table>
            <Pagination
                isCompact={false}
                itemCount={totalCount}
                widgetId={`${PaginationVariant.bottom}-example`}
                usePageInsets={true}
                page={page}
                perPage={pageSize}
                perPageOptions={pageSizeOptions}
                onSetPage={(_evt, newPage) => setPage(newPage)}
                onPerPageSelect={(_evt, newPageSize) => setPageSize(newPageSize)}
                variant={PaginationVariant.bottom}
                titles={{
                    paginationAriaLabel: `${PaginationVariant.bottom} pagination`
                }}
            />
        </PageSection>
    );
}

export default TaskList;