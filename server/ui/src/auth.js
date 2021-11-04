"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setJwtCredential = exports.setAuthHeader = exports.jwt = void 0;
function setAuthHeader(requestOpts) {
    requestOpts.headers['Authorization'] = 'Bearer ' + exports.jwt;
}
exports.setAuthHeader = setAuthHeader;
function setJwtCredential(_jwt) { exports.jwt = _jwt; }
exports.setJwtCredential = setJwtCredential;
