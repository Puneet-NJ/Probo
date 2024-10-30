interface User {
	balance: number;
	locked: number;
}
export interface Inr_Balances {
	[key: string]: User;
}

export interface AllOrders {
	orderId: string;
	userId: string;
	quantity: number;
	filledQuantity: number;
	remQuantity: number;
	time: Date;
}
interface Orders {
	sudoOrders: AllOrders[];
	orgOrders: AllOrders[];
}
interface PriceString {
	total: number;
	orders: Orders;
}
interface Yes_No {
	[key: string]: PriceString;
}
interface StockSymbol {
	yes: Yes_No;
	no: Yes_No;
}
export interface Orderbook {
	[key: string]: StockSymbol;
}

interface Stock_yes_no {
	quantity: number;
	locked: number;
}
interface Stock_stocksymbol {
	yes?: Stock_yes_no;
	no?: Stock_yes_no;
}
interface UserId {
	[key: string]: Stock_stocksymbol;
}
export interface Stock_balances {
	[key: string]: UserId;
}

interface OrderId {
	quantity: number;
	filled: number;
	remaining: number;
	time: Date;
}
interface UserId_Pending {
	[orderId: string]: OrderId;
}
export interface PendingOrders {
	[userId: string]: UserId_Pending;
}

export interface Probo {
	balance: number;
}
