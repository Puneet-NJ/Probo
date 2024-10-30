import { INR_BALANCES, STOCK_BALANCES } from "../lib";
import publish from "../publish";

const createUser = async (userId: string, pubsubChannel: string) => {
	if (INR_BALANCES[userId]) {
		await publish(pubsubChannel, {
			status: 411,
			msg: "User already exists",
		});
		return;
	}

	INR_BALANCES[userId] = { balance: 0, locked: 0 };
	STOCK_BALANCES[userId] = {};

	await publish(pubsubChannel, {
		status: 200,
		msg: "User created successfully",
	});
	return;
};

export default createUser;
