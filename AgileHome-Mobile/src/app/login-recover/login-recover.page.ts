import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastController, AlertController } from '@ionic/angular';
import { AuthService } from '../services/authlogin.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { from } from 'rxjs';

@Component({
  selector: 'app-login-recover',
  templateUrl: './login-recover.page.html',
  styleUrls: ['./login-recover.page.scss'],
})
export class LoginRecoverPage implements OnInit {

  emailValid = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  messageEmail = ""
  errorEmail = false;
  userEmail:any={
    email:''
  }
loading:any;
  loginRecover:any;
  constructor(private authService: AuthService, public formBuilder: FormBuilder, private toastCtrl:ToastController,
    private alertController:AlertController, private router: Router, private loadingController:LoadingController) { 
   this.loginRecover = formBuilder.group({
    email: ['', [Validators.required, Validators.pattern(this.emailValid)]]
   });
 }

 ngOnInit(){}

 showToast(msg){
  this.toastCtrl.create({
    message: msg,
    duration: 4000,
    showCloseButton: true,
    closeButtonText: 'Ok, entendi',
  }).then(toast => toast.present())
}

 recoverNow() {
  let {email} = this.loginRecover.controls;
    if(this.loginRecover.valid){
      from(this.presentLoading())
      .subscribe(() => {
      this.authService.recEmail(this.userEmail)
              .subscribe(res => { 
                this.showToast('E-mail de restauração de senha enviado com sucesso!')  
                this.router.navigate(['/login'])        
                }, 
                (err) => {
                  this.showToast('Esse e-mail não corresponde a nenhum usuário!')  
              })
        .add(() => this.loading.dismiss());
      });
    }
    else if(!email.valid){
      this.errorEmail=true; 
      this.messageEmail='Ops! Email inválido!'       
    }
    else {
      this.messageEmail='';
    }
  }

  async presentLoading(): Promise<any> {
    this.loading = await this.loadingController.create({
      message: 'Enviando ...',
    });
    return await this.loading.present();
  }
}
