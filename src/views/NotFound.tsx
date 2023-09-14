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
import {CubesIcon} from "@patternfly/react-icons";
import {
    Button,
    EmptyState, EmptyStateActions,
    EmptyStateBody,
    EmptyStateFooter,
    EmptyStateHeader,
    EmptyStateIcon,
    EmptyStateVariant, PageSection, PageSectionVariants
} from "@patternfly/react-core";
import {useNavigate} from "react-router-dom";


const NotFound: React.FunctionComponent = (): React.ReactElement => {
    const navigate = useNavigate();

    return (
        <PageSection variant={PageSectionVariants.light} isCenterAligned>
            <EmptyState variant={EmptyStateVariant.xl}>
                <EmptyStateHeader titleText="404: This page does not exist." headingLevel="h4" icon={<EmptyStateIcon icon={CubesIcon} />} />
                <EmptyStateBody>
                    Oops! The page you are looking for does not exist. It might have been moved or delete.
                </EmptyStateBody>
                <EmptyStateFooter>
                    <EmptyStateActions>
                        <Button variant="primary" onClick={() => navigate(-1)}>Back to home</Button>
                    </EmptyStateActions>
                </EmptyStateFooter>
            </EmptyState>
        </PageSection>
    )
}

export default NotFound;