import { client } from ".";

interface Inputs {
	status: number;
	msg?: string;
	data?: any;
}

const publish = async (
	pubsubChannel: string,
	{ status, msg, data }: Inputs
) => {
	await client.publish(pubsubChannel, JSON.stringify({ status, msg, data }));
};

export default publish;
