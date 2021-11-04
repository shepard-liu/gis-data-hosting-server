import Accessor from '@arcgis/core/core/Accessor'
import { subclass, property, aliasOf } from '@arcgis/core/core/accessorSupport/decorators';
import { LoginResponseBody, LoginViewModelProperties } from './interfaces';
import Request from '@arcgis/core/request';
import * as auth from '../../auth'

@subclass('ui.widgets.LoginViewModel')
export class LoginViewModel extends Accessor
    implements LoginViewModelProperties {

    constructor() {
        super();
        this.status = 'idle';
    }

    @property()
    username: string;

    @property()
    password: string;

    @property()
    serverResponseMessage: string;

    @property()
    status: "idle" | "invalidInput" | "requested" | "responsed" | "success";

    /**
     * Pre validation of the username
     * @param username 
     */
    preValidateUsername(username?: string): boolean {
        // Only check the length: 8~16 characters
        username = username || this.username;
        if (!username)
            return false;
        return username.length >= 8 && username.length <= 16;
    }

    /**
     * Pre validation of the password
     * @param password 
     */
    preValidatePassword(password?: string): boolean {
        // Only check the length: 8~16 characters
        password = password || this.password;
        if (!password)
            return false;
        return password.length >= 8 && password.length <= 16;
    }

    @property()
    private loginRequestOpts: __esri.RequestOptions = {
        body: "",
        headers: {
            "Content-Type": "application/json"
        },
        responseType: "json"
    };

    async sendAuthRequest(): Promise<string> {
        // Load credentials into request body
        const { username, password } = this;
        this.loginRequestOpts.body = JSON.stringify({
            username,
            password
        })

        // Send Request
        this.status = 'requested';
        let response = await Request("/users/login", this.loginRequestOpts);

        // Extract Jwt from response
        const loginResponse = response.data as LoginResponseBody;
        this.serverResponseMessage = loginResponse.message;
        this.status = 'responsed';

        return loginResponse.token;
    }

    saveJwtCredential(jwt: string): void {
        auth.setJwtCredential(jwt);
    }
}