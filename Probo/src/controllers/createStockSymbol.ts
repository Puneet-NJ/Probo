import { Request, Response } from "express";
import handleSub_Push from "../functions/handleSub_Push";

const createStockSymbol = async (req: Request, res: Response) => {
	const stockSymbol = String(req.params.stockSymbol);

	const val = await handleSub_Push("createStockSymbol", { stockSymbol });

	const status = val[0];
	const msg = val[1];

	res.status(status).json({ msg });
};

export default createStockSymbol;
