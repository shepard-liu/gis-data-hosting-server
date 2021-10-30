"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Data = exports.GISDatasetType = void 0;
const pgServer_1 = require("../db/pgServer");
/**
 * This is not an exhaustive list of GIS data.
 * Will be manipulated later.
 */
var GISDatasetType;
(function (GISDatasetType) {
    GISDatasetType["Vector"] = "Vector";
    GISDatasetType["Raster"] = "Raster";
    GISDatasetType["BIM"] = "BIM";
    GISDatasetType["GeoDataBase"] = "GeoDataBase";
    GISDatasetType["Other"] = "Other";
})(GISDatasetType = exports.GISDatasetType || (exports.GISDatasetType = {}));
/**
 * Handles database queries for GIS data index table
 * The table contains information about the GIS data
 * stored on the server.
 */
class Data {
    /**
     * query the database for all rows in db table 'gis_data_index'
     * @returns array of DataIndex
     */
    static getDatasetIndices() {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield pgServer_1.dbClient.query(`SELECT id, ST_AsText(extent) AS extent, layer_url, item_id, type, description FROM gis_data_index`);
            return result.rows;
        });
    }
    /**
     * query the database to insert a row into 'gis_data_index' table
     * @param datasetIndex the index information to be inserted
     */
    static addDatasetIndex(datasetIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            yield pgServer_1.dbClient.query(`INSERT INTO gis_data_index(extent, file_path, layer_url, item_id, type, description)
        VALUES($1, $2, $3, $4, $5, $6)`, [
                datasetIndex.extent,
                datasetIndex.file_path,
                datasetIndex.layer_url,
                datasetIndex.type,
                datasetIndex.description
            ]);
        });
    }
    /**
     * Query the database for the file path of the specified dataset
     * @param id the id of the dataset index
     * @return file path of the specified dataset
     */
    static getDatasetFilePathById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield pgServer_1.dbClient.query(`SELECT file_path FROM gis_data_index WHERE id = $1`, [id]);
            if (result.rows.length)
                return result.rows[0].file_path;
            else
                return null;
        });
    }
}
exports.Data = Data;
