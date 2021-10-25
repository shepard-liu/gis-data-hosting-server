import dbClient = require('../db/pgServer');
import { Strategy as LocalStrategy } from 'passport-local';

export type User = {
    username: string;
    password: string;
    lastLogout?: number;
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
        let result = await dbClient.query("SELECT * FROM users WHERE username = $1", [username]);
        return result.rows.length ? result.rows[0] : null;
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
            if (user.password === password)
                //This will set req.user as the authenticated user's username
                done(null, user.username);
            else
                done(null, false, { message: "Incorrect password" });
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
    static async logUserActivity(username: string, activity: UserActivity, detail: string, ipAddress: string): Promise<void> {
        await dbClient.query(`INSERT INTO user_activities(timestamp, username, activity_type, activity_detail, ip_addr)
         VALUES(current_timestamp, $1, $2, $3)`, [username, activity, detail, ipAddress]);
    }

    /**
     * update db table 'users'. update user's last log out timestamp
     * @param username username
     */
    static async logUserLastLogout(username: string): Promise<void> {
        await dbClient.query(`UPDATE users SET last_logout = current_timestamp WHERE username = $1`, [username]);
    }

} 
