import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams, ToastController } from '@ionic/angular';
import { PeopleService } from '../services/people.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mensageuser',
  templateUrl: './mensageuser.page.html',
  styleUrls: ['./mensageuser.page.scss'],
})
export class MensageuserPage implements OnInit {
  id:any
  title:any
  text:any
  name:any
  email:any
  createdAt:any
  popover:PopoverController
  constructor(private router:Router, private navParms:NavParams, private api:PeopleService, private toastCtrl: ToastController) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.id = this.navParms.get('id')
    this.title = this.navParms.get('title')
    this.name = this.navParms.get('name')
    this.email = this.navParms.get('email')
    this.text = this.navParms.get('text')
    this.popover = this.navParms.get('popover') 
    this.createdAt = this.navParms.get('createdAt')  
  }

  showToast(msg){
    this.toastCtrl.create({
      message: msg,
      duration: 3000,
      showCloseButton: true,
      closeButtonText: 'Ok',
    }).then(toast => toast.present())
  }

  async closePopover(){
    await this.popover.dismiss()
  }

  markSeen(){
    console.log(this.id)
    this.api.markSeenMessage(this.id)
    .subscribe(res => {
      this.showToast('Marcado como lido com sucesso!')
      this.popover.dismiss()
      }, (err) => {
        this.showToast('Algo ocorreu de errado!')
      })
  }

}
