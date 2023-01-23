import { PublicKey } from "@solana/web3.js";
import * as BN from "bn.js";

export interface Message {
    text: String,
    likes: BN,
    comments: BN,
    lastCommentPda: PublicKey,
    predecessor: PublicKey,
    writer: PublicKey,
    bump: number
}