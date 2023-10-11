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
    Alert,
    Button, Form, FormGroup,
    Modal,
    ModalVariant, Title, TitleSizes,
    WizardBody,
    WizardFooterWrapper
} from "@patternfly/react-core";
import {ITaskInfo, ISubtasks} from "../../models/TaskInfoResponse";
import styles from "@patternfly/react-styles/css/components/Wizard/wizard";
import {IErrataManage, IErrataReferences, IVulns} from "../../models/IErrata";
import {useFetching} from "../../hooks/useFetching";
import api from "../../http/api";
import {routes} from "../../routes/api-routes";
import {VulnsResponse} from "../../models/VulnsResponse";
import AddVulnsAsList from "./AddVulnsAsList";
import RenderFoundVulns from "../RenderFoundVulns";
import {AxiosResponse} from "axios";
import {constants} from "../../misc";
import {AuthContext} from "../../context/AuthProvide";
import {observer} from "mobx-react";
import ReasonForm from "./ReasonForm";
import reasonStore from "../../stores/reasonStore";
import {buildErrataReferences} from "../../utils";

interface CreateTaskErrataProps {
    isOpen: boolean;
    task: ITaskInfo;
    subtask: ISubtasks;
    handleToggle: () => void;
    setSave: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateTaskErrata: React.FunctionComponent<CreateTaskErrataProps> = (
    {isOpen, task, subtask, handleToggle, setSave}
): React.ReactElement => {

    const {auth} = React.useContext(AuthContext);

    const reason = reasonStore;

    /** List of found vulnerabilities. */
    const [foundVulns, setFoundVulns] = React.useState<IVulns[]>([]);
    /** List of not found vulnerabilities. */
    const [notFoundVulns, setNotFoundVulns] = React.useState<string[]>([])
    /** List of searched vulnerabilities. */
    const [vulnIds, setVulnIds] = React.useState<string[]>([]);
    const [alert, setAlert] = React.useState<React.ReactElement>()

    /** Find vulnerabilities. */
    const vulns = useFetching(async () => {
        const response: AxiosResponse = await api.post(routes.vulns, {
            "vuln_ids": vulnIds
        }, {withCredentials: true});
        if (response.data as VulnsResponse) {
            setFoundVulns([...response.data.vulns])
            setNotFoundVulns(response.data.not_found)
        }
    });

    /** Create errata in the DB. */
    const createErrata = useFetching(async (data: IErrataManage) => {
        const response: AxiosResponse = await api.post(routes.managementErrata, data)
        if (response.status === 200) {
            setSave(true);
            handleToggle();
            setFoundVulns([])
        } else {
            console.log(response)
            setAlert(
                <Alert
                    title={<div dangerouslySetInnerHTML={{__html: response.data.message}}/>}
                    variant={"danger"}
                    isInline
                >
                    {response.data.validation_message ? response.data.validation_message.join(". ") : undefined}
                </Alert>
            )
        }
    })

    /** Close modal for create errata. */
    const onCloseModal = () => {
        handleToggle();
        reason.handleReasonChange("");
    }

    /** Check vulnerabilities in the DB. */
    const checkVulnsClick = () => {
        vulns.fetching()
    }

    React.useEffect(() => {
        if (vulns.error) {
            setFoundVulns([])
        }
    }, [vulns.error])

    const onClickCreateErrata = () => {
        if (foundVulns.length > 0) {
            const refs: IErrataReferences[] = buildErrataReferences(foundVulns.map((vuln) => vuln.id))
            if (subtask && refs && task) {
                createErrata.fetching({
                    user: auth.user.nickname,
                    action: constants.ERRATA_CHANGE_ACTION_CREATE,
                    reason: reason.reason,
                    errata: {
                        is_discarded: false,
                        id: "",
                        created: "",
                        updated: "",
                        type: "task",
                        source: "changelog",
                        references: refs,
                        pkg_hash: subtask.src_pkg_hash,
                        pkg_name: subtask.src_pkg_name,
                        pkg_version: subtask.src_pkg_version,
                        pkg_release: subtask.src_pkg_release,
                        pkgset_name: task.task_repo,
                        task_id: task.task_id,
                        subtask_id: subtask.subtask_id,
                        task_state: task.task_state,
                    }
                })
            }
        }
    }

    const headerModal = (
        <React.Fragment>
            <Title id="modal-custom-header-label" headingLevel="h1" size={TitleSizes["2xl"]}>
                Create errata for {subtask.subtask_id} subtask
            </Title>
            {alert ? alert : undefined}
        </React.Fragment>
    )

    return (
        <React.Fragment>
            <Modal
                key={`modal-${task.task_id}-${subtask.subtask_id}`}
                width="100%"
                variant={ModalVariant.large}
                header={headerModal}
                aria-label="Create errata"
                isOpen={isOpen}
                onClose={onCloseModal}
                hasNoBodyWrapper
            >
                <div className={styles.wizard}>
                    <div className={`${styles.wizardOuterWrap} pf-v5-u-pl-0`}>
                        <div className={styles.wizardInnerWrap}>
                            <WizardBody>
                                <Form>
                                    <ReasonForm
                                        label={"Please indicate the reason for the create Errata:"}
                                        ariaLabel={"reason for create errata"}
                                    />
                                    <FormGroup>
                                        <AddVulnsAsList setVulns={setVulnIds} onClick={checkVulnsClick}/>
                                        <RenderFoundVulns
                                            vulns={foundVulns}
                                            notFoundVulns={notFoundVulns}
                                            isLoading={vulns.isLoading}
                                            error={vulns.error}/>
                                    </FormGroup>
                                </Form>
                            </WizardBody>
                        </div>
                        <WizardFooterWrapper>
                            <Button
                                key={"add-vulns"}
                                variant={"primary"}
                                className={"pf-v5-u-mr-sm"}
                                isDisabled={reason.status !== "success" || foundVulns.length === 0}
                                onClick={onClickCreateErrata}
                            >
                                Create
                            </Button>
                            <Button
                                key={"close-add-vulns-modal"}
                                variant={"tertiary"}
                                className={"pf-v5-u-mr-sm"}
                                onClick={onCloseModal}
                            >
                                Close
                            </Button>
                        </WizardFooterWrapper>
                    </div>
                </div>
            </Modal>
        </React.Fragment>
    )
}

export default observer(CreateTaskErrata);
