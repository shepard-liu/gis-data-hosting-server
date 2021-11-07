import '../../../sass/widgets/login.scss';


export const CSS = {
    root: "login esri-widget",
    container: 'login__container container',
    heading: "esri-widget__heading login__heading",
    inputBox: "login__input-box",
    inputBoxLabel: "login__input-box-label",
    inputBoxInput: "login__input-box-input esri-input",
    loginButtonWrapper: "login__login-button-wrapper col-sm-12 col-md-5",
    registerButtonWrapper: "login__register-button-wrapper col-sm-12 col-md-5",
    loginButton: "esri-button login__login-button",
    loginButtonIconLoading: "login__login-button-icon-loading",
    loginButtonIconSuccess: "login__login-button-icon-success",
    registerButton: "esri-button--secondary login__register-button",
    buttonGap: "col-sm-0 col-md-2",
    messageLabel: {
        warning: "login__message-label--warning",
        success: "login__message-label--success",
        error: "login__message-label--error"
    },
};

export const assets = {
    icons: {
        loading: require('../../../assets/loading.svg'),
        loginSuccess: require('../../../assets/login-success.svg'),
    },
}

export const i18n = {
    login: 'Login',
    register: 'Register',
    messages: {
        serverError: "Server encountered an error when processing your login request.",
        invalidCredentials: "Incorrect username or password.",
        invalidInput: "8~16 characters required for username and password.",
        registerNotOpen: "Registration is not available currently. Please contact adminstrator for an account"
    },
    labels: {
        accountName: 'Account Name',
        password: 'Password',
    },
    placeholders: {
        accoutName: 'Your account name here',
        password: 'Your password here'
    },
    loadingIconTitle: 'Please wait',
    loginSuccessIconTitle: 'Login successful'
}