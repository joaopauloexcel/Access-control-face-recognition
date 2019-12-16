import { Component, OnInit } from '@angular/core';
import { PeopleService } from '../services/people.service';
import { TokenService } from '../auth/token-service';
import { PopoverController } from '@ionic/angular';
import { MensageuserPage } from '../mensageuser/mensageuser.page';

@Component({
  selector: 'app-mensagens',
  templateUrl: './mensagens.page.html',
  styleUrls: ['./mensagens.page.scss'],
})
export class MensagensPage implements OnInit {
  postsf: any;
  postsv: any;
  search=''
  id:any
  title:any
  name:any
  text:any
  email:any
  verific='f'
  constructor(private popoverController: PopoverController, public api: PeopleService, private tokenService:TokenService) {}

  ngOnInit() {
    //this.getUsers();
  }

  async ionViewWillLeave(){//antes da página deixar de ser ativa, evento 
    this.search='';
  }

  async ionViewWillEnter(){
    this.email=this.tokenService.getUsername()
    this.getPosts();
  }
  
  async getPosts(){
      await this.api.getMsg(this.email, 1)
      .subscribe(res => {        
        this.postsv = res;
      }, err => {
        console.log('Errov: '+err);
      });
      await this.api.getMsg(this.email, 0)
      .subscribe(res => {        
        this.postsf = res;
      }, err => {
        console.log('Errof: '+err);
      });  
  }

  async searchUser(){
    if(this.verific==='v'){
      await this.api.getPostFilter(this.email, 1,this.search)
      .subscribe(res => {
        console.log(res)        
        this.postsv = res;
      }, err => {
      });
    }else{
      await this.api.getPostFilter(this.email, 0,this.search)
      .subscribe(res => {        
        this.postsf = res;
      }, err => {
      });
    } 
  }

  datasMessage(id, title, text, name, email){
    this.id = id
    this.title = title
    this.text = text
    this.name = name
    console.log('messages ',this.name)
    this.email = email
  }

  async message(ev: any) {
    this.verific=''
    const popover = await this.popoverController.create({
        component: MensageuserPage,
        componentProps: {id:this.id, title:this.title, text:this.text, name: this.name, email:this.email, popover: this.popoverController},
        event: ev,
        animated: true,
        showBackdrop: true
    });
    return await popover.present();
  }

}
