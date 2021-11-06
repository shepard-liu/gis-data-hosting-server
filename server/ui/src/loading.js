"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//main stylesheet
require("../sass/style.scss");
const dom_1 = require("./util/dom");
// show loader before import
const loader = require('../assets/loading-blue.svg');
document.body.appendChild((0, dom_1.defineElement)('img', 'loader')).style.height = '100px';
document.getElementById('loader').setAttribute('src', loader);
