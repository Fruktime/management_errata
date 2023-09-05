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
import {
    Button,
    DescriptionList,
    DescriptionListDescription,
    DescriptionListGroup,
    DescriptionListTerm,
    Flex,
    FlexItem,
    FormGroup,
    HelperText,
    HelperTextItem,
    PageSection,
    PageSectionTypes,
    SearchInput,
    Text,
    TextContent,
    Toolbar,
    ToolbarContent,
    ToolbarFilter,
    WizardFooterWrapper,
    WizardBody,
    Bullseye,
    EmptyState,
    EmptyStateVariant,
    EmptyStateIcon, Title
} from "@patternfly/react-core";
import {Link, useParams} from "react-router-dom";
import {CheckCircleIcon, ExclamationCircleIcon, SearchIcon} from "@patternfly/react-icons";
import {useFetching} from "../hooks/useFetching";
import api from "../http/api";
import {routes} from "../routes/api-routes";
import {
    IBug,
    IErrataPackageUpdates,
    IErrataPackageUpdatesResponse,
    IVulns
} from "../models/ErrataPackageUpdatesResponse";
import Moment from "moment";
import {css} from "@patternfly/react-styles";
import styles from "@patternfly/react-styles/css/components/Wizard/wizard";
import {Table, Tbody, Td, Th, Thead, Tr} from "@patternfly/react-table";
import AddVulnsForm from "../components/forms/AddVulnsForm";

const ErrataChange: React.FunctionComponent = (): React.ReactElement => {
    // information about errata
    const [errataInfo, setErrataInfo] = React.useState<IErrataPackageUpdates>()
    // errata ID from URL params
    const {errataId} = useParams<string>();

    // vulnerabilities removed from errata
    const [removedVulns, setRemovedVulns] = React.useState<string[]>([]);

    // value from search input
    const [searchInputValue, setSearchInputValue] = React.useState<string>("");
    
    const [vulnList, setVulnList] = React.useState<IVulns[] | IBug[]>([]);
    const [searchVulns, setSearchVulns] = React.useState(vulnList)

    // modal window for adding a vulnerability to errata
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

    const [variantAddVulns, setVariantAddVulns] = React.useState<"asList" | "fromList">("fromList")

    // table column names
    const columnNames = {
        is_valid: "Valid",
        id: "Vulnerability ID",
        summary: "Summary",
        url: "URL",
        published_date: "Published",
        modified_date: "Modified"
    };

    // handle modal window toggle
    const handleModalToggle = (_event?: KeyboardEvent | React.MouseEvent, variant?: "asList" | "fromList") => {
        if (variant) {
            setVariantAddVulns(variant)
        }
        setIsModalOpen(!isModalOpen);
    };

    const packageUpdates = useFetching(async () => {
        const response = await api.post(`${routes.errataPackagesUpdates}`, {
            "errata_ids": [errataId]
        }, {withCredentials: true});
        if (response.data?.packages_updates as IErrataPackageUpdatesResponse) {
            setErrataInfo(response.data.packages_updates[0])
            const bugs = response.data.packages_updates[0].bugs ? response.data.packages_updates[0].bugs : []
            const vulns = response.data.packages_updates[0].vulns ? response.data.packages_updates[0].vulns : []
            setVulnList([...bugs, ...vulns])
            setSearchVulns([...bugs, ...vulns])
        } else {
            setErrataInfo(undefined)
        }
    })

    React.useEffect(() => {
        packageUpdates.fetching()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    React.useEffect( () => {
        setSearchVulns(vulnList)
    }, [vulnList])

    // check the checkbox to remove the vulnerability
    const setSelected = (vuln: IVulns | IBug, isSelecting = true) =>
        setRemovedVulns(prevSelected => {
            const otherSelectedRepoNames = prevSelected.filter(r => r !== vuln.id);
            return isSelecting && vuln.id ? [...otherSelectedRepoNames, vuln.id] : otherSelectedRepoNames;
        });

    // check if the checkbox to remove the vulnerability is checked
    const isVulnSelected = (vuln: IVulns | IBug) => removedVulns.includes(vuln.id);

    // find vulnerability
    const onSearchInputChange = (value: string) => {
        setSearchInputValue(value);
        if (value === "") {
            setSearchVulns(vulnList)
        } else {
            setSearchVulns(vulnList.filter(r => r.id.toString().toLowerCase().includes(value.toLowerCase())))
        }

    };

    // table body rendering component
    const RenderRows: React.FunctionComponent = (): React.ReactElement => {
        if (searchVulns.length > 0) {
            return (
                <React.Fragment>
                    {searchVulns.map((vuln, vulnIndex) => {
                        return (
                            <Tr key={vuln.id}>
                                <Td dataLabel={columnNames.is_valid}>
                                    {!vuln.is_valid ? <ExclamationCircleIcon color={"red"}/> :
                                        <CheckCircleIcon color={"green"}/>}
                                </Td>
                                <Td dataLabel={columnNames.id}>{vuln.id}</Td>
                                <Td dataLabel={columnNames.summary}>{vuln.summary}</Td>
                                <Td dataLabel={columnNames.url}>
                                    {"url" in vuln ?
                                        <Link target="_blank" to={vuln.url}>{vuln.url}</Link> :
                                        <Link
                                            target="_blank"
                                            to={`https://bugzilla.altlinux.org/${vuln.id}`}
                                        >
                                            {`https://bugzilla.altlinux.org/${vuln.id}`}
                                        </Link>
                                    }
                                </Td>
                                <Td
                                    dataLabel={columnNames.published_date}
                                >
                                    {
                                        "published_date" in vuln && vuln.published_date.substring(0, 4) !== "1970" ?
                                            Moment(vuln.published_date).format("D MMMM YYYY") :
                                            "-"
                                    }
                                </Td>
                                <Td
                                    dataLabel={columnNames.modified_date}
                                >
                                    {
                                        "modified_date" in vuln && vuln.modified_date.substring(0, 4) !== "1970" ?
                                            Moment(vuln.modified_date).format("D MMMM YYYY") :
                                            "-"
                                    }
                                </Td>
                                <Td
                                    select={{
                                        rowIndex: vulnIndex,
                                        onSelect: (_event, isSelecting) => setSelected(vuln, isSelecting),
                                        isSelected: isVulnSelected(vuln)
                                    }}
                                />
                            </Tr>
                        )
                    })}
                </React.Fragment>
            )
        } else {
            return (
                <Tr>
                    <Td colSpan={Object.keys(columnNames).length + 1}>
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
        }
    }


    return (
        <React.Fragment>
            <PageSection type={PageSectionTypes.wizard}>
                <div className={css(styles.wizard)}>
                    <div className={css(styles.wizardOuterWrap, "pf-v5-u-pl-0")}>
                        <div className={css(styles.wizardInnerWrap)}>
                            <WizardBody>
                                <TextContent>
                                    <Text component="h1">Change errata {errataId}</Text>
                                </TextContent>

                                <DescriptionList className="pf-v5-u-mt-md" isCompact isHorizontal isFluid>
                                    {errataInfo?.task_id && errataInfo?.task_id !== 0 ?
                                        <DescriptionListGroup>
                                            <DescriptionListTerm>Task ID:</DescriptionListTerm>
                                            <DescriptionListDescription>
                                                <Link
                                                    to={`/tasks/${errataInfo?.task_id}`}
                                                >
                                                    #{errataInfo?.task_id}
                                                </Link>
                                            </DescriptionListDescription>
                                        </DescriptionListGroup>
                                        :
                                        undefined
                                    }
                                    <DescriptionListGroup>
                                        <DescriptionListTerm>Package name:</DescriptionListTerm>
                                        <DescriptionListDescription>
                                            <Link
                                                target="_blank"
                                                to={`https://packages.altlinux.org/en/${errataInfo?.pkgset_name}/srpms/${errataInfo?.pkg_name}/${errataInfo?.pkg_hash}`}
                                            >
                                                {errataInfo?.pkg_name}
                                            </Link>
                                        </DescriptionListDescription>
                                    </DescriptionListGroup>
                                    <DescriptionListGroup>
                                        <DescriptionListTerm>Package version:</DescriptionListTerm>
                                        <DescriptionListDescription>
                                            {errataInfo?.pkg_version}-{errataInfo?.pkg_release}
                                        </DescriptionListDescription>
                                    </DescriptionListGroup>
                                    <DescriptionListGroup>
                                        <DescriptionListTerm>Errata created date: </DescriptionListTerm>
                                        <DescriptionListDescription>
                                            {Moment(errataInfo?.created).format("D MMMM YYYY")}
                                        </DescriptionListDescription>
                                    </DescriptionListGroup>
                                    <DescriptionListGroup>
                                        <DescriptionListTerm>Errata updated date: </DescriptionListTerm>
                                        <DescriptionListDescription>
                                            {Moment(errataInfo?.updated).format("D MMMM YYYY")}
                                        </DescriptionListDescription>
                                    </DescriptionListGroup>
                                </DescriptionList>

                                <Toolbar clearAllFilters={() => onSearchInputChange("")}>
                                    <ToolbarContent>
                                        <ToolbarFilter
                                            key={"toolbar-search-tss"}
                                            chips={searchInputValue !== "" ? [searchInputValue] : []}
                                            deleteChip={() => {
                                                onSearchInputChange("")
                                            }}
                                            categoryName="Search"
                                            showToolbarItem={true}
                                        >
                                            <FormGroup>
                                                <SearchInput
                                                    className={"toolbar-search-input"}
                                                    aria-label="Find vulnerabilities"
                                                    placeholder="Find vulnerabilities"
                                                    onChange={(_event, value) => onSearchInputChange(value)}
                                                    value={searchInputValue}
                                                    onClear={() => onSearchInputChange("")}
                                                    onSearch={(event, value) => onSearchInputChange(value)}
                                                />
                                            </FormGroup>

                                        </ToolbarFilter>
                                    </ToolbarContent>
                                </Toolbar>

                                <Table variant={"compact"} isStickyHeader>
                                    <Thead>
                                        <Tr>
                                            <Th>{columnNames.is_valid}</Th>
                                            <Th width={15}>{columnNames.id}</Th>
                                            <Th>{columnNames.summary}</Th>
                                            <Th>{columnNames.url}</Th>
                                            <Th width={10}>{columnNames.published_date}</Th>
                                            <Th width={10}>{columnNames.modified_date}</Th>
                                            <Th>
                                                <HelperText>
                                                    <HelperTextItem variant="error">Delete?</HelperTextItem>
                                                </HelperText>
                                            </Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody key={"vulnerability-list"}>
                                        <RenderRows />
                                    </Tbody>
                                </Table>
                            </WizardBody>
                        </div>

                        <WizardFooterWrapper>
                            <Flex justifyContent={{default: "justifyContentSpaceBetween"}} style={{"width": "100%"}}>
                                <FlexItem>
                                    <Flex>
                                        <Button
                                            key={"save-errata"}
                                            variant={"primary"}
                                            className={"pf-v5-u-mr-sm"}
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            key={"save-and-continue-errata"}
                                            variant={"primary"}
                                        >
                                            Save and continue
                                        </Button>
                                    </Flex>
                                </FlexItem>
                                <FlexItem>
                                    <Flex>
                                        <Button
                                            key={"add-vulns-as-list"}
                                            variant={"primary"}
                                            onClick={(event) => handleModalToggle(event, "asList")}
                                            className={"pf-v5-u-mr-sm"}
                                        >
                                            Add vulnerabilities as a list
                                        </Button>
                                        <Button key={"discard-errata"} variant={"danger"}>
                                            Discard Errata
                                        </Button>
                                    </Flex>
                                </FlexItem>
                            </Flex>
                        </WizardFooterWrapper>
                    </div>
                </div>

                <AddVulnsForm
                    setListAddedVulns={setVulnList}
                    isOpen={isModalOpen}
                    handleToggle={handleModalToggle}
                    title={"Add vulnerability"}
                    ariaLabel={"Add vulnerability"}
                    variant={variantAddVulns}
                />
            </PageSection>
        </React.Fragment>
    );
};

export default ErrataChange;
