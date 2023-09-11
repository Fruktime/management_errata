/**
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

import {makeAutoObservable} from "mobx";
import {TaskListElement} from "../models/TaskListResponse";
import {smartSplit} from "../utils";
import api from "../http/api";
import {routes} from "../routes/api-routes";

class TaskListStore {
    taskList: TaskListElement[] = []
    branchList: string[] = []
    totalCount: number = 0
    filterBranch: string = ""
    isLoading: boolean = false
    error: string = ""

    constructor() {
        makeAutoObservable(this);
    }

    setTaskList(tasks: TaskListElement[]) {
        this.taskList = tasks;
    }

    setBranchList(branches: string[]) {
        this.branchList = branches;
    }

    setTotalCount(count: number) {
        this.totalCount = count;
    }

    setFilterBranch(branch: string) {
        this.filterBranch = branch;
    }

    setError(message: string) {
        this.error = message;
    }

    setIsLoading(load: boolean) {
        this.isLoading = load
    }

    async getTaskList(input: string, page: number, limit: number) {
        try {
            this.setIsLoading(true);
            const response = await api.get(routes.taskList, {
                params: {
                    limit: limit,
                    page: page,
                    branch: this.filterBranch !== '' ? this.filterBranch : null,
                    input: input !== '' ? smartSplit(input).join(',') : null
                },
                paramsSerializer: {
                    indexes: null
                },
            });
            if (response.data.tasks as TaskListElement[]) {
                this.setTaskList(response.data.tasks)
                this.setTotalCount(Number(response.headers['x-total-count']))
            }
            this.setError("")
        } catch (e) {
            this.setError(e.message);
        } finally {
            this.setIsLoading(false);
        }
    }

    async getBranches() {
        try {
            const response = await api.get(routes.allTasksBranches)
            if (response.data.branches) {
                this.setBranchList(response.data.branches)
            } else {
                this.setBranchList([]);
            }
        } catch (e) {
            this.setBranchList([]);
        }
    }
}

const taskListStore = new TaskListStore();
export default taskListStore;

