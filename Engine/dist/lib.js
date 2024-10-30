"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRICE_POINTS = exports.PROBO = exports.PENDING_ORDERS = exports.STOCK_BALANCES = exports.ORDERBOOK = exports.INR_BALANCES = void 0;
exports.INR_BALANCES = {
    user1: {
        balance: 50000,
        locked: 0,
    },
    user2: {
        balance: 50000,
        locked: 0,
    },
    user3: {
        balance: 50000,
        locked: 0,
    },
};
exports.ORDERBOOK = {
    BTC_USDT_10_Oct_2024_9_30: {
        yes: {
            "0.5": { total: 0, orders: { sudoOrders: [], orgOrders: [] } },
            "1": { total: 0, orders: { sudoOrders: [], orgOrders: [] } },
            "1.5": { total: 0, orders: { sudoOrders: [], orgOrders: [] } },
            "2": { total: 0, orders: { sudoOrders: [], orgOrders: [] } },
            "2.5": { total: 0, orders: { sudoOrders: [], orgOrders: [] } },
            "3": { total: 0, orders: { sudoOrders: [], orgOrders: [] } },
            "3.5": { total: 0, orders: { sudoOrders: [], orgOrders: [] } },
            "4": { total: 0, orders: { sudoOrders: [], orgOrders: [] } },
            "4.5": { total: 0, orders: { sudoOrders: [], orgOrders: [] } },
            "5": { total: 0, orders: { sudoOrders: [], orgOrders: [] } },
            "5.5": { total: 0, orders: { sudoOrders: [], orgOrders: [] } },
            "6": { total: 0, orders: { sudoOrders: [], orgOrders: [] } },
            "6.5": { total: 0, orders: { sudoOrders: [], orgOrders: [] } },
            "7": { total: 0, orders: { sudoOrders: [], orgOrders: [] } },
            "7.5": { total: 0, orders: { sudoOrders: [], orgOrders: [] } },
            "8": { total: 0, orders: { sudoOrders: [], orgOrders: [] } },
            "8.5": {
                total: 30,
                orders: {
                    sudoOrders: [
                        {
                            orderId: "order1",
                            userId: "user1",
                            quantity: 10,
                            filledQuantity: 3,
                            remQuantity: 7,
                            time: new Date(),
                        },
                        {
                            orderId: "order2",
                            userId: "user2",
                            quantity: 20,
                            filledQuantity: 0,
                            remQuantity: 20,
                            time: new Date(),
                        },
                    ],
                    orgOrders: [
                        {
                            orderId: "order1",
                            userId: "user1",
                            quantity: 10,
                            filledQuantity: 7,
                            remQuantity: 3,
                            time: new Date(),
                        },
                    ],
                },
            },
            "9": { total: 0, orders: { sudoOrders: [], orgOrders: [] } },
            "9.5": {
                total: 7,
                orders: {
                    sudoOrders: [],
                    orgOrders: [
                        {
                            orderId: "order1",
                            userId: "user1",
                            quantity: 10,
                            filledQuantity: 3,
                            remQuantity: 7,
                            time: new Date(),
                        },
                    ],
                },
            },
        },
        no: {
            "0.5": { total: 0, orders: { sudoOrders: [], orgOrders: [] } },
            "1": { total: 0, orders: { sudoOrders: [], orgOrders: [] } },
            "1.5": { total: 0, orders: { sudoOrders: [], orgOrders: [] } },
            "2": { total: 0, orders: { sudoOrders: [], orgOrders: [] } },
            "2.5": { total: 0, orders: { sudoOrders: [], orgOrders: [] } },
            "3": { total: 0, orders: { sudoOrders: [], orgOrders: [] } },
            "3.5": { total: 0, orders: { sudoOrders: [], orgOrders: [] } },
            "4": { total: 0, orders: { sudoOrders: [], orgOrders: [] } },
            "4.5": { total: 0, orders: { sudoOrders: [], orgOrders: [] } },
            "5": { total: 0, orders: { sudoOrders: [], orgOrders: [] } },
            "5.5": { total: 0, orders: { sudoOrders: [], orgOrders: [] } },
            "6": { total: 0, orders: { sudoOrders: [], orgOrders: [] } },
            "6.5": { total: 0, orders: { sudoOrders: [], orgOrders: [] } },
            "7": { total: 0, orders: { sudoOrders: [], orgOrders: [] } },
            "7.5": { total: 0, orders: { sudoOrders: [], orgOrders: [] } },
            "8": { total: 0, orders: { sudoOrders: [], orgOrders: [] } },
            "8.5": { total: 0, orders: { sudoOrders: [], orgOrders: [] } },
            "9": { total: 0, orders: { sudoOrders: [], orgOrders: [] } },
            "9.5": { total: 0, orders: { sudoOrders: [], orgOrders: [] } },
        },
    },
};
exports.STOCK_BALANCES = {
    user1: {
        BTC_USDT_10_Oct_2024_9_30: {
            yes: {
                quantity: 10,
                locked: 0,
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
                quantity: 0,
                locked: 0,
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
                quantity: 0,
                locked: 0,
            },
            no: {
                quantity: 0,
                locked: 0,
            },
        },
    },
};
exports.PENDING_ORDERS = {
    user1: {
        txn1: {
            quantity: 10,
            filled: 3,
            remaining: 7,
            time: new Date(),
        },
        txn2: {
            quantity: 10,
            filled: 3,
            remaining: 7,
            time: new Date(),
        },
    },
    user2: {},
};
exports.PROBO = {
    balance: 0,
};
exports.PRICE_POINTS = [
    "0.5",
    "1",
    "1.5",
    "2",
    "2.5",
    "3",
    "3.5",
    "4",
    "4.5",
    "5",
    "5.5",
    "6",
    "6.5",
    "7",
    "7.5",
    "8",
    "8.5",
    "9",
    "9.5",
];
