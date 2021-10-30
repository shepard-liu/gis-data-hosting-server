"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const authenticate_js_1 = require("../auth/authenticate.js");
const data_1 = require("../util/data");
const path = require("path");
const fs = require("fs");
const router = express.Router();
/**
 * Handling dataset index get request
 *
 * response format:
 * {
 *     [DatasetIndex]
 * }
 */
router.route('/').get(authenticate_js_1.authenticateWithJwt, (request, response) => {
    data_1.Data.getDatasetIndices().then(datasetIndices => {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.json(datasetIndices);
    }).catch(console.log);
});
/**
 * Handling data post request
 *
 * request format:
 * body = datasetIndex
 *
 * response format:
 * {
 *      success: string,
 *      message: string,
 * }
 */
router.route('/').post(authenticate_js_1.authenticateWithJwt, authenticate_js_1.authenticateWithAdmin, (request, response) => {
    data_1.Data.addDatasetIndex(request.body).then(() => {
        response.statusCode = 201;
        response.setHeader('Content-Type', 'application/json');
        response.json({
            success: true,
            message: "Succesfully added."
        });
    }).catch((err) => {
        response.statusCode = 400;
        response.setHeader('Content-Type', 'application/json');
        response.json({
            success: true,
            message: err
        });
    });
});
/**
 * Handling dataset get request
 *
 * request format:
 * /data/:id
 *
 * response format:
 * header : content-disposition: ...
 * body   : dataset file (.zip)
 */
router.route('/:id').get(authenticate_js_1.authenticateWithJwt, (request, response, next) => {
    data_1.Data.getDatasetFilePathById(Number(request.params.id)).then((filePath) => {
        response.statusCode = 200;
        response.setHeader('Content-Disposition', `attachment; filename = "${path.basename(filePath)}"`);
        fs.readFile(filePath, (err, data) => {
            if (err)
                console.log(err);
            else
                response.end(data);
        });
    }).catch((err) => {
        response.statusCode = 404;
        response.setHeader('Content-Type', 'application/json');
        response.json({
            success: false,
            message: 'Failed to locate the dataset file with given ID.'
        });
    });
});
exports.default = router;
