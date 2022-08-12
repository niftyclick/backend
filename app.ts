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
	const myNfts = await metaplex
		.nfts()
		.findAllByOwner(new PublicKey(req.params.id))
		.run();

	return res.json({
		data: myNfts,
	});
});

app.post("/mint", async (req: Request, res: Response) => {
	const { name, description, url } = req.body;

	const { uri } = await metaplex.nfts().uploadMetadata({
		name,
		description,
		image: url,
	});

	const { nft } = await metaplex.nfts().create({
		uri: uri,
	});

	console.log(nft.mint.toBase58());
});

export default app;
