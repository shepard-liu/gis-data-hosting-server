"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
var express = require("express");
var authenticate_js_1 = require("../auth/authenticate.js");
var users_js_1 = require("../auth/users.js");
var router = express.Router();
exports.usersRouter = router;
/**
 * Dealing with log in request
 *
 * Request format:
 * The username and password are beared as the request body
 * {
 * 		username: string
 * 		password: string
 * }
 *
 * Response format:
 * {
 * 		success: boolean,
 * 		token: string,	//JsonWebToken
 * 		message: string	//A greeting message
 * }
 */
router.route('/login').post(authenticate_js_1.authenticateWithLocal, function (request, response, next) {
    // Record the log-in activity in the database
    users_js_1.Users.logUserActivity(request.user, users_js_1.UserActivity.Login, 'Successful', request.ip)
        .catch(console.log);
    // Configuring response
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.json({
        success: true,
        token: (0, authenticate_js_1.generateJwt)(request.user),
        message: "You've been logged in.",
    });
});
/**
 * Dealing with sign up request
 *
 * Request format:
 * The username and password are beared as the request body
 * {
 * 		username: string
 * 		password: string
 * }
 *
 * Response format:
 * {
 * 		success: boolean,
 * 		token: string,	//JsonWebToken
 * 		message: string
 * }
 */
router.route('/signup').post(function (request, response, next) {
    // The register is not open now.
    response.statusCode = 405;
    response.setHeader('Content-Type', 'application/json');
    response.json({
        success: false,
        token: null,
        status: "The registration procedure is currently not available.\nContact the website administrator for a available account."
    });
    return;
    // Try to register the user
    users_js_1.Users.register(request.body).then(function (user) {
        // Record the registration activity to the database
        users_js_1.Users.logUserActivity(request.body.username, users_js_1.UserActivity.Register, 'Successful', request.ip)
            .catch(console.log);
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.json({
            success: true,
            token: (0, authenticate_js_1.generateJwt)(request.body.username),
            status: "Registration Successful!"
        });
    }).catch(function (err) {
        // The validation of constraint for password and username should be done on the front-end
        // This error happens only when the username has already been used.
        // However, if users send a request directly, the front-end validation could be bypassed.
        // In the database table the validation will be performed again.
        response.statusCode = 400;
        response.setHeader('Content-Type', 'application/json');
        response.json({
            success: false,
            token: null,
            status: "Registration Failed. The username has already been used."
        });
    });
});
/**
 * Dealing with log out request
 *
 * Request format:
 * {
 * }
 *
 * Response format:
 * {
 * 		success: boolean,
 * 		message: string
 * }
 */
router.route('/logout').post(authenticate_js_1.authenticateWithJwt, function (request, response, next) {
    // Record the log-out activity in the database
    users_js_1.Users.logUserActivity(request.user, users_js_1.UserActivity.Logout, 'Successful', request.ip)
        .catch(console.log);
    // Record the last log-out time of the user in the database
    // JWT is stateless. So I have to record the last log out time in the database
    // The Jwt payload has a 'issued at' timestamp. if the last log out timestamp > iat,
    // the authentication process will be blocked.
    users_js_1.Users.logUserLastLogout(request.user)
        .catch(console.log);
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.json({
        success: true,
        message: "You've been successfully logged out"
    });
});
