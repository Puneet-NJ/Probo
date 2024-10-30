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
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = String(req.params.userId);
    const val = yield (0, handleSub_Push_1.default)("createUser", { userId });
    const status = val[0];
    const msg = val[1];
    const data = val[2];
    res.status(status).json({ msg });
});
exports.default = createUser;
