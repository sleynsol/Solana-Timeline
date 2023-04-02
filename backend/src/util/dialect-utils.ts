import { NodeDialectSolanaWalletAdapter, Solana, SolanaSdkFactory } from "@dialectlabs/blockchain-sdk-solana"
import { CreateThreadCommand, Dialect, DialectSdk, Thread, ThreadId, ThreadMemberScope, ThreadSummary } from "@dialectlabs/sdk"
import { Keypair } from "@solana/web3.js";
import * as dotenv from 'dotenv';
dotenv.config();

const keypair = Keypair.fromSecretKey(Uint8Array.from([28,129,82,8,221,200,185,190,107,24,83,159,165,60,132,188,68,0,169,159,243,95,178,40,59,100,169,3,95,169,197,150,12,45,217,221,147,154,250,243,200,52,185,99,66,30,27,251,30,179,247,222,229,88,184,189,201,164,83,167,160,0,222,208]))

const environment = "development"

const sdk: DialectSdk<Solana> = Dialect.sdk(
    {
        environment: environment,
        dialectCloud: {
            environment: "development"
        }
    },
    SolanaSdkFactory.create({
        //@ts-ignore
        wallet: NodeDialectSolanaWalletAdapter.create(keypair),
        enableOnChainMessaging: true,
    })
)

console.log("Keypair: ", keypair.publicKey)

export async function getThreadsForUser(pubkey: string) {
    let thread: Thread =  await sdk.threads.find({otherMembers: [pubkey]})
    console.log(thread)
    return thread
}

export async function getMessagesOfThread(id: ThreadId) {
  let thread = await sdk.threads.find({id: id})
  return await thread.messages()
}

export async function sendMessageToThread(id: ThreadId, message: string) {
  let thread = await sdk.threads.find({id: id})
  await thread.send({text: message})
}

export async function createDirectMessgeThread(creator: string, recipient: string): Promise<Thread> {
    const command: CreateThreadCommand = {
      encrypted: false,
      me: {
        scopes: [ThreadMemberScope.ADMIN, ThreadMemberScope.WRITE],
      },
      otherMembers: [
        {
            address: creator,
            scopes: [ThreadMemberScope.ADMIN, ThreadMemberScope.WRITE]
        },
        {
          address: recipient,
          scopes: [ThreadMemberScope.ADMIN, ThreadMemberScope.WRITE],
        },
      ],
    };
    const thread = await sdk.threads.create(command);
    console.log({ thread });
    return thread;
}