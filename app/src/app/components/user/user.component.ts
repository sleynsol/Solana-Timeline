import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PublicKey } from '@solana/web3.js';
import { User } from 'src/app/model/User';
import { MessageService } from 'src/app/services/message.service';
import { Web3Service } from 'src/app/services/web3.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {

  user: User


  constructor(private route: ActivatedRoute, private web3: Web3Service, private nav: NavController, private msgService: MessageService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.loadUser(params.pda)
    })
  }

  async loadUser(pda: string) {
    this.user = await this.web3.loadUserAccount(new PublicKey(pda))
  }

  startNewChat() {
    this.msgService.createMessageThread(this.user.pubkey.toString()).subscribe(thread => {
      console.log(thread)
    })
  }

  isConnectedUser() {
    return this.user.pubkey.toString() == this.web3.getPublicKey().toString()
  }

  redirectBack() {
    this.nav.navigateBack("/tabs/home");
  }

  getPfp(){
    return "assets/unknown.svg"
  }

}
