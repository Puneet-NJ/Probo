import { ORDERBOOK } from "../lib";
import publish from "../publish";

const getOrderbook = async (pubsubChannel: string) => {
	const orderbook = ORDERBOOK;

	await publish(pubsubChannel, {
		status: 200,
		data: orderbook,
	});
	return;
};

export default getOrderbook;
