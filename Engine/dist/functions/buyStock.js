"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
const uuid_1 = require("uuid");
const buyStock = (body) => {
    const price = String(body.price);
    const quantity = body.quantity;
    const stockSymbol = body.stockSymbol;
    const userId = body.userId;
    const stockType = body.stockType;
    let totalQuantityRem = quantity;
    const oppStockType = stockType === "yes" ? "no" : "yes";
    if (!lib_1.ORDERBOOK[stockSymbol] || !lib_1.ORDERBOOK[stockSymbol][stockType]) {
        return {
            status: 411,
            json: { msg: "Invalid stock symbol" },
        };
    }
    let result = { status: 200, json: { msg: "Bid submitted successfully" } };
    lib_1.PRICE_POINTS.some((currPrice) => {
        var _a;
        if (currPrice === price) {
            totalQuantityRem = buyStockAtPrice(stockSymbol, stockType, currPrice, totalQuantityRem, userId);
            return true;
        }
        if (!((_a = lib_1.ORDERBOOK[stockSymbol][stockType]) === null || _a === void 0 ? void 0 : _a[currPrice])) {
            result = {
                status: 411,
                json: { msg: "Invalid price" },
            };
            return true; // stop iteration
        }
        if (lib_1.ORDERBOOK[stockSymbol][stockType][currPrice].total > 0) {
            totalQuantityRem = buyStockAtPrice(stockSymbol, stockType, currPrice, totalQuantityRem, userId);
        }
        return false; // continue iteration
    });
    if (totalQuantityRem !== 0) {
        placeReverseOrder(stockSymbol, oppStockType, userId, price, quantity, totalQuantityRem, quantity - totalQuantityRem);
    }
    return result;
};
const buyStockAtPrice = (stockSymbol, stockType, price, totalQuantityRem, userId) => {
    const numPrice = Number(price) * 100;
    const oppStockType = stockType === "yes" ? "no" : "yes";
    if (lib_1.ORDERBOOK[stockSymbol][stockType][price].total <= totalQuantityRem)
        lib_1.ORDERBOOK[stockSymbol][stockType][price].total = 0;
    else
        lib_1.ORDERBOOK[stockSymbol][stockType][price].total -= totalQuantityRem;
    let ordersToDelete = [];
    lib_1.ORDERBOOK[stockSymbol][stockType][price].orders.orgOrders.some((order, index) => {
        const remQuantity = order.remQuantity;
        let purchasedQuantity;
        const sellerUserId = order.userId;
        // I have bought stocks from him
        if (remQuantity <= totalQuantityRem) {
            purchasedQuantity = remQuantity;
            order.remQuantity = 0;
            ordersToDelete.push(index);
        }
        else {
            purchasedQuantity = totalQuantityRem;
            order.remQuantity -= purchasedQuantity;
        }
        order.filledQuantity += purchasedQuantity;
        totalQuantityRem -= purchasedQuantity;
        lib_1.INR_BALANCES[userId].balance -= numPrice * purchasedQuantity;
        lib_1.INR_BALANCES[sellerUserId].balance += numPrice * purchasedQuantity;
        lib_1.STOCK_BALANCES[userId][stockSymbol][stockType].quantity +=
            purchasedQuantity;
        lib_1.STOCK_BALANCES[sellerUserId][stockSymbol][stockType].locked -=
            purchasedQuantity;
        if (totalQuantityRem === 0)
            return true;
    });
    for (const index of ordersToDelete.reverse()) {
        lib_1.ORDERBOOK[stockSymbol][stockType][price].orders.orgOrders.splice(index, 1);
    }
    if (totalQuantityRem !== 0) {
        ordersToDelete = [];
        lib_1.ORDERBOOK[stockSymbol][stockType][price].orders.sudoOrders.some((order, index) => {
            const remQuantity = order.remQuantity;
            let purchasedQuantity;
            const sellerUserId = order.userId;
            // I have to match the stocks now
            if (remQuantity <= totalQuantityRem) {
                purchasedQuantity = remQuantity;
                order.remQuantity = 0;
                ordersToDelete.push(index);
            }
            else {
                purchasedQuantity = totalQuantityRem;
                order.remQuantity -= purchasedQuantity;
            }
            order.filledQuantity += purchasedQuantity;
            totalQuantityRem -= purchasedQuantity;
            lib_1.INR_BALANCES[userId].balance -= numPrice * purchasedQuantity;
            lib_1.INR_BALANCES[sellerUserId].locked -=
                (10 - numPrice / 100) * 100 * purchasedQuantity;
            lib_1.STOCK_BALANCES[userId][stockSymbol][stockType].quantity +=
                purchasedQuantity;
            lib_1.STOCK_BALANCES[sellerUserId][stockSymbol][oppStockType].quantity +=
                purchasedQuantity;
            lib_1.PROBO.balance +=
                numPrice * purchasedQuantity +
                    (10 - numPrice / 100) * 100 * purchasedQuantity;
            if (totalQuantityRem === 0)
                return true;
        });
        for (const index of ordersToDelete.reverse()) {
            lib_1.ORDERBOOK[stockSymbol][stockType][price].orders.sudoOrders.splice(index, 1);
        }
    }
    return totalQuantityRem;
};
const placeReverseOrder = (stockSymbol, oppStockType, userId, price, quantity, totalQuantityRem, filledQuantity) => {
    const revObPrice = 10 - Number(price);
    const numPrice = Number(price) * 100;
    const orderId = (0, uuid_1.v4)();
    lib_1.ORDERBOOK[stockSymbol][oppStockType][revObPrice].total += totalQuantityRem;
    lib_1.ORDERBOOK[stockSymbol][oppStockType][revObPrice].orders.sudoOrders.push({
        orderId,
        userId,
        time: new Date(),
        quantity,
        remQuantity: totalQuantityRem,
        filledQuantity,
    });
    lib_1.INR_BALANCES[userId].balance -= totalQuantityRem * numPrice;
    lib_1.INR_BALANCES[userId].locked += totalQuantityRem * numPrice;
};
exports.default = buyStock;
