import { Client, types } from 'pg'
import config from '../config.js'

export const dbClient = new Client(config.db);

//Disable the default parser
types.setTypeParser(1114, value => value);  //TIMESTAMP
types.setTypeParser(1184, value => value);  //TIMESTAMPTZ


(async function () {
    await dbClient.connect();
    console.log('Database connection established');
})().catch(err => {
    console.log("Database connection cannot be established:\n" + err);
})

