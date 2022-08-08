import {
	Metaplex,
	keypairIdentity,
	bundlrStorage,
} from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";
import fs from "fs";

const pathToMyKeypair = process.env.HOME + "/.config/solana/id.json";
const keypairFile = fs.readFileSync(pathToMyKeypair);
const secretKey = Buffer.from(JSON.parse(keypairFile.toString()));
const myKeyPair = Keypair.fromSecretKey(secretKey);

const connection = new Connection(clusterApiUrl("devnet"));
const metaplex = Metaplex.make(connection)
	.use(keypairIdentity(myKeyPair))
	.use(bundlrStorage({ address: "https://devnet.bundlr.network" }));

export default metaplex;
