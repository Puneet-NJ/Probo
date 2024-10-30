"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
const sellStock = (body) => {
    const price = String(body.price);
    const quantity = body.quantity;
    const stockSymbol = body.stockSymbol;
    const userId = body.userId;
    const stockType = body.stockType;
    const oppStockType = body.stockType === "yes" ? "no" : "yes";
    let remStocks = quantity;
    const priceOfStock = Number(price) * 100;
    if (lib_1.STOCK_BALANCES[userId][stockSymbol][stockType].quantity < quantity) {
        return {
            status: 411,
            json: { msg: "You dont have enough quantity of stocks" },
        };
    }
    if (!lib_1.ORDERBOOK[stockSymbol] ||
        !lib_1.ORDERBOOK[stockSymbol][stockType] ||
        !lib_1.ORDERBOOK[stockSymbol][oppStockType]) {
        return {
            status: 411,
            json: { msg: "Invalid stock symbol" },
        };
    }
    fillOrderbook(stockSymbol, stockType, price, userId);
    if (lib_1.ORDERBOOK[stockSymbol][oppStockType][10 - Number(price)].orders.sudoOrders) {
        // So, what we are doing here essentially is we are selling/matching our stock to the other user
        for (let userId in lib_1.ORDERBOOK[stockSymbol][oppStockType][10 - Number(price)]
            .orders.sudoOrders) {
            if (remStocks >
                lib_1.ORDERBOOK[stockSymbol][oppStockType][10 - Number(price)].orders
                    .sudoOrders[userId]) {
                const quantityOfStocks = lib_1.ORDERBOOK[stockSymbol][oppStockType][10 - Number(price)].orders
                    .sudoOrders[userId];
                lib_1.STOCK_BALANCES[userId][stockSymbol][stockType].quantity +=
                    quantityOfStocks;
                lib_1.INR_BALANCES[userId].locked -= priceOfStock * quantityOfStocks;
                remStocks -=
                    lib_1.ORDERBOOK[stockSymbol][oppStockType][10 - Number(price)].orders
                        .sudoOrders[userId];
                lib_1.ORDERBOOK[stockSymbol][oppStockType][10 - Number(price)].orders.sudoOrders[userId] = 0;
            }
            else {
                const quantityOfStocks = remStocks;
                lib_1.INR_BALANCES[userId].locked -= priceOfStock * quantityOfStocks;
                lib_1.STOCK_BALANCES[userId][stockSymbol][stockType].quantity +=
                    quantityOfStocks;
                remStocks;
                lib_1.ORDERBOOK[stockSymbol][oppStockType][10 - Number(price)].orders.sudoOrders[userId] -= remStocks;
                remStocks = 0;
            }
            if (remStocks === 0)
                break;
        }
        // Change the orderbook for the user who has put the reverse order
        // coz he had an entry for the sudoStock
        lib_1.ORDERBOOK[stockSymbol][oppStockType][10 - Number(price)].total -=
            quantity - remStocks;
        // reduce his stock balance
        lib_1.STOCK_BALANCES[userId][stockSymbol][stockType].quantity -=
            quantity - remStocks;
        // increase his inr balance
        lib_1.INR_BALANCES[userId].balance += (quantity - remStocks) * priceOfStock;
    }
    lib_1.ORDERBOOK[stockSymbol][stockType][price].total += remStocks;
    lib_1.ORDERBOOK[stockSymbol][stockType][price].orders.orgOrders[userId] +=
        remStocks;
    lib_1.STOCK_BALANCES[userId][stockSymbol][stockType].quantity -= remStocks;
    lib_1.STOCK_BALANCES[userId][stockSymbol][stockType].locked += remStocks;
    return {
        status: 200,
        json: { msg: "Sell order placed" },
    };
};
const fillOrderbook = (stockSymbol, stockType, price, userId) => {
    if (!lib_1.ORDERBOOK[stockSymbol][stockType][Number(price)]) {
        lib_1.ORDERBOOK[stockSymbol][stockType][Number(price)] = {
            total: 0,
            orders: {
                sudoOrders: {},
                orgOrders: {},
            },
        };
    }
    if (!lib_1.ORDERBOOK[stockSymbol][stockType][Number(price)].orders.sudoOrders ||
        !lib_1.ORDERBOOK[stockSymbol][stockType][Number(price)].orders.orgOrders) {
        lib_1.ORDERBOOK[stockSymbol][stockType][Number(price)].orders.sudoOrders = {};
        lib_1.ORDERBOOK[stockSymbol][stockType][Number(price)].orders.orgOrders = {};
    }
    if (!lib_1.ORDERBOOK[stockSymbol][stockType][Number(price)].orders.sudoOrders[userId] ||
        !lib_1.ORDERBOOK[stockSymbol][stockType][Number(price)].orders.orgOrders[userId]) {
        lib_1.ORDERBOOK[stockSymbol][stockType][Number(price)].orders.sudoOrders[userId] = 0;
        lib_1.ORDERBOOK[stockSymbol][stockType][Number(price)].orders.orgOrders[userId] = 0;
    }
};
exports.default = sellStock;
