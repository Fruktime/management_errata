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


import {IErrataReferences} from "./models/IErrata";

/** Color types for the Label component */
type TLabelColors = (
    "blue" | "gold" | "red" | "grey"
)


/**
 * Get vulnerability color for Label component.
 * @param type - vulnerability type
 * @returns color name
 */
export const vulnLabelColor = (type: "errata" | "vuln" | "bug"): TLabelColors => {
    /*
    Return color name for label.
    */
    if (type === "bug") {
        return "blue";
    }
    if (type === "errata") {
        return "gold";
    }
    if (type === "vuln") {
        return "red";
    }
    return "grey";
};

/**
 * Convert quoted string literals to unquoted strings with escaped quotes and
 * backslashes unquoted.
 * @param text - string to split
 * @returns string array
*/
export const smartSplit = (text: string): string[] => {
    const split_regex = /((?:[^\s'"]*(?:(?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')[^\s'"]*)+)|\S+)/g;
    const result = [];
    let match;
    while ((match = split_regex.exec(text)) !== null) {
        result.push(match[0]);
    }
    return result;
};

/**
 * Convert the list of vulnerabilities to a list of vulnerabilities and their types.
 * @param refs - list of vulnerabilities (CVE, BDU and bug ID)
 * @returns IErrataReferences[] - list of vulnerabilities and their types
 */
export const buildErrataReferences = (refs: string[]): IErrataReferences[] => {
    const result: IErrataReferences[] = []
    refs.forEach((ref) => {
        if (Number.isInteger(ref)) {
            result.push({type: "bug", link: ref})
        } else if (ref.startsWith("ALT-BU-")) {
            result.push({type: "errata", link: ref})
        } else {
            result.push({type: "vuln", link: ref})
        }
    })
    return result
}

/**
 * Check if string is digit.
 * @param str - string to test
 * @return flag whether the string is a digit
 */
export const isDigit = (str: string): boolean => {
    const reDigit: RegExp = /^\d+$/;
    return str !== "" && reDigit.test(str);
}
