import Request from '@arcgis/core/request';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Graphic from '@arcgis/core/Graphic';
import { subclass, property } from '@arcgis/core/core/accessorSupport/decorators';
import Accessor from '@arcgis/core/core/Accessor'
import AuthHelper from './authHelper';
import { geojsonToArcGIS } from '@terraformer/arcgis';
import Polygon from '@arcgis/core/geometry/Polygon';

import DatasetPopup from '../widgets/popup/datasetPopup';

@subclass('util.DataManager')
export default class DataManager extends Accessor implements DataManagerProperties {

    private constructor(params?: DataManagerProperties) {
        super(params);
    }

    @property()
    private static readonly datasetIndexUrl: string = "/api/data";

    @property()
    private static datasetIndexRequestOpts: __esri.RequestOptions = {
        responseType: 'json',
        headers: {}
    };

    @property()
    public static readonly datasetIndexFields: Array<DatasetIndexFileds> =
        [{
            name: 'id',
            label: 'ID',
            type: 'oid',
        }, {
            name: 'name',
            label: 'Name',
            type: 'string',
        }, {
            name: 'type',
            label: 'Type',
            type: 'string',
        }, {
            name: 'acquisition_time',
            label: 'Acquisition Time',
            type: 'string'
        }, {
            // file_size requested as integer number in bytes
            // but will be transform to a more readable format
            // like a file size of 10,240 bytes will be processed into string '10 KB' 
            name: 'file_size',
            label: 'File Size',
            type: 'string',
        }, {
            name: 'description',
            label: 'Description',
            type: 'string',
        }, {
            name: 'layer_url',
            label: 'Layer URL',
            type: 'string',
        }, {
            name: 'item_id',
            label: 'Item ID',
            type: 'string',
        }];

    /**
     * Configure the credentials for subsequent requests.
     * @param jwt Optional. if not provided, function will use jwt from 'auth.js'
     */
    public static setRequestAuthHeader(jwt?: string) {
        const authHelper = AuthHelper.instance();
        if (jwt) authHelper.setJwtCredential(jwt);
        authHelper.setAuthHeader(DataManager.datasetIndexRequestOpts);
    }

    public static async getDatasetIndexFeatureLayer(): Promise<FeatureLayer> {
        const indices = await DataManager.getDatasetIndexArray();
        if (!indices) return null;

        // Convert indices to Graphics
        const graphics: Array<Graphic> = [];
        indices.forEach(elem => {
            const { id, layer_url, item_id, type, description, name, acquisition_time, file_size } = elem;
            graphics.push(new Graphic({
                geometry: new Polygon(geojsonToArcGIS(JSON.parse(elem.extent))),
                attributes: {
                    id,
                    name,
                    type,
                    description,
                    acquisition_time: Intl.DateTimeFormat().format(new Date(acquisition_time)),
                    file_size: DataManager.representFileSize(file_size),
                    layer_url,
                    item_id,
                },
                popupTemplate: DatasetPopup.popupTemplate
            }))
        });

        // Load graphics into feature layer
        const featureLayer = new FeatureLayer({
            title: "Dataset Index list",
            source: graphics,
            objectIdField: "id",
            fields: this.datasetIndexFields,
            popupEnabled: true,
            popupTemplate: DatasetPopup.popupTemplate
        });

        return featureLayer;
    }

    /**
     * get a download link for the dataset
     * @param id Dataset ID
     */
    public static createDownloadLink(id: string) {
        return `${this.datasetIndexUrl}/${id}?token=${AuthHelper.instance().jwt}`;
    }

    private static async getDatasetIndexArray(): Promise<Array<DatasetIndex>> {
        const { datasetIndexUrl, datasetIndexRequestOpts } = this;
        let response = null;
        // send a request to server for available dataset index list
        try {
            response = await Request(datasetIndexUrl, datasetIndexRequestOpts);
        } catch (err) {
            switch (err.details.httpStatus) {
                case 401: // User's jwt credential has expired, create new login session
                    const authHelper = AuthHelper.instance();
                    authHelper.createNewLoginSession();
                    break;
            }
        }
        return response === null ? null : response.data;
    }

    private static representFileSize(fileSize: number): string {
        let q: number = fileSize;
        const table = [' B', ' KB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB'];
        let rounds: number;
        for (rounds = 0; q >= 1024.0; ++rounds)
            q /= 1024.0;
        return q.toString().substring(0, 5) + table[rounds];
    }
}

