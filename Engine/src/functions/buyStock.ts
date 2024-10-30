import {
	INR_BALANCES,
	ORDERBOOK,
	PRICE_POINTS,
	PROBO,
	STOCK_BALANCES,
} from "../lib";
import { v4 as uuidv4 } from "uuid";

interface Body {
	price: number;
	quantity: number;
	stockSymbol: string;
	userId: string;
	stockType: "yes" | "no";
}

const buyStock = (body: Body) => {
	const price = String(body.price);
	const quantity = body.quantity;
	const stockSymbol = body.stockSymbol;
	const userId = body.userId;
	const stockType = body.stockType;

	let totalQuantityRem = quantity;

	const oppStockType = stockType === "yes" ? "no" : "yes";

	if (!ORDERBOOK[stockSymbol] || !ORDERBOOK[stockSymbol][stockType]) {
		return {
			status: 411,
			json: { msg: "Invalid stock symbol" },
		};
	}

	let result = { status: 200, json: { msg: "Bid submitted successfully" } };

	PRICE_POINTS.some((currPrice) => {
		if (currPrice === price) {
			totalQuantityRem = buyStockAtPrice(
				stockSymbol,
				stockType,
				currPrice,
				totalQuantityRem,
				userId
			);
			return true;
		}

		if (!ORDERBOOK[stockSymbol][stockType]?.[currPrice]) {
			result = {
				status: 411,
				json: { msg: "Invalid price" },
			};
			return true; // stop iteration
		}

		if (ORDERBOOK[stockSymbol][stockType][currPrice].total > 0) {
			totalQuantityRem = buyStockAtPrice(
				stockSymbol,
				stockType,
				currPrice,
				totalQuantityRem,
				userId
			);
		}
		return false; // continue iteration
	});

	if (totalQuantityRem !== 0) {
		placeReverseOrder(
			stockSymbol,
			oppStockType,
			userId,
			price,
			quantity,
			totalQuantityRem,
			quantity - totalQuantityRem
		);
	}

	return result;
};

const buyStockAtPrice = (
	stockSymbol: string,
	stockType: "yes" | "no",
	price: string,
	totalQuantityRem: number,
	userId: string
) => {
	const numPrice = Number(price) * 100;
	const oppStockType = stockType === "yes" ? "no" : "yes";

	if (ORDERBOOK[stockSymbol][stockType][price].total <= totalQuantityRem)
		ORDERBOOK[stockSymbol][stockType][price].total = 0;
	else ORDERBOOK[stockSymbol][stockType][price].total -= totalQuantityRem;

	let ordersToDelete: number[] = [];

	ORDERBOOK[stockSymbol][stockType][price].orders.orgOrders.some(
		(order, index) => {
			const remQuantity = order.remQuantity;
			let purchasedQuantity;
			const sellerUserId = order.userId;

			// I have bought stocks from him
			if (remQuantity <= totalQuantityRem) {
				purchasedQuantity = remQuantity;
				order.remQuantity = 0;

				ordersToDelete.push(index);
			} else {
				purchasedQuantity = totalQuantityRem;
				order.remQuantity -= purchasedQuantity;
			}

			order.filledQuantity += purchasedQuantity;

			totalQuantityRem -= purchasedQuantity;

			INR_BALANCES[userId].balance -= numPrice * purchasedQuantity;
			INR_BALANCES[sellerUserId].balance += numPrice * purchasedQuantity;

			STOCK_BALANCES[userId][stockSymbol][stockType]!.quantity +=
				purchasedQuantity;
			STOCK_BALANCES[sellerUserId][stockSymbol][stockType]!.locked -=
				purchasedQuantity;

			if (totalQuantityRem === 0) return true;
		}
	);

	for (const index of ordersToDelete.reverse()) {
		ORDERBOOK[stockSymbol][stockType][price].orders.orgOrders.splice(index, 1);
	}

	if (totalQuantityRem !== 0) {
		ordersToDelete = [];
		ORDERBOOK[stockSymbol][stockType][price].orders.sudoOrders.some(
			(order, index) => {
				const remQuantity = order.remQuantity;
				let purchasedQuantity;
				const sellerUserId = order.userId;

				// I have to match the stocks now
				if (remQuantity <= totalQuantityRem) {
					purchasedQuantity = remQuantity;
					order.remQuantity = 0;

					ordersToDelete.push(index);
				} else {
					purchasedQuantity = totalQuantityRem;

					order.remQuantity -= purchasedQuantity;
				}

				order.filledQuantity += purchasedQuantity;

				totalQuantityRem -= purchasedQuantity;

				INR_BALANCES[userId].balance -= numPrice * purchasedQuantity;
				INR_BALANCES[sellerUserId].locked -=
					(10 - numPrice / 100) * 100 * purchasedQuantity;

				STOCK_BALANCES[userId][stockSymbol][stockType]!.quantity +=
					purchasedQuantity;
				STOCK_BALANCES[sellerUserId][stockSymbol][oppStockType]!.quantity +=
					purchasedQuantity;

				PROBO.balance +=
					numPrice * purchasedQuantity +
					(10 - numPrice / 100) * 100 * purchasedQuantity;

				if (totalQuantityRem === 0) return true;
			}
		);

		for (const index of ordersToDelete.reverse()) {
			ORDERBOOK[stockSymbol][stockType][price].orders.sudoOrders.splice(
				index,
				1
			);
		}
	}

	return totalQuantityRem;
};

const placeReverseOrder = (
	stockSymbol: string,
	oppStockType: "yes" | "no",
	userId: string,
	price: string,
	quantity: number,
	totalQuantityRem: number,
	filledQuantity: number
) => {
	const revObPrice = 10 - Number(price);
	const numPrice = Number(price) * 100;

	const orderId = uuidv4();

	ORDERBOOK[stockSymbol][oppStockType][revObPrice].total += totalQuantityRem;
	ORDERBOOK[stockSymbol][oppStockType][revObPrice].orders.sudoOrders.push({
		orderId,
		userId,
		time: new Date(),
		quantity,
		remQuantity: totalQuantityRem,
		filledQuantity,
	});

	INR_BALANCES[userId].balance -= totalQuantityRem * numPrice;
	INR_BALANCES[userId].locked += totalQuantityRem * numPrice;
};

export default buyStock;
