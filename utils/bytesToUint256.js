import { ethers } from "ethers";

export function bytesToUint256(bytes) {
  return ethers.BigNumber.from(bytes);
}
