import { defaultAbiCoder as abi } from "@ethersproject/abi";
// Example hexadecimal string from your query
const test =
  "0x3cbe7b2a1cbe0e67f31c6490b43b5ec526dc1c1e67d1690bc537975c6946f2b";

const merkle_root = abi
  .decode(["uint256"], `0x${test.slice(2).padStart(64, "0")}`)[0]
  .toHexString();

console.log(merkle_root);
