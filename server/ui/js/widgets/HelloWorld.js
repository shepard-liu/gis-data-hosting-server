"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelloWorld = void 0;
const Widget_1 = require("@arcgis/core/widgets/Widget");
const decorators_1 = require("@arcgis/core/core/accessorSupport/decorators");
const Widget_2 = require("@arcgis/core/widgets/support/Widget");
let HelloWorld = class HelloWorld extends Widget_1.default {
    constructor(params) {
        super(params);
    }
    render() {
        return ((0, Widget_2.tsx)("div", null, "HelloWorld!!!"));
    }
};
HelloWorld = __decorate([
    (0, decorators_1.subclass)('esri.widgets.HelloWorld')
], HelloWorld);
exports.HelloWorld = HelloWorld;
