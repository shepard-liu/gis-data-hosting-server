
//main stylesheet
import '../sass/style.scss';
import { defineElement } from './util/dom';

// show loader before import
const loadingSvgUrl = require('../assets/loading-blue.svg');
const loadingElement = defineElement('img', 'loading');
document.body.appendChild(loadingElement);
loadingElement.setAttribute('src', loadingSvgUrl);