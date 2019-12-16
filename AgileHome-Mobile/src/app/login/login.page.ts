import { Component, OnInit } from '@angular/core';
import { AuthLoginInfo } from '../model/login';
import { Router } from '@angular/router';
import { AuthService } from '../services/authlogin.service';
import { TokenService } from '../auth/token-service';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  form: any = {};
  roles: string[] = [];
  loginForm:any;
  loginInfo: AuthLoginInfo;
  errorEmail=false;
  errorPassword=false;
  messageEmail='';
  messagePassword='';
  emailValid = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  

  constructor(private authService: AuthService, private tokenStorage: TokenService,
     private router: Router, public formBuilder: FormBuilder, private toastCtrl:ToastController,
     private alertController:AlertController) { 
    this.loginForm = formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.emailValid)]],
      password: ['', Validators.compose([Validators.minLength(5),
      Validators.required])],
    });
  }

  ngOnInit() {
    if (this.tokenStorage.getToken()) {//Se houver token definido
      this.roles = this.tokenStorage.getAuthorities();//lê a atual permissão do usuário
    }
  }

  showToast(msg){
    this.toastCtrl.create({
      message: msg,
      duration: 3000,
      showCloseButton: true,
      closeButtonText: 'Ok',
    }).then(toast => toast.present())
  }


  onSubmit(){
    let {email, password } = this.loginForm.controls;
      if(this.loginForm.valid){
          this.loginInfo = new AuthLoginInfo(//Instancia objeto já com as informações de login do usuário preenchidos no formulário
          this.form.email,
          this.form.password);      
          this.authService.attemptAuth(this.loginInfo).subscribe(//Chama a service que tenta realizar o login
          data => {
            this.tokenStorage.saveToken(data.accessToken);//Cria token no cabeçalho de requisição
            this.tokenStorage.saveUsername(data.username);//salva usuário no cabeçalho de requisição
            this.tokenStorage.saveAuthorities(data.authorities);//salva autorização desse usuário no cabeçalho de autenticação
            this.roles = this.tokenStorage.getAuthorities();//lê a autorização desse usuário e a armazena na variável roles
            this.authService.login = true; 
            console.log('oi')                      
            this.router.navigate(['/home'])
          },
          error => {//se erro, retorna a mensagem
            this.showToast('E-mail ou Senha inválidos')
          }
        );
      }
      else if (!email.valid) {
              this.errorEmail = true;
              this.messageEmail = "Insira um email válido";
              this.showToast('E-mail inválido')
            } else {
              this.messageEmail = "";
            }
      
            if (!password.valid) {
              this.errorPassword = true;
              this.messagePassword ="A senha precisa ter no mínimo 6 caracteres"
              this.showToast('Senha inválida')
            } else {
              this.messagePassword = "";
            }
        /*this.router.navigate(['/home'])*/
  }
}




