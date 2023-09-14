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

export const constants = {
    PAGE_VAR: "p" as string,
    SEARCH_VAR: "q" as string,
    VALID_ERR_TYPE: "error" as "error",
    VALID_SUC_TYPE: "success" as "success",
    ERRATA_PACKAGES_PREFIX: "ALT-PU-",
    ERRATA_BRANCH_PREFIX: "ALT-BU-"
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
