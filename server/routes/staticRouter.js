"use strict";
/**
 * Configures the static assets serving settings
 */
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const express = require("express");
const fs = require("fs");
const config_1 = require("../config");
const router = express.Router();
// For any file
router.get(/.*/, (request, response, next) => {
    let file = request.url.substring(1);
    if (file.length === 0)
        file = 'index.html';
    let fullPath = path.resolve(__dirname, '../public', file);
    // Determine if the file exists.
    fs.stat(fullPath, (err, stats) => {
        if (err) // continue to another router if the file not exists
            next();
        else {
            // serve up the static file in '/server/public' folder
            let extname = path.extname(file);
            response.statusCode = 200;
            response.setHeader('Content-Type', config_1.default.mime[extname]);
            fs.createReadStream(fullPath).pipe(response);
        }
    });
});
exports.default = router;
