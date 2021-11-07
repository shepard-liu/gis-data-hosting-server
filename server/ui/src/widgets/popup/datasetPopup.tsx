import { tsx as jsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";
import Accessor from '@arcgis/core/core/Accessor';
import { subclass, property, aliasOf } from "@arcgis/core/core/accessorSupport/decorators";

import { CSS, i18n, assets } from './resources';
import { DatasetPopupProperties, DatasetIndexGraphic } from "./interfaces";
import PopupTemplate from '@arcgis/core/PopupTemplate';
import CustomContent from '@arcgis/core/popup/content/CustomContent';

import AuthHelper from "../../util/authHelper";

import DataManager from '../../util/dataManager';

// A singleton class for watching the change of current preview graphic
@subclass('ui.datasetPopup.graphicwrapper')
class GraphicWrapper extends Accessor {
    private constructor() {
        super();
    }

    @property()
    public graphic: DatasetIndexGraphic = null;

    @property()
    private static _instance: GraphicWrapper = null;

    public static instance() {
        return GraphicWrapper._instance ?
            GraphicWrapper._instance :
            GraphicWrapper._instance = new GraphicWrapper();
    }
}

@subclass('ui.datasetPopup')
export default class DatasetPopup extends Widget
    implements DatasetPopupProperties {

    constructor(params?: DatasetPopupProperties) {
        super(params);
        this.set(params);
    }

    @property()
    graphic: DatasetIndexGraphic = null;

    @property()
    private serverResponseMessage: string = null;

    @property()
    private statusCode: 'idle' | '401' | '404' | '500' | '200' = 'idle';

    @property()
    public static popupTemplate = new PopupTemplate({
        title: '{name}',
        outFields: ['*'],
        content: [new CustomContent({
            creator(graphicWrapper) {
                // Somewhat this function passes a graphic wrapped in an object
                // This is a workaround
                const graphic = (graphicWrapper as unknown as
                    { graphic: DatasetIndexGraphic }).graphic;
                const popup = new DatasetPopup({ graphic });
                return popup;
            },
            outFields: ['*'],
        })]
    });

    @property()
    public static currentPreview: GraphicWrapper = GraphicWrapper.instance();

    render() {
        const attribs = this.graphic.attributes;
        return (
            <div class={CSS.root}>
                <div class={CSS.container}>
                    {this.renderSubHeading()}
                    <div class={CSS.separatorLine} />
                    {this.renderDescription()}
                    {this.renderInformation(i18n.acquisitionTime, attribs.acquisition_time)}
                    {this.renderInformation(i18n.fileSize, attribs.file_size)}
                    <div class={CSS.seperator}></div>
                    <div class='row'>
                        {this.renderDownloadButton()}
                        <div class={CSS.buttonGap}></div>
                        {this.renderPreviewButton()}
                    </div>
                </div>
            </div>
        )
    }

    renderSubHeading() {
        const attribs = this.graphic.attributes;
        return (
            <div class={CSS.subHeading}>
                {attribs.type + ' #' + attribs.id}
            </div>
        );
    }

    renderDescription() {
        return (
            <div class={CSS.description}>
                {this.graphic.attributes.description}
            </div>
        )
    }

    renderInformation(infoTag: string, infoValue: string) {
        return (
            <div class='row'>
                <div class={CSS.infoTag}>{infoTag + ': '}</div>
                <div class={CSS.infoValue}>{infoValue}</div>
            </div>
        )
    }

    renderDownloadButton() {
        return (
            <div class={CSS.downloadButtonWrapper}>
                <a
                    href={DataManager.createDownloadLink(this.graphic.attributes.id.toString())}
                    download
                    class={CSS.downloadButtonWrapperLink}
                >
                    <button
                        type='button'
                        class={CSS.downloadButton}
                        bind={this}
                        onclick={this._onDownloadButtonClicked}>
                        {i18n.download}
                    </button>
                </a>
            </div>
        )
    }

    renderPreviewButton() {
        return (
            <div class={CSS.previewButtonWrapper}>
                <button
                    type='button'
                    class={CSS.previewButton}
                    bind={this}
                    onclick={this._onPreviewButtonClicked}>
                    {i18n.preview}
                </button>
            </div>
        )
    }


    private _onDownloadButtonClicked() {
    }

    private _onPreviewButtonClicked() {
        DatasetPopup.currentPreview.graphic = this.graphic;
    }
}