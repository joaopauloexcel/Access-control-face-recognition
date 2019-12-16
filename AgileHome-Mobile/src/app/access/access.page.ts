import { Component, OnInit } from '@angular/core';
import { TokenService } from '../auth/token-service';
import { AccessService } from '../services/access.service';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-access',
  templateUrl: './access.page.html',
  styleUrls: ['./access.page.scss'],
})
export class AccessPage implements OnInit {

  accesses:any
  roles:any
  search:any
  constructor(private tokenService: TokenService, private api: AccessService, private alertController: AlertController,
    private toastCtrl: ToastController) { }

  ngOnInit() {
  }

  showToast(msg){
    this.toastCtrl.create({
      message: msg, duration: 3000
    }).then(toast => toast.present())
  }

  async ionViewWillEnter(){
    this.roles=this.tokenService.getAuthorities()
    await this.getAccess();
  }

  async getAccess(){
    console.log(this.tokenService.getUsername())
    await this.api.getAccess(this.search)
      .subscribe(res => {    
        console.log(res)    
        this.accesses = res;
      }, err => {
        //console.log('Erro: '+err);
      });
  }

  async deleteAccess(access) {
    const alert = await this.alertController.create({
      header: 'Deseja realmente excluir o acesso de '+ access.people.name+' em '+access.dateTime+'?',
      buttons: [
         {
          text: 'Sim',
          handler: data =>{
            this.api.deleteAccess(access.id)
            .subscribe(res => {
              this.showToast('Excluido com sucesso!')
              this.getAccess();
            }, err => {
              console.log(err);
              this.showToast('Erro ao excluir!')
            });
          }
        }, {text: 'Não'}     
      ]
    })
    await alert.present();
  }

}
