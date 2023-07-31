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

import axios from "axios";
import {routes} from "../routes/api-routes";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        // Get access token from local storage and pass it to the Authorization header
        const token = localStorage.getItem(`${process.env.REACT_APP_ACCESS_TOKEN_KEY}`)
        if (token) {
            config.headers["Authorization"] = token
        }
        config.withCredentials = true
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
);

// Add a response interceptor
api.interceptors.response.use(
    (config) => {
        return config;
    },
    async (error) => {
        // Copy original config from error
        const originalConfig = {...error.config};

        /*
        If an authorization error occurred during a request to the server api, update the access token.
        Do not execute for "/cve/auth/login" and "/cve/auth/refresh-token" URLs.
        */
        if (originalConfig.url !== "/cve/auth/login" && originalConfig.url !== "/cve/auth/refresh-token") {
            if (error.response.status === 401 && !error.config._retry) {
                try {
                    originalConfig._retry = true;
                    const response = await axios.postForm(`${process.env.REACT_APP_API_URL}${routes.refreshToken}`, {
                            access_token: localStorage.getItem(`${process.env.REACT_APP_ACCESS_TOKEN_KEY}`)
                        }, {withCredentials: true}
                    )
                    localStorage.setItem(`${process.env.REACT_APP_ACCESS_TOKEN_KEY}`, response?.data?.access_token)
                    originalConfig.headers["Authorization"] = localStorage.getItem(`${process.env.REACT_APP_ACCESS_TOKEN_KEY}`)
                    return api.request(originalConfig)
                } catch (e) {
                    console.log(originalConfig.url, e)
                    return Promise.reject(e)
                }
            }
        }
        return Promise.reject(error)
    }
);

export default api;
