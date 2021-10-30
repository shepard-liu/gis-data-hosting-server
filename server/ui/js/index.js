"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Create viewDiv for map
document.body.appendChild((() => {
    let element = document.createElement('div');
    element.setAttribute('id', 'viewDiv');
    return element;
})());
const config_1 = require("@arcgis/core/config");
// Set asset path to local
config_1.default.assetsPath = "./assets";
const Map_1 = require("@arcgis/core/Map");
const SceneView_1 = require("@arcgis/core/views/SceneView");
require("../sass/style.scss");
const map = new Map_1.default({
    basemap: "osm", // Can be accessed without api-key
});
const view = new SceneView_1.default({
    map: map,
    container: "viewDiv",
    center: [110, 30],
    zoom: 6
});