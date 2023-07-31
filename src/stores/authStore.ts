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

import axios from 'axios';
import {makeAutoObservable} from "mobx";

import AuthService from "../services/AuthService";
import {IUser} from "../models/IUser";
import {AuthResponse} from "../models/AuthResponse";
import {routes} from "../routes/api-routes";


export default class authStore {
    user = {} as IUser;
    isAuth = false;
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    setLoading(bool: boolean) {
        this.isLoading = bool;
    }

    async login(nickname: string, password: string) {
        try {
            const response = await AuthService.login(nickname, password);
            localStorage.setItem(`${process.env.REACT_APP_ACCESS_TOKEN_KEY}`, response.data.access_token);
            this.setAuth(true);
            this.setUser({nickname});
        } catch (e) {
            throw e;
        }
    }

    async logout() {
        try {
            const response = await AuthService.logout();
            localStorage.removeItem(`${process.env.REACT_APP_ACCESS_TOKEN_KEY}`);
            this.setAuth(false);
            this.setUser({} as IUser);
        } catch (e) {
            throw e
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await axios.postForm<AuthResponse>(`${process.env.REACT_APP_API_URL}${routes.refreshToken}`,
                {
                    access_token: localStorage.getItem(`${process.env.REACT_APP_ACCESS_TOKEN_KEY}`)
                }
            )
            localStorage.setItem(`${process.env.REACT_APP_ACCESS_TOKEN_KEY}`, response.data.accessToken);
            this.setAuth(true);
        } catch (e) {
            this.setAuth(false)
            this.setUser({} as IUser)
        } finally {
            this.setLoading(false);
        }
    }

    async isAccessTokenExpired() {
        const token = localStorage.getItem(`${process.env.REACT_APP_ACCESS_TOKEN_KEY}`)
        if (token) {
            const decodeToken = JSON.parse(atob(token.split(".")[1]))
            return decodeToken.exp * 1000 > Date.now();
        } else {
            return false
        }
    }
}