import { Component, OnInit } from '@angular/core';
import { PeopleService } from '../services/people.service';
import { TokenService } from '../auth/token-service';
import { NavParams, PopoverController } from '@ionic/angular';
import { MensageuserPage } from '../mensageuser/mensageuser.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menus-dropdown',
  templateUrl: './menus-dropdown.page.html',
  styleUrls: ['./menus-dropdown.page.scss'],
})
export class MenusDropdownPage implements OnInit {
  id:any
  posts:any
  title:any
  text:any
  user:any
  nPosts=0;
  popover:PopoverController
  constructor(private navParms: NavParams, private popoverController:PopoverController, private router: Router) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    try{
      this.nPosts = this.navParms.get('nPosts')
      console.log(this.nPosts)
      this.popover = this.navParms.get('popover')
      this.posts = this.navParms.get('posts')
    }catch{
      console.log('Erro')
    }
  }

  datasMessage(id, title, text, email){
    this.id = id
    this.title = title
    this.text = text
    this.user = email
  }

  async message(ev: any) {
    const popover = await this.popoverController.create({
        component: MensageuserPage,
        componentProps: {id:this.id, title:this.title, text:this.text, user:this.user, popover: this.popoverController},
        event: ev,
        animated: true,
        showBackdrop: true
    });
    return await popover.present();
  }

}
