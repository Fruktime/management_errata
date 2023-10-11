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
import {AxiosResponse} from "axios";
import {ITaskInfo} from "../models/TaskInfoResponse";

class TaskInfoStore {
    taskInfo: ITaskInfo | null = null
    isLoading: boolean = false
    error: string = ""

    constructor() {
        makeAutoObservable(this);
    }

    setIsLoading = (loading: boolean) => {
        this.isLoading = loading;
    }

    setError = (message: string) => {
        this.error = message;
    }

    setTaskInfo = (data: ITaskInfo) => {
        this.taskInfo = data;
    }

    async getTaskInfo(taskID: string | undefined) {
        try {
            this.setIsLoading(true)
            const response: AxiosResponse = await api.get(
                `${routes.taskInfo}/${taskID}`
            )
            if (response.status === 200) {
                const data = response.data as ITaskInfo;
                this.setTaskInfo(data);
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
}

const taskInfoStore = new TaskInfoStore();
export default taskInfoStore;
