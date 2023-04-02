import { Injectable } from '@angular/core';
import { clusterApiUrl, Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { BehaviorSubject } from 'rxjs';
import { Program, Idl, AnchorProvider } from '@project-serum/anchor';
import { Msg3Program } from 'src/app/idl/msg3_program';
import { PdaService } from './pda.service';
import { GlobalStats } from '../model/GlobalStats';
import { Category } from '../model/Category';
import { PROGRAM_ID, PROGRAM_POINTER } from '../constants/constants';
import * as idl from '../idl/msg3_program.json'
import { Post } from '../model/Post';
import { User } from '../model/User';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { BN } from 'bn.js';
import { Message } from '../model/Message';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Comment } from '../model/Comment';

@Injectable({
  providedIn: 'root'
})

export class Web3Service {

  walletAdapter: PhantomWalletAdapter = new PhantomWalletAdapter()
  isConnectedSubject: BehaviorSubject<boolean> = new BehaviorSubject(false)
  userSubject: BehaviorSubject<User> = new BehaviorSubject(null)
  postSubject: BehaviorSubject<Post[]> = new BehaviorSubject(null)
  webSocketConnectionSubject: BehaviorSubject<boolean> = new BehaviorSubject(null)

  globalStats: GlobalStats
  globalCategory: Category
  user: User

  connection: Connection
  provider: AnchorProvider
  program: Program<Msg3Program>

  posts: Post[];
  isConnected: boolean = false;


  constructor(private pda: PdaService, private router: Router, private toastCtrl: ToastController) {}

  async init() {
    this.initProgram()
    await this.loadGlobalStats()
    await this.loadGlobalCategory()
    this.listenToLoadedPosts()
    this.listenToConnection()
    await this.loadLatestPosts()
    this.listenToNewPosts()
  }

  initProgram() {
    this.connection = new Connection(environment.rpc_endpoint, "processed");
    this.provider = new AnchorProvider(this.connection, this.walletAdapter, {skipPreflight: true});
    this.program = (new Program((idl as Idl), new PublicKey(PROGRAM_ID), this.provider) as Program<Msg3Program>)
  }

  getPublicKey() {
    return this.walletAdapter.publicKey
  }

  async loadGlobalStats() {
    //@ts-ignore
    this.globalStats = await this.program.account.globalStats.fetch(await this.pda.getGlobalStatsPDA())
  }

  async loadGlobalCategory() {
    //@ts-ignore
    this.globalCategory = await this.program.account.category.fetch(await this.pda.getGlobalCategoryPDA())
  }

  async loadUser() {
    try {
      this.user = {...await this.program.account.user.fetch(await this.pda.getUserPDA(this.walletAdapter.publicKey)), posts: []}
      await this.loadUserPosts(this.user)
      this.userSubject.next(this.user)
      this.lazyLoadLikes()
    } catch(e) {
    }
  }

  async loadUserAccount(pda: PublicKey): Promise<User> {
    let user = {...await this.program.account.user.fetch(await this.pda.getUserPDA(pda)), posts: []}
    user.posts = await this.loadPostsFromUser(user)
    return user;
  }

  async loadLatestPosts(): Promise<void> {
    let posts: Post[] = [];

    let lastPostPDA: PublicKey = this.globalCategory.lastPostPda;
    let likeAcc;

    for(let i = 0; i < 9; i++) {
      if(lastPostPDA.toString() == PROGRAM_POINTER) continue;
      let postAcc: any = await this.program.account.post.fetch(lastPostPDA)

      try {
        likeAcc = await this.program.account.like.fetch(await this.pda.getLikeAccountForPostPDA(this.user, lastPostPDA))
      } catch(e) {
        likeAcc = undefined;
      }

      posts.push(new Post(lastPostPDA, this.globalCategory.name, postAcc, likeAcc != undefined))
      lastPostPDA = postAcc.predecessor;
      likeAcc = undefined;
    }
    this.postSubject.next(posts);
  }

  async loadLatestComments(msg: Message): Promise<Comment[]> {
    let comments: Comment[] = [];

    let lastCommentPDA: PublicKey = msg.lastCommentPda

    for(let i = 0; i < 9; i++) {
      if(lastCommentPDA.toString() == PROGRAM_POINTER) continue;
      let commentAcc: any = await this.program.account.comment.fetch(lastCommentPDA)


      comments.push(commentAcc)
      lastCommentPDA = commentAcc.predecessor;
    }
    return comments
  }

  async loadPost(pda: PublicKey) {
    let acc = await this.program.account.post.fetch(pda)
    let likeAcc;
    try {
      likeAcc = await this.program.account.like.fetch(await this.pda.getLikeAccountForPostPDA(this.user, pda))
    }
    catch(e) {
      likeAcc = undefined;
    }
    return new Post(pda, this.globalCategory.name, acc, likeAcc != undefined)
  }

  async lazyLoadLikes() {
    let posts = this.posts;
    let likeAcc;

    for(let post of posts) {
      try {
        //load the like account
        likeAcc = await this.program.account.like.fetch(await this.pda.getLikeAccountForPostPDA(this.user, post.pda))
        //if it can be loaded, we know that the user liked it
        post.liked = true;
      } catch(e) {
        likeAcc = undefined;
      }

    }

    this.postSubject.next(posts)
  }

  async loadLatestCategories(): Promise<Category[]> {

    let categories: Category[] = [];

    let lastCategoryPDA: PublicKey = this.globalStats.lastCategoryPda;
    
    for(let i = 0; i < 9; i++) {
      if(lastCategoryPDA.toString() == PROGRAM_ID) continue;
      let categoryAcc: any = await this.program.account.category.fetch(lastCategoryPDA)
      categories.push({...categoryAcc, pda: lastCategoryPDA})
      lastCategoryPDA = categoryAcc.predecessor;
    }

    return categories
  }

  async loadUserPosts(user: User): Promise<void> {
    
    let lastPostPDA: PublicKey;
    let likeAcc;

    for(let i = 1; i <= 5; i++) {

      let counter = user.postCount;
      counter = counter.sub(new BN(i))
      lastPostPDA = await this.pda.getPostPDA(this.user, counter);

      //skip if there aren't any posts left
      if(counter.toNumber() < 0) continue;

      //fetch the post account
      let postAcc: any = await this.program.account.post.fetch(lastPostPDA)

      //fetch the like account
      try {
        likeAcc = await this.program.account.like.fetch(await this.pda.getLikeAccountForPostPDA(this.user, lastPostPDA))
      } catch(e) {
        likeAcc = undefined;
      }

      user.posts.push(new Post(lastPostPDA, this.globalCategory.name, postAcc, likeAcc != undefined))
      lastPostPDA = postAcc.predecessor;
      likeAcc = undefined;
    }
  }

  async loadPostsFromUser(user: User): Promise<Post[]> {
    
    let lastPostPDA: PublicKey;
    let likeAcc;
    let posts = []

    for(let i = 1; i <= 5; i++) {

      let counter = user.postCount;
      counter = counter.sub(new BN(i))
      lastPostPDA = await this.pda.getPostPDA(user, counter);

      //skip if there aren't any posts left
      if(counter.toNumber() < 0) continue;

      //fetch the post account
      let postAcc: any = await this.program.account.post.fetch(lastPostPDA)

      //fetch the like account
      try {
        likeAcc = await this.program.account.like.fetch(await this.pda.getLikeAccountForPostPDA(this.user, lastPostPDA))
      } catch(e) {
        likeAcc = undefined;
      }

      posts.push(new Post(lastPostPDA, this.globalCategory.name, postAcc, likeAcc != undefined))
      lastPostPDA = postAcc.predecessor;
      likeAcc = undefined;
    }

    return posts;
  }

  async createUserAccount() {
    try {
      await this.program.methods.createUser()
        .accounts({
          creator: this.walletAdapter.publicKey,
          user: await this.pda.getUserPDA(this.walletAdapter.publicKey),
          global: await this.pda.getGlobalStatsPDA()
      }).rpc()
    } catch(e) {
      this.toastCtrl.create({
        message: e,
        position: "top",
        color: "danger",
        duration: 5000
      }).then(t => t.present())
    }

  }

  async createCategory(name: string) {
    await this.program.methods.createCategory(name)
    .accounts({
      creator: this.walletAdapter.publicKey,
      category: await this.pda.getCategoryPDA(name),
      global: await this.pda.getGlobalStatsPDA()
    }).rpc()
  }

  async post(text: string, category: string) {

  let postPDA = await this.pda.getNewPostPDA(this.user)

    await this.program.methods.post(text)
    .accounts({
      creator: this.walletAdapter.publicKey,
      post: postPDA,
      user: await this.pda.getUserPDA(this.walletAdapter.publicKey),
      category: await this.pda.getCategoryPDA(category),
      global: await this.pda.getGlobalStatsPDA()
    }).rpc()


    this.user.postCount = this.user.postCount.add(new BN(1));
    let msg = await this.program.account.post.fetch(postPDA)

    let newPost = new Post(postPDA, category, msg, false);
    //this.posts.unshift(newPost)
    //this.postSubject.next(this.posts)
  }

  async likePost(post: Post) {
    await this.program.methods.likePost()
    .accounts({
      creator: this.walletAdapter.publicKey,
      like: await this.pda.getLikeAccountForPostPDA(this.user, post.pda),
      user: await this.pda.getUserPDA(this.walletAdapter.publicKey),
      post: post.pda
    }).rpc()
  }

  async commentPost(post: Post, text: string) {
    await this.program.methods.comment(text)
    .accounts({
      creator: this.walletAdapter.publicKey,
      comment: await this.pda.getNewCommentPDA(this.user),
      user: await this.pda.getUserPDA(this.walletAdapter.publicKey),
      post: post.pda
    }).rpc()
  }

  connectWallet() {
    this.walletAdapter.connect().then(() => {
      this.loadUser().finally(() => {
        this.isConnectedSubject.next(true);
      })
    })
  }

  disconnectWallet() {
    this.walletAdapter.disconnect().then(() => {
      this.isConnectedSubject.next(false);
    })
  }

  getWeb3ConnectionSubject$(): BehaviorSubject<boolean> {
    return this.isConnectedSubject;
  }

  getUserSubject$(): BehaviorSubject<User> {
    return this.userSubject;
  }

  getPostSubject$(): BehaviorSubject<Post[]> {
    return this.postSubject;
  }

  getWebSocketConnectionSubject$(): BehaviorSubject<boolean> {
    return this.webSocketConnectionSubject;
  }

  listenToLoadedPosts() {
    this.getPostSubject$().subscribe((posts: Post[]) => {
      this.posts = posts;
    })
  }

  listenToConnection() {
    this.getWeb3ConnectionSubject$().subscribe((value: boolean) => {
      this.isConnected = value;
    })
  }

  async getRecentBlockhash() {
    return await (await this.connection.getLatestBlockhash('finalized')).blockhash;
  }

  checkConnection() {
    if(!this.isConnected) {
      this.router.navigateByUrl("tabs/profile")
      this.toastCtrl.create(
        {
          color: "secondary",
          message: "Please connect your wallet first",
          duration: 3000,
          position: "top"
          
        }
      ).then(t => t.present())
      return false;  
    }

    if(!this.user) {
      this.router.navigateByUrl("tabs/profile")
      this.toastCtrl.create(
        {
          color: "secondary",
          message: "Please create an account",
          duration: 3000,
          position: "top"
          
        }
      ).then(t => t.present())
      return false;  
    }

    return true;

  }

  listenToNewPosts() {
    const socket = new WebSocket(environment.websocket_url)
    this.webSocketConnectionSubject.next(true)

    socket.onmessage = (msg) => {
      let rawNewPost = JSON.parse(msg.data)
    
      rawNewPost.message.comments = new BN(rawNewPost.message.comments)
      rawNewPost.message.likes = new BN(rawNewPost.message.likes)
      rawNewPost.message.lastCommentPda = new PublicKey(rawNewPost.message.lastCommentPda)
      rawNewPost.message.writer = new PublicKey(rawNewPost.message.writer)
      rawNewPost.message.predecessor = new PublicKey(rawNewPost.message.predecessor)

      rawNewPost.pda = new PublicKey(rawNewPost.pda)

      if(!this.posts.map(post => post.pda.toString()).includes(rawNewPost.pda.toString())) {
        this.posts.unshift(rawNewPost)
        this.postSubject.next(this.posts)
      }


    }
  }

}