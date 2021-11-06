//-------------------------------------
//    Precreate Element Containers
//-------------------------------------

//Create viewDiv for map, tableDiv for feature table
import { defineElement } from './util/dom';

document.body.appendChild(defineElement('div', 'viewDiv'));
document.body.appendChild(defineElement('div', 'tableContainer'))
    .appendChild(defineElement('div', 'tableDiv'));

//-------------------------------------
//    Import Modules
//-------------------------------------

// import stylesheets
// Twitter Bootstrap
import '../sass/bootstrap.min.css'

// synchronously loading libs
import esriConfig from "@arcgis/core/config";
import EsriMap from '@arcgis/core/Map';
import SceneView from '@arcgis/core/views/SceneView';
import AuthHelper from './util/authHelper';
import DataManager from './util/dataManager';
import FeatureTable from '@arcgis/core/widgets/FeatureTable';
import DatasetPopup from './widgets/popup/datasetPopup';
import { DatasetIndexGraphic } from './widgets/popup/interfaces';

// After module loaded, remove loader
document.getElementById('loader').remove();
document.getElementById('viewDiv').style.height = '100%';

//-----------------------------------------------
//    Initialize Map and View before login
//-----------------------------------------------

// Set asset path to local
esriConfig.assetsPath = "./assets";

const map = new EsriMap({
    basemap: "osm", // Can be accessed without api-key
});

const view = new SceneView({
    container: "viewDiv",
    map: map,
    zoom: 1,
});

let featureTable: __esri.FeatureTable;

//-----------------------------------------------
//    Start login procedure
//-----------------------------------------------

const authHelper = AuthHelper.instance();
authHelper.createNewLoginSession(view, true);

//-----------------------------------------------
//    Main Logic after login
//-----------------------------------------------

// Stores all active handlers defined after logged in
let watchHandlers: Array<__esri.WatchHandle> = [];

// Stores currect selected features in the featureTable
const selectedFeatures: Array<DatasetIndexGraphic> = [];

// When successfully logged in, fetch dataset index from server
authHelper.watch('loginStatus', async (value: 'inProgress' | 'finished') => {

    if (value !== 'finished') return;

    // This will not affect the watchHandler for loginStatus.
    watchHandlers.forEach((handler) => { handler.remove() });
    watchHandlers = [];

    DataManager.setRequestAuthHeader();

    // asyncronously fetch dataset index list and bind feature layer to feature table and map
    const datasetIndexFeatureLayer = await DataManager.getDatasetIndexFeatureLayer();

    map.add(datasetIndexFeatureLayer);

    featureTable = new FeatureTable({
        layer: datasetIndexFeatureLayer,
        view: view,
        container: "tableDiv",
        fieldConfigs: DataManager.datasetIndexFields as __esri.FieldColumnConfigProperties[]
    });

    // make space for feature table
    document.getElementById('tableContainer').style.height = '40%';
    document.getElementById('viewDiv').style.height = '60%';

    //-------------------------------------
    // bind view popup with feature table
    //-------------------------------------
    const popupViewModel = view.popup.viewModel;
    // To prevent the popup content being constructed twice when
    // user clicks to trigger the popup widget
    let noOpenFlag = false;

    watchHandlers.push(popupViewModel.watch('active', (isActive) => {
        if (!isActive) featureTable.clearSelection();
        if (isActive) {
            if (selectedFeatures.length === 0) {
                noOpenFlag = true;
                featureTable.selectRows(popupViewModel.features);
            }
        }
    }));

    watchHandlers.push(popupViewModel.watch('selectedFeature', (selectedFeature) => {
        if (selectedFeature) {
            const graphic = (selectedFeature as DatasetIndexGraphic);
            const newPopup = new DatasetPopup({ graphic });
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
                console.log('opening')
            }
        } else {
            // Close when there's none selected
            view.popup.close();
        }

        noOpenFlag = false;
    });
});