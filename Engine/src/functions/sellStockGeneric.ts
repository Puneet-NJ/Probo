import publish from "../publish";
import Publish from "./Publish";
import sellStock from "./sellStock";

interface Body {
	price: number;
	quantity: number;
	stockSymbol: string;
	userId: string;
	stockType: "yes" | "no";
}

const sellStockGeneric = async (body: Body, pubsubChannel: string) => {
	const stockType = body.stockType;
	const stockSymbol = body.stockSymbol;

	let response;
	if (stockType === "yes" || stockType === "no") {
		response = sellStock(body);

		await publish(pubsubChannel, {
			status: response.status,
			msg: response.json.msg,
		});

		await Publish(stockSymbol);
	} else {
		await publish(pubsubChannel, { status: 411, msg: "Invalid stock type" });
	}
};

export default sellStockGeneric;
