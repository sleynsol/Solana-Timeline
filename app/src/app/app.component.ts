import { Component } from '@angular/core';
import { Web3Service } from './services/web3.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  initialized: boolean = false;

  constructor(private web3: Web3Service) {
    this.initService()
  }

  async initService() {
    await this.web3.init()
    this.initialized = true;
  }

}
