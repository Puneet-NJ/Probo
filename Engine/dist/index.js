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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const redis_1 = require("redis");
const returnAll_1 = __importDefault(require("./functions/returnAll"));
const createUser_1 = __importDefault(require("./functions/createUser"));
const createStockSymbol_1 = __importDefault(require("./functions/createStockSymbol"));
const getOrderbook_1 = __importDefault(require("./functions/getOrderbook"));
const getBalance_1 = __importDefault(require("./functions/getBalance"));
const getStocks_1 = __importDefault(require("./functions/getStocks"));
const getUserBalance_1 = __importDefault(require("./functions/getUserBalance"));
const onRamp_1 = __importDefault(require("./functions/onRamp"));
const getUserStockBalance_1 = __importDefault(require("./functions/getUserStockBalance"));
const getOrderbookForStock_1 = __importDefault(require("./functions/getOrderbookForStock"));
const buyStockGeneric_1 = __importDefault(require("./functions/buyStockGeneric"));
const sellStockGeneric_1 = __importDefault(require("./functions/sellStockGeneric"));
const pendingBuyOrders_1 = __importDefault(require("./functions/pendingBuyOrders"));
const pendingSellOrders_1 = __importDefault(require("./functions/pendingSellOrders"));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    exports.client = (0, redis_1.createClient)();
    yield exports.client.connect();
    while (1) {
        const res = yield exports.client.brPop("queue", 0);
        // @ts-ignore
        const element = JSON.parse(res.element);
        const func = element.func;
        const pubsubChannel = element.pubsubChannel;
        if (func === "returnAll") {
            (0, returnAll_1.default)(pubsubChannel);
        }
        if (func === "createUser") {
            (0, createUser_1.default)(element.inputs.userId, pubsubChannel);
        }
        if (func === "createStockSymbol") {
            (0, createStockSymbol_1.default)(element.inputs.stockSymbol, pubsubChannel);
        }
        if (func === "getOrderbook") {
            (0, getOrderbook_1.default)(pubsubChannel);
        }
        if (func === "getBalance") {
            (0, getBalance_1.default)(pubsubChannel);
        }
        if (func === "getStocks") {
            (0, getStocks_1.default)(pubsubChannel);
        }
        if (func === "getUserBalance") {
            (0, getUserBalance_1.default)(element.inputs.userId, pubsubChannel);
        }
        if (func === "onramp") {
            (0, onRamp_1.default)(element.inputs, pubsubChannel);
        }
        if (func === "getUserStockBalance") {
            (0, getUserStockBalance_1.default)(element.inputs.userId, pubsubChannel);
        }
        if (func === "stockBuy") {
            (0, buyStockGeneric_1.default)(element.inputs.body, pubsubChannel);
        }
        if (func === "stockSell") {
            (0, sellStockGeneric_1.default)(element.inputs.body, pubsubChannel);
        }
        if (func === "getOrderbookForStock") {
            (0, getOrderbookForStock_1.default)(element.inputs.stockSymbol, pubsubChannel);
        }
        if (func === "pendingBuyOrders") {
            (0, pendingBuyOrders_1.default)(element.inputs.userId, pubsubChannel);
        }
        if (func === "pendingSellOrders") {
            (0, pendingSellOrders_1.default)(element.inputs.userId, pubsubChannel);
        }
    }
});
main();
