import { INR_BALANCES } from "../lib";
import publish from "../publish";

const onRamp = async (
	{
		userId,
		amount,
	}: {
		userId: string;
		amount: number;
	},
	pubsubChannel: string
) => {
	if (!INR_BALANCES[userId]) {
		await publish(pubsubChannel, { status: 411, msg: "Invalid user ID" });
		return;
	}

	INR_BALANCES[userId].balance += amount * 100;

	await publish(pubsubChannel, {
		status: 200,
		msg: "Funds added successfully",
		data: { balance: INR_BALANCES[userId].balance / 100 },
	});
};

export default onRamp;
