"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateWithAdmin = exports.authenticateWithLocal = exports.authenticateWithJwt = exports.validateJwt = exports.generateJwt = void 0;
const passport = require("passport");
const users_js_1 = require("../util/users.js");
const passport_jwt_1 = require("passport-jwt");
const jwt = require("jsonwebtoken");
const config_js_1 = require("../config.js");
// use local authentication strategy
passport.use(users_js_1.Users.authStrategy);
/**
 * Sign the JWT
 * @param username the payload of jwt
 * @return signed jwt
 */
function generateJwt(username) {
    return new Promise((resolve, reject) => {
        jwt.sign({
            username,
            iat: Date.now()
        }, config_js_1.default.secretKey, {
            expiresIn: config_js_1.default.jwtExpirationTime
        }, (err, jwtString) => {
            if (err)
                reject(err);
            else
                resolve(jwtString);
        });
    });
}
exports.generateJwt = generateJwt;
;
// use json web token strategy
passport.use(new passport_jwt_1.Strategy({
    secretOrKey: config_js_1.default.secretKey,
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken()
}, (payload, done) => {
    const { username, iat } = payload;
    users_js_1.Users.find(username).then((user) => {
        if (user && (user.last_logout || 0) < iat)
            done(null, user);
        else
            done(null, false);
    }).catch((err) => {
        done(err, false);
    });
}));
/**
 * A manual validation method
 * @param jwtString jwt credential
 * @returns username if verified, false otherwise
 */
function validateJwt(jwtString) {
    return new Promise((resolve, reject) => {
        jwt.verify(jwtString, config_js_1.default.secretKey, (err, decodedObject) => {
            if (err)
                resolve(false); // Invalid jwt or expired jwt
            else {
                // Validate user from the users database table
                const { username, iat } = decodedObject;
                // Check if the user exists, and if he/she has logged out before expiration
                users_js_1.Users.find(username).then((user) => {
                    if (user && (user.last_logout || 0) < iat)
                        resolve(user);
                    else
                        resolve(false);
                }).catch((err) => {
                    reject(err);
                });
            }
        });
    });
}
exports.validateJwt = validateJwt;
/**
 * This function extract jwt from Request Auth Header and query the
 * user database to verify the user
 */
exports.authenticateWithJwt = passport.authenticate('jwt', { session: false });
/**
 * Handles user authentication with passport local strategy
 */
exports.authenticateWithLocal = passport.authenticate('local', {
    session: false,
    failWithError: true, // The error set by passport will be handled
});
/**
 * Verify if the user is an administrator
 */
const authenticateWithAdmin = (request, response, next) => {
    if (request.user.admin)
        next();
    else
        next(new Error('Permission denied.'));
};
exports.authenticateWithAdmin = authenticateWithAdmin;
