import { PublicKey } from "@solana/web3.js";
import * as BN from "bn.js";

export interface GlobalStats {
    globalPostCount: BN,
    globalUserCount: BN,
    categoryCount: BN,
    lastUser: PublicKey
    lastCategoryPda: PublicKey,
    bump: number
}