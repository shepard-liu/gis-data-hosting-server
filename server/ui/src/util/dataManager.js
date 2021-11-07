"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var DataManager_1;
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = require("@arcgis/core/request");
const FeatureLayer_1 = require("@arcgis/core/layers/FeatureLayer");
const Graphic_1 = require("@arcgis/core/Graphic");
const decorators_1 = require("@arcgis/core/core/accessorSupport/decorators");
const Accessor_1 = require("@arcgis/core/core/Accessor");
const authHelper_1 = require("./authHelper");
const arcgis_1 = require("@terraformer/arcgis");
const Polygon_1 = require("@arcgis/core/geometry/Polygon");
const datasetPopup_1 = require("../widgets/popup/datasetPopup");
let DataManager = DataManager_1 = class DataManager extends Accessor_1.default {
    constructor(params) {
        super(params);
    }
    /**
     * Configure the credentials for subsequent requests.
     * @param jwt Optional. if not provided, function will use jwt from 'auth.js'
     */
    static setRequestAuthHeader(jwt) {
        const authHelper = authHelper_1.default.instance();
        if (jwt)
            authHelper.setJwtCredential(jwt);
        authHelper.setAuthHeader(DataManager_1.datasetIndexRequestOpts);
    }
    static getDatasetIndexFeatureLayer() {
        return __awaiter(this, void 0, void 0, function* () {
            const indices = yield DataManager_1.getDatasetIndexArray();
            if (!indices)
                return null;
            // Convert indices to Graphics
            const graphics = [];
            indices.forEach(elem => {
                const { id, layer_url, item_id, type, description, name, acquisition_time, file_size } = elem;
                graphics.push(new Graphic_1.default({
                    geometry: new Polygon_1.default((0, arcgis_1.geojsonToArcGIS)(JSON.parse(elem.extent))),
                    attributes: {
                        id,
                        name,
                        type,
                        description,
                        acquisition_time: Intl.DateTimeFormat().format(new Date(acquisition_time)),
                        file_size: DataManager_1.representFileSize(file_size),
                        layer_url,
                        item_id,
                    },
                    popupTemplate: datasetPopup_1.default.popupTemplate
                }));
            });
            // Load graphics into feature layer
            const featureLayer = new FeatureLayer_1.default({
                title: "Dataset Index list",
                source: graphics,
                objectIdField: "id",
                fields: this.datasetIndexFields,
                popupEnabled: true,
                popupTemplate: datasetPopup_1.default.popupTemplate
            });
            return featureLayer;
        });
    }
    /**
     * get a download link for the dataset
     * @param id Dataset ID
     */
    static createDownloadLink(id) {
        return `${this.datasetIndexUrl}/${id}?token=${authHelper_1.default.instance().jwt}`;
    }
    static getDatasetIndexArray() {
        return __awaiter(this, void 0, void 0, function* () {
            const { datasetIndexUrl, datasetIndexRequestOpts } = this;
            let response = null;
            // send a request to server for available dataset index list
            try {
                response = yield (0, request_1.default)(datasetIndexUrl, datasetIndexRequestOpts);
            }
            catch (err) {
                switch (err.details.httpStatus) {
                    case 401: // User's jwt credential has expired, create new login session
                        const authHelper = authHelper_1.default.instance();
                        authHelper.createNewLoginSession();
                        break;
                }
            }
            return response === null ? null : response.data;
        });
    }
    static representFileSize(fileSize) {
        let q = fileSize;
        const table = [' B', ' KB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB'];
        let rounds;
        for (rounds = 0; q >= 1024.0; ++rounds)
            q /= 1024.0;
        return q.toString().substring(0, 5) + table[rounds];
    }
};
DataManager.datasetIndexUrl = "/api/data";
DataManager.datasetIndexRequestOpts = {
    responseType: 'json',
    headers: {}
};
DataManager.datasetIndexFields = [{
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
__decorate([
    (0, decorators_1.property)()
], DataManager, "datasetIndexUrl", void 0);
__decorate([
    (0, decorators_1.property)()
], DataManager, "datasetIndexRequestOpts", void 0);
__decorate([
    (0, decorators_1.property)()
], DataManager, "datasetIndexFields", void 0);
DataManager = DataManager_1 = __decorate([
    (0, decorators_1.subclass)('util.DataManager')
], DataManager);
exports.default = DataManager;
