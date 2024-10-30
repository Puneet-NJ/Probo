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
const pendingSellOrders = (userId, pubsubChannel) => __awaiter(void 0, void 0, void 0, function* () {
    if (!lib_1.INR_BALANCES[userId]) {
        yield (0, publish_1.default)(pubsubChannel, {
            status: 411,
            msg: "Invalid user ID",
        });
        return;
    }
    let pendingSellOrders = [];
    for (const stockSymbol in lib_1.ORDERBOOK) {
        pendingSellOrders.push(...getPendingOrdersbyType(stockSymbol, "yes", userId));
        pendingSellOrders.push(...getPendingOrdersbyType(stockSymbol, "no", userId));
    }
    yield (0, publish_1.default)(pubsubChannel, {
        status: 200,
        msg: "Pending orders fetched",
        data: pendingSellOrders,
    });
});
const getPendingOrdersbyType = (stockSymbol, stockType, userId) => {
    let orders = [];
    for (const price in lib_1.ORDERBOOK[stockSymbol][stockType]) {
        const ordersAtPrice = lib_1.ORDERBOOK[stockSymbol][stockType][price].orders.orgOrders.filter((order) => {
            if (order.userId === userId)
                return true;
        });
        orders.push(...ordersAtPrice);
    }
    return orders;
};
exports.default = pendingSellOrders;
