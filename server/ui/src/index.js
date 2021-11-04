"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@arcgis/core/config");
const Map_1 = require("@arcgis/core/Map");
const SceneView_1 = require("@arcgis/core/views/SceneView");
//Twitter Bootstrap
require("../sass/bootstrap.min.css");
//main stylesheet
require("../sass/style.scss");
const login_1 = require("./widgets/login/login");
//Create viewDiv for map
document.body.appendChild((() => {
    let element = document.createElement('div');
    element.setAttribute('id', 'viewDiv');
    return element;
})());
// Set asset path to local
config_1.default.assetsPath = "./assets";
const map = new Map_1.default({
    basemap: "osm", // Can be accessed without api-key
});
const view = new SceneView_1.default({
    container: "viewDiv",
    map: map,
    zoom: 1,
});
// Initialize Widgets
const loginWidget = new login_1.default();
view.ui.add(loginWidget, 'manual');
// Watch Login Status
loginWidget.watch('status', (status) => {
    if (status === 'success')
        setTimeout(() => { loginWidget.destroy(); }, 1000);
    setTimeout(() => {
        view.goTo({
            center: [110, 30],
            zoom: 4,
        }, {
            duration: 1500
        });
    });
});
