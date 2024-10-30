import { INR_BALANCES } from "../lib";
import publish from "../publish";

const getBalance = async (pubsubChannel: string) => {
	const inr_balances = INR_BALANCES;

	await publish(pubsubChannel, {
		data: { balance: inr_balances },
		status: 200,
	});
};

export default getBalance;
