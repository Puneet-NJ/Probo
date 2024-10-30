import { Request, Response } from "express";
import handleSub_Push from "../functions/handleSub_Push";

const returnAll = async (req: Request, res: Response) => {
	const val = await handleSub_Push("returnAll");

	const status = val[0];
	const msg = val[1];
	const data = val[2];

	res.status(status).json({ msg, data });
};

export default returnAll;
