/*
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

import React, { ReactNode } from 'react'
import authStore from "../stores/authStore";

interface State {
    auth: authStore,
}

interface Props {
    children?: ReactNode
}

export const auth = new authStore();
export const AuthContext = React.createContext<State>({
    auth
});

export const AuthProvide = ({children}: Props) => {

    return (
        <AuthContext.Provider value={{ auth }}>
            {children}
        </AuthContext.Provider>
    )
}
