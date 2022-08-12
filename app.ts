import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import { PublicKey } from "@solana/web3.js";
import metaplex from "./utils/metaplex";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(morgan("dev"));

app.get("/all/:id", async (req: Request, res: Response) => {
	const allNfts = await metaplex
		.nfts()
		.findAllByOwner(new PublicKey(req.params.id))
		.run();

	return res.json({
		data: allNfts,
	});
});

app.post("/mint", async (req: Request, res: Response) => {
	const { name, description, url, account } = req.body;

	const { uri } = await metaplex
		.nfts()
		.uploadMetadata({
			name,
			description,
			image: url,
		})
		.run();

	const { nft } = await metaplex
		.nfts()
		.create({
			uri: uri,
			name,
			payer: account,
			tokenOwner: account,
		})
		.run();

	return res.json({ data: nft });
});

export default app;
