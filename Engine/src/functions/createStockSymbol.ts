import { ORDERBOOK, PRICE_POINTS } from "../lib";
import publish from "../publish";

const createStockSymbol = async (
	stockSymbol: string,
	pubsubChannel: string
) => {
	if (ORDERBOOK[stockSymbol]) {
		await publish(pubsubChannel, {
			status: 411,
			msg: "This stock symbol already exists",
		});

		return;
	}

	ORDERBOOK[stockSymbol] = { yes: {}, no: {} };
	PRICE_POINTS.map(
		(price) =>
			(ORDERBOOK[stockSymbol].yes[price] = {
				total: 0,
				orders: { sudoOrders: [], orgOrders: [] },
			})
	);

	await publish(pubsubChannel, {
		status: 200,
		msg: "Stock symbol created successfully",
	});
};

export default createStockSymbol;
