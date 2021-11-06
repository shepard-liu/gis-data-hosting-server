
//main stylesheet
import '../sass/style.scss';
import { defineElement } from './util/dom';

// show loader before import
const loader = require('../assets/loading-blue.svg');
document.body.appendChild(defineElement('img', 'loader')).style.height = '100px';
document.getElementById('loader').setAttribute('src', loader);