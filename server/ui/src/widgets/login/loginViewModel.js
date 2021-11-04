"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginViewModel = void 0;
const Accessor_1 = require("@arcgis/core/core/Accessor");
const decorators_1 = require("@arcgis/core/core/accessorSupport/decorators");
const request_1 = require("@arcgis/core/request");
const auth = require("../../auth");
let LoginViewModel = class LoginViewModel extends Accessor_1.default {
    constructor() {
        super();
        this.loginRequestOpts = {
            body: "",
            headers: {
                "Content-Type": "application/json"
            },
            responseType: "json"
        };
        this.status = 'idle';
    }
    /**
     * Pre validation of the username
     * @param username
     */
    preValidateUsername(username) {
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
    preValidatePassword(password) {
        // Only check the length: 8~16 characters
        password = password || this.password;
        if (!password)
            return false;
        return password.length >= 8 && password.length <= 16;
    }
    sendAuthRequest() {
        return __awaiter(this, void 0, void 0, function* () {
            // Load credentials into request body
            const { username, password } = this;
            this.loginRequestOpts.body = JSON.stringify({
                username,
                password
            });
            // Send Request
            this.status = 'requested';
            let response = yield (0, request_1.default)("/users/login", this.loginRequestOpts);
            // Extract Jwt from response
            const loginResponse = response.data;
            this.serverResponseMessage = loginResponse.message;
            this.status = 'responsed';
            return loginResponse.token;
        });
    }
    saveJwtCredential(jwt) {
        auth.setJwtCredential(jwt);
    }
};
__decorate([
    (0, decorators_1.property)()
], LoginViewModel.prototype, "username", void 0);
__decorate([
    (0, decorators_1.property)()
], LoginViewModel.prototype, "password", void 0);
__decorate([
    (0, decorators_1.property)()
], LoginViewModel.prototype, "serverResponseMessage", void 0);
__decorate([
    (0, decorators_1.property)()
], LoginViewModel.prototype, "status", void 0);
__decorate([
    (0, decorators_1.property)()
], LoginViewModel.prototype, "loginRequestOpts", void 0);
LoginViewModel = __decorate([
    (0, decorators_1.subclass)('ui.widgets.LoginViewModel')
], LoginViewModel);
exports.LoginViewModel = LoginViewModel;
