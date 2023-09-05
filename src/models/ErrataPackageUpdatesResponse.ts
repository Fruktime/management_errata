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

export interface IBug {
    /** Bug ID */
    id: string;
    /** Bug summary */
    summary: string;
    /** Bug information is valid */
    is_valid: boolean;
}

export interface IVulns {
    /** Vulnerability ID */
    id: string;
    /** Vulnerability hash */
    hash: string;
    /** Vulnerability type */
    type: string;
    /** Vulnerability summary */
    summary: string;
    /** Vulnerability score */
    score: number;
    /** Vulnerability severity */
    severity: string;
    /** Vulnerability URL */
    url: string;
    /** Vulnerability modified date */
    modified_date: string;
    /** Vulnerability published date */
    published_date: string;
    /** Vulnerability body in JSON format */
    body: string;
    /** Vulnerability information is valid */
    is_valid: boolean;
    related_vulns: string[];
}

export interface IErrataPackageUpdates {
    /** Errata id */
    id: string;
    /** Errata type */
    type: string;
    /** Errata created date */
    created: string;
    /** Errata update date */
    updated: string;
    /** Package set name */
    pkgset_name: string;
    /** Task ID */
    task_id: number;
    /** Subtask ID */
    subtask_id: number;
    /** Task state*/
    task_state: string;
    /** Package hash */
    pkg_hash: string;
    /** Package name */
    pkg_name: string;
    /** Package version */
    pkg_version: string;
    /** Package release */
    pkg_release: string;
    /** List of bugs */
    bugs: IBug[];
    /** List of vulnerabilities */
    vulns: IVulns[];
}

export interface IErrataPackageUpdatesResponse {
    packages_updates: IErrataPackageUpdates[]
}
