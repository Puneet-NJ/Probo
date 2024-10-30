import { INR_BALANCES, ORDERBOOK } from "../lib";
import publish from "../publish";
import { AllOrders } from "../types";

const pendingBuyOrders = async (userId: string, pubsubChannel: string) => {
	if (!INR_BALANCES[userId]) {
		await publish(pubsubChannel, {
			status: 411,
			msg: "Invalid user ID",
		});
		return;
	}

	let pendingBuyOrders: AllOrders[] = [];

	for (const stockSymbol in ORDERBOOK) {
		getOrderByType(stockSymbol, "yes", userId, pendingBuyOrders);

		getOrderByType(stockSymbol, "no", userId, pendingBuyOrders);
	}

	await publish(pubsubChannel, {
		status: 200,
		data: pendingBuyOrders,
		msg: "Pending orders fetched",
	});
};

const getOrderByType = (
	stockSymbol: string,
	stockType: "yes" | "no",
	userId: string,
	pendingBuyOrders: AllOrders[]
) => {
	for (const price in ORDERBOOK[stockSymbol][stockType]) {
		pendingBuyOrders.push(
			...ORDERBOOK[stockSymbol][stockType][price].orders.sudoOrders.filter(
				(order) => {
					return order.userId === userId;
				}
			)
		);
	}
};

export default pendingBuyOrders;
