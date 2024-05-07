// 1. Import modules.
import {
  createPublicClient,
  createWalletClient,
  hashMessage,
  http,
} from "viem";
import { mainnet, optimism } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { getContract } from "viem";
import { parseAbi } from "viem";

// 3. Client
const safeAddress = "0xd809de3086ea4f53ed3979cead25e1ff72b564a3";
const privateKey =
  "0x7197c864d90e6a76965573e2c5dfceaf5374279067361d928c22f5a1e450f148";
const safeEOA = "0x52fcc6871c8cf3bfd8a5e455e1cf125d3d0ad558";
const EIP1271_ABI = parseAbi([
  "function isValidSignature(bytes32 _message, bytes _signature) public view returns (bytes4)",
  "function checkSignatures(bytes32 dataHash, bytes data, bytes signatures) public view",
]);

// The message you want to sign
const message = "Hello, world!";

const account = privateKeyToAccount(privateKey);
const client = createWalletClient({
  account,
  chain: optimism,
  transport: http(),
});

const contract = getContract({
  address: safeAddress,
  abi: EIP1271_ABI,
  client: client,
});

const check = async () => {
  try {
    const signature = await account.signMessage({ message });
    const hashedMessage = hashMessage(message);
    const messageBytes = Buffer.from(message, "utf8").toString("hex"); // Convert message to hex string
    console.log("Message:", messageBytes);
    await contract.read.checkSignatures([
      hashedMessage,
      `0x${messageBytes}`, // bytes, prefixed with 0x
      signature,
    ]);
    console.log("CheckSignatures passed successfully.");
  } catch (error) {
    console.error("Error calling checkSignatures:");
  }
};

check();
