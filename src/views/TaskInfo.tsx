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
    PageSection,
    PageSectionVariants,
    TextContent,
    Text,
    CardBody,
    Card,
    EmptyState,
    EmptyStateIcon,
    Title,
    EmptyStateVariant,
    DescriptionList,
    DescriptionListGroup,
    DescriptionListTerm,
    DescriptionListDescription,
    Label,
    LabelGroup,
    Button,
    ActionList,
    ActionListItem,
    Icon,
    CardTitle,
    CardFooter,
    Breadcrumb, BreadcrumbItem
} from "@patternfly/react-core";
import {TFetch, useFetching} from "../hooks/useFetching";
import api from "../http/api";
import {routes} from "../routes/api-routes";
import {errataLabelColor} from "../utils";
import {Link, useParams} from "react-router-dom";
import {AddCircleOIcon, EditIcon, SearchIcon} from "@patternfly/react-icons";
import {ITaskInfo} from "../models/TaskInfoResponse";
import Loader from "../components/Loader";
import Moment from "moment/moment";
import {ExpandableRowContent, Table, Tbody, Td, Th, Thead, Tr} from "@patternfly/react-table";
import {IVulnerabilities} from "../models/IVulnerabilities";

function TaskInfo() {
    const [info, setInfo] = React.useState<ITaskInfo>();
    const {taskId} = useParams();

    const task: TFetch = useFetching(async () => {
        const response = await api.get(`${routes.taskInfo}/${taskId}`);
        if (response.data) {
            setInfo(response.data)
        } else {
            setInfo(undefined)
        }
    })

    React.useEffect(() => {
        task.fetching()
    }, [])


    const NestedItems = ({data}: {data: IVulnerabilities[] }): React.ReactElement => {

        return (
            <LabelGroup className={"pf-u-pt-sm pf-u-pb-sm"} numLabels={20} defaultIsOpen={false}>
                {data.map((vuln, vulnIndex) => {
                        return (
                            <Label key={`${vuln.id}-${vulnIndex}`}
                                   color={errataLabelColor(vuln.type)}>{vuln.id}</Label>
                        )
                    }
                )}
            </LabelGroup>
        );
    }


    const Subtasks: React.FunctionComponent = (): React.ReactElement | null => {
        if (info) {
            return (
                <Table variant={"compact"} isStickyHeader>
                    <Thead>
                        <Tr>
                            <Th>Subtask #</Th>
                            <Th>Package name</Th>
                            <Th>Package version</Th>
                            <Th>Errata ID</Th>
                            <Th width={30}>Vulnerabilities</Th>
                            <Th>Errata created</Th>
                            <Th>Errata update</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    {info.subtasks.map((subtask, subIndex) => {
                        return (
                            <Tbody key={subtask.subtask_id} isExpanded>
                                <Tr key={`${subtask.subtask_id}-subtask-info`}>
                                    <Td dataLabel="Subtask #">{subtask.subtask_id}</Td>
                                    <Td dataLabel="Package name">
                                        <Link
                                            target={"_blank"}
                                            to={`https://packages.altlinux.org/en/${info.task_repo}/srpms/${subtask.src_pkg_name}/${subtask.src_pkg_hash}`}
                                        >{subtask.src_pkg_name}</Link>
                                    </Td>
                                    <Td
                                        dataLabel="Package version">{subtask.src_pkg_version}-{subtask.src_pkg_release}</Td>
                                    <Td dataLabel="Errata ID">{subtask.errata_id ? subtask.errata_id : "-"}</Td>
                                    <Td dataLabel="Vulnerabilities">{
                                        subtask.vulnerabilities.length > 0
                                            ?
                                            <NestedItems data={subtask.vulnerabilities} />
                                            :
                                            "-"
                                    }</Td>
                                    <Td dataLabel="Errata created">{subtask.eh_created.substring(0, 4) !== "1970" ? Moment(subtask.eh_created).format('D MMMM YYYY, h:mm a'): "-"}</Td>
                                    <Td dataLabel="Errata update">{subtask.eh_update.substring(0, 4) !== "1970" ? Moment(subtask.eh_update).format('D MMMM YYYY, h:mm a'): "-"}</Td>
                                    <Td isActionCell>
                                        <ActionList isIconList>
                                            {subtask.errata_id ?
                                                <ActionListItem>
                                                    <Button title="Edit errata" variant="plain" id="with-edit-errata-button" aria-label="edit errata button">
                                                        <Icon size="md">
                                                            <EditIcon />
                                                        </Icon>
                                                    </Button>
                                                </ActionListItem>
                                                :
                                                <ActionListItem>
                                                    <Button title="Create errata" variant="plain" id="with-create-errata-button" aria-label="create errata button">
                                                        <Icon size="md">
                                                            <AddCircleOIcon />
                                                        </Icon>
                                                    </Button>
                                                </ActionListItem>
                                            }
                                        </ActionList>
                                    </Td>
                                </Tr>
                                <Tr key={`${subtask.subtask_id}-changelog`} isExpanded className={"pf-v5-u-display-none pf-v5-u-display-table-row-on-md"}>
                                    <Td dataLabel={`${subtask.src_pkg_name} changelog`} colSpan={8} className={"pf-v5-u-pt-0"}>
                                        <ExpandableRowContent>
                                            <Card isCompact>
                                                <CardTitle>{Moment(subtask.chlog_date).format('D MMMM YYYY')} {subtask.chlog_name}</CardTitle>
                                                <CardBody><pre>{subtask.chlog_text}</pre></CardBody>
                                            </Card>
                                        </ExpandableRowContent>
                                    </Td>
                                </Tr>
                            </Tbody>
                        )
                    })}
                </Table>
            )
        } else {
            return null
        }
    }


    const RenderInformation: React.FunctionComponent = (): React.ReactElement => {
        if (task.isLoading) {
            return (
                <PageSection isCenterAligned>
                    <Card>
                        <CardBody>
                            <Loader/>
                        </CardBody>
                    </Card>
                </PageSection>
            )
        } else if (task.error) {
            return (
                <PageSection isCenterAligned>
                    <Card>
                        <CardBody>
                            <EmptyState variant={EmptyStateVariant.lg}>
                                <EmptyStateIcon icon={SearchIcon}/>
                                <Title headingLevel="h2" size="lg">
                                    No results found
                                </Title>
                            </EmptyState>
                        </CardBody>
                    </Card>
                </PageSection>
            )
        } else {
            return (
                <React.Fragment>
                    <PageSection variant={PageSectionVariants.light} isWidthLimited>
                        <Breadcrumb ouiaId="TaskBreadcrumb">
                            <BreadcrumbItem to="/tasks">Tasks</BreadcrumbItem>
                            <BreadcrumbItem isActive>Task #{taskId}</BreadcrumbItem>
                        </Breadcrumb>
                        <TextContent>
                            <Text component="h1">Task #{info?.task_id} for {info?.task_repo} by <Link
                                target={"_blank"}
                                to={`https://packages.altlinux.org/en/${info?.task_repo}/maintainers/${info?.task_owner}/`}>{info?.task_owner}</Link></Text>
                        </TextContent>
                        <DescriptionList className="pf-v5-u-mt-md" isCompact isHorizontal isFluid>
                            <DescriptionListGroup>
                                <DescriptionListTerm>State</DescriptionListTerm>
                                <DescriptionListDescription><Label
                                    color="green">{info?.task_state}</Label></DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                                <DescriptionListTerm>Build time</DescriptionListTerm>
                                <DescriptionListDescription>{Moment(info?.task_changed).format('D MMMM YYYY, h:mm:ss a')}</DescriptionListDescription>
                            </DescriptionListGroup>
                            {info?.task_message ?
                                <DescriptionListGroup>
                                    <DescriptionListTerm>Message</DescriptionListTerm>
                                    <DescriptionListDescription>{info?.task_message}</DescriptionListDescription>
                                </DescriptionListGroup>
                                : undefined
                            }
                        </DescriptionList>
                    </PageSection>

                    <PageSection>
                        <Subtasks/>
                    </PageSection>
                </React.Fragment>
            )
        }

    }

    return (
        <React.Fragment>
            <RenderInformation/>
        </React.Fragment>
    )
}

export default TaskInfo;