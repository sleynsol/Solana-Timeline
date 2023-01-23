import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-category-full',
  templateUrl: './category-full.page.html',
  styleUrls: ['./category-full.page.scss'],
})
export class CategoryFullPage implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private nav: NavController) { }

  private sub: any;
  pda: string;

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.pda = params['pda']
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  redirectBack() {
    this.nav.navigateBack("/tabs/search");
  }

}
