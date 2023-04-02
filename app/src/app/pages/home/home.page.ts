import { Component, ElementRef, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddComponent } from 'src/app/components/add/add.component';
import { GlobalStats } from 'src/app/model/GlobalStats';
import { Post } from '../../model/Post';
import { Web3Service } from '../../services/web3.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  posts: Post[] = [];
  stats: GlobalStats;
  keyboardVisible: boolean = false;
  desktop: boolean = false;
  webSocketConnected: boolean = false;

  @ViewChild("listComp") listRef: ElementRef;

  constructor(private web3: Web3Service, private modalCtrl: ModalController) {

    if(screen.width > 1200) this.desktop = true

    this.getGlobalStats()
    this.listenToLoadedPosts();
    this.listenToWebSocketConnection();
  }

  getGlobalStats() {
    this.stats = this.web3.globalStats;
  }

  listenToLoadedPosts() {
    this.web3.getPostSubject$().subscribe((posts: Post[]) => {

      if(this.listRef) {
        //@ts-ignore
        this.listRef.el.classList.add("bump-in-anim")
        //@ts-ignore
        setTimeout(() => {this.listRef.el.classList.remove("bump-in-anim")}, 1000)
      }
      this.posts = posts;
    })
  }

  listenToWebSocketConnection() {
    this.web3.getWebSocketConnectionSubject$().subscribe((connected: boolean) => {
      this.webSocketConnected = connected
    })
  }

  refresh(ev) {
    setTimeout(() => {
      ev.detail.complete();
    }, 3000);
  }

  async writeMessage() {

    if(!this.web3.checkConnection()) return;

    let modal = await this.modalCtrl.create(
      {
        component: AddComponent
      }
    )

    modal.present()
  }

}
