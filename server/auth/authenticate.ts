import * as passport from 'passport';
import { Users, User } from '../util/users.js';
import { Strategy as jwtStrategy, ExtractJwt as jwtExtractor } from 'passport-jwt';
import * as jwt from 'jsonwebtoken';
import config from '../config.js';
import * as express from 'express';

type JwtPayload = {
    username: string,
    iat: number, //issued at - the timestamp that the jwt is signed
}

// use local authentication strategy
passport.use(Users.authStrategy);

/**
 * Sign the JWT
 * @param username the payload of jwt
 * @return signed jwt 
 */
export function generateJwt(username: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        jwt.sign({
            username,
            iat: Date.now()
        }, config.secretKey, {
            expiresIn: config.jwtExpirationTime
        }, (err, jwtString) => {
            if (err) reject(err);
            else resolve(jwtString);
        });
    });
};

// use json web token strategy
passport.use(new jwtStrategy({
    secretOrKey: config.secretKey,
    jwtFromRequest: jwtExtractor.fromAuthHeaderAsBearerToken()
}, (payload, done) => {
    const { username, iat } = payload as JwtPayload;

    Users.find(username).then((user) => {
        if (user && (user.last_logout || 0) < iat) done(null, user);
        else done(null, false);
    }).catch((err) => {
        done(err, false);
    });
}));

/**
 * A manual validation method
 * @param jwtString jwt credential
 * @returns username if verified, false otherwise
 */
export function validateJwt(jwtString: string): Promise<User | boolean> {
    return new Promise<User | boolean>((resolve, reject) => {
        jwt.verify(jwtString, config.secretKey, (err, decodedObject) => {
            if (err) resolve(false);    // Invalid jwt or expired jwt
            else {
                // Validate user from the users database table
                const { username, iat } = decodedObject as JwtPayload;

                // Check if the user exists, and if he/she has logged out before expiration
                Users.find(username).then((user) => {
                    if (user && (user.last_logout || 0) < iat) resolve(user);
                    else resolve(false);
                }).catch((err) => {
                    reject(err);
                });
            }
        });
    });
}

/**
 * This function extract jwt from Request Auth Header and query the
 * user database to verify the user
 */
export const authenticateWithJwt = passport.authenticate('jwt', { session: false });

/**
 * Handles user authentication with passport local strategy
 */
export const authenticateWithLocal = passport.authenticate('local', {
    session: false,
    failWithError: true, // The error set by passport will be handled
});

/**
 * Verify if the user is an administrator
 */
export const authenticateWithAdmin: express.RequestHandler = (request, response, next) => {
    if ((<User>request.user).admin)
        next();
    else
        next(new Error('Permission denied.'));
};