/*
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

import {AuthResponse} from "../models/AuthResponse";
import {AxiosResponse} from "axios";
import api from "../http/api";
import {routes} from "../routes/api-routes";

export default class AuthService {

    static async login(nickname: string, password: string): Promise<AxiosResponse> {
        // user authentication request
        return await api.postForm<AuthResponse>(routes.logIn, {
            nickname: nickname,
            password: password
        })
    }

    static async logout(): Promise<void> {
        // user logout request
        return await api.post(routes.logOut, {}, {
            headers: {
                Authorization: localStorage.getItem("accessToken")
            },
        });
    }
}