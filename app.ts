import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import mintNFT from "./utils/mint";
import { PublicKey } from "@solana/web3.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
	return res.send(
		"NiftyClick's server :). Check us out @ https://twitter.com/niftyclickhq/"
	);
});

app.post("/create", async (req: Request, res: Response) => {
	const { account, name, symbol, uri, seller_fee, network, in_base64 } =
		req.body;
	console.log(req.body);

	const { transaction, message } = await mintNFT(
		new PublicKey(account),
		0.02,
		uri,
		name,
		symbol,
		parseInt(seller_fee),
		network,
		in_base64
	);

	return res.status(200).json({ transaction, message });
});

export default app;
