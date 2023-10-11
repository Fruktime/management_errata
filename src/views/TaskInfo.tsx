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
import {
    PageSection,
    PageSectionVariants,
    TextContent,
    Text,
    CardBody,
    Card,
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
} from "@patternfly/react-core";
import {generatePath, Link, useParams} from "react-router-dom";
import {
    AddCircleOIcon,
    EditIcon,
    MinusCircleIcon,
} from "@patternfly/react-icons";
import {ISubtasks} from "../models/TaskInfoResponse";
import Loader from "../components/Loader";
import Moment from "moment/moment";
import {ExpandableRowContent, Table, Tbody, Td, Th, Thead, Tr} from "@patternfly/react-table";
import {IVulnerabilities} from "../models/IVulnerabilities";
import {siteRoutes} from "../routes/routes";
import {constants} from "../misc";
import VulnLabel from "../components/VulnLabel";
import CreateTaskErrata from "../components/forms/CreateTaskErrata";
import taskInfoStore from "../stores/taskInfoStore";
import {observer} from "mobx-react";
import NotFound from "./NotFound";

const TaskInfo: React.FunctionComponent = () => {
    const task = taskInfoStore;
    /** Task ID from URL params. */
    const {taskId} = useParams<string>();
    /** The subtask in which Errata are created. */
    const [changeSubtask, setChangeSubtask] = React.useState<ISubtasks>()
    /** Modal window for adding a vulnerability to errata. */
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
    /** A flag indicating that errata is created. */
    const [isCreateErrata, setCreateErrata] = React.useState<boolean>(false)

    React.useEffect(() => {
        setCreateErrata(false)
        task.getTaskInfo(taskId).then()
    }, [isCreateErrata])

    /** Handle modal window toggle */
    const handleModalToggle = () => {
        setIsModalOpen(!isModalOpen);
    };

    const onCreateSubtaskErrata = (subtask: ISubtasks) => {
        handleModalToggle();
        setChangeSubtask(subtask)
    }

    const NestedItems = ({data}: {data: IVulnerabilities[] }): React.ReactElement => {

        return (
            <LabelGroup className={"pf-u-pt-sm pf-u-pb-sm"} numLabels={20} defaultIsOpen={false}>
                {data.map((vuln, vulnIndex) => {
                        return (
                            <VulnLabel key={`vuln-label-${vuln.id}-${vulnIndex}`} vuln_id={vuln.id} />
                        )
                    }
                )}
            </LabelGroup>
        );
    }


    const Subtasks: React.FunctionComponent = (): React.ReactElement | null => {
        const columnNames = {
            subtask_id: "Subtask #",
            src_pkg_name: "Package name",
            pkg_evr: "Package version",
            errata_id: "Errata ID",
            vulnerabilities: "Vulnerabilities",
            eh_created: "Errata created",
            eh_update: "Errata update",
        }

        if (task.taskInfo === null) {
            return null
        } else {
            return (
                <Table variant={"compact"} isStickyHeader>
                    <Thead>
                        <Tr>
                            <Th>{columnNames.subtask_id}</Th>
                            <Th>{columnNames.src_pkg_name}</Th>
                            <Th>{columnNames.pkg_evr}</Th>
                            <Th>{columnNames.errata_id}</Th>
                            <Th width={30}>{columnNames.vulnerabilities}</Th>
                            <Th>{columnNames.eh_created}</Th>
                            <Th>{columnNames.eh_update}</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    {task.taskInfo.subtasks.map((subtask, subIndex) => {
                        return (
                            <Tbody key={subtask.subtask_id} isExpanded>
                                <Tr key={`${subtask.subtask_id}-subtask-info`}>
                                    <Td dataLabel={columnNames.subtask_id}>{subtask.subtask_id}</Td>
                                    <Td dataLabel={columnNames.src_pkg_name}>
                                        <Link
                                            target={"_blank"}
                                            to={`${constants.PACKAGES_URL}/${task.taskInfo?.task_repo}/srpms/${subtask.src_pkg_name}/${subtask.src_pkg_hash}`}
                                        >
                                            {subtask.src_pkg_name}
                                        </Link>
                                    </Td>
                                    <Td dataLabel={columnNames.pkg_evr}>{subtask.src_pkg_version}-{subtask.src_pkg_release}</Td>
                                    <Td dataLabel={columnNames.errata_id}>
                                        {subtask.errata_id ?
                                            <React.Fragment>
                                                {subtask.is_discarded ? <MinusCircleIcon color={"red"}/> : undefined}
                                                {subtask.errata_id}
                                            </React.Fragment> : "-"}
                                    </Td>
                                    <Td dataLabel={columnNames.vulnerabilities}>{
                                        subtask.vulnerabilities.length > 0
                                            ?
                                            <NestedItems data={subtask.vulnerabilities} />
                                            :
                                            "-"
                                    }</Td>
                                    <Td dataLabel={columnNames.eh_created}>
                                        {subtask.eh_created.substring(0, 4) !== "1970" ? Moment(subtask.eh_created).format('D MMMM YYYY, h:mm a'): "-"}
                                    </Td>
                                    <Td dataLabel={columnNames.eh_update}>
                                        {subtask.eh_update.substring(0, 4) !== "1970" ? Moment(subtask.eh_update).format('D MMMM YYYY, h:mm a'): "-"}
                                    </Td>
                                    <Td isActionCell>
                                        <ActionList isIconList>
                                            {subtask.errata_id ?
                                                <ActionListItem>
                                                    <Button
                                                        title="Edit errata"
                                                        variant="plain"
                                                        id="with-edit-errata-button"
                                                        aria-label="edit errata button"
                                                        component={(props: any) => <Link {...props} to={generatePath(siteRoutes.errataInfo, {errataId: subtask.errata_id})} />}
                                                    >
                                                        <Icon size="md">
                                                            <EditIcon />
                                                        </Icon>
                                                    </Button>
                                                </ActionListItem>
                                                :
                                                <ActionListItem>
                                                    <Button
                                                        title="Create errata"
                                                        variant="plain"
                                                        id="with-create-errata-button"
                                                        aria-label="create errata button"
                                                        onClick={() => onCreateSubtaskErrata(subtask)}
                                                    >
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
                                                <CardTitle>
                                                    {Moment(subtask.chlog_date).format('D MMMM YYYY')} {subtask.chlog_name}
                                                </CardTitle>
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
        }
    }


    const RenderInformation: React.FunctionComponent = observer((): React.ReactElement => {
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
        } else if (task.error || task.taskInfo === null) {
            return (
                <NotFound/>
            )
        } else {
            return (
                <React.Fragment>
                    <PageSection variant={PageSectionVariants.light} isWidthLimited>
                        <TextContent>
                            <Text component="h1">Task #{task.taskInfo.task_id} for {task.taskInfo.task_repo} by <Link
                                target={"_blank"}
                                to={`${constants.PACKAGES_URL}/${task.taskInfo.task_repo}/maintainers/${task.taskInfo.task_owner}/`}>{task.taskInfo.task_owner}</Link></Text>
                        </TextContent>
                        <DescriptionList className="pf-v5-u-mt-md" isCompact isHorizontal isFluid>
                            <DescriptionListGroup>
                                <DescriptionListTerm>State</DescriptionListTerm>
                                <DescriptionListDescription><Label
                                    color="green">{task.taskInfo.task_state}</Label></DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                                <DescriptionListTerm>Build time</DescriptionListTerm>
                                <DescriptionListDescription>{Moment(task.taskInfo.task_changed).format('D MMMM YYYY, h:mm:ss a')}</DescriptionListDescription>
                            </DescriptionListGroup>
                            {task.taskInfo.task_message ?
                                <DescriptionListGroup>
                                    <DescriptionListTerm>Message</DescriptionListTerm>
                                    <DescriptionListDescription>{task.taskInfo.task_message}</DescriptionListDescription>
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

    })

    return (
        <React.Fragment>
            <RenderInformation/>
            { task.taskInfo && changeSubtask ?
                <CreateTaskErrata
                    isOpen={isModalOpen}
                    task={task.taskInfo}
                    subtask={changeSubtask}
                    handleToggle={handleModalToggle}
                    setSave={setCreateErrata}
                />
                :
                undefined
            }
        </React.Fragment>
    )
}

export default observer(TaskInfo);