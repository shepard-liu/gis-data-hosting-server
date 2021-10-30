"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = exports.UserActivity = void 0;
const pgServer_js_1 = require("../db/pgServer.js");
const passport_local_1 = require("passport-local");
var UserActivity;
(function (UserActivity) {
    UserActivity["Login"] = "Login";
    UserActivity["Logout"] = "Logout";
    UserActivity["Register"] = "Register";
    UserActivity["Query"] = "Query";
    UserActivity["Download"] = "Download";
    UserActivity["Upload"] = "Upload";
    UserActivity["Delete"] = "Delete";
    UserActivity["Modify"] = "Modify"; // Admin user replaces data
})(UserActivity = exports.UserActivity || (exports.UserActivity = {}));
/**
 * Handles the database query,
 * Information about current users
 */
class Users {
    /**
     * Query database for the user
     * @param username the user's username to be query
     * @return the user's username and password.
     */
    static find(username) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield pgServer_js_1.dbClient.query(`SELECT username, password, last_logout \
        FROM users WHERE username = $1`, [username]);
            if (result.rows.length) {
                let user = result.rows[0];
                // Database table 'users' and 'user_activities' are using TIMESTAMPTZ(timestamp with time zone)
                // as time datatype. when logging user's log-out time and activity happening time, 
                // postgresql function 'now()' which returns current system time with time zone, is used.
                // The node-postgres module's type parser for TIMESTAMPTZ has been overridden to parse string directly.
                user.last_logout = new Date(user.last_logout).getTime();
                // Determine permission
                user.admin = yield Users.isAdministrator(user.username);
                return user;
            }
            else {
                return null;
            }
        });
    }
    /**
     * Query database to insert a new user
     * @param newUser Username and password to register
     * @return
     */
    static register(newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            yield pgServer_js_1.dbClient.query("INSERT INTO users VALUES($1, $2)", [newUser.username, newUser.password]);
        });
    }
    /**
     * Log user activity into the database
     * @param username the username
     * @param activity the user's activity type(enum)
     * @param detail detailed description of the activity
     */
    static logUserActivity(username, activity, detail, ipAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            yield pgServer_js_1.dbClient.query(`INSERT INTO user_activities(timestamp, username, activity_type, activity_detail, ip_addr)
         VALUES(current_timestamp, $1, $2, $3, $4)`, [username, activity, detail, ipAddress]);
        });
    }
    /**
     * update db table 'users'. update user's last log out timestamp
     * @param username username
     */
    static logUserLastLogout(username) {
        return __awaiter(this, void 0, void 0, function* () {
            yield pgServer_js_1.dbClient.query(`UPDATE users SET last_logout = current_timestamp WHERE username = $1`, [username]);
        });
    }
    static isAdministrator(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return username === 'administrator';
        });
    }
}
exports.Users = Users;
_a = Users;
/**
 * The local authentication strategy
 */
Users.authStrategy = new passport_local_1.Strategy((username, password, done) => {
    _a.find(username).then(user => {
        if (user.password === password)
            //This will set req.user as the authenticated user's username
            done(null, user);
        else
            done(null, false, { message: "Incorrect password" });
    }).catch(err => {
        done(err, false);
    });
});
