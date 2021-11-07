"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//main stylesheet
require("../sass/style.scss");
const dom_1 = require("./util/dom");
// show loader before import
const loadingSvgUrl = require('../assets/loading-blue.svg');
const loadingElement = (0, dom_1.defineElement)('img', 'loading');
document.body.appendChild(loadingElement);
loadingElement.setAttribute('src', loadingSvgUrl);
