import { PublicKey } from "@solana/web3.js";

export interface Comment {
    text: string,
    likes: number,
    predecessor: PublicKey,
    writer: PublicKey,
    bump: number
}