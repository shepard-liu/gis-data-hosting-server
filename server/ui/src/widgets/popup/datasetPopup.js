"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const widget_1 = require("@arcgis/core/widgets/support/widget");
const Widget_1 = require("@arcgis/core/widgets/Widget");
const decorators_1 = require("@arcgis/core/core/accessorSupport/decorators");
const resources_1 = require("./resources");
const PopupTemplate_1 = require("@arcgis/core/PopupTemplate");
const CustomContent_1 = require("@arcgis/core/popup/content/CustomContent");
const dataManager_1 = require("../../util/dataManager");
class DatasetPopup extends Widget_1.default {
    constructor(params) {
        super(params);
        this.graphic = null;
        this.serverResponseMessage = null;
        this.statusCode = 'idle';
        this.set(params);
        console.log('constucted ', params.graphic.attributes.name);
    }
    render() {
        const attribs = this.graphic.attributes;
        return ((0, widget_1.tsx)("div", { class: resources_1.CSS.root },
            (0, widget_1.tsx)("div", { class: resources_1.CSS.container },
                this.renderSubHeading(),
                (0, widget_1.tsx)("div", { class: resources_1.CSS.separatorLine }),
                this.renderDescription(),
                this.renderInformation(resources_1.i18n.acquisitionTime, attribs.acquisition_time),
                this.renderInformation(resources_1.i18n.fileSize, attribs.file_size),
                (0, widget_1.tsx)("div", { class: resources_1.CSS.seperator }),
                (0, widget_1.tsx)("div", { class: 'row' },
                    this.renderDownloadButton(),
                    (0, widget_1.tsx)("div", { class: resources_1.CSS.buttonGap }),
                    this.renderPreviewButton()))));
    }
    renderSubHeading() {
        const attribs = this.graphic.attributes;
        return ((0, widget_1.tsx)("div", { class: resources_1.CSS.subHeading }, attribs.type + ' #' + attribs.id));
    }
    renderDescription() {
        return ((0, widget_1.tsx)("div", { class: resources_1.CSS.description }, this.graphic.attributes.description));
    }
    renderInformation(infoTag, infoValue) {
        return ((0, widget_1.tsx)("div", { class: 'row' },
            (0, widget_1.tsx)("div", { class: resources_1.CSS.infoTag }, infoTag + ': '),
            (0, widget_1.tsx)("div", { class: resources_1.CSS.infoValue }, infoValue)));
    }
    renderDownloadButton() {
        return ((0, widget_1.tsx)("div", { class: resources_1.CSS.downloadButtonWrapper },
            (0, widget_1.tsx)("a", { href: dataManager_1.default.createDownloadLink(this.graphic.attributes.id.toString()), download: true, class: resources_1.CSS.downloadButtonWrapperLink },
                (0, widget_1.tsx)("button", { type: 'button', class: resources_1.CSS.downloadButton, bind: this, onclick: this._onDownloadButtonClicked }, resources_1.i18n.download))));
    }
    renderPreviewButton() {
        return ((0, widget_1.tsx)("div", { class: resources_1.CSS.previewButtonWrapper },
            (0, widget_1.tsx)("button", { type: 'button', class: resources_1.CSS.previewButton, bind: this, onclick: this._onPreviewButtonClicked }, resources_1.i18n.preview)));
    }
    _onDownloadButtonClicked() {
    }
    _onPreviewButtonClicked() {
        alert(resources_1.i18n.messages.previewNotAvailable);
    }
}
DatasetPopup.popupTemplate = new PopupTemplate_1.default({
    title: '{name}',
    outFields: ['*'],
    content: [new CustomContent_1.default({
            creator(graphicWrapper) {
                // Somewhat this function passes a graphic wrapped in an object
                // This is a workaround
                const graphic = graphicWrapper.graphic;
                const popup = new DatasetPopup({ graphic });
                return popup;
            },
            outFields: ['*'],
        })]
});
__decorate([
    (0, decorators_1.property)()
], DatasetPopup.prototype, "graphic", void 0);
__decorate([
    (0, decorators_1.property)()
], DatasetPopup.prototype, "serverResponseMessage", void 0);
__decorate([
    (0, decorators_1.property)()
], DatasetPopup.prototype, "statusCode", void 0);
__decorate([
    (0, decorators_1.property)()
], DatasetPopup, "popupTemplate", void 0);
exports.default = DatasetPopup;
