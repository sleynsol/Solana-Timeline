import { PublicKey } from "@solana/web3.js";
import { Message } from "./Message";

export class Post {

    constructor(pda: PublicKey, category: string, message: Message, liked: boolean) {
        this.pda = pda;
        this.category = category;
        this.message = message;
        this.liked = liked;
    }
    pda: PublicKey;
    category: String;
    message: Message;
    liked: boolean;
}