import Accessor from '@arcgis/core/core/Accessor';
import { subclass, property } from '@arcgis/core/core/accessorSupport/decorators';
import SceneView from '@arcgis/core/views/SceneView';
import LoginWidget from '../widgets/login/Login';

/**
 * AuthHelper class
 * access the singleton with AuthHelper.instance()
 */
@subclass('util.AuthHelper')
export default class AuthHelper extends Accessor implements AuthUtilProperties {

    private constructor() {
        super();
    }

    // Credentials
    @property()
    jwt: string;

    @property()
    view: SceneView;

    @property()
    loginStatus: 'finished' | 'inProgress';

    // Stores watchhandlers for clean up procedure
    private loginWatchHandler: __esri.WatchHandle = null;

    // Single Instance
    private static _instance: AuthHelper = null;

    // Get the AuthHelper instance
    public static instance() {
        return AuthHelper._instance ?
            AuthHelper._instance :
            AuthHelper._instance = new AuthHelper();
    }

    public setAuthHeader(requestOpts: __esri.RequestOptions) {
        const authString = 'Bearer ' + this.jwt;
        if (requestOpts.headers === undefined) {
            requestOpts.headers = {
                Authorization: authString
            };
        } else {
            requestOpts.headers.Authorization = authString;
        }
    }

    public setJwtCredential(_jwt: string) {
        this.jwt = _jwt;
    }

    public createNewLoginSession(view?: SceneView, animateSuccess?: boolean): void {
        this.view = view || this.view;
        animateSuccess = animateSuccess || false;

        this.loginStatus = 'inProgress';
        // Initialize Widgets
        const loginWidget = new LoginWidget();
        this.view.ui.add(loginWidget, 'manual');

        // Watch Login Status
        if (this.loginWatchHandler) this.loginWatchHandler.remove();
        this.loginWatchHandler = loginWidget.watch('status', (status: string) => {
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
}