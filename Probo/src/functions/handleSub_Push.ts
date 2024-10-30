import { createClient } from "redis";
import { RedisClientType } from "@redis/client";

let client: RedisClientType;
let subClient: RedisClientType;

const handleSub_Push = async (
	func: string,
	inputs?: any
): Promise<[number, string, string]> => {
	const pubsubChannel = Math.random().toString();

	let status;
	let msg;
	let data;

	const response: [number, string, string] = await new Promise(
		async (resolve, reject) => {
			await subClient.subscribe(pubsubChannel, async (response) => {
				await subClient.unsubscribe(pubsubChannel);

				const parsedResponse = JSON.parse(response);

				status = parsedResponse?.status;
				msg = parsedResponse?.msg;
				data = parsedResponse?.data;

				resolve([status, msg, data]);
			});

			await client.lPush(
				"queue",
				JSON.stringify({ func, inputs, pubsubChannel })
			);
		}
	);

	return response;
};

export const initilizeRedis = async () => {
	client = createClient();
	await client.connect();

	subClient = createClient();
	await subClient.connect();
};

export default handleSub_Push;
