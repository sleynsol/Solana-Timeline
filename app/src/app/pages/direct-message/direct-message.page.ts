import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import { Web3Service } from 'src/app/services/web3.service';

@Component({
  selector: 'app-direct-message',
  templateUrl: './direct-message.page.html',
  styleUrls: ['./direct-message.page.scss'],
})
export class DirectMessagePage implements OnInit {

  constructor(private dmService: MessageService, private web3: Web3Service) { 
    web3.getWeb3ConnectionSubject$().subscribe(value => {
      if(value) this.loadMessageThreads()
    })    
  }

  ngOnInit() {
  }

  loadMessageThreads()  {
    this.dmService.getMessageThreads().subscribe((threads) => {
      console.log(threads)
    })
  }

}
