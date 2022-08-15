import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import { File } from "web3.storage";
import { makeStorageClient } from "./utils/web3Storage";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(morgan("dev"));

const makeFileFromJSON = (data) => {
	const buffer = Buffer.from(JSON.stringify(data));

	return new File([buffer], `metadata-${data["name"]}.json`);
};

app.post("/uploadMetadata", async (req: Request, res: Response) => {
	// const { name, desc, image } = req.body;

	const obj = { hello: "world" };
	const file = makeFileFromJSON(obj);

	const client = makeStorageClient();
	const cid = await client.put([file]);
	console.log("stored files with cid: ", cid);

	return res.json({
		data: cid,
	});
});

export default app;
