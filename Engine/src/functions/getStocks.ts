import { STOCK_BALANCES } from "../lib";
import publish from "../publish";

const getStocks = async (pubsubChannel: string) => {
	const stock_balances = STOCK_BALANCES;

	await publish(pubsubChannel, { data: stock_balances, status: 200 });
};

export default getStocks;
