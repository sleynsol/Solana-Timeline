import * as dotenv from "dotenv";
dotenv.config();
import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { Msg3Program } from "../target/types/msg3_program";
import { BN } from "bn.js";


describe("msg3-program", () => {

  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.local("https://api.testnet.solana.com")
  anchor.setProvider(provider);

  const program = anchor.workspace.Msg3Program as Program<Msg3Program>;
  const programId = new PublicKey("pYSi8uuoAZPNNzk76aWax5NscjACtJtSDY9DSGnQtWB");

  it("shall initiailize", async() => {

    const [globalPDA, globalBump] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("global")
      ],
      programId)

    await program.methods.initialize()
    .accounts({
        creator: provider.wallet.publicKey,
        global: globalPDA
      }).rpc()

      let globalStats = await program.account.globalStats.fetch(globalPDA)

      console.log("Initialized!")
      console.log(globalStats)

  })

  it("Create global category", async () => {

    const [globalStatsPDA, globalBump] = await PublicKey.findProgramAddress(
    [
      anchor.utils.bytes.utf8.encode("global")
    ],
    programId)

    const [globalCategoryPDA, globalCategoryBump] = await PublicKey.findProgramAddress(
    [
      anchor.utils.bytes.utf8.encode("category"),
      anchor.utils.bytes.utf8.encode("global")
    ],
    programId)

    console.log("global stats: ", globalStatsPDA.toString())
    console.log("global category: ", globalCategoryPDA.toString())

    await program.methods.createCategory("global")
    .accounts({
      creator: provider.wallet.publicKey,
      category: globalCategoryPDA,
      global: globalStatsPDA,
    }).rpc()

    console.log("Created global category")

    let globalCategory = await program.account.category.fetch(globalCategoryPDA)

    console.log(globalCategory)

  });

  it("Shall create a post",async () => {
    
    const [globalStatsPDA, globalBump] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("global")
      ],
      programId
    )
  
    const [globalCategoryPDA, globalCategoryBump] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("category"),
        anchor.utils.bytes.utf8.encode("global")
      ],
      programId
    )

    let globalCategory = await program.account.category.fetch(globalCategoryPDA)

    console.log("POST COUNT: ", globalCategory.postCount.toNumber())
    
    const [postPDA, pdaBump] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("post"),
        anchor.utils.bytes.utf8.encode("global"),
        Uint8Array.of(...globalCategory.postCount.toArray('be', 8))
      ],
      programId
    )

    console.log("POST COUNT U8: ", Uint8Array.of(...globalCategory.postCount.toArray('be', 8)))

    console.log("POST PDA ", postPDA.toString())

      await program.methods.post("This is the first Post!")
      .accounts({
        creator: provider.wallet.publicKey,
        category: globalCategoryPDA,
        post: postPDA,
        global: globalStatsPDA
      }).rpc()
      
      let post = await program.account.post.fetch(postPDA)

      console.log("Created post")
      console.log(post)

  })

  it('shall fetch all accounts',async () => {

    let postCounts = [new BN(0), new BN(1), new BN(2)]

    for(let count of postCounts) {
      const [postPDA, pdaBump] = await PublicKey.findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode("post"),
          anchor.utils.bytes.utf8.encode("global"),
          Uint8Array.of(...count.toArray('be', 8))
        ],
        programId
      )

      let post = await program.account.post.fetch(postPDA)

      console.log("POST ", count.toNumber())
      console.log("POST PDA", postPDA.toString())
      console.log(post)
    }


    const [globalStatsPDA, globalBump] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("global")
      ],
      programId
    )
  
    const [globalCategoryPDA, globalCategoryBump] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("category"),
        anchor.utils.bytes.utf8.encode("global")
      ],
      programId
    )
    
    let globalStats = await program.account.globalStats.fetch(globalStatsPDA)
    let category = await program.account.category.fetch(globalCategoryPDA)
    

    console.log("STATS: ", globalStats)
    console.log("CATEGORY: ", category)


  })
});
