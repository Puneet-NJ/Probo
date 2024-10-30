import {
	Inr_Balances,
	Orderbook,
	PendingOrders,
	Probo,
	Stock_balances,
} from "./types";

export const INR_BALANCES: Inr_Balances = {
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

export const ORDERBOOK: Orderbook = {
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

export const STOCK_BALANCES: Stock_balances = {
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

export const PENDING_ORDERS: PendingOrders = {
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

export const PROBO: Probo = {
	balance: 0,
};

export const PRICE_POINTS = [
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
