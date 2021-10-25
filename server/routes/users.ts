import * as express from 'express';
import { verifyUser, generateJsonWebToken } from '../auth/authenticate';
import { Users, User, UserActivity } from '../auth/users';
import passport = require('passport');

const router = express.Router();

/**
 * Dealing with login request
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
router.route('/login').post(passport.authenticate('local'), (request, response, next) => {
	// Record the log-in activity in the database
	Users.logUserActivity(request.user as string, UserActivity.Login, 'success');
	
	// Configuring response
	response.statusCode = 200;
	response.setHeader('Content-Type', 'application/json');
	response.json({
		success: true,
		token: generateJsonWebToken(request.user as string),
		message: "You've been logged in.",
	});
});

/**
 * Dealing with signup request
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
router.route('/signup').post((request, response, next) => {
	// The register is not open now.
	response.statusCode = 405;
	response.setHeader('Content-Type', 'application/json');
	response.json({
		success: false,
		token: null,
		status: `
		The registration procedure is currently not available.
		Contact the website administrator for a available account.
		`
	});
	
	// Try to register the user
	Users.register(request.body as User).then((user) => {
		response.statusCode = 200;
		response.setHeader('Content-Type', 'application/json');
		response.json({
			success: true,
			token: generateJsonWebToken((<User>request.body).username),
			status: "Registration Successful!"
		});
	}).catch((err) => {
		// The validation of constraint for password and username should be done on the front-end
		// This error happens only when the username has already been used.
		// However, if users send a request directly. The front-end validation could be bypassed.
		// In the database table the validation will be performed again.
		response.statusCode = 400;
		response.setHeader('Content-Type', 'application/json');
		response.json({
			success: false,
			token: null,
			status: "Registration Failed. The username has already been used."
		});
	})
	
})

export { router as usersRouter };
