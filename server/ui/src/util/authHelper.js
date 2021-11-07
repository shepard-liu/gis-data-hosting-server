"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AuthHelper_1;
Object.defineProperty(exports, "__esModule", { value: true });
const Accessor_1 = require("@arcgis/core/core/Accessor");
const decorators_1 = require("@arcgis/core/core/accessorSupport/decorators");
const Login_1 = require("../widgets/login/Login");
/**
 * AuthHelper class
 * access the singleton with AuthHelper.instance()
 */
let AuthHelper = AuthHelper_1 = class AuthHelper extends Accessor_1.default {
    constructor() {
        super();
        // Stores watchhandlers for clean up procedure
        this.loginWatchHandler = null;
    }
    // Get the AuthHelper instance
    static instance() {
        return AuthHelper_1._instance ?
            AuthHelper_1._instance :
            AuthHelper_1._instance = new AuthHelper_1();
    }
    setAuthHeader(requestOpts) {
        const authString = 'Bearer ' + this.jwt;
        if (requestOpts.headers === undefined) {
            requestOpts.headers = {
                Authorization: authString
            };
        }
        else {
            requestOpts.headers.Authorization = authString;
        }
    }
    setJwtCredential(_jwt) {
        this.jwt = _jwt;
    }
    createNewLoginSession(view, animateSuccess) {
        this.view = view || this.view;
        animateSuccess = animateSuccess || false;
        this.loginStatus = 'inProgress';
        // Initialize Widgets
        const loginWidget = new Login_1.default();
        this.view.ui.add(loginWidget, 'manual');
        // Watch Login Status
        if (this.loginWatchHandler)
            this.loginWatchHandler.remove();
        this.loginWatchHandler = loginWidget.watch('status', (status) => {
            if (status !== 'success')
                return;
            this.loginStatus = 'finished';
            // Destroy login widget
            setTimeout(() => { loginWidget.destroy(); }, 1000);
            // Animated navigation to China
            if (animateSuccess) {
                setTimeout(() => {
                    view.goTo({
                        center: [110, 30],
                        zoom: 4,
                    }, {
                        duration: 1500
                    });
                });
            }
        });
    }
};
// Single Instance
AuthHelper._instance = null;
__decorate([
    (0, decorators_1.property)()
], AuthHelper.prototype, "jwt", void 0);
__decorate([
    (0, decorators_1.property)()
], AuthHelper.prototype, "view", void 0);
__decorate([
    (0, decorators_1.property)()
], AuthHelper.prototype, "loginStatus", void 0);
AuthHelper = AuthHelper_1 = __decorate([
    (0, decorators_1.subclass)('util.AuthHelper')
], AuthHelper);
exports.default = AuthHelper;
