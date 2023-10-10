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
    Modal,
    ModalVariant,
    Button,
    WizardBody,
    WizardFooterWrapper,
} from "@patternfly/react-core";
import {useFetching} from "../../hooks/useFetching";
import api from "../../http/api";
import {routes} from "../../routes/api-routes";
import styles from "@patternfly/react-styles/css/components/Wizard/wizard";
import {VulnsResponse} from "../../models/VulnsResponse";
import {IVulns} from "../../models/IErrata";
import {toJS} from "mobx";
import {observer} from "mobx-react";
import AddVulnsAsList from "./AddVulnsAsList";
import RenderFoundVulns from "../RenderFoundVulns";

interface AddVulnsFormProps {
    listAddedVulns: IVulns[];
    setListAddedVulns: (vulns: IVulns[]) => void;
    /** Is the modal window open to add vulnerabilities */
    isOpen: boolean;
    /** Handle modal window toggle */
    handleToggle: () => void;
    /** Simple text content of the modal header. Also used for the aria-label on the body. */
    title: string;
    /** Accessible descriptor of the modal. */
    ariaLabel: string;
}


const AddVulnsForm: React.FunctionComponent<AddVulnsFormProps> = (
    {
        listAddedVulns,
        setListAddedVulns,
        isOpen,
        handleToggle,
        title,
        ariaLabel
    }
): React.ReactElement => {
    // list of found vulnerabilities
    const [foundVulns, setFoundVulns] = React.useState<IVulns[]>([]);
    // list of not found vulnerabilities
    const [notFoundVulns, setNotFoundVulns] = React.useState<string[]>([])
    // list of searched vulnerabilities
    const [vulnIds, setVulnIds] = React.useState<string[]>([]);


    const vulns = useFetching(async () => {
        const response = await api.post(routes.vulns, {
            "vuln_ids": vulnIds
        }, {withCredentials: true});
        if (response.data as VulnsResponse) {
            setFoundVulns([...response.data.vulns])
            setNotFoundVulns(response.data.not_found)
        }
    });

    const onCloseModal = () => {
        handleToggle();
        setFoundVulns([])
    }

    const checkVulnsClick = () => {
        vulns.fetching()
    }

    React.useEffect(() => {
        if (vulns.error) {
            setFoundVulns([])
        }
    }, [vulns.error])

    const onAddVulns = () => {
        const newVulnList: IVulns[] = []
        for (let vuln of foundVulns) {
            if (listAddedVulns.findIndex(r => r.id === vuln.id) === -1) {
                newVulnList.push(vuln)
            }
        }
        const updateVulns: IVulns[] = [...toJS(listAddedVulns), ...newVulnList]
        setListAddedVulns(updateVulns)
        onCloseModal()
    }

    return (
        <Modal
            width="100%"
            variant={ModalVariant.large}
            title={title}
            aria-label={ariaLabel}
            isOpen={isOpen}
            onClose={onCloseModal}
            hasNoBodyWrapper
        >
            <div className={styles.wizard}>
                <div className={`${styles.wizardOuterWrap} pf-v5-u-pl-0`}>
                    <div className={styles.wizardInnerWrap}>
                        <WizardBody>
                            <React.Fragment>
                                <AddVulnsAsList setVulns={setVulnIds} onClick={checkVulnsClick}/>
                                <RenderFoundVulns
                                    vulns={foundVulns}
                                    notFoundVulns={notFoundVulns}
                                    isLoading={vulns.isLoading}
                                    error={vulns.error}/>
                            </React.Fragment>
                        </WizardBody>
                    </div>
                    <WizardFooterWrapper>
                        <Button
                            key={"add-vulns"}
                            variant={"primary"}
                            className={"pf-v5-u-mr-sm"}
                            isDisabled={foundVulns.length === 0}
                            onClick={onAddVulns}
                        >
                            Add
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
    );
}

export default observer(AddVulnsForm);