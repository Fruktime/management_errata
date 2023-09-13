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

import axios from "axios";
import {makeAutoObservable} from "mobx";
import jwt from "jwt-decode"

import AuthService from "../services/AuthService";
import {IUser} from "../models/IUser";
import {AuthResponse, IDecodeAccessToken} from "../models/AuthResponse";
import {routes} from "../routes/api-routes";


export default class authStore {
    user = {} as IUser;
    isAuth: boolean = false;
    isLoading: boolean = false;
    accessToken: string | null = localStorage.getItem(`${process.env.REACT_APP_ACCESS_TOKEN_KEY}`)
    decodeToken: IDecodeAccessToken | null = this.accessToken ? jwt(this.accessToken) : null

    constructor() {
        makeAutoObservable(this);
    }

    /** Set whether the user is authorized or not. */
    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    /** Set about information user. */
    setUser(user: IUser) {
        this.user = user;
    }

    /** Set the flag if authorization or token refresh is in progress. */
    setLoading(bool: boolean) {
        this.isLoading = bool;
    }

    /** Set access token and write it to local storage. */
    setAccessToken (token: string) {
        this.accessToken = token
        localStorage.setItem(`${process.env.REACT_APP_ACCESS_TOKEN_KEY}`, token)
    }

    /** Decode access token and set decodeToken. */
    setDecodeToken (token: string | null) {
        if (token) {
            this.decodeToken = jwt(token)
        }
    }

    /** Authenticate an existing user. */
    async login(nickname: string, password: string) {
        try {
            const response = await AuthService.login(nickname, password);
            this.setAccessToken(response.data.access_token)
            this.setDecodeToken(response.data.access_token)
            if (this.decodeToken) {
                this.setUser({nickname: this.decodeToken.nickname, groups: this.decodeToken.groups});
            }
            this.setAuth(true);
        } catch (e) {
            throw e;
        }
    }

    /** User logs out. */
    async logout() {
        try {
            await AuthService.logout();
            localStorage.removeItem(`${process.env.REACT_APP_ACCESS_TOKEN_KEY}`);
            this.setAuth(false);
            this.setUser({} as IUser);
        } catch (e) {
            throw e
        }
    }

    /** Update access token. */
    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await axios.postForm<AuthResponse>(`${process.env.REACT_APP_API_URL}${routes.refreshToken}`,
                {
                    access_token: this.accessToken
                }, {withCredentials: true}
            )
            this.setAccessToken(response.data.access_token)
            this.setDecodeToken(response.data.access_token)
            if (this.decodeToken) {
                this.setUser({nickname: this.decodeToken.nickname, groups: this.decodeToken.groups});
            }
            this.setAuth(true);
        } catch (e) {
            localStorage.removeItem(`${process.env.REACT_APP_ACCESS_TOKEN_KEY}`)
            this.setAuth(false)
            this.setUser({} as IUser)
        } finally {
            this.setLoading(false);
        }
    }

    /** Check access token expires. */
    isAccessTokenExpired() {
        if (this.accessToken && this.decodeToken) {
            return this.decodeToken.exp * 1000 > Date.now();
        } else {
            return false
        }
    }
}