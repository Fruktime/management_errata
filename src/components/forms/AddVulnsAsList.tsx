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
import {Button, Form, FormGroup, FormHelperText, HelperText, HelperTextItem, TextArea} from "@patternfly/react-core";

interface AddVulnsAsListProps {
    setVulns: React.Dispatch<React.SetStateAction<string[]>>
    onClick: () => void;
}


const AddVulnsAsList: React.FunctionComponent<AddVulnsAsListProps> = ({setVulns, onClick}): React.ReactElement => {
    const [value, setValue] = React.useState("");
    const [validated, setValidated] = React.useState<"success" | "warning" | "error" | "default">("default");

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

export default AddVulnsAsList;
