"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateWithAdmin = exports.authenticateWithLocal = exports.authenticateWithJwt = exports.generateJwt = void 0;
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
    return jwt.sign({
        username,
        iat: Date.now()
    }, config_js_1.default.secretKey, {
        expiresIn: config_js_1.default.jwtExpirationTime
    });
}
exports.generateJwt = generateJwt;
;
// use json web token strategy
passport.use(new passport_jwt_1.Strategy({
    secretOrKey: config_js_1.default.secretKey,
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken()
}, (payload, done) => {
    let { username, iat } = payload;
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
 * This function extract jwt from Request Auth Header and query the
 * user database to verify the user
 */
exports.authenticateWithJwt = passport.authenticate('jwt', { session: false });
/**
 * Handles user authentication with passport local strategy
 */
exports.authenticateWithLocal = passport.authenticate('local', { session: false });
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
