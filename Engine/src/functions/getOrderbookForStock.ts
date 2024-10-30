import { ORDERBOOK } from "../lib";
import publish from "../publish";

const getOrderbookForStock = async (
	stockSymbol: string,
	pubsubChannel: string
) => {
	if (!ORDERBOOK[stockSymbol]) {
		await publish(pubsubChannel, { status: 411, msg: "Invalid stock symbol" });
		return;
	}

	const orderbookForStock = { stock: stockSymbol, ...ORDERBOOK[stockSymbol] };

	await publish(pubsubChannel, { status: 200, data: orderbookForStock });
};

export default getOrderbookForStock;
