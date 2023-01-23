import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Web3Service } from 'src/app/services/web3.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  initialized: boolean = false;

  constructor(private web3: Web3Service, private toastCtrl: ToastController) {
    this.listenToWeb3Connection()
    this.autoConnect()
  }

  autoConnect() {
    this.web3.connectWallet()
  }

  listenToWeb3Connection() {
    this.web3.getWeb3ConnectionSubject$().subscribe((connection) => {
    if(connection) this.showConnectedToast()
    })
  }

  showConnectedToast() {
    this.toastCtrl.create(
      {
        message: `${this.web3.getPublicKey().toString().substring(0, 10)} connected!`,
        duration: 2000,
        color: "success",
        position: 'top'
      }
    ).then(toast => toast.present())
  }

}
