"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
const buyStock = (body) => {
    const price = String(body.price);
    const quantity = body.quantity;
    const stockSymbol = body.stockSymbol;
    const userId = body.userId;
    const stockType = body.stockType;
    const oppStockType = body.stockType;
    if (!lib_1.ORDERBOOK[stockSymbol] || !lib_1.ORDERBOOK[stockSymbol][stockType]) {
        return {
            status: 411,
            json: { msg: "Invalid stock symbol" },
        };
    }
    if (lib_1.ORDERBOOK[stockSymbol][stockType][price]) {
        let remStocks = quantity;
        let priceOfStock = Number(price) * 100;
        // first resolving the orgOrders
        for (let userId in lib_1.ORDERBOOK[stockSymbol][stockType][price].orders
            .orgOrders) {
            if (remStocks >
                lib_1.ORDERBOOK[stockSymbol][stockType][price].orders.orgOrders[userId]) {
                const quantityOfStocks = lib_1.ORDERBOOK[stockSymbol][stockType][price].orders.orgOrders[userId];
                lib_1.INR_BALANCES[userId].balance += priceOfStock * quantityOfStocks;
                lib_1.STOCK_BALANCES[userId][stockSymbol][stockType].locked -=
                    quantityOfStocks;
            }
        }
    }
};
exports.default = buyStock;
