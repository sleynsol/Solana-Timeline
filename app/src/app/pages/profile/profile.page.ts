import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/User';
import { Web3Service } from 'src/app/services/web3.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {

  connected: boolean = false
  user: User;

  constructor(private web3: Web3Service) {
    this.listenToConnection()
    this.listenToConnectedUser()
  }

  listenToConnection() {
    this.web3.getWeb3ConnectionSubject$().subscribe((value: boolean) => {
      this.connected = value;
    })
  }

  listenToConnectedUser() {
    this.web3.getUserSubject$().subscribe((user: User) => {
      this.user = user;
    })
  }

  connectWallet() {
    this.web3.connectWallet()
  }

  getPubkey() {
    return this.web3.getPublicKey().toString()
  }

  async createUserAccount() {
    await this.web3.createUserAccount()
    await this.web3.loadUser()
  }

  getPfp(){
    return "assets/unknown.svg"
  }

}
