import { STOCK_BALANCES } from "../lib";
import publish from "../publish";

const getUserStockBalance = async (userId: string, pubsubChannel: string) => {
	if (!STOCK_BALANCES[userId]) {
		await publish(pubsubChannel, {
			status: 411,
			msg: "User with this ID doesn't exists",
		});
		return;
	}

	const stockBalance = STOCK_BALANCES[userId];

	await publish(pubsubChannel, {
		status: 200,
		data: stockBalance,
	});
};

export default getUserStockBalance;
