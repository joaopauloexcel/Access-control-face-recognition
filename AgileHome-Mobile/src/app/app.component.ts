import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { TokenService } from './auth/token-service';
import { Router } from '@angular/router';
import { AuthService } from './services/authlogin.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Cadastros',
      url: '/list',
      icon: 'contact'
    },
    {
      title: 'Acessos',
      url: '/access',
      icon: 'key'
    },
    {
      title: 'Mensagens',
      url: '/mensagens',
      icon: 'chatboxes'
    },
    {
      title: 'Sair',
      icon: 'log-out',
      function: this.logout(),
      url: '/login',
    }
  ];
  roles: string[];
  authority: string;
  userEmail:string;
  username:any
  constructor(
    private platform: Platform, private splashScreen: SplashScreen, private statusBar: StatusBar, private tokenStorage: TokenService) 
    {
      this.initializeApp();
    }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit(){
    if (this.tokenStorage.getToken()) {
     // this.authService.login = true;
      this.roles = this.tokenStorage.getAuthorities();
      this.roles.every(role => {
        if (role === 'ROLE_ADMIN') {
          this.authority = 'admin';
          return false;
        }
        else if(role === 'ROLE_USER') {
          this.authority = 'user';
          return false;
        } 
        else if(role === 'ROLE_RESIDENT'){
          this.authority = 'resident';
          return false; 
        }
        return true;
      });
    }
    /*else 
    {
     this.router.navigate(['/login']);
    }*/
  }
  
  attUser(){
    try{
      this.userEmail = this.tokenStorage.getUsername().split("@")[0]
    }catch{}
  }

  logout() {
    this.tokenStorage.signOut();
    //this.authService.login = false;
  }
}
