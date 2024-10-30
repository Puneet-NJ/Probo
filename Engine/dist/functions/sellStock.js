"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
const uuid_1 = require("uuid");
const dummySell = (body) => {
    const price = String(body.price);
    const quantity = body.quantity;
    const stockSymbol = body.stockSymbol;
    const userId = body.userId;
    const stockType = body.stockType;
    let totalRemQuantity = quantity;
    if (lib_1.STOCK_BALANCES[userId][stockSymbol][stockType].quantity < quantity) {
        return {
            status: 411,
            json: { msg: "You dont have enough quantity of stocks" },
        };
    }
    for (const currPrice of lib_1.PRICE_POINTS.slice().reverse()) {
        if (currPrice === price) {
            totalRemQuantity = matchOrderAtPrice(stockSymbol, stockType, 10 - Number(currPrice), totalRemQuantity, userId, currPrice, price);
            break;
        }
        totalRemQuantity = matchOrderAtPrice(stockSymbol, stockType, 10 - Number(currPrice), totalRemQuantity, userId, currPrice, price);
    }
    const orderId = (0, uuid_1.v4)();
    if (totalRemQuantity !== 0) {
        lib_1.ORDERBOOK[stockSymbol][stockType][price].total += totalRemQuantity;
        lib_1.ORDERBOOK[stockSymbol][stockType][price].orders.orgOrders.push({
            orderId,
            userId,
            quantity,
            filledQuantity: quantity - totalRemQuantity,
            remQuantity: totalRemQuantity,
            time: new Date(),
        });
        lib_1.STOCK_BALANCES[userId][stockSymbol][stockType].quantity -= quantity;
        lib_1.STOCK_BALANCES[userId][stockSymbol][stockType].locked += quantity;
    }
    return {
        status: 200,
        json: { msg: "Bid submitted successfully" },
    };
};
const matchOrderAtPrice = (stockSymbol, stockType, oppObPrice, totalRemQuantity, userId, price, orgPrice) => {
    const numPrice = Number(price) * 100;
    const oppStockType = stockType === "yes" ? "no" : "yes";
    const indexToDelete = [];
    const numOrgPrice = Number(orgPrice) * 100;
    if (totalRemQuantity >= lib_1.ORDERBOOK[stockSymbol][oppStockType][oppObPrice].total)
        lib_1.ORDERBOOK[stockSymbol][oppStockType][oppObPrice].total = 0;
    else
        lib_1.ORDERBOOK[stockSymbol][oppStockType][oppObPrice].total -= totalRemQuantity;
    lib_1.ORDERBOOK[stockSymbol][oppStockType][oppObPrice].orders.sudoOrders.some((order, index) => {
        const remQuantity = order.remQuantity;
        const sellerUserId = order.userId;
        let stocksQuantity;
        if (remQuantity <= totalRemQuantity) {
            stocksQuantity = remQuantity;
            order.remQuantity = 0;
            indexToDelete.push(index);
        }
        else {
            stocksQuantity = totalRemQuantity;
            order.remQuantity -= totalRemQuantity;
        }
        order.filledQuantity += stocksQuantity;
        totalRemQuantity -= stocksQuantity;
        lib_1.INR_BALANCES[userId].balance += stocksQuantity * numOrgPrice;
        lib_1.INR_BALANCES[sellerUserId].locked -= stocksQuantity * numPrice;
        lib_1.INR_BALANCES[sellerUserId].balance +=
            stocksQuantity * (numPrice - numOrgPrice);
        lib_1.STOCK_BALANCES[userId][stockSymbol][stockType].quantity -=
            stocksQuantity;
        lib_1.STOCK_BALANCES[sellerUserId][stockSymbol][stockType].quantity +=
            stocksQuantity;
        if (totalRemQuantity === 0)
            return true;
    });
    for (const index of indexToDelete.reverse()) {
        lib_1.ORDERBOOK[stockSymbol][oppStockType][oppObPrice].orders.sudoOrders.splice(index, 1);
    }
    return totalRemQuantity;
};
exports.default = dummySell;
