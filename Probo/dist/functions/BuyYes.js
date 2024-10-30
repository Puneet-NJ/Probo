"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
const buyYesStock = (body) => {
    const price = String(body.price);
    const quantity = body.quantity;
    const stockSymbol = body.stockSymbol;
    const userId = body.userId;
    if (!lib_1.ORDERBOOK[stockSymbol] || !lib_1.ORDERBOOK[stockSymbol].yes) {
        return {
            status: 411,
            json: { msg: "Invalid stock symbol" },
        };
    }
    // The stock that buyer wants to buy is already available in the market
    if (lib_1.ORDERBOOK[stockSymbol].yes[price]) {
        // i) In sufficient quantity
        // if (ORDERBOOK[stockSymbol].yes![price].total >= quantity) {
        // ORDERBOOK[stockSymbol].yes![price].total -= quantity;
        let remStocks = quantity;
        let priceOfStock = Number(price) * 100;
        // Number(
        // 	Object.keys(ORDERBOOK[stockSymbol].yes as object).find(
        // 		(currPrice) => currPrice === price
        // 	)
        // ) * 100;
        // First give him the orignal stocks
        for (let userId in lib_1.ORDERBOOK[stockSymbol].yes[price].orders.orgOrders) {
            if (remStocks > lib_1.ORDERBOOK[stockSymbol].yes[price].orders.orgOrders[userId]) {
                // As this is the orgOrders,
                // Give money to seller
                // Reduce the balance of the buyer
                const quantityOfStocks = lib_1.ORDERBOOK[stockSymbol].yes[price].orders.orgOrders[userId];
                lib_1.INR_BALANCES[userId].balance += priceOfStock * quantityOfStocks;
                // As this is the orgOrders,
                // Reduce the locked stocks for seller
                // Increase the quantity of stocks for the buyer
                lib_1.STOCK_BALANCES[userId][stockSymbol].yes.locked -= quantityOfStocks;
                remStocks -=
                    lib_1.ORDERBOOK[stockSymbol].yes[price].orders.orgOrders[userId];
                lib_1.ORDERBOOK[stockSymbol].yes[price].orders.orgOrders[userId] = 0;
            }
            else {
                const quantityOfStocks = remStocks;
                lib_1.INR_BALANCES[userId].balance += priceOfStock * quantityOfStocks;
                lib_1.STOCK_BALANCES[userId][stockSymbol].yes.locked -= quantityOfStocks;
                lib_1.ORDERBOOK[stockSymbol].yes[price].orders.orgOrders[userId] -=
                    remStocks;
                remStocks = 0;
            }
            if (remStocks === 0)
                break;
        }
        // Try for sudoStocks
        if (remStocks !== 0) {
            // remaining stocks that we have is sudoStocks
            // when you have sudoStocks we would have locked the amount from the initial buyer
            // and whenever the second buyer wants to buy the stock we take both of their money and
            // add it probo's account
            for (let userId in lib_1.ORDERBOOK[stockSymbol].yes[price].orders.sudoOrders) {
                if (!lib_1.STOCK_BALANCES[userId][stockSymbol].no) {
                    lib_1.STOCK_BALANCES[userId][stockSymbol].no = {
                        quantity: 0,
                        locked: 0,
                    };
                }
                if (remStocks >
                    lib_1.ORDERBOOK[stockSymbol].yes[price].orders.sudoOrders[userId]) {
                    // Take the seller's locked amount and give it to probo
                    const amountToTransfer = priceOfStock *
                        lib_1.ORDERBOOK[stockSymbol].yes[price].orders.sudoOrders[userId];
                    lib_1.PROBO.balance += amountToTransfer;
                    lib_1.PROBO.balance +=
                        lib_1.ORDERBOOK[stockSymbol].yes[price].orders.sudoOrders[userId] *
                            (10 - priceOfStock / 100) *
                            100;
                    lib_1.INR_BALANCES[userId].locked -=
                        lib_1.ORDERBOOK[stockSymbol].yes[price].orders.sudoOrders[userId] *
                            (10 - priceOfStock / 100) *
                            100;
                    lib_1.STOCK_BALANCES[userId][stockSymbol].no.quantity +=
                        lib_1.ORDERBOOK[stockSymbol].yes[price].orders.sudoOrders[userId];
                    remStocks -=
                        lib_1.ORDERBOOK[stockSymbol].yes[price].orders.sudoOrders[userId];
                    lib_1.ORDERBOOK[stockSymbol].yes[price].orders.sudoOrders[userId] = 0;
                }
                else {
                    const amountToTransfer = priceOfStock * remStocks;
                    lib_1.PROBO.balance += amountToTransfer;
                    lib_1.PROBO.balance += remStocks * (10 - priceOfStock / 100) * 100;
                    lib_1.INR_BALANCES[userId].locked -=
                        remStocks * (10 - priceOfStock / 100) * 100;
                    lib_1.STOCK_BALANCES[userId][stockSymbol].no.quantity += remStocks;
                    lib_1.ORDERBOOK[stockSymbol].yes[price].orders.sudoOrders[userId] -=
                        remStocks;
                    remStocks = 0;
                }
                if (remStocks === 0)
                    break;
            }
        }
        if (!lib_1.STOCK_BALANCES[userId]) {
            lib_1.STOCK_BALANCES[userId] = {};
        }
        if (!lib_1.STOCK_BALANCES[userId][stockSymbol] ||
            !lib_1.STOCK_BALANCES[userId][stockSymbol].yes) {
            lib_1.STOCK_BALANCES[userId][stockSymbol] = {
                yes: {
                    quantity: 0,
                    locked: 0,
                },
            };
        }
        lib_1.STOCK_BALANCES[userId][stockSymbol].yes.quantity += quantity - remStocks;
        lib_1.INR_BALANCES[userId].balance -=
            (quantity - remStocks) * Number(price) * 100;
        lib_1.ORDERBOOK[stockSymbol].yes[price].total -= quantity - remStocks;
        // ii) Only some partial quantity is available
        if (remStocks !== 0) {
            if (!lib_1.ORDERBOOK[stockSymbol].no) {
                return {
                    status: 411,
                    msg: "Invalid stock symbol",
                };
            }
            // UNSURE
            if (!lib_1.ORDERBOOK[stockSymbol].no[10 - Number(price)]) {
                lib_1.ORDERBOOK[stockSymbol].no[10 - Number(price)] = {
                    total: 0,
                    orders: {
                        sudoOrders: {},
                        orgOrders: {},
                    },
                };
            }
            if (!lib_1.ORDERBOOK[stockSymbol].no[10 - Number(price)].orders.sudoOrders) {
                lib_1.ORDERBOOK[stockSymbol].no[10 - Number(price)].orders.sudoOrders = {};
            }
            if (!lib_1.ORDERBOOK[stockSymbol].no[10 - Number(price)].orders.sudoOrders[userId]) {
                lib_1.ORDERBOOK[stockSymbol].no[10 - Number(price)].orders.sudoOrders[userId] = 0;
            }
            lib_1.ORDERBOOK[stockSymbol].no[10 - Number(price)].orders.sudoOrders[userId] += remStocks;
            lib_1.ORDERBOOK[stockSymbol].no[10 - Number(price)].total += remStocks;
            lib_1.INR_BALANCES[userId].balance -= priceOfStock * remStocks;
            lib_1.INR_BALANCES[userId].locked += priceOfStock * remStocks;
            remStocks = 0;
        }
        return { status: 200, json: { msg: "Bid submitted successfully" } };
    }
    // else
    let priceOfStock = Number(price) * 100;
    if (!lib_1.ORDERBOOK[stockSymbol].no) {
        return {
            status: 411,
            msg: "Invalid stock symbol",
        };
    }
    // UNSURE
    if (!lib_1.ORDERBOOK[stockSymbol].no[10 - Number(price)]) {
        lib_1.ORDERBOOK[stockSymbol].no[10 - Number(price)] = {
            total: 0,
            orders: {
                sudoOrders: {},
                orgOrders: {},
            },
        };
    }
    if (!lib_1.ORDERBOOK[stockSymbol].no[10 - Number(price)].orders.sudoOrders) {
        lib_1.ORDERBOOK[stockSymbol].no[10 - Number(price)].orders.sudoOrders = {};
    }
    if (!lib_1.ORDERBOOK[stockSymbol].no[10 - Number(price)].orders.sudoOrders[userId]) {
        lib_1.ORDERBOOK[stockSymbol].no[10 - Number(price)].orders.sudoOrders[userId] = 0;
    }
    lib_1.ORDERBOOK[stockSymbol].no[10 - Number(price)].orders.sudoOrders[userId] +=
        quantity;
    lib_1.ORDERBOOK[stockSymbol].no[10 - Number(price)].total += quantity;
    lib_1.INR_BALANCES[userId].balance -= priceOfStock * quantity;
    lib_1.INR_BALANCES[userId].locked += priceOfStock * quantity;
    return { status: 200, json: { msg: "Bid submitted successfully" } };
};
exports.default = buyYesStock;
