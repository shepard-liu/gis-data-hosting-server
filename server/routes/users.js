"use strict";
exports.__esModule = true;
exports.usersRouter = void 0;
var express = require("express");
var router = express.Router();
exports.usersRouter = router;
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
