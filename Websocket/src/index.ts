import { WebSocket, WebSocketServer } from "ws";
import { createClient } from "redis";

const users: {
	[userId: string]: {
		ws: WebSocket;
		stocks: string[];
	};
} = {};

const main = async () => {
	const subscriberClient = createClient();
	await subscriberClient.connect();

	const wss = new WebSocketServer({ port: 3001 });

	wss.on("connection", (userSocket) => {
		const userId = Math.random();
		users[userId] = {
			ws: userSocket,
			stocks: [],
		};

		userSocket.on("message", (data) => {
			const { type, stockSymbol } = JSON.parse(data.toString());

			if (type === "SUBSCRIBE") {
				users[userId].stocks.push(stockSymbol);

				if (isFirstUserToRoom(stockSymbol)) {
					subscriberClient.subscribe(stockSymbol, (message) => {
						const data = JSON.parse(message);

						for (let userId in users) {
							if (users[userId].stocks.includes(stockSymbol)) {
								users[userId].ws.send(JSON.stringify(data));
							}
						}
					});
				}
			}

			if (type === "UNSUBSCRIBE") {
				users[userId].stocks = users[userId].stocks.filter(
					(stock) => stock !== stockSymbol
				);

				if (isLastUserLeft(stockSymbol)) {
					subscriberClient.unsubscribe(stockSymbol);
				}
			}
		});

		userSocket.on("close", (data) => {});
	});
};

const isFirstUserToRoom = (stockSymbol: string) => {
	let numOfUsers = 0;

	for (let userId in users) {
		if (users[userId].stocks.includes(stockSymbol)) numOfUsers++;

		if (numOfUsers > 1) return false;
	}

	if (numOfUsers === 0) return false;

	return true;
};

const isLastUserLeft = (stockSymbol: string) => {
	let numOfUsers = 0;

	for (let userId in users) {
		if (users[userId].stocks.includes(stockSymbol)) return false;
	}

	return true;
};

main();
