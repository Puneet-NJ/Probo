import { client } from "..";
import { ORDERBOOK } from "../lib";

const Publish = async (stockSymbol: string) => {
	const modifiedOrderbook: {
		yes: { [price: string]: number };
		no: { [price: string]: number };
	} = { yes: {}, no: {} };

	for (let price in ORDERBOOK[stockSymbol].yes) {
		modifiedOrderbook.yes[price] = ORDERBOOK[stockSymbol].yes![price].total;
	}

	for (let price in ORDERBOOK[stockSymbol].no) {
		modifiedOrderbook.no[price] = ORDERBOOK[stockSymbol].no![price].total;
	}

	try {
		await client.publish(stockSymbol, JSON.stringify(modifiedOrderbook));
	} catch (error) {
		console.error("Error during publishing:", error);
	}
};

export default Publish;
