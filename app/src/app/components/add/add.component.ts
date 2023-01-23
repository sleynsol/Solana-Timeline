import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Web3Service } from '../../services/web3.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {

  text: string = "";
  pending: boolean = false
  desktop: boolean = false 

  constructor(private web3: Web3Service, private modalCtrl: ModalController) { 
    if(screen.width > 1200) this.desktop = true;
  }

  ngOnInit() {
  }

  async post() {
    this.pending = true;
    await this.web3.post(this.text, "global")
    this.pending = false;

    this.modalCtrl.dismiss()
  }

  redirectBack() {
    this.modalCtrl.dismiss()
  }

}
