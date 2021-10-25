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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = exports.UserActivity = void 0;
var pgServer_js_1 = require("../db/pgServer.js");
var passport_local_1 = require("passport-local");
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
var Users = /** @class */ (function () {
    function Users() {
    }
    /**
     * Query database for the user
     * @param username the user's username to be query
     * @return the user's username and password.
     */
    Users.find = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, pgServer_js_1.dbClient.query("SELECT username, password, last_logout as lastlogout         FROM users WHERE username = $1", [username])];
                    case 1:
                        result = _b.sent();
                        if (result.rows.length) {
                            // Database table 'users' and 'user_activities' are using TIMESTAMPTZ(timestamp with time zone)
                            // as time datatype. when logging user's log-out time and activity happening time, 
                            // postgresql function 'now()' which returns current system time with time zone, is used.
                            // The node-postgres module's type parser for TIMESTAMPTZ has been overridden to parse string directly.
                            result.rows[0].lastlogout = new Date(result.rows[0].lastlogout).getTime();
                            return [2 /*return*/, result.rows[0]];
                        }
                        else {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Query database to insert a new user
     * @param newUser Username and password to register
     * @return
     */
    Users.register = function (newUser) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, pgServer_js_1.dbClient.query("INSERT INTO users VALUES($1, $2)", [newUser.username, newUser.password])];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Log user activity into the database
     * @param username the username
     * @param activity the user's activity type(enum)
     * @param detail detailed description of the activity
     */
    Users.logUserActivity = function (username, activity, detail, ipAddress) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, pgServer_js_1.dbClient.query("INSERT INTO user_activities(timestamp, username, activity_type, activity_detail, ip_addr)\n         VALUES(current_timestamp, $1, $2, $3, $4)", [username, activity, detail, ipAddress])];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * update db table 'users'. update user's last log out timestamp
     * @param username username
     */
    Users.logUserLastLogout = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, pgServer_js_1.dbClient.query("UPDATE users SET last_logout = current_timestamp WHERE username = $1", [username])];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    var _a;
    _a = Users;
    /**
     * The local authentication strategy
     */
    Users.authStrategy = new passport_local_1.Strategy(function (username, password, done) {
        _a.find(username).then(function (user) {
            if (user.password === password)
                //This will set req.user as the authenticated user's username
                done(null, user.username);
            else
                done(null, false, { message: "Incorrect password" });
        }).catch(function (err) {
            done(err, false);
        });
    });
    return Users;
}());
exports.Users = Users;
