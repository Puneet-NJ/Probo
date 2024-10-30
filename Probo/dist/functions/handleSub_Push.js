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
exports.initilizeRedis = void 0;
const redis_1 = require("redis");
let client;
let subClient;
const handleSub_Push = (func, inputs) => __awaiter(void 0, void 0, void 0, function* () {
    const pubsubChannel = Math.random().toString();
    let status;
    let msg;
    let data;
    const response = yield new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        yield subClient.subscribe(pubsubChannel, (response) => __awaiter(void 0, void 0, void 0, function* () {
            yield subClient.unsubscribe(pubsubChannel);
            const parsedResponse = JSON.parse(response);
            status = parsedResponse === null || parsedResponse === void 0 ? void 0 : parsedResponse.status;
            msg = parsedResponse === null || parsedResponse === void 0 ? void 0 : parsedResponse.msg;
            data = parsedResponse === null || parsedResponse === void 0 ? void 0 : parsedResponse.data;
            resolve([status, msg, data]);
        }));
        yield client.lPush("queue", JSON.stringify({ func, inputs, pubsubChannel }));
    }));
    return response;
});
const initilizeRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    client = (0, redis_1.createClient)();
    yield client.connect();
    subClient = (0, redis_1.createClient)();
    yield subClient.connect();
});
exports.initilizeRedis = initilizeRedis;
exports.default = handleSub_Push;
