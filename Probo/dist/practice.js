"use strict";
// const asyncFunc = async () => {
// 	const todos = await fetch("https://jsonplaceholder.typicode.com/todos");
// 	const parsedTodos = await todos.json();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// 	const users = await fetch("https://jsonplaceholder.typicode.com/users");
// 	const parsedUsers = await users.json();
// 	return [parsedTodos[0], parsedUsers[0]];
// };
// const helper = async () => {
// 	const val = await asyncFunc();
// 	console.log(val);
// };
// helper();
const asyncFunc = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield new Promise((res, rej) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("inside promise");
        const todos = yield fetch("https://jsonplaceholder.typicode.com/todos");
        const parsedTodos = yield todos.json();
        const users = yield fetch("https://jsonplaceholder.typicode.com/users");
        const parsedUsers = yield users.json();
        res([parsedTodos[0], parsedUsers[0]]);
    }));
    console.log("exit from promise");
    return response;
});
const val = asyncFunc();
console.log(val);
