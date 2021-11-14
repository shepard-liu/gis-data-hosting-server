//-------------------------------------
//    Precreate Element Containers
//-------------------------------------

//Create viewDiv for map, tableDiv for feature table
import { defineElement } from './util/dom';

const mainViewTableContainer = defineElement('div', 'mainViewTableContainer', "view-table-container");
const mainViewElement = defineElement('div', 'viewDiv');
const tableContainerElement = defineElement('div', 'tableContainer');
const tableElement = defineElement('div', 'tableDiv');
const preViewElement = defineElement('div', 'preView');
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
import { createSeperatorBar } from './util/seperator';
import WebScene from '@arcgis/core/WebScene';
import LayerList from '@arcgis/core/widgets/LayerList';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Slice from '@arcgis/core/widgets/Slice';
import Expand from '@arcgis/core/widgets/Expand';
import AreaMeasurement3D from '@arcgis/core/widgets/AreaMeasurement3D';
import Daylight from '@arcgis/core/widgets/Daylight';
import Legend from '@arcgis/core/widgets/Legend';
import Home from '@arcgis/core/widgets/Home';
// import { Debug, initializeDebugger } from './util/debugger';
// initializeDebugger();

// After module loaded, remove loader
document.getElementById('loading').remove();
mainViewElement.style.height = '100%';

//-----------------------------------------------
//    Initialize Map and View before login
//-----------------------------------------------

// Set asset path to local
esriConfig.assetsPath = "./assets";

const map = new EsriMap({
    basemap: "osm", // Can be accessed without api-key
});

const view = new SceneView({
    container: mainViewElement as HTMLDivElement,
    map: map,
    zoom: 1,
});

const preView = new SceneView({
    container: preViewElement as HTMLDivElement,
})

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
        container: tableElement,
        fieldConfigs: DataManager.datasetIndexFields as __esri.FieldColumnConfigProperties[]
    });

    //-------------------------------------------
    //  Create seperator bar for view and table
    //-------------------------------------------
    mainViewTableContainer.style.height = '100%';
    tableContainerElement.style.height = '40%';
    mainViewElement.style.height = '60%';
    createSeperatorBar(
        'view-table-seperator',
        'horizental-seperator',
        'horizental',
        [mainViewElement, tableContainerElement],
        20, 80,
        10
    );


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

    //--------------------------------
    //  On previewing dataset
    //--------------------------------

    let isPreviewInitialized: boolean = false;
    watchHandlers.push(DatasetPopup.currentPreview.watch('graphic', (value) => {
        if (!value) return;
        //------------------------------------
        //  Attach scene view with item
        //------------------------------------
        const graphic = value as DatasetIndexGraphic;
        const { type, name, id, item_id, layer_url } = graphic.attributes;
        if ((!item_id || item_id.length === 0) && (!layer_url || layer_url.length === 0)) {
            alert('This dataset is currently not previewable.');
            return;
        }

        if (type === 'BIM') {

            // Specify webscene
            const bimScene = new WebScene({
                portalItem: {
                    id: item_id,
                }
            });

            //Attach with scene view
            preView.map = bimScene;

        } else if (type === 'Vector') {

            const previewFeatureLayer = new FeatureLayer({
                url: layer_url,
            });

            preView.map = new EsriMap({
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
            createSeperatorBar(
                'main-view-table-preview-seperator',
                'vertical-seperator',
                'vertical',
                [mainViewTableContainer, preViewElement],
                10, 90,
                8
            );
            isPreviewInitialized = true;

            // Initializing tools
            const expandWidgets: Expand[] = [];

            expandWidgets.push(
                new Expand({
                    content: new LayerList({ view: preView }),
                    expandIconClass: 'esri-icon-layer-list',
                    view: preView
                }),
                new Expand({
                    content: new Slice({ view: preView }),
                    expandIconClass: 'esri-icon-slice',
                    view: preView,
                }),
                new Expand({
                    content: new AreaMeasurement3D({ view: preView, }),
                    expandIconClass: 'esri-icon-measure-area',
                    view: preView,
                }),
                new Expand({
                    content: new Daylight({ view: preView }),
                    expandIconClass: 'esri-icon-lightbulb',
                    view: preView,
                }),
                new Expand({
                    content: new Legend({ view: preView }),
                    expandIconClass: 'esri-icon-legend',
                    view: preView,
                })
            );

            expandWidgets.forEach((currentExpand) => {
                currentExpand.watch('expanded', (isExpanded) => {
                    if (isExpanded) {
                        //Fold all other widgets
                        expandWidgets.forEach(widget => {
                            if (widget !== currentExpand)
                                widget.collapse();
                        })
                    }
                });
                preView.ui.add(currentExpand, 'top-right');
            });

            // Add home widget
            preView.ui.add(new Home({ view: preView }), 'top-left');
        }

    }));
});