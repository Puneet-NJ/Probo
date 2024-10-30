import { Request, Response } from "express";
import handleSub_Push from "../functions/handleSub_Push";

const getStockBalances = async (req: Request, res: Response) => {
	const val = await handleSub_Push("getStocks");

	const status = val[0];
	const data = val[2];

	res.status(status).json({ data });
};

export default getStockBalances;
