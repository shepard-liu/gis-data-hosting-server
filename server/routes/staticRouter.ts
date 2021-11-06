/**
 * Configures the static assets serving settings
 */

import * as path from 'path';
import * as express from "express";
import * as fs from "fs";
import config from '../config';

const router = express.Router();

// For any file
router.get(/.*/, (request, response, next) => {

    let file = request.url.substring(1);
    if (file.length === 0) file = 'index.html';

    let fullPath = path.resolve(__dirname, '../public', file);
    // Determine if the file exists.
    fs.stat(fullPath, (err, stats) => {
        if (err)    // continue to another router if the file not exists
            next();
        else {
            // serve up the static file in '/server/public' folder
            let extname = path.extname(file);
            response.statusCode = 200;
            response.setHeader('Content-Type', config.mime[extname]);
            fs.createReadStream(fullPath).pipe(response);
        }
    });
});

export default router;