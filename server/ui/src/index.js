"use strict";
//-------------------------------------
//    Precreate Element Containers
//-------------------------------------
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
//Create viewDiv for map, tableDiv for feature table
const dom_1 = require("./util/dom");
const mainViewTableContainer = (0, dom_1.defineElement)('div', 'mainViewTableContainer', "view-table-container");
const mainViewElement = (0, dom_1.defineElement)('div', 'viewDiv');
const tableContainerElement = (0, dom_1.defineElement)('div', 'tableContainer');
const tableElement = (0, dom_1.defineElement)('div', 'tableDiv');
const preViewElement = (0, dom_1.defineElement)('div', 'preView');
mainViewTableContainer.appendChild(mainViewElement);
mainViewTableContainer.appendChild(tableContainerElement)
    .appendChild(tableElement);
document.body.appendChild(mainViewTableContainer);
document.body.appendChild(preViewElement);
//-------------------------------------
//    Import Modules
//-------------------------------------
// import stylesheets
// Twitter Bootstrap
require("../sass/bootstrap.min.css");
// synchronously loading libs
const config_1 = require("@arcgis/core/config");
const Map_1 = require("@arcgis/core/Map");
const SceneView_1 = require("@arcgis/core/views/SceneView");
const authHelper_1 = require("./util/authHelper");
const dataManager_1 = require("./util/dataManager");
const FeatureTable_1 = require("@arcgis/core/widgets/FeatureTable");
const datasetPopup_1 = require("./widgets/popup/datasetPopup");
const seperator_1 = require("./util/seperator");
const WebScene_1 = require("@arcgis/core/WebScene");
const LayerList_1 = require("@arcgis/core/widgets/LayerList");
const FeatureLayer_1 = require("@arcgis/core/layers/FeatureLayer");
const Slice_1 = require("@arcgis/core/widgets/Slice");
const Expand_1 = require("@arcgis/core/widgets/Expand");
const AreaMeasurement3D_1 = require("@arcgis/core/widgets/AreaMeasurement3D");
const Daylight_1 = require("@arcgis/core/widgets/Daylight");
const Legend_1 = require("@arcgis/core/widgets/Legend");
const Home_1 = require("@arcgis/core/widgets/Home");
// import { Debug, initializeDebugger } from './util/debugger';
// initializeDebugger();
// After module loaded, remove loader
document.getElementById('loading').remove();
mainViewElement.style.height = '100%';
//-----------------------------------------------
//    Initialize Map and View before login
//-----------------------------------------------
// Set asset path to local
config_1.default.assetsPath = "./assets";
const map = new Map_1.default({
    basemap: "osm", // Can be accessed without api-key
});
const view = new SceneView_1.default({
    container: mainViewElement,
    map: map,
    zoom: 1,
});
const preView = new SceneView_1.default({
    container: preViewElement,
});
let featureTable;
//-----------------------------------------------
//    Start login procedure
//-----------------------------------------------
const authHelper = authHelper_1.default.instance();
authHelper.createNewLoginSession(view, true);
//-----------------------------------------------
//    Main Logic after login
//-----------------------------------------------
// Stores all active handlers defined after logged in
let watchHandlers = [];
// Stores currect selected features in the featureTable
const selectedFeatures = [];
// When successfully logged in, fetch dataset index from server
authHelper.watch('loginStatus', (value) => __awaiter(void 0, void 0, void 0, function* () {
    if (value !== 'finished')
        return;
    // This will not affect the watchHandler for loginStatus.
    watchHandlers.forEach((handler) => { handler.remove(); });
    watchHandlers = [];
    dataManager_1.default.setRequestAuthHeader();
    // asyncronously fetch dataset index list and bind feature layer to feature table and map
    const datasetIndexFeatureLayer = yield dataManager_1.default.getDatasetIndexFeatureLayer();
    map.add(datasetIndexFeatureLayer);
    featureTable = new FeatureTable_1.default({
        layer: datasetIndexFeatureLayer,
        view: view,
        container: tableElement,
        fieldConfigs: dataManager_1.default.datasetIndexFields
    });
    //-------------------------------------------
    //  Create seperator bar for view and table
    //-------------------------------------------
    mainViewTableContainer.style.height = '100%';
    tableContainerElement.style.height = '40%';
    mainViewElement.style.height = '60%';
    (0, seperator_1.createSeperatorBar)('view-table-seperator', 'horizental-seperator', 'horizental', [mainViewElement, tableContainerElement], 20, 80, 10);
    //-------------------------------------
    // bind view popup with feature table
    //-------------------------------------
    const popupViewModel = view.popup.viewModel;
    // To prevent the popup content being constructed twice when
    // user clicks to trigger the popup widget
    let noOpenFlag = false;
    watchHandlers.push(popupViewModel.watch('active', (isActive) => {
        if (!isActive)
            featureTable.clearSelection();
        if (isActive) {
            if (selectedFeatures.length === 0) {
                noOpenFlag = true;
                featureTable.selectRows(popupViewModel.features);
            }
        }
    }));
    watchHandlers.push(popupViewModel.watch('selectedFeature', (selectedFeature) => {
        if (selectedFeature) {
            const graphic = selectedFeature;
            const newPopup = new datasetPopup_1.default({ graphic });
            popupViewModel.content = newPopup;
            popupViewModel.title = graphic.attributes.name;
        }
    }));
    featureTable.on('selection-change', (event) => {
        // Maintain a selected feature array for feature table
        event.added.forEach((item) => {
            selectedFeatures.unshift(item.feature);
        });
        event.removed.forEach((item) => {
            const spliced = selectedFeatures.splice(selectedFeatures.findIndex((graphic) => graphic == item.feature), 1);
            // if the removed feature is now being displayed, set popup
            if (spliced[0] == popupViewModel.selectedFeature)
                view.popup.close();
        });
        // Show and switch popups when there are selected features
        if (selectedFeatures.length) {
            if (!noOpenFlag) {
                // Construct a array of dataset popups
                view.popup.open({
                    // I have no idea why I need to 'clone' the array before passing it to the features
                    // It's more like rearranging the memory but not cloning
                    features: selectedFeatures.map(elem => elem),
                    updateLocationEnabled: true
                });
                console.log('opening');
            }
        }
        else {
            // Close when there's none selected
            view.popup.close();
        }
        noOpenFlag = false;
    });
    //--------------------------------
    //  On previewing dataset
    //--------------------------------
    let isPreviewInitialized = false;
    watchHandlers.push(datasetPopup_1.default.currentPreview.watch('graphic', (value) => {
        if (!value)
            return;
        //------------------------------------
        //  Attach scene view with item
        //------------------------------------
        const graphic = value;
        const { type, name, id, item_id, layer_url } = graphic.attributes;
        if ((!item_id || item_id.length === 0) && (!layer_url || layer_url.length === 0)) {
            alert('This dataset is currently not previewable.');
            return;
        }
        if (type === 'BIM') {
            // Specify webscene
            const bimScene = new WebScene_1.default({
                portalItem: {
                    id: item_id,
                }
            });
            //Attach with scene view
            preView.map = bimScene;
        }
        else if (type === 'Vector') {
            const previewFeatureLayer = new FeatureLayer_1.default({
                url: layer_url,
            });
            preView.map = new Map_1.default({
                layers: [previewFeatureLayer],
                basemap: 'osm'
            });
        }
        // Make space for preview scene view element
        if (!isPreviewInitialized) {
            mainViewTableContainer.style.width = '50%';
            preViewElement.style.width = '50%';
            preViewElement.style.height = '100%';
            document.body.style.display = 'flex';
            (0, seperator_1.createSeperatorBar)('main-view-table-preview-seperator', 'vertical-seperator', 'vertical', [mainViewTableContainer, preViewElement], 10, 90, 8);
            isPreviewInitialized = true;
            // Initializing tools
            const expandWidgets = [];
            expandWidgets.push(new Expand_1.default({
                content: new LayerList_1.default({ view: preView }),
                expandIconClass: 'esri-icon-layer-list',
                view: preView
            }), new Expand_1.default({
                content: new Slice_1.default({ view: preView }),
                expandIconClass: 'esri-icon-slice',
                view: preView,
            }), new Expand_1.default({
                content: new AreaMeasurement3D_1.default({ view: preView, }),
                expandIconClass: 'esri-icon-measure-area',
                view: preView,
            }), new Expand_1.default({
                content: new Daylight_1.default({ view: preView }),
                expandIconClass: 'esri-icon-lightbulb',
                view: preView,
            }), new Expand_1.default({
                content: new Legend_1.default({ view: preView }),
                expandIconClass: 'esri-icon-legend',
                view: preView,
            }));
            expandWidgets.forEach((currentExpand) => {
                currentExpand.watch('expanded', (isExpanded) => {
                    if (isExpanded) {
                        //Fold all other widgets
                        expandWidgets.forEach(widget => {
                            if (widget !== currentExpand)
                                widget.collapse();
                        });
                    }
                });
                preView.ui.add(currentExpand, 'top-right');
            });
            // Add home widget
            preView.ui.add(new Home_1.default({ view: preView }), 'top-left');
        }
    }));
}));
