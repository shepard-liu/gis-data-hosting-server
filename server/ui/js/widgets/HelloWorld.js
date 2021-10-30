"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelloWorld = void 0;
var Widget_1 = require("@arcgis/core/widgets/Widget");
var decorators_1 = require("@arcgis/core/core/accessorSupport/decorators");
var Widget_2 = require("@arcgis/core/widgets/support/Widget");
var HelloWorld = /** @class */ (function (_super) {
    __extends(HelloWorld, _super);
    function HelloWorld(params) {
        return _super.call(this, params) || this;
    }
    HelloWorld.prototype.render = function () {
        return ((0, Widget_2.tsx)("div", null, "HelloWorld!!!"));
    };
    HelloWorld = __decorate([
        (0, decorators_1.subclass)('esri.widgets.HelloWorld')
    ], HelloWorld);
    return HelloWorld;
}((0, decorators_1.declared)(Widget_1.default)));
exports.HelloWorld = HelloWorld;
