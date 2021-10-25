"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateWithLocal = exports.authenticateWithJwt = exports.generateJwt = void 0;
var passport = require("passport");
var users_js_1 = require("./users.js");
var passport_jwt_1 = require("passport-jwt");
var jwt = require("jsonwebtoken");
var config_js_1 = require("../config.js");
// use local authentication strategy
passport.use(users_js_1.Users.authStrategy);
/**
 * Sign the JWT
 * @param username the payload of jwt
 * @return signed jwt
 */
function generateJwt(username) {
    return jwt.sign({
        username: username,
        iat: Date.now()
    }, config_js_1.config.secretKey, {
        expiresIn: config_js_1.config.jwtExpirationTime
    });
}
exports.generateJwt = generateJwt;
;
// use json web token strategy
passport.use(new passport_jwt_1.Strategy({
    secretOrKey: config_js_1.config.secretKey,
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken()
}, function (payload, done) {
    var _a = payload, username = _a.username, iat = _a.iat;
    users_js_1.Users.find(username).then(function (user) {
        if (user && (user.lastlogout || 0) < iat)
            done(null, user.username);
        else
            done(null, false);
    }).catch(function (err) {
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
