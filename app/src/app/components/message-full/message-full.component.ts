import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { PublicKey } from '@solana/web3.js';
import { BN } from 'bn.js';
import { Comment } from 'src/app/model/Comment';
import { Post } from 'src/app/model/Post';
import { Web3Service } from 'src/app/services/web3.service';

@Component({
  selector: 'app-message-full',
  templateUrl: './message-full.component.html',
  styleUrls: ['./message-full.component.scss'],
})
export class MessageFullComponent implements OnInit {

  constructor(private route: ActivatedRoute, private web3: Web3Service, private nav: NavController, private toastCtrl: ToastController) { }

  post: Post;
  comments: Comment[]
  commentText: string = "";
  pending: boolean = false;

  ngOnInit() {
    this.route.queryParams.subscribe(async (params) => {
      await this.loadPost(params.pda)
      await this.loadComments()
    })
  }

  async loadPost(pda: string) {
    this.post = await this.web3.loadPost(new PublicKey(pda))
  }

  async loadComments() {
    this.comments = await this.web3.loadLatestComments(this.post.message)
  }

  redirectBack() {
    this.nav.navigateBack("/tabs/home");
  }

  async comment() {
    if(!this.web3.checkConnection()) return;

    this.pending = true;
    await this.web3.commentPost(this.post, this.commentText)
    this.post.message.comments = this.post.message.comments.add(new BN(1));
    this.pending = false;
  }
}
