
// Credentials
export var jwt: string;

export function setAuthHeader(requestOpts: __esri.RequestOptions) {
    requestOpts.headers['Authorization'] = 'Bearer ' + jwt;
}

export function setJwtCredential(_jwt: string) { jwt = _jwt; }