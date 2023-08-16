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
    /** Task ID */
    task_id: number;
    /** Subtask ID */
    subtask_id: number;
    /** Subtask type */
    subtask_type: string;
    /** Subtask package from */
    subtask_pkg_from: string;
    /** Subtask changed */
    subtask_changed: string;
    /** Item status type in subtask */
    type: string;
    /** Source package name */
    src_pkg_name: string;
    /** Source package hash */
    src_pkg_hash: string;
}

export interface TaskListElement {
    /** Task ID */
    task_id: number;
    /** Package set name */
    branch: string;
    /** Task owner */
    owner: string;
    /** Task state */
    state: string;
    /** Task changed */
    changed: string;
    /** Errata ID */
    errata_id: string;
    /** Vulnerabilities list */
    vulnerabilities: IVulnerabilities[]
    /** Subtasks list */
    subtasks: ISubtasks[]
}
