

export interface DatasetPopupViewModelProperties {

}

export interface DatasetPopupProperties
    extends DatasetPopupViewModelProperties, __esri.WidgetProperties {
    graphic: DatasetIndexGraphic
}

export interface DatasetIndexGraphic extends __esri.Graphic {
    attributes: DatasetIndexGraphicAttributes,
}