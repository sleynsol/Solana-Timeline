import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Category } from 'src/app/model/Category';
import { Web3Service } from 'src/app/services/web3.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage {

  connected: boolean = false
  categories: Category[]

  constructor(private web3: Web3Service, private alertCtrl: AlertController, private router: Router) {
    this.listenToConnection()
    this.loadLatestCategories()
  }

  listenToConnection() {
    this.web3.getWeb3ConnectionSubject$().subscribe(value => this.connected = value)
  }

  async loadLatestCategories() {
    let categories = await this.web3.loadLatestCategories()
    this.categories = categories
  }

  async createCategory() {
    const alert = await this.alertCtrl.create({
      header: 'Please enter the name',
      buttons: ['OK'],
      inputs: [
        {
          placeholder: 'Name (max 20 characters)',
          attributes: {
            maxlength: 20,
          },
        }
      ]
    })
    
    alert.onDidDismiss().then((event) => {

      let name: string = event.data.values[0];
      if(name) {
        this.web3.createCategory(name).then(() => {
          this.web3.loadLatestCategories()
        })
      }
      
    })

    alert.present()

  }

  showCategory(category: Category) {
      this.router.navigate([`/ctg/${category.pda}`])
  }

}
