import { ORDERBOOK, INR_BALANCES, STOCK_BALANCES, PROBO } from "../lib";
import publish from "../publish";

const returnAll = async (pubsubChannel: string) => {
	await publish(pubsubChannel, {
		status: 200,
		msg: "success",
		data: { ORDERBOOK, INR_BALANCES, STOCK_BALANCES, PROBO },
	});
};

export default returnAll;
