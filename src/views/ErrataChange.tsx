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
import {useParams} from "react-router-dom";
import {constants} from "../misc";
import {
    Card,
    CardBody,
    EmptyState,
    EmptyStateBody,
    EmptyStateHeader,
    EmptyStateIcon,
    PageSection
} from "@patternfly/react-core";
import {SearchIcon} from "@patternfly/react-icons";
import ErrataBranchChange from "./ErrataBranchChange";
import ErrataPackagesChange from "./ErrataPackagesChange";


const ErrataChange: React.FunctionComponent = (): React.ReactElement => {
    const {errataId} = useParams()
    if (errataId) {
        if (errataId.startsWith(constants.ERRATA_PACKAGES_PREFIX)) {
            return (
                <ErrataPackagesChange />
            )
        } else {
            return (
                <ErrataBranchChange />
            )
        }
    } else {
        return (
            <PageSection isCenterAligned>
                <Card>
                    <CardBody>
                        <EmptyState>
                            <EmptyStateHeader titleText="No results found" headingLevel="h4" icon={<EmptyStateIcon icon={SearchIcon} />} />
                            <EmptyStateBody>Nothing was found for your request.</EmptyStateBody>
                        </EmptyState>
                    </CardBody>
                </Card>
            </PageSection>
        )
    }
}

export default ErrataChange;