import { PublicKey } from "@solana/web3.js"
import * as anchor from '@project-serum/anchor'
import * as WebSocket from 'ws'
import { Msg3Program } from "../../msg3_program"
import { Post } from "../model/Post"
import { Message } from "../model/Message"

const provider = anchor.AnchorProvider.local()
anchor.setProvider(provider);

const program = anchor.workspace.Msg3Program as anchor.Program<Msg3Program>;
const programId = new PublicKey("pYSi8uuoAZPNNzk76aWax5NscjACtJtSDY9DSGnQtWB");

export function listenToNewPosts(sockets: Set<WebSocket>) {
    provider.connection.onProgramAccountChange(new PublicKey(programId),
    async (keyedAccountInfo, context) => {
        try {
            let fetchedAcc = (await program.account.post.fetch(keyedAccountInfo.accountId) as Message)

            let post = new Post(keyedAccountInfo.accountId,"global", fetchedAcc, false)

            console.log("New post detected! PDA: ", keyedAccountInfo.accountId.toString())
            broadcastNewPost(sockets, post); 
        } catch(err){}
    })
}

function broadcastNewPost(sockets: Set<WebSocket>, post) {
    console.log("Sending post to Clients amount:", sockets.size)
    sockets.forEach((client: WebSocket) => {
        client.send(JSON.stringify(post))
    })
}