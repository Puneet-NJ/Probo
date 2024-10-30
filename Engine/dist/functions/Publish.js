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
const __1 = require("..");
const lib_1 = require("../lib");
const Publish = (stockSymbol) => __awaiter(void 0, void 0, void 0, function* () {
    const modifiedOrderbook = { yes: {}, no: {} };
    for (let price in lib_1.ORDERBOOK[stockSymbol].yes) {
        modifiedOrderbook.yes[price] = lib_1.ORDERBOOK[stockSymbol].yes[price].total;
    }
    for (let price in lib_1.ORDERBOOK[stockSymbol].no) {
        modifiedOrderbook.no[price] = lib_1.ORDERBOOK[stockSymbol].no[price].total;
    }
    try {
        yield __1.client.publish(stockSymbol, JSON.stringify(modifiedOrderbook));
    }
    catch (error) {
        console.error("Error during publishing:", error);
    }
});
exports.default = Publish;
