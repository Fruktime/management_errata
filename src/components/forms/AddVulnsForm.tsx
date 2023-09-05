/**
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
    Modal,
    ModalVariant,
    Form,
    FormGroup,
    TextArea,
    FormHelperText,
    HelperText,
    HelperTextItem,
    Button,
    Bullseye,
    EmptyState,
    EmptyStateVariant,
    EmptyStateIcon, Title,
    WizardBody,
    WizardFooterWrapper,
    PageSection,
    PageSectionVariants,
    Alert
} from "@patternfly/react-core";
import {Table, Tbody, Td, Th, Thead, Tr} from "@patternfly/react-table";
import {useFetching} from "../../hooks/useFetching";
import api from "../../http/api";
import {routes} from "../../routes/api-routes";
import {IBug, IVulns} from "../../models/ErrataPackageUpdatesResponse";
import {CheckCircleIcon, ExclamationCircleIcon, SearchIcon} from "@patternfly/react-icons";
import {Link} from "react-router-dom";
import Moment from "moment/moment";
import {css} from "@patternfly/react-styles";
import styles from "@patternfly/react-styles/css/components/Wizard/wizard";
import Loader from "../Loader";
import {VulnsResponse} from "../../models/VulnsResponse";
import {List, ListItem} from "@patternfly/react-core/components";

interface AddVulnsFormProps {
    setListAddedVulns: React.Dispatch<React.SetStateAction<IVulns[] | IBug[]>>
    /** Is the modal window open to add vulnerabilities */
    isOpen: boolean;
    /** Handle modal window toggle */
    handleToggle: () => void;
    /** Simple text content of the modal header. Also used for the aria-label on the body. */
    title?: string;
    /** Accessible descriptor of the modal. */
    ariaLabel?: string;
    /** Vulnerability adding option (list | from list) */
    variant: "fromList" | "asList"
}

interface RenderFoundVulnsProps {
    /** List of found vulnerabilities in the database */
    vulns: IVulns[] | IBug[];
    /** BDUs and Bugzilla vulnerabilities not found in the DB */
    notFoundVulns: string[]
    isLoading: boolean;
    /** Error message to API */
    error: string;
}

interface AddAsListProps {
    setVulns: React.Dispatch<React.SetStateAction<string[]>>
    onClick: () => void;
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


const AddAsList: React.FunctionComponent<AddAsListProps> = ({setVulns, onClick}): React.ReactElement => {
    const [value, setValue] = React.useState("");
    const [validated, setValidated] = React.useState<"default" | "error" | "warning" | "success" | undefined>("default");

    const defaultHelperText = "Enter a list of vulnerabilities separated by spaces, commas, or line breaks."
    const [helperText, setHelperText] = React.useState(defaultHelperText);

    const validateText = (value: string) => {
        const reSplit = /[\s,\n ]+/;
        const reValue = /\s*(^CVE-\d{4}-\d{4,}$|^BDU:\d{4}-\d{5}$|^\d+$)\s*/
        const valueList = value.split(reSplit)
        const newValueList = valueList.filter(element => element.match(reValue))
        const invalidValueList = valueList.filter(element => !element.match(reValue) && element !== "")
        if (invalidValueList.length > 0) {
            setValidated("error");
            setHelperText(`${invalidValueList.join(", ")}: invalid vulnerabilities`);
        } else if (newValueList.length > 0) {
            setVulns(newValueList)
            setValidated("success");
            setHelperText("");
        } else {
            setValidated("default");
            setHelperText(defaultHelperText);
        }

    }

    const handleTextAreaChange = (value: string) => {
        setValue(value);
        validateText(value);
    };

    return (
        <React.Fragment>
            <Form>
                <FormGroup label="Paste list of vulnerabilities:" type="string" fieldId="selection">
                    <TextArea
                        value={value}
                        style={{minHeight: "10rem"}}
                        onChange={(_event, value) => handleTextAreaChange(value)}
                        isRequired
                        validated={validated}
                        aria-label="invalid text area example"
                    />
                    <FormHelperText>
                        <HelperText>
                            <HelperTextItem variant={validated}>{helperText}</HelperTextItem>
                        </HelperText>
                    </FormHelperText>
                </FormGroup>
                <FormGroup>
                    <Button
                        onClick={onClick} variant="primary" size="sm"
                        isDisabled={validated !== "success"}>
                        Check vulnerabilities
                    </Button>
                </FormGroup>
            </Form>
        </React.Fragment>
    )
}


export default function AddVulnsForm(
    {
        setListAddedVulns,
        isOpen,
        handleToggle,
        title,
        ariaLabel,
        variant
    }: AddVulnsFormProps): React.ReactElement {
    // list of found vulnerabilities
    const [foundVulns, setFoundVulns] = React.useState<IVulns[] | IBug[]>([]);
    // list of not found vulnerabilities
    const [notFoundVulns, setNotFoundVulns] = React.useState<string[]>([])
    // list of searched vulnerabilities
    const [vulnIds, setVulnIds] = React.useState<string[]>([]);


    const vulns = useFetching(async () => {
        const response = await api.post(routes.vulns, {
            "vuln_ids": vulnIds
        }, {withCredentials: true});
        if (response.data as VulnsResponse) {
            setFoundVulns([...response.data.bugs, ...response.data.vulns])
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
        setListAddedVulns(prevState => {
            const newVulnList = []
            for (let vuln of foundVulns) {
                if (prevState.findIndex(r => r.id === vuln.id) === -1) {
                    newVulnList.push(vuln)
                }
            }
            return [...prevState, ...newVulnList]
        })
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
            <div className={css(styles.wizard)}>
                <div className={css(styles.wizardOuterWrap, "pf-v5-u-pl-0")}>
                    <div className={css(styles.wizardInnerWrap)}>
                        <WizardBody>
                            {variant === "asList" ?
                                <React.Fragment>
                                    <AddAsList setVulns={setVulnIds} onClick={checkVulnsClick}/>
                                    <RenderFoundVulns
                                        vulns={foundVulns}
                                        notFoundVulns={notFoundVulns}
                                        isLoading={vulns.isLoading}
                                        error={vulns.error}/>
                                </React.Fragment>
                                :
                                undefined
                            }
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
};