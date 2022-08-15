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

app.post("/uploadMetadata", async (req: Request, res: Response) => {
	const { name, desc, image } = req.body;
	const { uri } = await metaplex
		.nfts()
		.uploadMetadata({
			name,
			desc,
			image,
		})
		.run();
	console.log(uri); // https://arweave.net/789

	return res.json({
		data: uri,
	});
});

export default app;
