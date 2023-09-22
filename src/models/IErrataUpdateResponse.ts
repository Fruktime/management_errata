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
import {IErrataHistory} from "./IErrataHistory";

interface IErrataChange {
    created: string;
    errata_id: string;
    id: string;
    origin: string;
    reason: string;
    source: string;
    type: string;
    updated: string;
    user: string;
    user_ip: string;
}

export interface IErrataUpdateResponse {
    action: string;
    errata: IErrataHistory;
    errata_change: IErrataChange[]
}