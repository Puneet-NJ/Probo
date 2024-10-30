"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROBO = exports.STOCK_BALANCES = exports.ORDERBOOK = exports.INR_BALANCES = void 0;
exports.INR_BALANCES = {
    user1: {
        balance: 0,
        locked: 500,
    },
    user2: {
        balance: 0,
        locked: 550,
    },
    user3: {
        balance: 50000,
        locked: 0,
    },
};
exports.ORDERBOOK = {
    BTC_USDT_10_Oct_2024_9_30: {
        yes: {
            "9.5": {
                total: 27,
                orders: {
                    sudoOrders: { user1: 10, user2: 11 },
                    orgOrders: { user1: 3, user2: 3 },
                },
            },
            "8.5": {
                total: 11,
                orders: {
                    sudoOrders: { user1: 3, user2: 2 },
                    orgOrders: { user2: 6 },
                },
            },
        },
        no: {},
    },
};
exports.STOCK_BALANCES = {
    user1: {
        BTC_USDT_10_Oct_2024_9_30: {
            yes: {
                quantity: 0,
                locked: 3,
            },
            no: {
                quantity: 0,
                locked: 0,
            },
        },
    },
    user2: {
        BTC_USDT_10_Oct_2024_9_30: {
            yes: {
                quantity: 1,
                locked: 3,
            },
            no: {
                quantity: 0,
                locked: 0,
            },
        },
    },
    user3: {
        BTC_USDT_10_Oct_2024_9_30: {
            yes: {
                quantity: 1,
                locked: 3,
            },
            no: {
                quantity: 30,
                locked: 0,
            },
        },
    },
};
exports.PROBO = {
    balance: 0,
};
