import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router} from '@angular/router';
import { ToastController, NavParams, PopoverController } from '@ionic/angular';
import { TokenService } from '../auth/token-service';
import { LoadingController } from '@ionic/angular';
import { from } from 'rxjs';
import { PeopleService } from '../services/people.service';

@Component({
  selector: 'app-sendemails',
  templateUrl: './sendemails.page.html',
  styleUrls: ['./sendemails.page.scss'],
})
export class SendemailsPage implements OnInit {

  sendForm:any;
  errorTitulo=false;
  messageTitulo='';
  errorTexto=false;
  messageTexto='';
  popover: PopoverController;
  loading:any;
  form:any={
    title:'',
    text:'',
    name:'',
    receptEmail:'',
    emiterEmail:'',
  }

  constructor(private router: Router, public loadingController: LoadingController,
    private api:PeopleService, private tokenStorage: TokenService,
    public formBuilder: FormBuilder, private toastCtrl:ToastController,
    private navParams: NavParams) { 
    this.sendForm = formBuilder.group({
      title: ['', [Validators.required]],
      text: ['', Validators.required],
    });
  }

  ngOnInit() {
  }

  showToast(msg){
    this.toastCtrl.create({
      message: msg,
      duration: 3000,
      showCloseButton: true,
      closeButtonText: 'Ok',
    }).then(toast => toast.present())
  }

  async ionViewWillEnter() {
    this.popover = this.navParams.get('popover')
    this.form.name = this.navParams.get('name')
    this.form.receptEmail = this.navParams.get('email')
    this.form.emiterEmail = this.tokenStorage.getUsername();
  }

  sendEmail() {
    let {title, text} = this.sendForm.controls;
      if(this.sendForm.valid){
        from(this.presentLoading())
        .subscribe(() => {
          this.api.sendEmail(this.form)
          .subscribe(res => {
            this.popover.dismiss()
            this.showToast('Email enviado com sucesso!')
            }, (err) => {
              this.showToast('Erro ao enviar! Verifique sua conexão!')
            })
          .add(() => this.loading.dismiss());
          this.router.navigate(['/list'])
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
