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

export const constants = {
    PAGE_VAR: "p" as string,
    SEARCH_VAR: "q" as string,
    VALID_ERR_TYPE: "error" as "error",
    VALID_SUC_TYPE: "success" as "success",
    ERRATA_PACKAGES_PREFIX: "ALT-PU-",
    ERRATA_BRANCH_PREFIX: "ALT-BU-",
    CVE_PREFIX: "CVE-",
    BDU_PREFIX: "BDU:",
    MFSA_PREFIX: "MFSA",
    PACKAGES_URL: "https://packages.altlinux.org/en",
    BUGZILLA_URL: "https://bugzilla.altlinux.org",
    NVD_CVE_URL: "https://nvd.nist.gov/vuln/detail",
    FSTEC_BDU_URL: "https://bdu.fstec.ru/vul",
    MFSA_URL: "https://www.mozilla.org/en-US/security/advisories",
    DARK_THEME_KEY: "_dark_theme",
}

/**
 * User events to guarantee user activity on the application
 */
export const events = [
    "load",
    "mousemove",
    "mousedown",
    "click",
    "scroll",
    "keypress",
]
