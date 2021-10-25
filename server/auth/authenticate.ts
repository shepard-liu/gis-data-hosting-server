import passport = require('passport');
import { Users, User } from './users';
import { Strategy as jwtStrategy, ExtractJwt as jwtExtractor } from 'passport-jwt';
import jwt = require('jsonwebtoken');
import { config } from '../config';

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
export function generateJsonWebToken(username: string): string {
    return jwt.sign({
        username,
        iat: Date.now()
    }, config.secretKey, {
        expiresIn: config.jwtExpirationTime
    });
};

// use json web token strategy
passport.use(new jwtStrategy({
    secretOrKey: config.secretKey,
    jwtFromRequest: jwtExtractor.fromAuthHeaderAsBearerToken()
}, (payload, done) => {
    let { username, iat } = payload as JwtPayload;

    Users.find(username).then((user) => {
        if (user && user.lastLogout < iat) done(null, user.username);
        else done(null, false);
    }).catch((err) => {
        done(err, false);
    });

}))

/**
 * This function extract jwt from Request Auth Header and query the
 * user database to verify the user
 */
export const authenticateWithJwt = passport.authenticate('jwt', { session: false });