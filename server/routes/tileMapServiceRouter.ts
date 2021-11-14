import * as express from 'express';
import { authenticateWithJwt, authenticateWithAdmin, validateJwt } from '../auth/authenticate.js';
import { Data, DatasetIndex, GISDatasetType } from '../util/data';
import * as path from 'path'
import * as fs from 'fs'

const router = express.Router();

router.get('/:level/:row/:col', (request, response, next) => {
    
})