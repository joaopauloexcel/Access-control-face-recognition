import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loginrec',
  templateUrl: './loginrec.component.html',
  styleUrls: ['./loginrec.component.css']
})
export class LoginrecComponent implements OnInit {

  emailValid = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  userEmail:any={
    email:''
  }
  loading:any;
  loginRecover:any;
  class_email = 'form-control'
  constructor(private authService: AuthService, public formBuilder: FormBuilder, private toastr:ToastrService
    , private router: Router) { 
   this.loginRecover = formBuilder.group({
    email: ['', [Validators.required, Validators.pattern(this.emailValid)]]
   });
 }

  ngOnInit() {
  }

  recoverNow() {
    let {email} = this.loginRecover.controls;
      if(this.loginRecover.valid){
        this.authService.recEmail(this.userEmail)
                .subscribe(res => { 
                  this.toastr.success("Restauração de login enviada com sucesso, confirme em seu E-mail!") 
                  this.router.navigate(['/login'])        
                  }, 
                  (err) => {
                    this.router.navigate(['/login']) 
                    this.toastr.error("E-mail incorretos ou Flaha de conexão com o servidor!")  
                })
      }
      else if(!email.valid){
        this.toastr.error("E-mail inválido!")        
      }
      if(email.valid){
        this.class_email = 'form-control is-valid'
      }else{
        this.class_email = 'form-control is-invalid'
      }
    }

}
