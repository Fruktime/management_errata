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

import {IErrataPackages} from "./IErrataPackages";

export interface IVulnerabilities {
    number: string;
    type: "errata" | "vuln" | "bug";
}

export interface ErrataListElement {
    errata_id: string;
    eh_type: string;
    task_id: Number;
    changed: string;
    branch: string;
    packages: Array<IErrataPackages>
    vulnerabilities: Array<IVulnerabilities>
}

export interface ErrataListResponse {
    request_args: any;
    length: Number;
    erratas: Array<ErrataListElement>
}
