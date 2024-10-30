import { Request, Response } from "express";
import handleSub_Push from "../functions/handleSub_Push";

const buyStock = async (req: Request, res: Response) => {
	const body = req.body;

	const val = await handleSub_Push("stockBuy", { body });

	const status = val[0];
	const msg = val[1];

	res.status(status).json({ msg });
};

export default buyStock;
