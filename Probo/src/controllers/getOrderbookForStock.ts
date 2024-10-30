import { Request, Response } from "express";
import handleSub_Push from "../functions/handleSub_Push";

const getOrderbookForStock = async (req: Request, res: Response) => {
	const stockSymbol = String(req.params.stockSymbol);

	const val = await handleSub_Push("getOrderbookForStock", { stockSymbol });

	const status = val[0];
	const msg = val[1];
	const data = val[2];

	if (status !== 200) {
		res.status(status).json({ msg });
		return;
	}

	res.status(status).json({ data });
};

export default getOrderbookForStock;
