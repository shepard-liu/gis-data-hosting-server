import WidgetProperties = __esri.WidgetProperties

export interface LoginProperties
    extends LoginViewModelProperties, WidgetProperties {
}

export interface LoginViewModelProperties {
    username: string;
    password: string;
    serverResponseMessage: string;
    status: 'idle' | 'invalidInput' | 'requested' | 'responsed' | 'success';
}

export interface LoginResponseBody {
    message: string,
    success: boolean,
    token?: string
}