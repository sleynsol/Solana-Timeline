import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { Post } from '../../model/Post';
import { UserComponent } from '../user/user.component';
import { Web3Service } from 'src/app/services/web3.service';
import BN from 'bn.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Input() post: Post;
  @Input("comments-diabled") commentsDisabled: boolean;

  constructor(private web3: Web3Service, private nav: NavController, private toastCtrl: ToastController) { }

  ngOnInit() {}

  isIos() {
    const win = window as any;
    return win && win.Ionic && win.Ionic.mode === 'ios';
  }

  showUser() {
    this.nav.navigateForward("user", { queryParams:{ pda: this.post.message.writer.toString() }})
  }

  showPost() {
    this.nav.navigateForward("msg", { queryParams: { pda: this.post.pda } })
  }


  async like() {
    if(!this.web3.checkConnection()) return;

    await this.web3.likePost(this.post)
    this.post.message.likes = this.post.message.likes.add(new BN(1));
    this.post.liked = true
  }

  share() {
    var dummy = document.createElement('input')

    document.body.appendChild(dummy);
    dummy.value = `https://app.solana-timeline.com/msg?pda=${this.post.pda}`;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);

    this.toastCtrl.create(
      {
        message: "link copied to clipboard",
        color: "secondary",
        position: "top",
        duration: 3000
      }
    ).then(t => t.present())
  }

  getPfp(){
    return "assets/unknown.svg"
  }

}
