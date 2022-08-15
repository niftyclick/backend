import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import { makeStorageClient, makeFileFromJSON } from "./utils/web3Storage";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(morgan("dev"));

app.post("/uploadMetadata", async (req: Request, res: Response) => {
	const { name, desc, image, address } = req.body;

	const file = makeFileFromJSON(name, desc, image, address);

	const client = makeStorageClient();
	const cid = await client.put([file]);
	console.log("stored files with cid: ", cid);

	return res.json({
		data: cid,
	});
});

export default app;
