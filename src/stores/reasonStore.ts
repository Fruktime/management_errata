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

import {makeAutoObservable} from "mobx";

class ReasonStore {
    reason: string = ""
    helperText: string = ""
    status: "default" | "error" | "warning" | "success" = "default"

    constructor() {
        makeAutoObservable(this);
    }

    setReason = (reason: string) => {
        this.reason = reason;
    }

    setStatus = (status: "default" | "error" | "warning" | "success") => {
        this.status = status;
    }

    setHelperText = (text: string) => {
        this.helperText = text;
    }

    clearReason = () => {
        this.setReason("");
        this.setHelperText("");
        this.setStatus("default");
    }

    validateReason = (value: string) => {
        if (value.length !== 0 && value.length < 10) {
            this.setStatus("error");
            this.setHelperText("The message cannot be less than 10 characters.");
        } else if (value.length >= 10) {
            this.setStatus("success");
            this.setHelperText("");
        } else {
            this.setStatus("default");
            this.setHelperText("");
        }
    }

    handleReasonChange = (value: string) => {
        this.validateReason(value);
        this.setReason(value);
    }

}

const reasonStore = new ReasonStore();
export default reasonStore;