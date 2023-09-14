/*
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

import {IErrataPackages} from "./IErrataPackages";
import {IVulnerabilities} from "./IVulnerabilities";

export interface ErrataListElement {
    /** Errata ID */
    errata_id: string;
    /** Errata type */
    eh_type: string;
    /** Task ID */
    task_id: number;
    /** Errata changed */
    changed: string;
    /** Package set name */
    branch: string;
    /** Affected packages from errata */
    packages: IErrataPackages[]
    /** Errata vulnerabilities */
    vulnerabilities: IVulnerabilities[]
}
