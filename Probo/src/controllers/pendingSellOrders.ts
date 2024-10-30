import { Request, Response } from "express";
import handleSub_Push from "../functions/handleSub_Push";

const pendingSellOrders = async (req: Request, res: Response) => {
	const userId = req.params.userId;

	const val = await handleSub_Push("pendingSellOrders", { userId });

	const status = val[0];
	const msg = val[1];
	const data = val[2];

	res.status(status).json({ msg, data });
};

export default pendingSellOrders;
