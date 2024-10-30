import { Request, Response } from "express";
import handleSub_Push from "../functions/handleSub_Push";

const onRamp = async (req: Request, res: Response) => {
	const body = req.body;

	const userId = String(body.userId);
	const amount = Number(body.amount);

	const val = await handleSub_Push("onramp", { amount, userId });

	const status = val[0];
	const msg = val[1];
	const data = val[2];

	if (status !== 200) {
		res.status(status).json({ msg });
		return;
	}

	res.status(status).json({ data });
};

export default onRamp;
