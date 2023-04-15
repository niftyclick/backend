import {
	GuestIdentityDriver,
	Metaplex,
	keypairIdentity,
} from "@metaplex-foundation/js";
import {
	Cluster,
	Connection,
	Keypair,
	LAMPORTS_PER_SOL,
	PublicKey,
	SystemProgram,
	clusterApiUrl,
} from "@solana/web3.js";
import base58 from "bs58";

const mintNFT = async (
	account: PublicKey,
	amount = 0.02,
	metadata_uri: string,
	name: string,
	symbol: string,
	seller_fee: number,
	network: string
) => {
	const ENDPOINT = clusterApiUrl(network as Cluster);
	const connection = new Connection(ENDPOINT);

	const payerPrivateKey = process.env.PAYER_SECRET_KEY;
	if (!payerPrivateKey) throw new Error("PAYER_PRIVATE_KEY not found");
	const payerKeypair = Keypair.fromSecretKey(base58.decode(payerPrivateKey));

	const metaplex = Metaplex.make(connection).use(keypairIdentity(payerKeypair));

	const nfts = metaplex.nfts();

	const mintKeypair = Keypair.generate();
	console.log("mint", mintKeypair.publicKey);

	const transactionBuilder = await nfts.builders().create({
		uri: metadata_uri,
		name: name,
		symbol: symbol,
		tokenOwner: account,
		updateAuthority: payerKeypair,
		collection: null,
		creators: [
			{
				address: payerKeypair.publicKey,
				share: 100,
			},
		],
		uses: null,
		sellerFeeBasisPoints: seller_fee,
		useNewMint: mintKeypair,
	});

	const solTransferInstruction = SystemProgram.transfer({
		fromPubkey: account,
		toPubkey: payerKeypair.publicKey,
		lamports: LAMPORTS_PER_SOL * amount,
	});

	// Create a guest identity for buyer, so they will be a required signer for the transaction
	const identitySigner = new GuestIdentityDriver(account);

	// Add the SOL payment to the NFT transaction
	transactionBuilder.prepend({
		instruction: solTransferInstruction,
		signers: [identitySigner],
	});

	// transactionBuilder.setFeePayer(payerKeypair);

	// Convert to transaction
	const latestBlockhash = await connection.getLatestBlockhash();
	const transaction = await transactionBuilder.toTransaction(latestBlockhash);

	// Partially sign the transaction, as the payer and the mint
	// The account is also a required signer, but they'll sign it with their wallet after we return it
	transaction.sign(payerKeypair, mintKeypair);

	// Serialize the transaction and convert to base64 to return it
	const serializedTransaction = transaction.serialize({
		requireAllSignatures: false, // account is a missing signature
	});
	const base64 = serializedTransaction.toString("base64");

	const message = "Please approve the transaction to mint your golden ticket!";

	// Return the serialized transaction
	return {
		transaction: base64,
		message,
	};
};

export default mintNFT;
