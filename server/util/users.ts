import { dbClient } from '../db/pgServer.js';
import { Strategy as LocalStrategy } from 'passport-local';

export type User = {
    username: string;
    password: string;
    admin: boolean;
    last_logout?: number;
};

export enum UserActivity {
    Login = 'Login',
    Logout = 'Logout',
    Register = 'Register',
    Query = 'Query',    // User queries GIS data availability
    Download = 'Download',
    Upload = 'Upload',
    Delete = 'Delete',
    Modify = 'Modify'    // Admin user replaces data
}

/**
 * Handles the database query,
 * Information about current users 
 */
export class Users {
    /**
     * Query database for the user
     * @param username the user's username to be query
     * @return the user's username and password.
     */
    static async find(username: string): Promise<User> {
        let result = await dbClient.query(`SELECT username, password, last_logout \
        FROM users WHERE username = $1`, [username]);
        if (result.rows.length) {
            let user = result.rows[0] as User;
            // Database table 'users' and 'user_activities' are using TIMESTAMPTZ(timestamp with time zone)
            // as time datatype. when logging user's log-out time and activity happening time, 
            // postgresql function 'now()' which returns current system time with time zone, is used.
            // The node-postgres module's type parser for TIMESTAMPTZ has been overridden to parse string directly.
            user.last_logout = new Date(user.last_logout).getTime();

            // Determine permission
            user.admin = await Users.isAdministrator(user.username);

            return user;
        } else {
            return null;
        }

    }

    /**
     * Query database to insert a new user
     * @param newUser Username and password to register
     * @return
     */
    static async register(newUser: User): Promise<void> {
        await dbClient.query("INSERT INTO users VALUES($1, $2)", [newUser.username, newUser.password]);
    }

    /**
     * The local authentication strategy
     */
    static readonly authStrategy = new LocalStrategy((username, password, done) => {
        this.find(username).then(user => {
            if (user && user.password === password)
                //This will set req.user as the authenticated user's username
                done(null, user);
            else
                done(null, false);
        }).catch(err => {
            done(err, false);
        })
    });

    /**
     * Log user activity into the database
     * @param username the username
     * @param activity the user's activity type(enum)
     * @param detail detailed description of the activity
     */
    static async logUserActivity(username: string | null, activity: UserActivity, detail: string, ipAddress: string): Promise<void> {
        await dbClient.query(`INSERT INTO user_activities(timestamp, username, activity_type, activity_detail, ip_addr)
         VALUES(current_timestamp, $1, $2, $3, $4)`,
            [username, activity, detail, ipAddress]);
    }

    /**
     * update db table 'users'. update user's last log out timestamp
     * @param username username
     */
    static async logUserLastLogout(username: string): Promise<void> {
        await dbClient.query(`UPDATE users SET last_logout = current_timestamp WHERE username = $1`,
            [username]);
    }

    static async isAdministrator(username: string): Promise<boolean> {
        return username === 'administrator';
    }

} 
