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
import {Label, Spinner, Tooltip} from "@patternfly/react-core";
import {useFetching} from "../hooks/useFetching";
import api from "../http/api";
import {routes} from "../routes/api-routes";
import {isDigit} from "../utils";
import {constants} from "../misc";
import axios from "axios";
import {generatePath, Link} from "react-router-dom";
import {siteRoutes} from "../routes/routes";

interface VulnLabelProps {
    vuln_id: string;
}

const VulnLabel: React.FunctionComponent<VulnLabelProps> = ({vuln_id}): React.ReactElement => {
    /** Vulnerability summary. */
    const [summary, setSummary] = React.useState<string>("");

    /** Get the vulnerability type based on its ID. */
    const getVulnType = () => {
        if (vuln_id.startsWith(constants.CVE_PREFIX) || vuln_id.startsWith(constants.BDU_PREFIX) || vuln_id.startsWith(constants.MFSA_PREFIX)) {
            return "red"
        } else if (isDigit(vuln_id)) {
            return "blue"
        } else {
            return "gold"
        }
    };

    /** Get URL to vulnerability page. */
    const getVulnUrl = (): string => {
        if (vuln_id.startsWith(constants.CVE_PREFIX)) {
            return `${constants.NVD_CVE_URL}/${vuln_id}`
        } else if (vuln_id.startsWith(constants.BDU_PREFIX)) {
            return `${constants.FSTEC_BDU_URL}/${vuln_id.replace(constants.BDU_PREFIX, "")}`
        } else if (isDigit(vuln_id)) {
            return `${constants.BUGZILLA_URL}/${vuln_id}`
        } else if (vuln_id.startsWith(constants.MFSA_PREFIX)) {
            const normalized_id = vuln_id.replace(`${constants.MFSA_PREFIX} `, "mfsa").replace(`${constants.MFSA_PREFIX}-`, "mfsa")
            return `${constants.MFSA_URL}/${normalized_id}`
        } else if (vuln_id.startsWith(constants.ERRATA_PACKAGES_PREFIX)) {
            return generatePath(siteRoutes.errataInfo, {errataId: vuln_id})
        } else {
            return "#"
        }
    }

    const vuln = useFetching(async () => {
        if (vuln_id.startsWith(constants.CVE_PREFIX)) {
            const response = await api.get(`${routes.cveInfo}`, {
                params: {
                    vuln_id: vuln_id
                }
            });
            if (response.data?.vuln_info) {
                setSummary(response.data?.vuln_info.summary)
            }
        } else if (vuln_id.startsWith(constants.BDU_PREFIX)) {
            const response = await api.get(`${routes.bduInfo}`, {
                params: {
                    vuln_id: vuln_id
                }
            });
            if (response.data?.vuln_info) {
                setSummary(response.data?.vuln_info.summary)
            }
        } else if (isDigit(vuln_id)) {
            const response = await axios.get(`${constants.BUGZILLA_URL}/rest/bug`, {
                params: {
                    id: vuln_id
                },
            });
            if (response.data?.bugs) {
                setSummary(response.data?.bugs[0].summary)
            }
        }
    })

    const mouseEnter = () => {
        if (!summary) {
            vuln.fetching()
        }
    }

    if (!summary && !vuln.isLoading) {
        return (
            <Label
                key={`label-${vuln_id}`}
                color={getVulnType()}
                onMouseEnter={mouseEnter}
                render={({className, content, componentRef}) => (
                    <Link
                        to={getVulnUrl()}
                        target={vuln_id.startsWith(constants.ERRATA_PACKAGES_PREFIX) ? "" : "_blank"}
                        className={className}
                    >{content}</Link>
                )}
            >
                {vuln_id}
            </Label>
        )
    }

    return (
        <Tooltip
            key={`tooltip-${vuln_id}`}
            content={
                <div>
                    {vuln.isLoading ?
                        <React.Fragment>
                            Loading<Spinner size="md" aria-label="Contents of the large example" />
                        </React.Fragment>
                        :
                        summary
                    }
                </div>
            }
        >
            <Label
                key={`label-${vuln_id}`}
                color={getVulnType()}
                onMouseEnter={mouseEnter}
                render={({className, content, componentRef}) => (
                    <Link
                        target={vuln_id.startsWith(constants.ERRATA_PACKAGES_PREFIX) ? "" : "_blank"}
                        to={getVulnUrl()}
                        className={className}
                    >{content}</Link>
                )}
            >
                {vuln_id}
            </Label>
        </Tooltip>
    )
}

export default VulnLabel;
