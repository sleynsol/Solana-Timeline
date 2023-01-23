import { Injectable } from '@angular/core';
import { PublicKey } from '@solana/web3.js';
import { BN, utils } from '@project-serum/anchor';
import { PROGRAM_ID } from '../constants/constants';
import { User } from '../model/User';

const GLOBAL_SEED = "global"
const CATEGORY_SEED = "category"
const POST_SEED = "post"
const LIKE_SEED = "like"
const COMMENT_SEED = "comment"
const USER_SEED = "user"

@Injectable({
  providedIn: 'root'
})
export class PdaService {

  constructor() { }

  async getGlobalStatsPDA() {
    const [pda, bump] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode(GLOBAL_SEED)
      ],
      new PublicKey(PROGRAM_ID))
      return pda;
  }

  async getGlobalCategoryPDA() {
    const [pda, bump] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode(CATEGORY_SEED),
        utils.bytes.utf8.encode(GLOBAL_SEED)
      ],
      new PublicKey(PROGRAM_ID))
      return pda;
  }
  

  async getCategoryPDA(category: string) {
    const [pda, bump] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode(CATEGORY_SEED),
        utils.bytes.utf8.encode(category),
      ],
      new PublicKey(PROGRAM_ID))

      return pda;
  }

  async getUserPDA(pubkey: PublicKey) {
    const [pda, bump] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode(USER_SEED),
        pubkey.toBuffer(),
      ],
      new PublicKey(PROGRAM_ID))

      return pda;
  }

  async getNewPostPDA(user: User) {
    const [pda, bump] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode(POST_SEED),
        (await this.getUserPDA(user.pubkey)).toBuffer(),
        Uint8Array.of(...user.postCount.toArray('be', 8))
      ],
      new PublicKey(PROGRAM_ID))

      return pda;
  }

  async getNewCommentPDA(user: User) {
    const [pda, bump] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode(COMMENT_SEED),
        (await this.getUserPDA(user.pubkey)).toBuffer(),
        Uint8Array.of(...user.commentCount.toArray('be', 8))
      ],
      new PublicKey(PROGRAM_ID))

      return pda;
  }

  async getPostPDA(user: User, postCount: BN) {
    const [pda, bump] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode(POST_SEED),
        (await this.getUserPDA(user.pubkey)).toBuffer(),
        Uint8Array.of(...postCount.toArray('be', 8))
      ],
      new PublicKey(PROGRAM_ID)
    )
    return pda;
  }

  async getLikeAccountForPostPDA(user: User, postPDA: PublicKey) {
    const [pda, bump] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode(LIKE_SEED),
        (await this.getUserPDA(user.pubkey)).toBuffer(),
        postPDA.toBuffer()
      ],
      new PublicKey(PROGRAM_ID))

      return pda;
  }



}
