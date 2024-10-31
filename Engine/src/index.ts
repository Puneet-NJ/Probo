import { createClient } from "redis";
import { RedisClientType } from "@redis/client";
import returnAll from "./functions/returnAll";
import createUser from "./functions/createUser";
import createStockSymbol from "./functions/createStockSymbol";
import getOrderbook from "./functions/getOrderbook";
import getBalance from "./functions/getBalance";
import getStocks from "./functions/getStocks";
import getUserBalance from "./functions/getUserBalance";
import onRamp from "./functions/onRamp";
import getUserStockBalance from "./functions/getUserStockBalance";
import getOrderbookForStock from "./functions/getOrderbookForStock";
import buyStockGeneric from "./functions/buyStockGeneric";
import sellStockGeneric from "./functions/sellStockGeneric";
import pendingBuyOrders from "./functions/pendingBuyOrders";
import pendingSellOrders from "./functions/pendingSellOrders";

export let client: RedisClientType;

const main = async () => {
	client = createClient({ url: "redis://redis:6379" });
	await client.connect();

	while (1) {
		const res = await client.brPop("queue", 0);
		// @ts-ignore
		const element = JSON.parse(res.element);
		const func = element.func;
		const pubsubChannel = element.pubsubChannel;

		if (func === "returnAll") {
			returnAll(pubsubChannel);
		}
		if (func === "createUser") {
			createUser(element.inputs.userId, pubsubChannel);
		}
		if (func === "createStockSymbol") {
			createStockSymbol(element.inputs.stockSymbol, pubsubChannel);
		}
		if (func === "getOrderbook") {
			getOrderbook(pubsubChannel);
		}
		if (func === "getBalance") {
			getBalance(pubsubChannel);
		}
		if (func === "getStocks") {
			getStocks(pubsubChannel);
		}
		if (func === "getUserBalance") {
			getUserBalance(element.inputs.userId, pubsubChannel);
		}
		if (func === "onramp") {
			onRamp(element.inputs, pubsubChannel);
		}
		if (func === "getUserStockBalance") {
			getUserStockBalance(element.inputs.userId, pubsubChannel);
		}
		if (func === "stockBuy") {
			buyStockGeneric(element.inputs.body, pubsubChannel);
		}
		if (func === "stockSell") {
			sellStockGeneric(element.inputs.body, pubsubChannel);
		}
		if (func === "getOrderbookForStock") {
			getOrderbookForStock(element.inputs.stockSymbol, pubsubChannel);
		}
		if (func === "pendingBuyOrders") {
			pendingBuyOrders(element.inputs.userId, pubsubChannel);
		}
		if (func === "pendingSellOrders") {
			pendingSellOrders(element.inputs.userId, pubsubChannel);
		}
	}
};

main();
