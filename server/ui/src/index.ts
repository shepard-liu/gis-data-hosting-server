import esriConfig from "@arcgis/core/config";
import Map from '@arcgis/core/Map';
import SceneView from "@arcgis/core/views/SceneView";
import Viewpoint from "@arcgis/core/ViewPoint";

//Twitter Bootstrap
import '../sass/bootstrap.min.css'
//main stylesheet
import '../sass/style.scss';
import LoginWidget from './widgets/login/login'

//Create viewDiv for map
document.body.appendChild((() => {
    let element = document.createElement('div');
    element.setAttribute('id', 'viewDiv');
    return element;
})());

// Set asset path to local
esriConfig.assetsPath = "./assets";

const map = new Map({
    basemap: "osm", // Can be accessed without api-key
});

const view = new SceneView({
    container: "viewDiv",
    map: map,
    zoom: 1,
});

// Initialize Widgets
const loginWidget = new LoginWidget();
view.ui.add(loginWidget, 'manual');

// Watch Login Status
loginWidget.watch('status', (status: string) => {
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
})