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
import {IErrataPackageUpdates} from "./ErrataPackageUpdatesResponse";

export interface IErrataBranchUpdates {
    /** Errata ID. */
    id: string;
    /** Errata type. */
    type: string;
    /** Package set name. */
    pkgset_name: string;
    /** Package set date.  */
    pkgset_date: string;
    /** List of packages updates. */
    packages_updates: IErrataPackageUpdates[];
}

export interface IErrataBranchUpdatesResponse {
    /** List of branch updates. */
    branches_updates: IErrataBranchUpdates[];
}
