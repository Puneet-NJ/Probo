"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
const buyStock = (body) => {
    const price = String(body.price);
    const quantity = body.quantity;
    const stockSymbol = body.stockSymbol;
    const userId = body.userId;
    const stockType = body.stockType;
    const oppStockType = body.stockType === "yes" ? "no" : "yes";
    if (!lib_1.ORDERBOOK[stockSymbol] ||
        !lib_1.ORDERBOOK[stockSymbol][stockType] ||
        !lib_1.ORDERBOOK[stockSymbol][oppStockType]) {
        return {
            status: 411,
            json: { msg: "Invalid stock symbol" },
        };
    }
    if (!lib_1.STOCK_BALANCES[userId][stockSymbol]) {
        lib_1.STOCK_BALANCES[userId][stockSymbol] = {
            yes: { quantity: 0, locked: 0 },
            no: { quantity: 0, locked: 0 },
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
                remStocks -=
                    lib_1.ORDERBOOK[stockSymbol][stockType][price].orders.orgOrders[userId];
                lib_1.ORDERBOOK[stockSymbol][stockType][price].orders.orgOrders[userId] = 0;
            }
            else {
                const quantityOfStocks = remStocks;
                lib_1.INR_BALANCES[userId].balance += priceOfStock * quantityOfStocks;
                lib_1.STOCK_BALANCES[userId][stockSymbol][stockType].locked -=
                    quantityOfStocks;
                lib_1.ORDERBOOK[stockSymbol][stockType][price].orders.orgOrders[userId] -=
                    remStocks;
                remStocks = 0;
            }
            if (remStocks === 0)
                break;
        }
        if (remStocks !== 0) {
            for (let userId in lib_1.ORDERBOOK[stockSymbol][stockType][price].orders
                .sudoOrders) {
                if (remStocks >
                    lib_1.ORDERBOOK[stockSymbol][stockType][price].orders.sudoOrders[userId]) {
                    const amountToTransfer = priceOfStock *
                        lib_1.ORDERBOOK[stockSymbol][stockType][price].orders.sudoOrders[userId];
                    lib_1.PROBO.balance += amountToTransfer;
                    lib_1.PROBO.balance +=
                        lib_1.ORDERBOOK[stockSymbol][stockType][price].orders.sudoOrders[userId] *
                            (10 - priceOfStock / 100) *
                            100;
                    lib_1.INR_BALANCES[userId].locked -=
                        lib_1.ORDERBOOK[stockSymbol][stockType][price].orders.sudoOrders[userId] *
                            (10 - priceOfStock / 100) *
                            100;
                    lib_1.STOCK_BALANCES[userId][stockSymbol][oppStockType].quantity +=
                        lib_1.ORDERBOOK[stockSymbol][stockType][price].orders.sudoOrders[userId];
                    remStocks -=
                        lib_1.ORDERBOOK[stockSymbol][stockType][price].orders.sudoOrders[userId];
                    lib_1.ORDERBOOK[stockSymbol][stockType][price].orders.sudoOrders[userId] = 0;
                }
                else {
                    const amountToTransfer = priceOfStock * remStocks;
                    lib_1.PROBO.balance += amountToTransfer;
                    lib_1.PROBO.balance += remStocks * (10 - priceOfStock / 100) * 100;
                    lib_1.INR_BALANCES[userId].locked -=
                        remStocks * (10 - priceOfStock / 100) * 100;
                    lib_1.STOCK_BALANCES[userId][stockSymbol][oppStockType].quantity +=
                        remStocks;
                    lib_1.ORDERBOOK[stockSymbol][stockType][price].orders.sudoOrders[userId] -=
                        remStocks;
                    remStocks = 0;
                }
                if (remStocks === 0)
                    break;
            }
        }
        lib_1.STOCK_BALANCES[userId][stockSymbol][stockType].quantity +=
            quantity - remStocks;
        lib_1.INR_BALANCES[userId].balance -=
            (quantity - remStocks) * Number(price) * 100;
        lib_1.ORDERBOOK[stockSymbol][stockType][price].total -= quantity - remStocks;
        // ii) Only some partial quantity is available
        if (remStocks !== 0) {
            placeReverseOrder(price, stockSymbol, oppStockType, userId, remStocks, priceOfStock);
            // checkOppOrderbook(stockSymbol, oppStockType, price, userId);
            // ORDERBOOK[stockSymbol][oppStockType]![
            // 	10 - Number(price)
            // ].orders.sudoOrders[userId] += remStocks;
            // ORDERBOOK[stockSymbol][oppStockType]![10 - Number(price)].total +=
            // 	remStocks;
            // INR_BALANCES[userId].balance -= priceOfStock * remStocks;
            // INR_BALANCES[userId].locked += priceOfStock * remStocks;
            remStocks = 0;
        }
        return { status: 200, json: { msg: "Bid submitted successfully" } };
    }
    let priceOfStock = Number(price) * 100;
    placeReverseOrder(price, stockSymbol, oppStockType, userId, quantity, priceOfStock);
    // checkOppOrderbook(stockSymbol, oppStockType, price, userId);
    // ORDERBOOK[stockSymbol][oppStockType]![10 - Number(price)].orders.sudoOrders[
    // 	userId
    // ] += quantity;
    // ORDERBOOK[stockSymbol][oppStockType]![10 - Number(price)].total += quantity;
    // INR_BALANCES[userId].balance -= priceOfStock * quantity;
    // INR_BALANCES[userId].locked += priceOfStock * quantity;
    return { status: 200, json: { msg: "Bid submitted successfully" } };
};
const checkOppOrderbook = (stockSymbol, oppStockType, price, userId) => {
    if (!lib_1.ORDERBOOK[stockSymbol][oppStockType][10 - Number(price)]) {
        lib_1.ORDERBOOK[stockSymbol][oppStockType][10 - Number(price)] = {
            total: 0,
            orders: {
                sudoOrders: {},
                orgOrders: {},
            },
        };
    }
    if (!lib_1.ORDERBOOK[stockSymbol][oppStockType][10 - Number(price)].orders.sudoOrders) {
        lib_1.ORDERBOOK[stockSymbol][oppStockType][10 - Number(price)].orders.sudoOrders = {};
    }
    if (!lib_1.ORDERBOOK[stockSymbol][oppStockType][10 - Number(price)].orders
        .sudoOrders[userId]) {
        lib_1.ORDERBOOK[stockSymbol][oppStockType][10 - Number(price)].orders.sudoOrders[userId] = 0;
    }
};
const placeReverseOrder = (price, stockSymbol, oppStockType, userId, quantity, priceOfStock) => {
    checkOppOrderbook(stockSymbol, oppStockType, price, userId);
    lib_1.ORDERBOOK[stockSymbol][oppStockType][10 - Number(price)].orders.sudoOrders[userId] += quantity;
    lib_1.ORDERBOOK[stockSymbol][oppStockType][10 - Number(price)].total += quantity;
    lib_1.INR_BALANCES[userId].balance -= priceOfStock * quantity;
    lib_1.INR_BALANCES[userId].locked += priceOfStock * quantity;
};
exports.default = buyStock;
