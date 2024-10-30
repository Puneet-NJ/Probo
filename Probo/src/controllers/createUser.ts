import { Request, Response } from "express";
import handleSub_Push from "../functions/handleSub_Push";

const createUser = async (req: Request, res: Response) => {
	const userId = String(req.params.userId);

	const val = await handleSub_Push("createUser", { userId });

	const status = val[0];
	const msg = val[1];
	const data = val[2];

	res.status(status).json({ msg });
};

export default createUser;
