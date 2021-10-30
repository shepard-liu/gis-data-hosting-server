"use strict";
/**
 * Configures the static assets serving settings
 */
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var express = require("express");
var fs = require("fs");
var config_1 = require("../config");
var router = express.Router();
// For any file
router.get(/.*/, function (request, response, next) {
    var file = request.url.substring(1);
    if (file.length === 0)
        file = 'index.html';
    var fullPath = path.resolve(__dirname, '../public', file);
    // Determine if the file exists.
    fs.stat(fullPath, function (err, stats) {
        if (err) // continue to another router if the file not exists
            next();
        else {
            // serve up the static file in '/server/public' folder
            var extname = path.extname(file);
            response.statusCode = 200;
            response.setHeader('Content-Type', config_1.default.mime[extname]);
            fs.createReadStream(fullPath).pipe(response);
        }
    });
});
exports.default = router;
