"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const widget_1 = require("@arcgis/core/widgets/support/widget");
const Widget_1 = require("@arcgis/core/widgets/Widget");
const decorators_1 = require("@arcgis/core/core/accessorSupport/decorators");
const resources_1 = require("./resources");
const loginViewModel_1 = require("./loginViewModel");
let Login = class Login extends Widget_1.default {
    ////////////////////////////////
    //  LifeCycle
    ////////////////////////////////
    constructor(params) {
        super(params);
        this.viewModel = new loginViewModel_1.default();
    }
    postInitialize() {
    }
    destroy() {
    }
    ////////////////////////////////
    // Render
    ////////////////////////////////
    render() {
        return ((0, widget_1.tsx)("div", { class: resources_1.CSS.root },
            (0, widget_1.tsx)("div", { class: this.classes(resources_1.CSS.container) },
                this.renderHeading(),
                this.renderInputBox(resources_1.i18n.labels.accountName, 'text', resources_1.i18n.placeholders.accoutName, 'username'),
                this.renderInputBox(resources_1.i18n.labels.password, 'password', resources_1.i18n.placeholders.password, 'password'),
                (0, widget_1.tsx)("div", { class: "row" },
                    this.renderLoginButton(),
                    (0, widget_1.tsx)("div", { class: resources_1.CSS.buttonGap }),
                    this.renderRegisterButton()),
                this.renderMessage())));
    }
    renderHeading() {
        return ((0, widget_1.tsx)("div", { class: this.classes(resources_1.CSS.heading) }, resources_1.i18n.login));
    }
    renderInputBox(label, type, placeholder, bindProp) {
        return ((0, widget_1.tsx)("div", { class: this.classes(resources_1.CSS.inputBox) },
            (0, widget_1.tsx)("div", { class: this.classes(resources_1.CSS.inputBoxLabel) }, label),
            (0, widget_1.tsx)("input", { class: this.classes(resources_1.CSS.inputBoxInput), bind: this, placeholder: placeholder, "data-item-prop": bindProp, type: type, onchange: this._onInputChange })));
    }
    renderLoginButton() {
        let elem = null;
        let disabled = false;
        switch (this.status) {
            case 'requested':
                elem = ((0, widget_1.tsx)("img", { class: resources_1.CSS.loginButtonIconLoading, src: resources_1.assets.icons.loading, title: resources_1.i18n.loadingIconTitle }));
                disabled = true;
                break;
            case 'success':
                elem = ((0, widget_1.tsx)("img", { class: resources_1.CSS.loginButtonIconSuccess, src: resources_1.assets.icons.loginSuccess, title: resources_1.i18n.loginSuccessIconTitle }));
                break;
            default:
                elem = resources_1.i18n.login;
        }
        return ((0, widget_1.tsx)("div", { class: resources_1.CSS.loginButtonWrapper },
            (0, widget_1.tsx)("button", { type: "submit", bind: this, disabled: disabled, class: this.classes(resources_1.CSS.loginButton), onclick: this._onLoginButtonClicked }, elem)));
    }
    renderRegisterButton() {
        return ((0, widget_1.tsx)("div", { class: resources_1.CSS.registerButtonWrapper },
            (0, widget_1.tsx)("button", { type: "button", bind: this, class: this.classes(resources_1.CSS.registerButton), onclick: this._onRegisterButtonClicked }, resources_1.i18n.register)));
    }
    renderMessage() {
        let message = null;
        let cssClass = null;
        switch (this.viewModel.status) {
            case 'idle':
                message = null;
                cssClass = null;
                break;
            case 'invalidInput':
                message = resources_1.i18n.messages.invalidInput;
                cssClass = resources_1.CSS.messageLabel.error;
                break;
            case 'requested':
                message = null;
                cssClass = null;
                break;
            case 'responsed':
                message = this.viewModel.serverResponseMessage;
                cssClass = resources_1.CSS.messageLabel.error;
                break;
            case 'success':
                message = this.viewModel.serverResponseMessage;
                cssClass = resources_1.CSS.messageLabel.success;
        }
        return ((0, widget_1.tsx)("div", { class: this.classes(cssClass) }, message));
    }
    ////////////////////////////////
    // Public Method
    ////////////////////////////////
    ////////////////////////////////
    // Protected Method
    ////////////////////////////////
    ////////////////////////////////
    // Private Method
    ////////////////////////////////
    _onInputChange(event) {
        const target = event.currentTarget;
        const itemProp = target.getAttribute("data-item-prop");
        this.viewModel.set(itemProp, target.value);
        this.viewModel.status = 'idle';
    }
    _onLoginButtonClicked(event) {
        const { viewModel } = this;
        // pre validate
        const valid = viewModel.preValidateUsername() && viewModel.preValidatePassword();
        if (!valid) {
            viewModel.status = 'invalidInput';
        }
        else {
            // send login request
            viewModel.sendAuthRequest().then((jwt) => {
                viewModel.saveJwtCredential(jwt);
                // set final status
                viewModel.status = 'success';
            }).catch((error) => {
                const statusCode = error.details.httpStatus;
                switch (statusCode) {
                    case 401:
                        this.serverResponseMessage = resources_1.i18n.messages.invalidCredentials;
                        break;
                    case 500:
                        this.serverResponseMessage = resources_1.i18n.messages.serverError;
                        break;
                }
                viewModel.status = 'responsed';
            });
        }
    }
    _onRegisterButtonClicked(event) {
        alert(resources_1.i18n.messages.registerNotOpen);
    }
};
__decorate([
    (0, decorators_1.property)()
], Login.prototype, "viewModel", void 0);
__decorate([
    (0, decorators_1.aliasOf)('viewModel.username')
], Login.prototype, "username", void 0);
__decorate([
    (0, decorators_1.aliasOf)('viewModel.password')
], Login.prototype, "password", void 0);
__decorate([
    (0, decorators_1.aliasOf)('viewModel.serverResponseMessage')
], Login.prototype, "serverResponseMessage", void 0);
__decorate([
    (0, decorators_1.aliasOf)('viewModel.status')
], Login.prototype, "status", void 0);
Login = __decorate([
    (0, decorators_1.subclass)("ui.widgets.login")
], Login);
exports.default = Login;
;
