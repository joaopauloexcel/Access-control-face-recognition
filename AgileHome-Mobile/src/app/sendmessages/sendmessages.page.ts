import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, NavParams, NavController, PopoverController } from '@ionic/angular';
import { TokenService } from '../auth/token-service';
import { FormBuilder, Validators } from '@angular/forms';
import { from } from 'rxjs';
import { PeopleService } from '../services/people.service';

@Component({
  selector: 'app-sendmessages',
  templateUrl: './sendmessages.page.html',
  styleUrls: ['./sendmessages.page.scss'],
})
export class SendmessagesPage implements OnInit {
  sendForm:any;
  errorTitulo=false;
  messageTitulo='';
  errorTexto=false;
  messageTexto='';
  person:any;
  popover:PopoverController;
  loading:any;
  form:any={
    title:'',
    text:'',
    email:''
  }

  constructor(private router: Router, public loadingController: LoadingController,
    private api:PeopleService, private tokenStorage: TokenService,
    public formBuilder: FormBuilder, private toastCtrl:ToastController,
    private navParams: NavParams, private navCtrl: NavController) { 
    this.sendForm = formBuilder.group({
      title: ['', [Validators.required]],
      text: ['', Validators.required],
    });
  }

  ngOnInit() {
  }

  async showToast(msg){
    await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      showCloseButton: true,
      closeButtonText: 'Ok',
    }).then(toast => toast.present())
  }

  async ionViewWillEnter() {
    this.popover = await this.navParams.get('popover')
    this.person= await this.navParams.get('name')
    this.form.email = await this.tokenStorage.getUsername();
  }

  sendMsg() {
    let id = this.navParams.get('id')
    let {title, text} = this.sendForm.controls;
      if(this.sendForm.valid){
        from(this.presentLoading())
        .subscribe(() => {
           this.api.sendMsg(id,this.form)
          .subscribe(res => {
            console.log(res);
            this.popover.dismiss()
            this.showToast('Mensagem enviada com sucesso!')
            }, (err) => {
              this.showToast('Erro ao enviar mensagem!')
            })
           .add(() => this.loading.dismiss());
        });
      }
      else if (!title.valid) {
        this.errorTitulo = true;
        this.messageTitulo = "Insira o Título";
      } else {
        this.messageTitulo = "";
      }

      if (!text.valid) {
        this.errorTexto = true;
        this.messageTexto ="Insira o texto"
      } else {
        this.messageTexto = "";
      }
    }
  
    async presentLoading(): Promise<any> {
      this.loading = await this.loadingController.create({
        message: 'Enviando ...',
      });
      return await this.loading.present();
    }
}
