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

import React from "react";
import {LoginMainHeader, LoginForm, LoginMainBody, BackgroundImage} from "@patternfly/react-core";

import ExclamationCircleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon";
import {AuthContext} from "../context/AuthProvide";
import {css} from "@patternfly/react-styles";
import styles from "@patternfly/react-styles/css/components/Login/login";
import {observer} from "mobx-react";


const LoginPageHideShowPassword: React.FunctionComponent = () => {
    /** Flag whether to show help text in the authorization form. */
    const [showHelperText, setShowHelperText] = React.useState<boolean>(false);
    /** Content displayed in the helper text component. */
    const [helperText, setHelperText] = React.useState<string>("Invalid login credentials.");
    /** Username from input. */
    const [username, setUsername] = React.useState<string>("");
    /** Flag indicating whether the username is valid. */
    const [isValidUsername, setIsValidUsername] = React.useState<boolean>(true);
    /** User password from input. */
    const [password, setPassword] = React.useState<string>("");
    /** Flag indicating whether the user password is valid. */
    const [isValidPassword, setIsValidPassword] = React.useState<boolean>(true);
    const {auth} = React.useContext(AuthContext);

    /** Function that handles the onChange event for the username */
    const handleUsernameChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
        setUsername(value);
    };
    /** Function that handles the onChange event for the user password */
    const handlePasswordChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
        setPassword(value);
    };
    /** Function that is called when the login button is clicked */
    const onLoginButtonClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();

        if (!!username && !!password) {
            try {
                await auth.login(username, password)
            } catch (e) {
                setHelperText(e.response.data.message);
                setIsValidUsername(false);
                setIsValidPassword(false);
                setShowHelperText(true)
            }
        } else {
            setIsValidUsername(!!username);
            setIsValidPassword(!!password);
            setShowHelperText(!username || !password);
        }
    };

    const loginForm = <LoginForm
        showHelperText={showHelperText}
        helperText={helperText}
        helperTextIcon={<ExclamationCircleIcon />}
        usernameLabel="Username"
        usernameValue={username}
        onChangeUsername={handleUsernameChange}
        isValidUsername={isValidUsername}
        passwordLabel="Password"
        passwordValue={password}
        isShowPasswordEnabled
        onChangePassword={handlePasswordChange}
        isValidPassword={isValidPassword}
        onLoginButtonClick={onLoginButtonClick}
        autoComplete={"test"}
        loginButtonLabel="Log in" />;

    return (
        <div className={css(styles.login)}>
            <BackgroundImage src={""} />
            <main className={css(styles.loginMain)}>
                <LoginMainHeader
                    title={"Login in the management CVE"}
                    subtitle={"Enter your single sign-on LDAP credentials."}
                />
                <LoginMainBody>{loginForm}</LoginMainBody>
            </main>
        </div>
    )
};

export default observer(LoginPageHideShowPassword);
