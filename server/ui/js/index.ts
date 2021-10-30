
//Create viewDiv for map
document.body.appendChild((() => {
    let element = document.createElement('div');
    element.setAttribute('id', 'viewDiv');
    return element;
})());

import esriConfig from "@arcgis/core/config";

// Set asset path to local
esriConfig.assetsPath = "./assets";
import Map from '@arcgis/core/Map';
import SceneView from "@arcgis/core/views/SceneView";

import '../sass/style.scss';

const map = new Map({
    basemap: "osm", // Can be accessed without api-key
});

const view = new SceneView({
    map: map,
    container: "viewDiv",
    center: [110, 30],
    zoom: 6
});

import { HelloWorld } from './widgets/HelloWorld';
view.ui.add(new HelloWorld(), 'bottom-left');