/*
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

import {IVulnerabilities} from "./IVulnerabilities";

interface ISubtasks {
    /** Subtask ID */
    subtask_id: number;
    /** Subtask type */
    subtask_type: string;
    /** Subtask changed */
    subtask_changed: string;
    /** Item status type in subtask */
    type: string;
    /** Source package name */
    src_pkg_name: string;
    /** Source package hash */
    src_pkg_hash: string;
    /** Source package version */
    src_pkg_version: string;
    /** Source package release */
    src_pkg_release: string;
    /** Package last changelog message */
    chlog_text: string;
    /** Package last changelog message date */
    chlog_date: string;
    /** Package last changelog name */
    chlog_name: string;
    /** Package last changelog evr */
    chlog_evr: string;
    /** Errata ID */
    errata_id: string;
    /** Time and date of creation errata */
    eh_created: string;
    /** Time and date of updating errata */
    eh_update: string;
    /** Vulnerabilities */
    vulnerabilities: IVulnerabilities[];
}

export interface ITaskInfo {
    /** Task ID */
    task_id: number;
    /** Package set name */
    task_repo: string;
    /** Task state */
    task_state: string;
    /** Task changed */
    task_changed: string;
    /** Task owner */
    task_owner: string;
    /** Task message */
    task_message: string;
    /** Subtasks list */
    subtasks: ISubtasks[]
}
