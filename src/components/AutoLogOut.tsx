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

import React, {ReactNode} from "react";
import {events} from "../misc";
import {AuthContext} from "../context/AuthProvide";
import {IUser} from "../models/IUser";

interface Props {
    children?: ReactNode
}

export const AutoLogOut: React.FunctionComponent<Props> = ({ children }: Props) => {
    const {auth} = React.useContext(AuthContext);

    React.useEffect(() => {
        Object.values(events).forEach((item) => {
            window.addEventListener(item, () => {
                if (localStorage.getItem(`${process.env.REACT_APP_ACCESS_TOKEN_KEY}`)) {
                    if (!auth.isAccessTokenExpired() && !auth.isLoading) {
                        auth.checkAuth()
                    }
                } else {
                    auth.setAuth(false)
                    auth.setUser({} as IUser)
                }
            });
        });
    }, []);

    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    );
};
