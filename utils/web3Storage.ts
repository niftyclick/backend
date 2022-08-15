import { Web3Storage, File } from "web3.storage";
import { API_TOKEN } from "./config";

export const makeStorageClient = () => {
	return new Web3Storage({ token: API_TOKEN });
};

const getSymbolFromName = (name: string): string => {
	return name
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase())
		.join("");
};

export const makeFileFromJSON = (
	name: string,
	description: string,
	image: string,
	address: string
): File => {
	const data = {
		name,
		symbol: getSymbolFromName(name),
		description,
		properties: {
			category: "image",
			creators: [
				{
					address,
					share: 100,
				},
			],
			files: [
				{
					uri: image,
					type: "image/png",
				},
			],
		},
		image,
	};

	const buffer = Buffer.from(JSON.stringify(data));

	return new File([buffer], `metadata-${data["symbol"]}-${address}.json`);
};
