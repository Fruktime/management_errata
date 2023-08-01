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
import Moment from 'moment';
import {
    Bullseye,
    Button,
    EmptyState,
    EmptyStateIcon,
    EmptyStateVariant,
    FormHelperText,
    HelperText,
    HelperTextItem,
    Label,
    LabelGroup,
    MenuItem,
    Modal,
    ModalVariant,
    OverflowMenu,
    OverflowMenuGroup,
    OverflowMenuItem,
    PageSection,
    Pagination,
    SearchInput,
    Title,
    Toolbar,
    ToolbarContent,
    ToolbarFilter,
    ToolbarGroup,
    ToolbarItem,
    ToolbarToggleGroup,
} from "@patternfly/react-core";
import {Table, Tbody, Td, Th, Thead, Tr} from "@patternfly/react-table";
import {TFetch, useFetching} from "../hooks/useFetching";
import {FilterIcon, SearchIcon} from "@patternfly/react-icons";
import Loader from "../components/Loader";
import {MenuToggleElement, PaginationVariant} from "@patternfly/react-core/components";
import {ErrataListElement} from "../models/ErrataListResponse";
import {IPageSizeOptions} from "../models/IPageSizeOptions";
import api from "../http/api";
import DropdownMenuItems, {DropdownItem} from "../components/UI/DropdownMenuItems";
import {routes} from "../routes/api-routes";

function ErrataList() {
    const [errataList, setErrata] = React.useState<ErrataListElement[]>([])
    const [pageSize, setPageSize] = React.useState<number>(50)
    const [page, setPage] = React.useState<number>(1)
    const [totalCount, setTotalCount] = React.useState<number>(0);

    const [filterErrataType, setFilterErrataType] = React.useState<string>('');
    const [filterSearch, setFilterSearch] = React.useState<string[]>([])
    const [validSearch, setValidSearch] = React.useState<string>('')
    const [validSearchText, setValidSearchText] = React.useState<string>('')
    const [filterBranch, setFilterBranch] = React.useState<string>('')
    const [branchList, setBranchList] = React.useState<Array<string>[]>([])
    const [isNewErrataModal, setNewErrataModal] = React.useState<boolean>(false)
    const [isNewErrata, setNewErrata] = React.useState<boolean>(false)

    const errataTypeToggleRef = React.useRef<MenuToggleElement>(null);
    const branchToggleRef = React.useRef<MenuToggleElement>(null);
    const errataTypeMenuRef = React.useRef<MenuToggleElement>(null);
    const branchMenuRef = React.useRef<MenuToggleElement>(null);
    const errataTypeContainerRef = React.useRef<MenuToggleElement>(null);
    const branchContainerRef = React.useRef<MenuToggleElement>(null);

    const pageSizeOptions: IPageSizeOptions[] = [
        {title: "50", value: 50},
        {title: "100", value: 100},
        {title: "200", value: 200},
    ]

    const columnNames = {
        errata: 'Errata ID',
        branch: 'Branch',
        vulnerabilities: 'Vulnerabilities',
        packages: 'Affected packages',
        changed: 'Changed'
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
                    return (
                        <MenuItem itemId={branch}>{branch}</MenuItem>
                    )
                })
            ]
        },
        {
            field: "eh_type",
            name: "Errata type",
            filter: filterErrataType,
            setFilter: setFilterErrataType,
            toggleRef: errataTypeToggleRef,
            menuRef: errataTypeMenuRef,
            containerRef: errataTypeContainerRef,
            cssStyle: {},
            menuItems: [
                <MenuItem itemId="task">Task</MenuItem>,
                <MenuItem itemId="branch">Branch</MenuItem>,
                <MenuItem itemId="bulletin">Bulletin</MenuItem>,
            ]
        },
    ]

    const errata: TFetch  = useFetching(async (
        pageSize,
        page,
        filterBranch,
        filterType,
        filterSearch
    ) => {
        const response = await api.get(routes.errataList, {
            params: {
                limit: pageSize,
                page: page,
                branch: filterBranch  !== '' ? filterBranch : null,
                type: filterType !== '' ? filterType : null,
                input: filterSearch
            },
            paramsSerializer: {
                indexes: null
            },
        });
        if (response.data.erratas) {
            setErrata(response.data.erratas)
            setTotalCount(Number(response.headers['x-total-count']))
        } else {
            setErrata([])
            setTotalCount(0)
        }
    })

    const branches: TFetch = useFetching( async () => {
        const response = await api.get(routes.errataBranches)
        if (response.data.branches) {
            setBranchList(response.data.branches)
        } else {
            setBranchList([])
        }
    })

    React.useEffect(() => {
        errata.fetching(
            pageSize,
            page,
            filterBranch,
            filterErrataType,
            filterSearch
        );
        branches.fetching();
    }, [page, pageSize, filterSearch, filterBranch, filterErrataType])

    const clearAllFilters = () => {
        // clear all filters
        setFilterSearch([])
        setFilterBranch('')
        setFilterErrataType('')
    }

    const checkInput = (val: string) => {
        // validation search input
        if (val === "" || val === undefined) {
            setValidSearch("default")
            setValidSearchText("")
        } else if (val.length < 2) {
            setValidSearch("error")
            setValidSearchText("The input should not be shorter than 2 characters")
        } else if ((/^([\w.+\-_:]{2,},?)+$/).test(val)) {
            setValidSearch("success")
            setValidSearchText("")
        } else {
            setValidSearch("error")
            setValidSearchText("The input must match: [a-zA-Z0-9-._:+]")
        }
    }

    const onSearchInputChange = (newValue: string) => {
        // set the value in filterSearch when changing the text in the search field.
        if (newValue !== "") {
            setFilterSearch([newValue])
            checkInput(newValue)
        } else {
            setFilterSearch([])
            checkInput("")
        }

    };

    const onNameInput = ({event, value}: {event: React.SyntheticEvent<HTMLButtonElement>, value: string}) => {
        // set value in filterSearch when searching.
        if ('key' in event && event.key !== 'Enter') {
            return;
        }

        if (value) {
            setFilterSearch([value])
        } else {
            setFilterSearch([])
        }
    };

    const handleModalToggle = () => {
        setNewErrataModal(!isNewErrataModal)
    }

    const NestedItems = ({data, columnKey}: {data: ErrataListElement, columnKey: "vulnerabilities" | "packages"}): React.ReactElement => {
        // return a LabelGroup with the names of affected packages or vulnerabilities errata

        const labelColor = (type: string) => {
            // return color name for label
            // param: type (string) - errata type
            if (type === "bug") {
                return "blue"
            }
            if (type === "errata") {
                return "gold"
            }
            if (type === "vuln") {
                return "red"
            }
            return "grey"
        }
        if (columnKey === "vulnerabilities") {
            return (
                <LabelGroup className={"pf-u-pt-sm pf-u-pb-sm"} numLabels={20} defaultIsOpen={false}>
                    {data[columnKey].map((vuln, vulnIndex) => {
                            return(
                                <Label key={vuln.number} color={labelColor(vuln.type)}>{vuln.number}</Label>
                            )
                        }
                    )}
                </LabelGroup>
            );
        } else {
            return (
                <LabelGroup className={"pf-u-pt-sm pf-u-pb-sm"} numLabels={20} defaultIsOpen={false}>
                    {data[columnKey].map((pkg, pkgIndex) => {
                            return(
                                <Label
                                    href={"https://packages.altlinux.org/en/" + data.branch + "/srpms/" + pkg.pkg_name + "/" + pkg.pkghash} key={pkg.pkghash}
                                    color={"green"}
                                >{pkg.pkg_name}</Label>
                            )
                        }
                    )}
                </LabelGroup>
            );
        }
    };

    const RenderPagination = ({variant, isCompact}: {variant: PaginationVariant, isCompact: boolean}): React.ReactElement => {
        // Return pagination component
        // params:
        // variant (top | bottom) - pagination position on the page
        // isCompact (bool) - compact pagination
        return (
            <Pagination
                isCompact={isCompact}
                itemCount={totalCount}
                widgetId="bottom-example"
                usePageInsets={true}
                page={page}
                perPage={pageSize}
                perPageOptions={pageSizeOptions}
                onSetPage={(_evt, newPage) => setPage(newPage)}
                onPerPageSelect={(_evt, newPageSize) => setPageSize(newPageSize)}
                variant={variant}
                titles={{
                    paginationTitle: `${variant} pagination`
                }}
            />
        )
    };

    const renderModal = (): React.ReactElement => {
        return (
            <Modal
                width="75%"
                height="75%"
                variant={ModalVariant.small}
                title="CreateErrata"
                aria-label="Create errata"
                isOpen={isNewErrataModal}
                onClose={handleModalToggle}
            >
                <div></div>
            </Modal>
        )
    };

    const renderRows = () => {
        if (errata.isLoading) {
            return (
                <Tr>
                    <Td colSpan={6}>
                        <Loader/>
                    </Td>
                </Tr>
            )
        } else if (errata.error) {
            return (
                <Tr>
                    <Td colSpan={6}>
                        <Bullseye>
                            <EmptyState variant={EmptyStateVariant.small}>
                                <EmptyStateIcon icon={SearchIcon} />
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
                errataList.map((errata, rowIndex) => {
                    return (
                        <Tbody key={errata.errata_id}>
                            <Tr>
                                <Td component="th" dataLabel={columnNames.errata}><a href="#">{errata.errata_id}</a></Td>
                                <Td component="th" dataLabel={columnNames.branch}>{errata.branch}</Td>
                                <Td component="th" dataLabel={columnNames.vulnerabilities}><NestedItems data={errata} columnKey={"vulnerabilities"}/></Td>
                                <Td component="th" dataLabel={columnNames.packages}><NestedItems data={errata} columnKey={"packages"}/></Td>
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
            <Toolbar id="actions-toolbar" className={"pf-v5-u-pb-0"}>
                <ToolbarContent>
                    <ToolbarItem variant="overflow-menu">
                        <OverflowMenu breakpoint="md">
                            <OverflowMenuGroup groupType="button" isPersistent>
                                <OverflowMenuItem>
                                    <Button variant="primary" onClick={handleModalToggle}>Create Errata</Button>
                                </OverflowMenuItem>
                            </OverflowMenuGroup>
                        </OverflowMenu>
                    </ToolbarItem>
                    <ToolbarItem variant="pagination">
                        <RenderPagination variant={PaginationVariant.top} isCompact={true}/>
                    </ToolbarItem>
                </ToolbarContent>
            </Toolbar>
            <Toolbar id="filters-toolbar" clearAllFilters={clearAllFilters}>
                <ToolbarContent>
                    <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="xl">
                        <ToolbarGroup variant="filter-group">
                            <DropdownMenuItems items={selectFilters}/>
                        </ToolbarGroup>
                    </ToolbarToggleGroup>
                    <ToolbarFilter
                        key={"toolbar-search-errata"}
                        chips={filterSearch}
                        deleteChip={() => {setFilterSearch([])}}
                        categoryName="Search"
                        showToolbarItem={true}
                    >
                        <SearchInput
                            aria-label="Find errata"
                            placeholder="Find errata by Errata ID, vulnerability ID or package name"
                            onChange={(_event, value) => onSearchInputChange(value)}
                            value={filterSearch.slice(-1)[0]}
                            onClear={() => {
                                onSearchInputChange('');
                            }}
                            onSearch={(event, value) => onNameInput({event, value})}
                            onBlur={() => {checkInput("")}}
                            onClick={(event) => {checkInput((event.target as HTMLButtonElement).value)
                            }}
                        />
                        <FormHelperText style={{"position": "absolute"}} component={"div"} isError={validSearch === "error"} isHidden={validSearch !== "error"}>
                            <HelperText>
                                <HelperTextItem isDynamic variant="error">
                                    {validSearchText}
                                </HelperTextItem>
                            </HelperText>
                        </FormHelperText>
                    </ToolbarFilter>
                </ToolbarContent>
            </Toolbar>
            <Table variant={"compact"} isStickyHeader>
                <Thead>
                    <Tr>
                        <Th width={15}>{columnNames.errata}</Th>
                        <Th>{columnNames.branch}</Th>
                        <Th>{columnNames.vulnerabilities}</Th>
                        <Th>{columnNames.packages}</Th>
                        <Th width={15}>{columnNames.changed}</Th>
                    </Tr>
                </Thead>
                {renderRows()}
            </Table>
            <RenderPagination variant={PaginationVariant.bottom} isCompact={false}/>
            {renderModal()}
        </PageSection>
    )
}

export default ErrataList;
