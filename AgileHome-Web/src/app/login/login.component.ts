import { Component, OnInit } from '@angular/core';
import { AuthLoginInfo } from '../model/login-info';
import { AuthService } from '../services/auth-service';
import { TokenService } from '../auth/token-service';
import { Router } from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  
})

export class LoginComponent implements OnInit {
  form: any = {};
  loginForm:any;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  emailValid = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  roles: string[] = [];
  public loading = false;
  private loginInfo: AuthLoginInfo;
  //class_user = 'form-control is-invalid'
  //class_user = 'form-control is-valid'
  //class_password = 'form-control is-invalid'
  //class_password = 'form-control is-valid'
  class_email = 'form-control'
  class_password = 'form-control'

  constructor(private authService: AuthService, 
  private tokenStorage: TokenService, 
  private router: Router,
  private toastr: ToastrService,
  public formBuilder: FormBuilder) {
    this.loginForm = formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.emailValid)]],
      password: ['', Validators.compose([Validators.minLength(5),
      Validators.required])],})
    }

  ngOnInit() {
    if (this.tokenStorage.getToken()) {//Se houver token definido
        this.isLoggedIn = true;//habilita boolean de logado
        this.roles = this.tokenStorage.getAuthorities();//lê a atual permissão do usuário
    }
  }

  onSubmit(){
    this.class_email = 'form-control'
    this.class_password = 'form-control'
    let{email, password} = this.loginForm.controls
    if(this.loginForm.valid){
      this.loginInfo = new AuthLoginInfo(//Instancia objeto já com as informações de login do usuário preenchidos no formulário
      this.form.email,
      this.form.password);      
      this.authService.attemptAuth(this.loginInfo).subscribe(//Chama a service que tenta realizar o login
      data => {
        this.tokenStorage.saveToken(data.accessToken);//Cria token no cabeçalho de requisição
        this.tokenStorage.saveUsername(data.username);//salva usuário no cabeçalho de requisição
        this.tokenStorage.saveAuthorities(data.authorities);//salva autorização desse usuário no cabeçalho de autenticação
        this.isLoginFailed = false;//desabilita boolean de falha na autenticação
        this.isLoggedIn = true;//habilita boolean de autenticação
        this.roles = this.tokenStorage.getAuthorities();//lê a autorização desse usuário e a armazena na variável roles
        this.authService.login = true;                       
        this.router.navigate(['home'])
        this.loading= false        
      },
      error => {//se erro, retorna a mensagem
        this.toastr.error("E-mail ou Senha incorretos!")
        this.errorMessage = error.error.reason;
        this.isLoginFailed = true;//habilita o boolean de falha na autenticação
        this.loading = false;
      }
    )
  }
  else if(!email.valid){
    this.toastr.error("E-mail inválido")
  }
  else if(!password.valid){
    this.toastr.error("A senha deve conter no mmínimo 6 caracteres")
  }
  else{
    this.toastr.error("Erro de conexão com o servidor")
  }
  if(email.valid){
    this.class_email = 'form-control is-valid'
  }else{
    this.class_email = 'form-control is-invalid'
  }
  if(password.valid){
    this.class_password = 'form-control is-valid'
  }else{
    this.class_password = 'form-control is-invalid'
  }
}


  /*reloadPage() {//Função de recarregar página
    window.location.reload();
  }*/

}




