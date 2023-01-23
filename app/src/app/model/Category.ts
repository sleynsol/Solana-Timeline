import { PublicKey } from "@solana/web3.js";
import * as BN from "bn.js";

export interface Category {
    name: string,
    postCount: BN,
    lastPostPda: PublicKey,
    predecessor: PublicKey,
    creator: PublicKey,
    bump: number,
    pda: PublicKey
}