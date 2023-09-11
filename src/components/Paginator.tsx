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

import React from "react";
import {useNavigate} from "react-router-dom";
import {useQuery} from "../hooks/useQuery";
import {constants} from "../misc";
import {PaginationVariant} from "@patternfly/react-core/components";
import {Pagination} from "@patternfly/react-core";
import paginatorStore from "../stores/paginatorStore";
import {isDigit} from "../utils";

interface PaginatorProps {
    /** Flag indicating if pagination is compact. */
    isCompact: boolean;
    /** Total number of items. */
    totalCount: number;
    /** Position where pagination is rendered. */
    variant: 'top' | 'bottom' | PaginationVariant;
}

export const Paginator:React.FunctionComponent<PaginatorProps> = ({
    isCompact,
    totalCount,
    variant
}: PaginatorProps): React.ReactElement => {
    const navigate = useNavigate()
    const query = useQuery();

    /**
     * Get page number from query params.
     */
    const getPageToQuery = () => {
        const queryParam = query.get(constants.PAGE_VAR)
        if (queryParam && isDigit(queryParam)) {
            paginatorStore.setPage(Number(queryParam))
            return Number(queryParam)
        } else {
            paginatorStore.setPage(1)
        }
    }

    getPageToQuery();

    /**
     * Set current page in the store and URL params.
     * @param pageNumber current page
     */
    const handlePageChange = (pageNumber: number) => {
        query.set(constants.PAGE_VAR, pageNumber.toString())
        navigate(`?${query}`);
        paginatorStore.setPage(pageNumber);
    };

    return (
        <Pagination
            isCompact={isCompact}
            itemCount={totalCount}
            widgetId={`${variant}-example`}
            usePageInsets={true}
            page={paginatorStore.page}
            perPage={paginatorStore.pageSize}
            perPageOptions={paginatorStore.pageSizeOptions}
            onSetPage={(_evt, newPage) => handlePageChange(newPage)}
            onPerPageSelect={(_evt, newPageSize) => paginatorStore.setPageSize(newPageSize)}
            variant={variant}
            titles={{
                paginationAriaLabel: `${variant} pagination`
            }}
        />
    )
}
