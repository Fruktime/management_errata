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
import {IPageSizeOptions} from "../models/IPageSizeOptions";

class PaginatorStore {
    /**
     Storage for pagination, which stores the current page,
     the size of the objects on the page, and page size options.
     */
    page: number = 1;
    pageSizeOptions: IPageSizeOptions[] = [
        {title: "50", value: 50},
        {title: "100", value: 100},
        {title: "200", value: 200},
    ]
    pageSize: number = this.pageSizeOptions[0].value;

    constructor() {
        makeAutoObservable(this);
    }

    /** Set current page */
    setPage(page: number) {
        this.page = page;
    }

    /** Set number of objects per page */
    setPageSize(pageSize: number) {
        this.pageSize = pageSize;
    }
}

const paginatorStore = new PaginatorStore();
export default paginatorStore;
