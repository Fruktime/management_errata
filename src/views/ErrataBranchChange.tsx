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
import {generatePath, Link, useParams} from "react-router-dom";
import {useFetching} from "../hooks/useFetching";
import api from "../http/api";
import {routes} from "../routes/api-routes";
import {IErrataBranchUpdates, IErrataBranchUpdatesResponse} from "../models/IErrataBranchUpdatesResponse";
import {
    Card, CardBody,
    Label, LabelGroup,
    PageSection,
    PageSectionVariants,
    Text,
    TextContent
} from "@patternfly/react-core";
import Moment from "moment";
import {Table, Tbody, Td, Th, Thead, Tr} from "@patternfly/react-table";
import {IBug, IVulns} from "../models/ErrataPackageUpdatesResponse";
import Loader from "../components/Loader";
import NotFound from "./NotFound";
import {siteRoutes} from "../routes/routes";
import {constants} from "../misc";
import VulnLabel from "../components/VulnLabel";

const ErrataBranchChange: React.FunctionComponent = (): React.ReactElement => {
    const [errataInfo, setErrataInfo] = React.useState<IErrataBranchUpdates>()

    const {errataId} = useParams()

    const branchUpdates = useFetching(async () => {
        const response = await api.post(`${routes.errataBranchesUpdates}`, {
            "errata_ids": [errataId]
        }, {withCredentials: true});
        if (response.data?.branches_updates as IErrataBranchUpdatesResponse) {
            setErrataInfo(response.data.branches_updates[0])
        } else {
            setErrataInfo(undefined)
        }
    });

    React.useEffect(() => {
        branchUpdates.fetching()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const columnNames = {
        id: 'Errata ID',
        task_id: 'Task ID',
        subtask_id: 'Subtask ID',
        pkg_name: 'Package name',
        vulns: 'Vulnerabilities',
        created: 'Created',
        updated: 'Updated',
    };

    const NestedItems = ({vulns, bugs}: { vulns: IVulns[], bugs: IBug[] } ): React.ReactElement => {
        return (
            <LabelGroup className={"pf-u-pt-sm pf-u-pb-sm"} numLabels={20} defaultIsOpen={false}>
                {vulns.map((vuln, vulnIndex) => {
                        return (
                            <VulnLabel key={`vuln-label-${vuln.id}-${vulnIndex}`} vuln_id={vuln.id} />
                        )
                    }
                )}
                {bugs.map((bug, bugIndex) => {
                        return (
                            <VulnLabel key={`vuln-label-${bug.id}-${bugIndex}`} vuln_id={bug.id.toString()} />
                        )
                    }
                )}
            </LabelGroup>
        );
    }

    if (branchUpdates.isLoading) {
        return (
            <PageSection isCenterAligned>
                <Card>
                    <CardBody>
                        <Loader/>
                    </CardBody>
                </Card>
            </PageSection>
        )
    } else if (branchUpdates.error) {
        return (
            <NotFound />
        )
    } else {
        return (
            <React.Fragment>
                <PageSection variant={PageSectionVariants.light} isWidthLimited>
                    <TextContent>
                        <Text component="h1">Errata {errataId}</Text>
                        <Text component="h3">Branch <Label>{errataInfo?.pkgset_name}</Label> update bulletin.</Text>
                    </TextContent>
                </PageSection>

                <PageSection>
                    <Table variant={"compact"} isStickyHeader>
                        <Thead>
                            <Tr>
                                <Th width={15}>{columnNames.id}</Th>
                                <Th width={10}>{columnNames.task_id}</Th>
                                <Th>{columnNames.pkg_name}</Th>
                                <Th>{columnNames.vulns}</Th>
                                <Th>{columnNames.created}</Th>
                                <Th>{columnNames.updated}</Th>
                            </Tr>
                        </Thead>
                        <Tbody key={"vulnerability-list"}>
                            {errataInfo?.packages_updates.map((errata, errataIndex) => {
                                    return (
                                        <Tr key={`${errata.id}-row`}>
                                            <Td><Link to={generatePath(siteRoutes.errataInfo, {errataId: errata.id})}>{errata.id}</Link></Td>
                                            <Td>{errata.task_id ? <Link to={generatePath(siteRoutes.taskInfo, {taskId: errata.task_id})}>{errata.task_id}</Link> : "-" }</Td>
                                            <Td>
                                                <Label
                                                    key={errata.pkg_hash}
                                                    color={"green"}
                                                    render={({className, content, componentRef}) => (
                                                        <Link
                                                            target="_blank"
                                                            to={`${constants.PACKAGES_URL}/${errata.pkgset_name}/srpms/${errata.pkg_name}/${errata.pkg_hash}`}
                                                            className={className}
                                                        >{content}</Link>
                                                    )}
                                                >{errata.pkg_name}</Label>
                                            </Td>
                                            <Td width={30}><NestedItems vulns={errata.vulns} bugs={errata.bugs} /> </Td>
                                            <Td>{Moment(errata.created).format('D MMMM YYYY')}</Td>
                                            <Td>{Moment(errata.updated).format('D MMMM YYYY')}</Td>
                                        </Tr>
                                    )
                                }
                            )}
                        </Tbody>
                    </Table>
                </PageSection>

            </React.Fragment>
        )
    }
}

export default ErrataBranchChange;