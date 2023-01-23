import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Comment } from 'src/app/model/Comment';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {

  @Input() comment: Comment

  constructor(private nav: NavController) { }

  ngOnInit() {}

  showUser() {
    this.nav.navigateForward("user", { queryParams:{ pda: this.comment.writer.toString() }})
  }

  getPfp(){
    return "assets/unknown.svg"
  }

}
