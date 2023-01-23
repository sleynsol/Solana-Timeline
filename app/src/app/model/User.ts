import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { Post } from "./Post";

export interface User {
    postCount: BN,
    commentCount: BN,
    predecessor: PublicKey,
    pubkey: PublicKey,
    bump: number,
    posts: Post[]
}