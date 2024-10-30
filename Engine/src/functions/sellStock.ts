import { INR_BALANCES, ORDERBOOK, PRICE_POINTS, STOCK_BALANCES } from "../lib";
import { v4 as uuidv4 } from "uuid";

interface RequestBody {
	price: number;
	quantity: number;
	stockSymbol: string;
	userId: string;
	stockType: "yes" | "no";
}

const dummySell = (body: RequestBody) => {
	const price = String(body.price);
	const quantity = body.quantity;
	const stockSymbol = body.stockSymbol;
	const userId = body.userId;

	const stockType = body.stockType;
	let totalRemQuantity = quantity;

	if (STOCK_BALANCES[userId][stockSymbol][stockType]!.quantity < quantity) {
		return {
			status: 411,
			json: { msg: "You dont have enough quantity of stocks" },
		};
	}

	for (const currPrice of PRICE_POINTS.slice().reverse()) {
		if (currPrice === price) {
			totalRemQuantity = matchOrderAtPrice(
				stockSymbol,
				stockType,
				10 - Number(currPrice),
				totalRemQuantity,
				userId,
				currPrice,
				price
			);

			break;
		}

		totalRemQuantity = matchOrderAtPrice(
			stockSymbol,
			stockType,
			10 - Number(currPrice),
			totalRemQuantity,
			userId,
			currPrice,
			price
		);
	}

	const orderId = uuidv4();
	if (totalRemQuantity !== 0) {
		ORDERBOOK[stockSymbol][stockType][price].total += totalRemQuantity;
		ORDERBOOK[stockSymbol][stockType][price].orders.orgOrders.push({
			orderId,
			userId,
			quantity,
			filledQuantity: quantity - totalRemQuantity,
			remQuantity: totalRemQuantity,
			time: new Date(),
		});

		STOCK_BALANCES[userId][stockSymbol][stockType]!.quantity -= quantity;
		STOCK_BALANCES[userId][stockSymbol][stockType]!.locked += quantity;
	}

	return {
		status: 200,
		json: { msg: "Bid submitted successfully" },
	};
};

const matchOrderAtPrice = (
	stockSymbol: string,
	stockType: "yes" | "no",
	oppObPrice: number,
	totalRemQuantity: number,
	userId: string,
	price: string,
	orgPrice: string
) => {
	const numPrice = Number(price) * 100;
	const oppStockType = stockType === "yes" ? "no" : "yes";
	const indexToDelete: number[] = [];

	const numOrgPrice = Number(orgPrice) * 100;

	if (
		totalRemQuantity >= ORDERBOOK[stockSymbol][oppStockType][oppObPrice].total
	)
		ORDERBOOK[stockSymbol][oppStockType][oppObPrice].total = 0;
	else
		ORDERBOOK[stockSymbol][oppStockType][oppObPrice].total -= totalRemQuantity;

	ORDERBOOK[stockSymbol][oppStockType][oppObPrice].orders.sudoOrders.some(
		(order, index) => {
			const remQuantity = order.remQuantity;
			const sellerUserId = order.userId;
			let stocksQuantity;

			if (remQuantity <= totalRemQuantity) {
				stocksQuantity = remQuantity;

				order.remQuantity = 0;

				indexToDelete.push(index);
			} else {
				stocksQuantity = totalRemQuantity;

				order.remQuantity -= totalRemQuantity;
			}

			order.filledQuantity += stocksQuantity;

			totalRemQuantity -= stocksQuantity;

			INR_BALANCES[userId].balance += stocksQuantity * numOrgPrice;
			INR_BALANCES[sellerUserId].locked -= stocksQuantity * numPrice;
			INR_BALANCES[sellerUserId].balance +=
				stocksQuantity * (numPrice - numOrgPrice);

			STOCK_BALANCES[userId][stockSymbol][stockType]!.quantity -=
				stocksQuantity;
			STOCK_BALANCES[sellerUserId][stockSymbol][stockType]!.quantity +=
				stocksQuantity;

			if (totalRemQuantity === 0) return true;
		}
	);

	for (const index of indexToDelete.reverse()) {
		ORDERBOOK[stockSymbol][oppStockType][oppObPrice].orders.sudoOrders.splice(
			index,
			1
		);
	}

	return totalRemQuantity;
};

export default dummySell;
