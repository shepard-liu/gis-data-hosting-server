"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Create viewDiv for map
document.body.appendChild((function () {
    var element = document.createElement('div');
    element.setAttribute('id', 'viewDiv');
    return element;
})());
var config_1 = require("@arcgis/core/config");
// Set asset path to local
config_1.default.assetsPath = "./assets";
var Map_1 = require("@arcgis/core/Map");
var SceneView_1 = require("@arcgis/core/views/SceneView");
require("../sass/style.scss");
var map = new Map_1.default({
    basemap: "osm", // Can be accessed without api-key
});
var view = new SceneView_1.default({
    map: map,
    container: "viewDiv",
    center: [110, 30],
    zoom: 6
});
var HelloWorld_1 = require("./widgets/HelloWorld");
view.ui.add(new HelloWorld_1.HelloWorld(), 'bottom-left');
