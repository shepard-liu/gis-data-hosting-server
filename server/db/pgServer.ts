import pg = require('pg');
import {config} from '../config'

const dbClient = new pg.Client(config.db);

(async function () {
    await dbClient.connect();
    console.log('Database connection established');
})().catch(err => {
    console.log("Database connection cannot be established:\n" + err);
})

export = dbClient;