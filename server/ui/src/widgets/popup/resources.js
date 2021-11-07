"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assets = exports.i18n = exports.CSS = void 0;
require("../../../sass/widgets/datasetPopup.scss");
exports.CSS = {
    root: 'dataset-popup esri-widget',
    container: 'dataset-popup__container',
    subHeading: 'dataset-popup__subheading',
    seperator: 'dataset-popup__seperator',
    separatorLine: 'dataset-popup__separator-line',
    description: 'dataset-popup__description',
    infoTag: 'dataset-popup__info-tag col-sm-6 col-md-8',
    infoValue: 'dataset-popup__info-value col-sm-4',
    downloadButtonWrapper: 'dataset-popup__download-button-wrapper col-sm-12 col-md-5',
    previewButtonWrapper: 'dataset-popup__preview-button-wrapper col-sm-12 col-md-5',
    buttonGap: "col-sm-0 col-md-2",
    downloadButtonWrapperLink: 'dataset-popup__download-button-wrapper-link',
    downloadButton: 'esri-button dataset-popup__download-button',
    previewButton: 'esri-button--secondary dataset-popup__preview-button',
};
exports.i18n = {
    download: 'Download',
    preview: 'Preview',
    acquisitionTime: 'Acquisition Time',
    fileSize: 'File Size',
    messages: {
        datasetNotFound: 'The requested dataset does not exist on server. ' +
            'It may have been removed or modified. ' +
            'Please refresh the page to fetch the latest dataset index list.',
        unauthorized: 'Your login credentials are expired. Please log back in.',
        serverError: 'Server encountered an error while processing your request. ' +
            'Please retry later, or contact administrators.',
        success: 'Download starting...',
        previewNotAvailable: 'The preview functionality is in development!'
    }
};
exports.assets = {};
