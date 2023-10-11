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
    Card,
    CardBody,
    Modal,
    ModalVariant,
    Alert,
    AlertGroup,
    AlertActionCloseButton,
} from "@patternfly/react-core";
import {generatePath, Link, useNavigate, useParams} from "react-router-dom";
import {CheckCircleIcon, ExclamationCircleIcon} from "@patternfly/react-icons";
import Moment from "moment";
import styles from "@patternfly/react-styles/css/components/Wizard/wizard";
import {Table, Tbody, Td, Th, Thead, Tr} from "@patternfly/react-table";
import AddVulnsForm from "../components/forms/AddVulnsForm";
import Loader from "../components/Loader";
import NotFound from "./NotFound";
import {siteRoutes} from "../routes/routes";
import {constants} from "../misc";
import {AuthContext} from "../context/AuthProvide";
import errataStore from "../stores/errataStore";
import {IVulns} from "../models/IErrata";
import {observer} from "mobx-react";
import ReasonForm from "../components/forms/ReasonForm";
import reasonStore from "../stores/reasonStore";

const ErrataPackagesChange: React.FunctionComponent = (): React.ReactElement => {
    const {auth} = React.useContext(AuthContext);
    const errata = errataStore
    const reason = reasonStore

    /**
     * Returns an imperative method for changing the location. Used by <Link>s,
     * but may also be used by other elements to change the location.
     */
    const navigate = useNavigate();

    const [alerts, setAlerts] = React.useState<React.ReactNode[]>([]);

    /** Errata ID from URL params */
    const {errataId} = useParams<string>();

    /** Value from search input. */
    const [searchInputValue, setSearchInputValue] = React.useState<string>("");

    const [searchVulns, setSearchVulns] = React.useState<IVulns[]>(errata.errataVulns)

    /** Modal window for adding a vulnerability to errata. */
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

    /** Modal window for adding a vulnerability to errata. */
    const [isDiscardModalOpen, setDiscardModalOpen] = React.useState<boolean>(false);

    /** Modal window for adding a vulnerability to errata. */
    const [isSaveModalOpen, setSaveModalOpen] = React.useState<boolean>(false);


    /** Table column names. */
    const columnNames = {
        is_valid: "Valid",
        id: "Vulnerability ID",
        summary: "Summary",
        url: "URL",
        created: "Published",
        updated: "Modified"
    };

    /** Handle modal window toggle */
    const handleModalToggle = (_event?: KeyboardEvent | React.MouseEvent) => {
        setIsModalOpen(!isModalOpen);
    };

    const handleDiscardModalToggle = () => {
        setDiscardModalOpen(!isDiscardModalOpen);
        reason.handleReasonChange("");
    };

    const handleSaveModalToggle = () => {
        setSaveModalOpen(!isSaveModalOpen);
        reason.handleReasonChange("");
    };

    React.useEffect(() => {
        errata.getErrata(errataId).then();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errataId]);

    React.useEffect(() => {
        setSearchVulns(errata.errataVulns)
    }, [errata.errataVulns]);

    React.useEffect(() => {
        if (errata.message) {
            if (errata.statusCode === 400 && errata.validationMessage) {
                showAlerts(errata.message, errata.validationMessage, errata.typeMessage)
            } else {
                showAlerts(errata.message, "", errata.typeMessage)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errata.message]);

    /** Check the checkbox to remove the vulnerability. */
    const setSelected = (vuln: IVulns, isSelecting:boolean = true) => {
        const otherSelectedRepoNames = errata.removedVulns.filter(r => r !== vuln.id);
        errata.setRemovedVulns(isSelecting && vuln.id ? [...otherSelectedRepoNames, vuln.id] : otherSelectedRepoNames);
    };

    /** Check if the checkbox to remove the vulnerability is checked. */
    const isVulnSelected = (vuln: IVulns) => errata.removedVulns.includes(vuln.id);

    /** find vulnerability */
    const onSearchInputChange = (value: string) => {
        setSearchInputValue(value);
        if (value === "") {
            setSearchVulns(errata.errataVulns)
        } else {
            setSearchVulns(errata.errataVulns.filter(r => r.id.toString().toLowerCase().includes(value.toLowerCase())))
        }

    };

    const showAlerts = (
        header: string,
        message: string,
        variant: 'success' | 'danger' | 'warning' | 'info' | 'custom'
    ) => {
        setAlerts([
                <Alert
                    title={<div dangerouslySetInnerHTML={{__html: header}}/>}
                    variant={variant}
                    actionClose={
                        <AlertActionCloseButton variantLabel={`${variant} alert`} onClose={() => setAlerts([])}/>
                    }
                >
                    {message}
                </Alert>
            ]
        );
    };

    const saveErrata = () => {
        errata.putErrata(auth.user, reason.reason).then(() => {
            if (errata.updateErrata) {
                navigate(generatePath(siteRoutes.errataInfo, {errataId: errata.updateErrata}))
            }
        });
        handleSaveModalToggle();
    };

    const saveDiscardErrata = () => {
        errata.discardErrata(auth.user, reason.reason).then();
        handleDiscardModalToggle();
    };

    /** Table body rendering component */
    const RenderRows: React.FunctionComponent = observer((): React.ReactElement => {
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
                                {vuln.type === "BUG" ?
                                    <Link
                                        target="_blank"
                                        to={`${constants.BUGZILLA_URL}/${vuln.id}`}
                                    >
                                        {`${constants.BUGZILLA_URL}/${vuln.id}`}
                                    </Link>
                                    :
                                    <Link target="_blank" to={vuln.url}>{vuln.url}</Link>
                                }
                            </Td>
                            <Td
                                dataLabel={columnNames.created}
                            >
                                {
                                    vuln.published_date.substring(0, 4) !== "1970" ?
                                        Moment(vuln.published_date).format("D MMMM YYYY") :
                                        "-"
                                }
                            </Td>
                            <Td
                                dataLabel={columnNames.updated}
                            >
                                {
                                    vuln.modified_date.substring(0, 4) !== "1970" ?
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
    });

    if (errata.isLoading) {
        return (
            <PageSection isCenterAligned>
                <Card>
                    <CardBody>
                        <Loader/>
                    </CardBody>
                </Card>
            </PageSection>
        )
    } else if (errata.error || errata.errataInfo === null) {
        return (
            <NotFound/>
        )
    } else {
        return (
            <React.Fragment>
                <AlertGroup isToast isLiveRegion>
                    {alerts}
                </AlertGroup>
                <PageSection type={PageSectionTypes.wizard}>
                    <div className={styles.wizard}>
                        <div className={`${styles.wizardOuterWrap} pf-v5-u-pl-0`}>
                            <div className={styles.wizardInnerWrap}>
                                <WizardBody>
                                    <TextContent>
                                        <Text component="h1">Change errata {errataId}</Text>
                                    </TextContent>

                                    <DescriptionList className="pf-v5-u-mt-md" isCompact isHorizontal isFluid>
                                        {errata.errataInfo?.task_id && errata.errataInfo?.task_id !== 0 ?
                                            <DescriptionListGroup>
                                                <DescriptionListTerm>Task ID:</DescriptionListTerm>
                                                <DescriptionListDescription>
                                                    <Link
                                                        to={generatePath(siteRoutes.taskInfo, {taskId: errata.errataInfo.task_id.toString()})}
                                                    >
                                                        #{errata.errataInfo?.task_id}
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
                                                    to={`${constants.PACKAGES_URL}/${errata.errataInfo?.pkgset_name}/srpms/${errata.errataInfo?.pkg_name}/${errata.errataInfo.pkg_hash}`}
                                                >
                                                    {errata.errataInfo.pkg_name}
                                                </Link>
                                            </DescriptionListDescription>
                                        </DescriptionListGroup>
                                        <DescriptionListGroup>
                                            <DescriptionListTerm>Package version:</DescriptionListTerm>
                                            <DescriptionListDescription>
                                                {errata.errataInfo.pkg_version}-{errata.errataInfo.pkg_release}
                                            </DescriptionListDescription>
                                        </DescriptionListGroup>
                                        <DescriptionListGroup>
                                            <DescriptionListTerm>Errata created date: </DescriptionListTerm>
                                            <DescriptionListDescription>
                                                {Moment(errata.errataInfo.created).format("D MMMM YYYY")}
                                            </DescriptionListDescription>
                                        </DescriptionListGroup>
                                        <DescriptionListGroup>
                                            <DescriptionListTerm>Errata updated date: </DescriptionListTerm>
                                            <DescriptionListDescription>
                                                {Moment(errata.errataInfo.updated).format("D MMMM YYYY")}
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
                                                <Th width={10}>{columnNames.created}</Th>
                                                <Th width={10}>{columnNames.updated}</Th>
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
                                <Flex justifyContent={{default: "justifyContentSpaceBetween"}}
                                      style={{"width": "100%"}}>
                                    <FlexItem>
                                        <Flex>
                                            <Button
                                                key={"save-errata"}
                                                size="sm"
                                                variant={"primary"}
                                                className={"pf-v5-u-mr-sm"}
                                                onClick={handleSaveModalToggle}
                                                isDisabled={true}
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                key={"save-and-continue-errata"}
                                                size="sm"
                                                variant={"primary"}
                                                onClick={handleSaveModalToggle}
                                                isDisabled={!errata.errataInfo}
                                            >
                                                Save and continue
                                            </Button>
                                        </Flex>
                                    </FlexItem>
                                    <FlexItem>
                                        <Flex>
                                            <Button
                                                key={"add-vulns-as-list"}
                                                size="sm"
                                                variant={"primary"}
                                                onClick={handleModalToggle}
                                                className={"pf-v5-u-mr-sm"}
                                                isDisabled={!errata.errataInfo}
                                            >
                                                Add vulnerabilities as a list
                                            </Button>
                                            <Button
                                                key={"errata-history-button"}
                                                size="sm"
                                                variant={"tertiary"}
                                                // onClick={handleModalToggle}
                                                className={"pf-v5-u-mr-sm"}
                                                isDisabled={true}
                                            >
                                                History
                                            </Button>
                                            {errata.errataInfo.is_discarded?
                                                <Button
                                                    key={"enable-errata"}
                                                    size="sm"
                                                    variant={"warning"}
                                                >
                                                    Enable Errata
                                                </Button>
                                                :
                                                <Button
                                                    key={"discard-errata"}
                                                    size="sm"
                                                    variant={"danger"}
                                                    onClick={() => handleDiscardModalToggle()}
                                                >
                                                    Discard Errata
                                                </Button>
                                            }

                                        </Flex>
                                    </FlexItem>
                                </Flex>
                            </WizardFooterWrapper>
                        </div>
                    </div>

                    <AddVulnsForm
                        listAddedVulns={errata.errataVulns}
                        setListAddedVulns={errata.setErrataVulns}
                        isOpen={isModalOpen}
                        handleToggle={handleModalToggle}
                        title={"Add vulnerability"}
                        ariaLabel={"Add vulnerability"}
                    />
                </PageSection>

                <Modal
                    variant={ModalVariant.small}
                    title="Are you sure you want to discard errata?"
                    isOpen={isDiscardModalOpen}
                    onClose={handleDiscardModalToggle}
                    actions={[
                        <Button
                            key="confirm"
                            variant="primary"
                            isDisabled={reason.status !== "success" || !errata.errataInfo}
                            onClick={saveDiscardErrata}
                        >
                            Yes
                        </Button>,
                        <Button key="cancel" variant="link" onClick={handleDiscardModalToggle}>
                            No
                        </Button>
                    ]}
                >
                    <ReasonForm
                        label={"Please indicate the reason for the change Errata:"}
                        ariaLabel={"reason for change errata"}
                        style={{minHeight: "10rem"}}
                    />
                </Modal>

                <Modal
                    variant={ModalVariant.small}
                    title="Save changes Errata"
                    isOpen={isSaveModalOpen}
                    onClose={handleSaveModalToggle}
                    actions={[
                        <Button key="confirm" variant="primary" isDisabled={reason.status !== "success" || !errata.errataInfo}
                                onClick={saveErrata}>
                            Yes
                        </Button>,
                        <Button key="cancel" variant="link" onClick={handleSaveModalToggle}>
                            No
                        </Button>
                    ]}
                >
                    <ReasonForm
                        label={"Please indicate the reason for the change Errata:"}
                        ariaLabel={"reason for change errata"}
                        style={{minHeight: "10rem"}}
                    />
                </Modal>
            </React.Fragment>
        );
    }
};

export default observer(ErrataPackagesChange);
