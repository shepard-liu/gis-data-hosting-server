import { Stream } from "stream";
import { dbClient } from "../db/pgServer";

/**
 * This is not an exhaustive list of GIS data.
 * Will be manipulated later.
 */
export enum GISDatasetType{
    Vector = 'Vector',
    Raster = 'Raster',
    BIM = "BIM",
    GeoDataBase = 'GeoDataBase',
    Other = 'Other'
}

/**
 * DataIndex, consistent with the data types of db table 'gis_data_index'
 */
export type DatasetIndex = {
    id?: number,
    extent: string,         // The geometry of approximate bounding polygon of the data
    file_path?: string,     // The relative file path of the data file stored on the server
    layer_url?: string,     // The URL of ArcGIS Online layer service
    item_id?: string,       // The item ID used by ArcGIS Online layer service
    type: string,           // Dataset type, such as 'Vector', 'Raster', 'Point Cloud'
    description?: string,   // Detailed description of the dataset
}

/**
 * Handles database queries for GIS data index table
 * The table contains information about the GIS data
 * stored on the server.
 */
export class Data {
    /**
     * query the database for all rows in db table 'gis_data_index'
     * @returns array of DataIndex
     */
    static async getDatasetIndices(): Promise<DatasetIndex[]> {
        let result = await dbClient.query(`SELECT id, ST_AsText(extent) AS extent, layer_url, item_id, type, description FROM gis_data_index`);
        return result.rows as DatasetIndex[];
    }

    /**
     * query the database to insert a row into 'gis_data_index' table
     * @param datasetIndex the index information to be inserted
     */
    static async addDatasetIndex(datasetIndex: DatasetIndex): Promise<void>{
        await dbClient.query(`INSERT INTO gis_data_index(extent, file_path, layer_url, item_id, type, description)
        VALUES($1, $2, $3, $4, $5, $6)`, [
            datasetIndex.extent,
            datasetIndex.file_path,
            datasetIndex.layer_url,
            datasetIndex.type,
            datasetIndex.description
        ]);
    }

    /**
     * Query the database for the file path of the specified dataset
     * @param id the id of the dataset index
     * @return file path of the specified dataset
     */
    static async getDatasetFilePathById(id: number): Promise<string>{
        let result = await dbClient.query(`SELECT file_path FROM gis_data_index WHERE id = $1`, [id]);
        if (result.rows.length)
            return result.rows[0].file_path;
        else
            return null;
    }


}