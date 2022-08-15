import { Web3Storage } from "web3.storage";
import { API_TOKEN } from "./config";

export const makeStorageClient = () => {
	return new Web3Storage({ token: API_TOKEN });
};
