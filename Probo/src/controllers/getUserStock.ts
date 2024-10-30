import { Request, Response } from "express";
import handleSub_Push from "../functions/handleSub_Push";

const getUserStock = async (req: Request, res: Response) => {
	const userId = String(req.params.userId);

	const val = await handleSub_Push("getUserStockBalance", { userId });

	const status = val[0];
	const msg = val[1];
	const data = val[2];

	if (status !== 200) {
		res.status(status).json({ msg });
		return;
	}

	res.status(status).json({ data });
};

export default getUserStock;
