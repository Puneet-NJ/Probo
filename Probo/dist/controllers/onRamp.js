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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const handleSub_Push_1 = __importDefault(require("../functions/handleSub_Push"));
const onRamp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const userId = String(body.userId);
    const amount = Number(body.amount);
    const val = yield (0, handleSub_Push_1.default)("onramp", { amount, userId });
    const status = val[0];
    const msg = val[1];
    const data = val[2];
    if (status !== 200) {
        res.status(status).json({ msg });
        return;
    }
    res.status(status).json({ data });
});
exports.default = onRamp;
