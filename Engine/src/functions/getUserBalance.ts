import { INR_BALANCES } from "../lib";
import publish from "../publish";

const getUserBalance = async (userId: string, pubsubChannel: string) => {
	if (!INR_BALANCES[userId]) {
		await publish(pubsubChannel, {
			status: 411,
			msg: "Invalid user ID",
		});
		return;
	}

	const balance = INR_BALANCES[userId].balance / 100;

	await publish(pubsubChannel, {
		status: 200,
		msg: "Invalid user ID",
		data: balance,
	});
};

export default getUserBalance;
