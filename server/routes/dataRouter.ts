import * as express from 'express';
import { authenticateWithJwt, authenticateWithAdmin, validateJwt } from '../auth/authenticate.js';
import { Data, DatasetIndex, GISDatasetType } from '../util/data';
import * as path from 'path'
import * as fs from 'fs'

const router = express.Router();

/**
 * Handling dataset index get request
 * 
 * response format:
 * {    
 *     [DatasetIndex]
 * }
 */
router.route('/').get(authenticateWithJwt, (request, response) => {
    Data.getDatasetIndices().then(datasetIndices => {
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
router.route('/').post(authenticateWithJwt, authenticateWithAdmin, (request, response) => {

    Data.addDatasetIndex(request.body as DatasetIndex).then(() => {
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
 * /data/:id?token=xxxxxxxxxxxxxxxx
 * 
 * response format: 
 * header : content-disposition: ...
 * body   : dataset file (.zip)
 */

// Manually verify jwt credential
router.route('/:id').get((request, response, next) => {
    validateJwt(request.query.token as string).then((user) => {
        if (!user) {
            response.statusCode = 401;
            response.setHeader('Content-Type', 'application/json');
            response.json({
                success: false,
                message: 'Unauthorized'
            });
            return;
        }
        Data.getDatasetFilePathById(Number(request.params.id)).then((filePath) => {
            response.statusCode = 200;
            response.setHeader('Content-Disposition', `attachment; filename = "${path.basename(filePath)}"`);
            fs.readFile(filePath, (err, data) => {
                if (err) console.log(err);
                else response.end(data);
            });
        }).catch((err) => {
            response.statusCode = 404;
            response.setHeader('Content-Type', 'application/json');
            response.json({
                success: false,
                message: 'Failed to locate the dataset file with given ID.'
            });
        })
    }).catch(console.log);
})

export default router;