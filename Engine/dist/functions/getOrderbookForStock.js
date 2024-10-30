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
const lib_1 = require("../lib");
const publish_1 = __importDefault(require("../publish"));
const getOrderbookForStock = (stockSymbol, pubsubChannel) => __awaiter(void 0, void 0, void 0, function* () {
    if (!lib_1.ORDERBOOK[stockSymbol]) {
        yield (0, publish_1.default)(pubsubChannel, { status: 411, msg: "Invalid stock symbol" });
        return;
    }
    const orderbookForStock = Object.assign({ stock: stockSymbol }, lib_1.ORDERBOOK[stockSymbol]);
    yield (0, publish_1.default)(pubsubChannel, { status: 200, data: orderbookForStock });
});
exports.default = getOrderbookForStock;
