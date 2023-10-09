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


export interface IErrataReferences {
    /** Reference type */
    type: "Errata" | "vuln" | "bug";
    /** Reference ID */
    link: string;
}

export interface IVulns {
    /** Vulnerability ID */
    id: string;
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
    /** Vulnerability information is valid */
    is_valid: boolean;
    references: string[];
    /** Related vulnerabilities list */
    related_vulns: string[] | null;
}

export interface IErrata {
    /** Is errata discarded. */
    is_discarded: boolean;
    /** Errata id. */
    id: string;
    /** Errata created date. */
    created: string;
    /** Errata updated date. */
    updated: string;
    /** Errata type. */
    type: string;
    /** Errata source. */
    source: string;
    /** list of Errata references. */
    references: IErrataReferences[];
    /** Package hash. */
    pkg_hash: string;
    /** Package name. */
    pkg_name: string;
    /** Package version. */
    pkg_version: string;
    /** Package release. */
    pkg_release: string;
    /** Package set name. */
    pkgset_name: string;
    /** Task id. */
    task_id: number;
    /** Subtask ID. */
    subtask_id: number;
    /** Task state. */
    task_state: string;
}

export interface IErrataManageChange {
    /** Errata id. */
    id: string;
    /** Errata created date. */
    created: string;
    /** Errata updated date. */
    updated: string;
    /** Errata change user. */
    user: string;
    /** Errata change user IP. */
    user_ip: string;
    /** Errata change reason. */
    reason: string;
    /** Errata change type. */
    type: string;
    /** Errata change source. */
    source: string;
    /** Errata change origin. */
    origin: string;
    /** Changed errata id reference. */
    errata_id: string;
}

export interface IErrataManage {
    /** Errata change originator. */
    user: string;
    /** Errata manage action. */
    action: string;
    /** Errata change reason. */
    reason: string;
    /** Errata contents. */
    errata: IErrata;
}

export interface IErrataManageResponse {
    /** Errata manage result message. */
    message: string;
    /** Errata manage action. */
    action: string;
    /** Errata contents. */
    errata: IErrata[];
    /** Errata change contents. */
    errata_change: IErrataManageChange[];
    validation_message?: string[];
}

export interface IErrataGetResponse {
    /** Request arguments. */
    request_args: {};
    /** Errata manage result message. */
    message: string;
    /** Errata contents. */
    errata: IErrata;
    /** List of vulnerabilities closed in errata. */
    vulns: IVulns[];
}
