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
import React, {CSSProperties} from "react";
import {FormGroup, FormHelperText, HelperText, HelperTextItem, TextArea} from "@patternfly/react-core";
import {observer} from "mobx-react";
import reasonStore from "../../stores/reasonStore";


interface ReasonFormProps {
    label: string;
    ariaLabel: string;
    style?: CSSProperties;
}


const ReasonForm: React.FunctionComponent<ReasonFormProps> = ({label, ariaLabel, style}) => {
    const reason = reasonStore

    return (
        <FormGroup label={label} type="string"
                   fieldId="reasonErrata">
            <TextArea
                value={reason.reason}
                style={style}
                onChange={(_event, value) => reason.handleReasonChange(value)}
                isRequired
                resizeOrientation="vertical"
                validated={reason.status}
                aria-label={ariaLabel}
            />
            <FormHelperText>
                <HelperText>
                    <HelperTextItem variant={reason.status}>{reason.helperText}</HelperTextItem>
                </HelperText>
            </FormHelperText>
        </FormGroup>
    )
}

export default observer(ReasonForm);