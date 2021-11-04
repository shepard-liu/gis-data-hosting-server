import { tsx as jsx, renderable } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";
import { subclass, property, aliasOf } from "@arcgis/core/core/accessorSupport/decorators";

import { CSS, i18n, assets } from './resource';
import { LoginProperties } from "./interfaces";
import { LoginViewModel } from "./loginViewModel";

@subclass("ui.widgets.login")
export default class Login extends Widget {

    ////////////////////////////////
    //  LifeCycle
    ////////////////////////////////

    constructor(params?: LoginProperties) {
        super(params);
        this.viewModel = new LoginViewModel();
    }

    postInitialize(): void {

    }

    destroy(): void {

    }

    ////////////////////////////////
    // Private Variables
    ////////////////////////////////



    ///////////////////////////////
    // Properties
    ///////////////////////////////

    @property()
    @renderable([
        "viewModel.serverResponseMessage"
    ])
    viewModel: LoginViewModel;

    @aliasOf('viewModel.username')
    username: string;

    @aliasOf('viewModel.password')
    password: string;

    @aliasOf('viewModel.serverResponseMessage')
    serverResponseMessage: string;

    @aliasOf('viewModel.status')
    status: string;

    ////////////////////////////////
    // Render
    ////////////////////////////////

    render() {
        return (
            <div class={CSS.root}>
                <div class={this.classes(CSS.container)}>
                    {this.renderHeader()}
                    {this.renderInputBox(i18n.labels.accountName, 'text', i18n.placeholders.accoutName, 'username')}
                    {this.renderInputBox(i18n.labels.password, 'password', i18n.placeholders.password, 'password')}
                    <div class="row">
                        {this.renderLoginButton()}
                        <div class={CSS.buttonGap}></div>
                        {this.renderRegisterButton()}
                    </div>
                    {this.renderMessage()}
                </div>

            </div>
        )
    }

    renderHeader() {
        return (
            <div class={this.classes(CSS.header)}>
                {i18n.login}
            </div>
        );
    }

    renderInputBox(label: string, type: string, placeholder: string, bindProp: string) {
        return (
            <div class={this.classes(CSS.inputBox)}>
                <div class={this.classes(CSS.inputBoxLabel)}>
                    {label}
                </div>
                <input
                    class={this.classes(CSS.inputBoxInput)}
                    bind={this}
                    placeholder={placeholder}
                    data-item-prop={bindProp}
                    type={type}
                    onchange={this._onInputChange} />
            </div>
        )
    }

    renderLoginButton() {
        let elem = null;
        let disabled = false;

        switch (this.status) {
            case 'requested':
                elem = (
                    <img
                        class={CSS.loginButtonIconLoading}
                        src={assets.icons.loading}
                        title={i18n.loadingIconTitle}
                    />);
                disabled = true;
                break;
            case 'success':
                elem = (
                    <img
                        class={CSS.loginButtonIconSuccess}
                        src={assets.icons.loginSuccess}
                        title={i18n.loginSuccessIconTitle}
                    />);
                break;
            default:
                elem = i18n.login;
        }

        return (
            <div class={CSS.loginButtonWrapper}>
                <button
                    type="submit"
                    bind={this}
                    disabled={disabled}
                    class={this.classes(CSS.loginButton)}
                    onclick={this._onLoginButtonClicked}>
                    {elem}
                </button>
            </div>
        )
    }

    renderRegisterButton() {
        return (
            <div class={CSS.registerButtonWrapper}>
                <button
                    type="button"
                    bind={this}
                    class={this.classes(CSS.registerButton)}
                    onclick={this._onRegisterButtonClicked}>
                    {i18n.register}
                </button>
            </div>
        )
    }

    renderMessage() {
        let message: string = null;
        let cssClass: string = null;

        switch (this.viewModel.status) {
            case 'idle':
                message = null;
                cssClass = null;
                break;
            case 'invalidInput':
                message = i18n.messages.invalidInput;
                cssClass = CSS.messageLabel.error;
                break;
            case 'requested':
                message = null;
                cssClass = null;
                break;
            case 'responsed':
                message = this.viewModel.serverResponseMessage;
                cssClass = CSS.messageLabel.error;
                break;
            case 'success':
                message = this.viewModel.serverResponseMessage;
                cssClass = CSS.messageLabel.success;
        }

        return (
            <div class={this.classes(cssClass)}>
                {message}
            </div>
        )
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

    private _onInputChange(event: Event): void {
        const target = event.currentTarget as HTMLInputElement;
        const itemProp = target.getAttribute("data-item-prop");
        this.viewModel.set(itemProp, target.value);
        this.viewModel.status = 'idle';
    }

    private _onLoginButtonClicked(event: Event): void {
        const { viewModel } = this;
        // pre validate
        const valid = viewModel.preValidateUsername() && viewModel.preValidatePassword();
        if (!valid) {
            viewModel.status = 'invalidInput';
        } else {
            // send login request
            viewModel.sendAuthRequest().then((jwt) => {
                viewModel.saveJwtCredential(jwt);
                // set final status
                viewModel.status = 'success';
            }).catch((error) => {
                const statusCode = error.details.httpStatus;

                switch (statusCode) {
                    case 401:
                        this.serverResponseMessage = i18n.messages.invalidCredentials;
                        break;
                    case 500:
                        this.serverResponseMessage = i18n.messages.serverError;
                        break;
                }

                viewModel.status = 'responsed';
            });
        }
    }

    private _onRegisterButtonClicked(event: Event): void {
        alert(i18n.messages.registerNotOpen);
    }

};