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

import {IVulns} from "../models/IErrata";
import React from "react";
import {Table, Tbody, Td, Th, Thead, Tr} from "@patternfly/react-table";
import {
    Alert,
    Bullseye,
    EmptyState,
    EmptyStateIcon,
    EmptyStateVariant,
    PageSection,
    PageSectionVariants, Title
} from "@patternfly/react-core";
import {CheckCircleIcon, ExclamationCircleIcon, SearchIcon} from "@patternfly/react-icons";
import {Link} from "react-router-dom";
import {List, ListItem} from "@patternfly/react-core/components";
import Moment from "moment";
import Loader from "./Loader";

interface RenderFoundVulnsProps {
    /** List of found vulnerabilities in the database */
    vulns: IVulns[];
    /** BDUs and Bugzilla vulnerabilities not found in the DB */
    notFoundVulns: string[]
    isLoading: boolean;
    /** Error message to API */
    error: string;
}


const RenderFoundVulns: React.FunctionComponent<RenderFoundVulnsProps> = (
    {vulns, notFoundVulns, isLoading, error}
): React.ReactElement | null => {

    const columnNames = {
        is_valid: "Valid",
        id: "Vulnerability ID",
        related_vulns: "Related vulns",
        summary: "Summary",
        url: "URL",
        published_date: "Published",
        modified_date: "Modified"
    };

    // table body rendering component
    const RenderRows: React.FunctionComponent = (): React.ReactElement => {
        return (
            <React.Fragment>
                {notFoundVulns.map((vulnId) => {
                    return (
                        <Tr key={vulnId}>
                            <Td dataLabel={columnNames.id} colSpan={Object.keys(columnNames).length}>
                                <Alert variant="danger" isInline title={`Vulnerability ${vulnId} not found in DB`}/>
                            </Td>
                        </Tr>
                    )
                })}
                {vulns.map((vuln) => {
                    return (
                        <Tr key={`added-vuln-${vuln.id}`}>
                            <Td dataLabel={columnNames.is_valid}>
                                {!vuln.is_valid ? <ExclamationCircleIcon color={"red"}/> :
                                    <CheckCircleIcon color={"green"}/>}
                            </Td>
                            <Td dataLabel={columnNames.id}><Link to={"#"}>{vuln.id}</Link></Td>
                            <Td dataLabel={columnNames.related_vulns}>
                                {"related_vulns" in vuln && vuln.related_vulns ?
                                    <List isPlain>
                                        {vuln.related_vulns.map((relVuln) => {
                                            return (
                                                <ListItem key={relVuln}><Link to={"#"}>{relVuln}</Link></ListItem>
                                            )
                                        })}
                                    </List>
                                    : "-"}
                            </Td>
                            <Td dataLabel={columnNames.summary}>{vuln.summary}</Td>
                            <Td dataLabel={columnNames.url}>
                                {vuln.type === "BUG" ?
                                    <Link
                                        target="_blank"
                                        to={`https://bugzilla.altlinux.org/${vuln.id}`}
                                    >
                                        {`https://bugzilla.altlinux.org/${vuln.id}`}
                                    </Link>
                                    :
                                    <Link target="_blank" to={vuln.url}>{vuln.url}</Link>
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
                        </Tr>
                    )
                })}
            </React.Fragment>
        )
    }

    if (isLoading) {
        return (
            <PageSection variant={PageSectionVariants.light} isCenterAligned>
                <Loader/>
            </PageSection>
        )
    } else if (vulns.length === 0 && !error) {
        return null
    } else {
        return (
            <Table variant={"compact"}>
                <Thead>
                    <Tr>
                        <Th>{columnNames.is_valid}</Th>
                        <Th width={10}>{columnNames.id}</Th>
                        <Th width={10}>{columnNames.related_vulns}</Th>
                        <Th>{columnNames.summary}</Th>
                        <Th>{columnNames.url}</Th>
                        <Th width={10}>{columnNames.published_date}</Th>
                        <Th width={10}>{columnNames.modified_date}</Th>
                    </Tr>
                </Thead>
                <Tbody key={"found-vulnerabilities"}>
                    {!error
                        ? <RenderRows/>
                        :
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
                    }

                </Tbody>
            </Table>
        )
    }
}

export default RenderFoundVulns;
