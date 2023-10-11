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
import api from "../http/api";
import {routes} from "../routes/api-routes";
import {HttpStatusCode} from "axios";
import {IErrata, IErrataGetResponse, IErrataManage, IErrataManageResponse, IVulns} from "../models/IErrata";
import {AxiosResponse} from "axios";
import {constants} from "../misc";
import {IUser} from "../models/IUser";


class ErrataStore {
    errataInfo: null | IErrata = null
    errataVulns: IVulns[] = []
    updateErrata: string = ""
    removedVulns: string[] = []
    statusCode: HttpStatusCode = 200
    message: string = ""
    validationMessage: string = ""
    typeMessage: "success" | "danger" | "warning" | "info" | "custom" = "success"
    isLoading: boolean = false
    error: string = ""

    constructor() {
        makeAutoObservable(this);
    }

    setErrataInfo = (errata: IErrata | null) => {
        this.errataInfo = errata;
    }

    setErrataVulns = (vulns: IVulns[]) => {
        this.errataVulns = vulns
    }

    setRemovedVulns = (vulns: string[]) => {
        this.removedVulns = vulns;
    }

    setIsLoading = (isLoading: boolean) => {
        this.isLoading = isLoading;
    }

    setMessage = (message: string) => {
        this.message = message;
    }

    setValidationMessage = (message: string) => {
        this.validationMessage = message;
    }

    setError(error: string) {
        this.error = error;
    }

    setTypeMessage = (type: "success" | "danger" | "warning" | "info" | "custom") => {
        this.typeMessage = type;
    }

    setStatusCode = (code: HttpStatusCode) => {
        this.statusCode = code
    }

    setErrataChange(response: AxiosResponse) {
        this.setStatusCode(response.status)
        if (this.statusCode === 200) {
            const data = response.data as IErrataManageResponse;
            if (data.errata_change.length === 0) {
                this.setMessage(response.data.message);
                this.setTypeMessage("warning");
            } else {
                this.updateErrata = data.errata_change[0].errata_id
            }
        } else if (this.statusCode === 400) {
            this.setMessage(response.data.message);
            this.setValidationMessage(response.data.validation_message.join())
            this.setTypeMessage("danger");
        } else {
            this.setMessage(response.data.message)
            this.setTypeMessage("danger");
        }
    }

    updateReferences(errata: IErrata) {
        const vulns = this.errataVulns.filter((vuln) => !this.removedVulns.includes(vuln.id)).map((vuln) => vuln)
        errata.references = vulns.map((vuln) => {
            return {
                type: vuln.type === "BUG" ? "bug" : "vuln",
                link: vuln.id
            }
        })
        return errata
    }

    /** Get errata info. */
    async getErrata(errataID: string | undefined) {
        try {
            this.setIsLoading(true)
            const response: AxiosResponse = await api.get(
                `${routes.managementErrata}`,
                {params: {errata_id: errataID}}
            )
            if (response.status === 200) {
                const data = response.data as IErrataGetResponse;
                this.setErrataInfo(data.errata);
                this.setErrataVulns(data.vulns);
                this.setError("");
            } else {
                this.setError(response.data.message);
            }
        } catch (e) {
            this.setError(e.message);
        } finally {
            this.setIsLoading(false);
        }
    }

    /** Update errata version with new contents. */
    async  putErrata(user: IUser, reason: string) {
        if (this.errataInfo) {
            const errata: IErrataManage = {
                user: user.nickname,
                action: constants.ERRATA_CHANGE_ACTION_UPDATE,
                reason: reason,
                errata: this.updateReferences(this.errataInfo)
            }
            try {
                this.setIsLoading(true);
                const response: AxiosResponse = await api.put(
                    `${routes.managementErrata}`, errata
                );
                this.setErrataChange(response)
            } catch (e) {
                this.setError(e.message)
            } finally {
                this.setIsLoading(false);
            }
        }
    }

    /** Register new errata record. */
    async postErrata(user: string, reason: string) {

    }

    /** Discard errata record. */
    async discardErrata(user: IUser, reason: string) {
        if (this.errataInfo) {
            const errata: IErrataManage = {
                user: user.nickname,
                action: constants.ERRATA_CHANGE_ACTION_DISCARD,
                reason: reason,
                errata: this.errataInfo
            }
            try {
                this.setIsLoading(true)
                const response: AxiosResponse = await api.delete(
                    `${routes.managementErrata}`,
                    {data: errata}
                )
                this.setErrataChange(response)
                if (response.status === 200) {
                    this.errataInfo.is_discarded = true
                }
            } catch (e) {
                this.setError(e.message)
            } finally {
                this.setIsLoading(false)
            }
        }
    }
}

const errataStore = new ErrataStore();
export default errataStore;
