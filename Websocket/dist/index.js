"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const redis_1 = require("redis");
const users = {};
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const subscriberClient = (0, redis_1.createClient)();
    yield subscriberClient.connect();
    const wss = new ws_1.WebSocketServer({ port: 3001 });
    wss.on("connection", (userSocket) => {
        const userId = Math.random();
        users[userId] = {
            ws: userSocket,
            stocks: [],
        };
        userSocket.on("message", (data) => {
            const { type, stockSymbol } = JSON.parse(data.toString());
            console.log("message");
            if (type === "SUBSCRIBE") {
                users[userId].stocks.push(stockSymbol);
                if (isFirstUserToRoom(stockSymbol)) {
                    subscriberClient.subscribe(stockSymbol, (message) => {
                        const data = JSON.parse(message);
                        console.log(data);
                        for (let userId in users) {
                            if (users[userId].stocks.includes(stockSymbol)) {
                                users[userId].ws.send(JSON.stringify(data));
                            }
                        }
                    });
                }
            }
            if (type === "UNSUBSCRIBE") {
                users[userId].stocks = users[userId].stocks.filter((stock) => stock !== stockSymbol);
                if (isLastUserLeft(stockSymbol)) {
                    subscriberClient.unsubscribe(stockSymbol);
                }
            }
        });
        userSocket.on("close", (data) => { });
    });
});
const isFirstUserToRoom = (stockSymbol) => {
    let numOfUsers = 0;
    for (let userId in users) {
        if (users[userId].stocks.includes(stockSymbol))
            numOfUsers++;
        if (numOfUsers > 1)
            return false;
    }
    if (numOfUsers === 0)
        return false;
    return true;
};
const isLastUserLeft = (stockSymbol) => {
    let numOfUsers = 0;
    for (let userId in users) {
        if (users[userId].stocks.includes(stockSymbol))
            return false;
    }
    return true;
};
main();
