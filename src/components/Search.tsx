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
import {
    FormGroup,
    FormHelperText,
    HelperText,
    HelperTextItem,
    SearchInput
} from "@patternfly/react-core";
import {smartSplit} from "../utils";
import searchStore from "../stores/searchStore";

interface SearchProps {
    /** An accessible label for the search input. */
    ariaLabel: string;
    /** Placeholder text of the search input. */
    placeholder: string;
}

export const Search: React.FunctionComponent<SearchProps> = ({
    ariaLabel,
    placeholder
}): React.ReactElement => {

    const navigate = useNavigate()
    const query = useQuery();

    const search: string = query.get(constants.SEARCH_VAR) || "";
    const [val, setVal] = React.useState(searchStore.value)

    /** Validate the GET query parameter for the search
     * If the parameter invalid, then remove it from the URL.
     * @param value - value from search query param.
     */
    const validatorQueryParam = (value: string) => {
        validator(value)
        if (!value && query.has(constants.SEARCH_VAR)) {
            searchStore.setError("");
            query.delete(constants.SEARCH_VAR)
            navigate(`?${query}`);
        } else if (!!searchStore.error) {
            searchStore.setError("");
            query.delete(constants.SEARCH_VAR)
            navigate(`?${query}`);
        } else {
            searchStore.setValue(value)
            setVal(value)
        }
    }

    React.useEffect(() => {
        validatorQueryParam(search)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search])

    /** Validation search value. */
    const validator = (value: string) => {
        const splitValue: string[] = smartSplit(value)
        if (value === "" || value === undefined) {
            searchStore.setError("");
        } else if (value.length < 2) {
            searchStore.setError("The input should not be shorter than 2 characters.");
        } else if (!/^[A-Za-z0-9#.@_:+ ]+$/.test(value)) {
            searchStore.setError("The input must match: [A-Za-z0-9#.@_:+ ].");
        } else if (splitValue.length > 4) {
            searchStore.setError("Input values list should contain no more than 4 elements.");
        } else {
            searchStore.setError("");
        }
    };

    /** Action when entering a value in the search input. */
    const onSearchInputChange = (newValue: string) => {
        validator(newValue)
        setVal(newValue)
    };

    /** Search action. */
    const onSearchInput = (event: React.SyntheticEvent<HTMLButtonElement>, value: string) => {
        if ('key' in event && event.key !== 'Enter') {
            return;
        }
        if (!searchStore.error) {
            query.set(constants.SEARCH_VAR, value)
            navigate(`?${query}`);
            setVal(value)
            searchStore.setValue(value)
            if (!value) {
                query.delete(constants.SEARCH_VAR)
                navigate(`?${query}`);
            }
        }
    }

    return (
        <FormGroup>
            <SearchInput
                className={"toolbar-search-input"}
                style={{"borderBottom": "var(--pf-v5-c-form-control--m-readonly--hover--after--BorderBottomColor)"} as React.CSSProperties}
                aria-label={ariaLabel}
                placeholder={placeholder}
                onChange={(_event, value) => onSearchInputChange(value)}
                value={val}
                onClear={() => {
                    onSearchInputChange("");
                }}
                onSearch={(event, value,attrValueMap) => onSearchInput(event, value)}
                onClick={(event) => {
                    validator((event.target as HTMLButtonElement).value)
                }}
            />
            {searchStore.error && (
                <FormHelperText>
                    <HelperText>
                        <HelperTextItem isDynamic variant={constants.VALID_ERR_TYPE}>
                            {searchStore.error}
                        </HelperTextItem>
                    </HelperText>
                </FormHelperText>
            )}
        </FormGroup>
    )
}