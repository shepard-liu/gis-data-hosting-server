"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const authenticate_1 = require("../auth/authenticate");
const users_1 = require("../util/users");
const router = express.Router();
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
 * (when successful)
 * {
 * 		success: boolean,
 * 		token: string,	//JsonWebToken
 * 		message: string	//A greeting message
 * }
 * (when failed)
 * {
 * 		success: boolean,
 * 		message: string
 * }
 */
router.route('/login').post(authenticate_1.authenticateWithLocal, (request, response, next) => {
    // Record the log-in activity in the database
    users_1.Users.logUserActivity(request.user.username, users_1.UserActivity.Login, 'Successful', request.ip)
        .catch(console.log);
    // Configuring response
    (0, authenticate_1.generateJwt)(request.user.username).then(jwtString => {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.json({
            success: true,
            token: jwtString,
            message: "You've been logged in.",
        });
    }).catch(console.log);
}, (error, request, response, next) => {
    // Record the log-in activity in the database
    users_1.Users.logUserActivity(null, users_1.UserActivity.Login, 'Failed', request.ip)
        .catch(console.log);
    // delay the response
    setTimeout(() => {
        response.statusCode = 401;
        response.setHeader('Content-Type', 'application/json');
        response.json({
            success: false,
            message: "Incorrect username or password"
        });
    }, 1000);
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
router.route('/signup').post((request, response, next) => {
    // The register is not open now.
    response.statusCode = 405;
    response.setHeader('Content-Type', 'application/json');
    response.json({
        success: false,
        token: null,
        status: `The registration procedure is currently not available.
Contact the website administrator for a available account.`
    });
    return;
    // Try to register the user
    users_1.Users.register(request.body).then((user) => {
        // Record the registration activity to the database
        users_1.Users.logUserActivity(request.body.username, users_1.UserActivity.Register, 'Successful', request.ip)
            .catch(console.log);
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.json({
            success: true,
            token: (0, authenticate_1.generateJwt)(request.body.username),
            status: "Registration Successful!"
        });
    }).catch((err) => {
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
router.route('/logout').post(authenticate_1.authenticateWithJwt, (request, response, next) => {
    // Record the log-out activity in the database
    users_1.Users.logUserActivity(request.user.username, users_1.UserActivity.Logout, 'Successful', request.ip)
        .catch(console.log);
    // Record the last log-out time of the user in the database
    // JWT is stateless. So I have to record the last log out time in the database
    // The Jwt payload has a 'issued at' timestamp. if the last log out timestamp > iat,
    // the authentication process will be terminated.
    users_1.Users.logUserLastLogout(request.user.username)
        .catch(console.log);
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.json({
        success: true,
        message: "You've been successfully logged out"
    });
});
exports.default = router;
