import * as express from 'express';
import { authenticateWithJwt, authenticateWithLocal, generateJwt } from '../auth/authenticate.js';
import { Users, User, UserActivity } from '../auth/users.js';
import * as passport from 'passport';

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
 * {
 * 		success: boolean,
 * 		token: string,	//JsonWebToken
 * 		message: string	//A greeting message
 * }
 */
router.route('/login').post(authenticateWithLocal, (request, response, next) => {
	// Record the log-in activity in the database
	Users.logUserActivity(request.user as string, UserActivity.Login, 'Successful', request.ip)
		.catch(console.log);

	// Configuring response
	response.statusCode = 200;
	response.setHeader('Content-Type', 'application/json');
	response.json({
		success: true,
		token: generateJwt(request.user as string),
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
	Users.register(request.body as User).then((user) => {
		// Record the registration activity to the database
		Users.logUserActivity((<User>request.body).username, UserActivity.Register, 'Successful', request.ip)
			.catch(console.log);

		response.statusCode = 200;
		response.setHeader('Content-Type', 'application/json');
		response.json({
			success: true,
			token: generateJwt((<User>request.body).username),
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
	})
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
router.route('/logout').post(authenticateWithJwt, (request, response, next) => {
	// Record the log-out activity in the database
	Users.logUserActivity(request.user as string, UserActivity.Logout, 'Successful', request.ip)
		.catch(console.log);

	// Record the last log-out time of the user in the database
	// JWT is stateless. So I have to record the last log out time in the database
	// The Jwt payload has a 'issued at' timestamp. if the last log out timestamp > iat,
	// the authentication process will be blocked.
	Users.logUserLastLogout(request.user as string)
		.catch(console.log);


	response.statusCode = 200;
	response.setHeader('Content-Type', 'application/json');
	response.json({
		success: true,
		message: "You've been successfully logged out"
	});
});

export { router as usersRouter };
