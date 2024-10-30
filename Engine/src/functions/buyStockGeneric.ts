import { INR_BALANCES } from "../lib";
import publish from "../publish";
import buyStock from "./buyStock";
// import dummyBuy from "./dummyBuy";
import Publish from "./Publish";

interface Body {
	price: number;
	quantity: number;
	stockSymbol: string;
	userId: string;
	stockType: "yes" | "no";
}

const buyStockGeneric = async (body: Body, pubsubChannel: string) => {
	const price = String(body.price);
	const quantity = body.quantity;
	const stockSymbol = body.stockSymbol;
	const userId = body.userId;
	const stockType = body.stockType;

	// Check if the buyer has sufficient balance

	if (INR_BALANCES[userId].balance < Number(price) * 100 * quantity) {
		await publish(pubsubChannel, { status: 411, msg: "Insufficient balance" });
		return;
	}

	let response;
	if (stockType === "yes" || stockType === "no") {
		response = buyStock(body);
		// response = dummyBuy(body);

		await publish(pubsubChannel, {
			status: response.status,
			msg: response.json.msg,
		});

		await Publish(stockSymbol);
	} else {
		await publish(pubsubChannel, { status: 411, msg: "Invalid stock type" });
		return;
	}
};

export default buyStockGeneric;
