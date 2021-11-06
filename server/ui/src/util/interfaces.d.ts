
/**
 * This is not an exhaustive list of GIS data.
 * Will be manipulated later.
 */
declare enum GISDatasetType {
    Vector = 'Vector',
    Raster = 'Raster',
    BIM = "BIM",
    GeoDataBase = 'GeoDataBase',
    Other = 'Other'
}

/**
 * DataIndex, consistent with the data types of db table 'gis_data_index'
 */
interface DatasetIndex {
    id?: number,
    extent: string,             // The geometry of approximate bounding polygon of the data
    file_path?: string,         // The relative file path of the data file stored on the server
    layer_url?: string,         // The URL of ArcGIS Online layer service
    item_id?: string,           // The item ID used by ArcGIS Online layer service
    type: string,               // Dataset type, such as 'Vector', 'Raster', 'Point Cloud'
    description?: string,       // Detailed description of the dataset
    name: string,               // Dataset Name
    acquisition_time?: string,  // When the dataset was acquired
    file_size: number,          // The size of the file in Bytes
}

type Modify<T, R> = Omit<T, keyof R> & R;

interface DatasetIndexGraphicAttributes extends Modify<DatasetIndex, {
    file_size: string,          // The file_size was converted to better representation
    acquisition_time?: string,   // acquisition_time was converted to local date string
}>{}

interface DatasetIndexFileds extends __esri.FieldProperties{
    label?: string
}

interface DataManagerProperties{
}

interface AuthUtilProperties {
    jwt?: string,
    view?: __esri.View;
    loginStatus: 'finished' | 'inProgress';
}