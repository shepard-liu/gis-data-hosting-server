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
const mainViewTableContainer = (0, dom_1.defineElement)('div', 'mainView-table-container', 'view-table-container');
const mainViewElement = (0, dom_1.defineElement)('div', 'mainViewDiv');
const tableContainerElement = (0, dom_1.defineElement)('div', 'tableContainer');
const tableElement = (0, dom_1.defineElement)('div', 'tableDiv');
//preview sceneview element will be added to be dom when previewing items
const preViewElement = (0, dom_1.defineElement)('div', 'preViewDiv');
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
// After module loaded, remove loader
document.getElementById('loading').remove();
mainViewElement.style.height = '100%';
preViewElement.style.width = '0%';
//-----------------------------------------------
//    Initialize Map and View before login
//-----------------------------------------------
// Set asset path to local
config_1.default.assetsPath = "./assets";
const mainMap = new Map_1.default({
    basemap: "osm", // Can be accessed without api-key
});
const mainView = new SceneView_1.default({
    container: mainViewElement,
    map: mainMap,
    zoom: 1,
});
const preView = new SceneView_1.default({
    container: preViewElement,
    map: null,
});
let featureTable;
//-----------------------------------------------
//    Start login procedure
//-----------------------------------------------
const authHelper = authHelper_1.default.instance();
authHelper.createNewLoginSession(mainView, true);
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
    mainMap.add(datasetIndexFeatureLayer);
    featureTable = new FeatureTable_1.default({
        layer: datasetIndexFeatureLayer,
        view: mainView,
        container: tableElement,
        fieldConfigs: dataManager_1.default.datasetIndexFields
    });
    //-------------------------------------------
    //  Create seperator bar for view and table
    //-------------------------------------------
    tableContainerElement.style.height = '40%';
    mainViewElement.style.height = '60%';
    (0, seperator_1.createSeperatorBar)('view-table-seperator', 'horizental-seperator', 'horizental', [mainViewElement, tableContainerElement], 20, 80, 8);
    //-------------------------------------
    // bind view popup with feature table
    //-------------------------------------
    const popupViewModel = mainView.popup.viewModel;
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
                mainView.popup.close();
        });
        // Show and switch popups when there are selected features
        if (selectedFeatures.length) {
            if (!noOpenFlag) {
                // Construct a array of dataset popups
                mainView.popup.open({
                    // I have no idea why I need to 'clone' the array before passing it to the features
                    // It's more like rearranging the memory but not cloning
                    features: selectedFeatures.map(elem => elem),
                    updateLocationEnabled: true
                });
            }
        }
        else {
            // Close when there's none selected
            mainView.popup.close();
        }
        noOpenFlag = false;
    });
    //--------------------------------
    //  On previewing dataset
    //--------------------------------
    let vertialSeperatorElement = null;
    watchHandlers.push(datasetPopup_1.default.currentPreview.watch('graphic', (value) => {
        if (!value)
            return;
        //------------------------------------
        //  Attach scene view with item
        //------------------------------------
        const graphic = value;
        const { type, name, id, item_id } = graphic.attributes;
        if (type === 'BIM') {
            // Specify webscene
            const bimScene = new WebScene_1.default({
                portalItem: {
                    id: item_id,
                }
            });
            const layerListWidget = new LayerList_1.default({
                view: preView,
            });
            //Attach with scene view
            preView.map = bimScene;
            preView.ui.add(layerListWidget, 'top-right');
        }
        // Make space for preview scene view element
        if (!vertialSeperatorElement) {
            mainViewTableContainer.style.width = '50%';
            preViewElement.style.width = '50%';
            preViewElement.style.height = '100%';
            document.body.style.display = 'flex';
            vertialSeperatorElement = (0, seperator_1.createSeperatorBar)('main-view-table-preview-seperator', 'vertical-seperator', 'vertical', [mainViewTableContainer, preViewElement], 10, 90, 8);
        }
        else {
        }
    }));
}));
