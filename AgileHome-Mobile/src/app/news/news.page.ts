import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams, ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NewsService } from '../services/news.service';
import { TokenService } from '../auth/token-service';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {
  id:any
  form:any={
    text:'',
    userEmail:''
  }
  popover:PopoverController
  constructor(private router:Router, private navParms:NavParams, private api:NewsService, private tokenService: TokenService,
     private toastCtrl: ToastController, private alertController:AlertController) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    if(this.navParms.get('id')){
      this.id = this.navParms.get('id')
    }
    this.form.userEmail = this.tokenService.getUsername()
    this.form.text = this.navParms.get('text')
    this.popover = this.navParms.get('popover') 
  }

  showToast(msg){
    this.toastCtrl.create({
      message: msg,
      duration: 3000,
      showCloseButton: true,
      closeButtonText: 'Ok',
    }).then(toast => toast.present())
  }

  async saveNew(){
    console.log(this.form)
    await this.api.saveNews(this.form,this.id)
    .subscribe(res => {
      this.router.navigate(['/home']);
      this.showToast('Notícia enviada com sucesso!')
      this.form.text=''
      this.form.id=''
      this.popover.dismiss()
      }, (err) => {
        this.showToast('Algo ocorreu de errado!')
      })
  }

  async closePopover(){
    await this.popover.dismiss()
  }
}
