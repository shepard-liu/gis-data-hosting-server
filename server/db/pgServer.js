"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbClient = void 0;
const pg_1 = require("pg");
const config_js_1 = require("../config.js");
exports.dbClient = new pg_1.Client(config_js_1.default.db);
//Disable the default parser
pg_1.types.setTypeParser(1114, value => value); //TIMESTAMP
pg_1.types.setTypeParser(1184, value => value); //TIMESTAMPTZ
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.dbClient.connect();
        console.log('Database connection established');
    });
})().catch(err => {
    console.log("Database connection cannot be established:\n" + err);
});
