import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Web3Service } from './web3.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient, private web3: Web3Service) { }


  getMessageThreads() {
    return this.http.get(`${environment.backend_url}/api/messages/get`, {params: {user: this.web3.getPublicKey().toString()}})
  }

  createMessageThread(recipient: string) {
    return this.http.post(`${environment.backend_url}/api/messages/create`, {creator: this.web3.getPublicKey().toString(), recipient: recipient})
  }


}
