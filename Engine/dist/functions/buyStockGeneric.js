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
const buyStock_1 = __importDefault(require("./buyStock"));
// import dummyBuy from "./dummyBuy";
const Publish_1 = __importDefault(require("./Publish"));
const buyStockGeneric = (body, pubsubChannel) => __awaiter(void 0, void 0, void 0, function* () {
    const price = String(body.price);
    const quantity = body.quantity;
    const stockSymbol = body.stockSymbol;
    const userId = body.userId;
    const stockType = body.stockType;
    // Check if the buyer has sufficient balance
    if (lib_1.INR_BALANCES[userId].balance < Number(price) * 100 * quantity) {
        yield (0, publish_1.default)(pubsubChannel, { status: 411, msg: "Insufficient balance" });
        return;
    }
    let response;
    if (stockType === "yes" || stockType === "no") {
        response = (0, buyStock_1.default)(body);
        // response = dummyBuy(body);
        yield (0, publish_1.default)(pubsubChannel, {
            status: response.status,
            msg: response.json.msg,
        });
        yield (0, Publish_1.default)(stockSymbol);
    }
    else {
        yield (0, publish_1.default)(pubsubChannel, { status: 411, msg: "Invalid stock type" });
        return;
    }
});
exports.default = buyStockGeneric;
