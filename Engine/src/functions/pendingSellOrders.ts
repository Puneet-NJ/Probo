import { INR_BALANCES, ORDERBOOK } from "../lib";
import publish from "../publish";
import { AllOrders } from "../types";

const pendingSellOrders = async (userId: string, pubsubChannel: string) => {
	if (!INR_BALANCES[userId]) {
		await publish(pubsubChannel, {
			status: 411,
			msg: "Invalid user ID",
		});
		return;
	}

	let pendingSellOrders: AllOrders[] = [];
	for (const stockSymbol in ORDERBOOK) {
		pendingSellOrders.push(
			...getPendingOrdersbyType(stockSymbol, "yes", userId)
		);

		pendingSellOrders.push(
			...getPendingOrdersbyType(stockSymbol, "no", userId)
		);
	}

	await publish(pubsubChannel, {
		status: 200,
		msg: "Pending orders fetched",
		data: pendingSellOrders,
	});
};

const getPendingOrdersbyType = (
	stockSymbol: string,
	stockType: "yes" | "no",
	userId: string
) => {
	let orders: AllOrders[] = [];
	for (const price in ORDERBOOK[stockSymbol][stockType]) {
		const ordersAtPrice = ORDERBOOK[stockSymbol][stockType][
			price
		].orders.orgOrders.filter((order) => {
			if (order.userId === userId) return true;
		});

		orders.push(...ordersAtPrice);
	}

	return orders;
};

export default pendingSellOrders;
