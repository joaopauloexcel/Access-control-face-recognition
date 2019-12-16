import { Component } from '@angular/core';
import { TokenService } from './auth/token-service';
import { Router } from '@angular/router';
import { AuthService } from './services/auth-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private roles: string[];
  userEmail:any
  private authority: string;
  private login: boolean

  constructor(private tokenStorage: TokenService, private router: Router, private authService: AuthService) { 
  }

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      console.log('logou')
      this.authService.login = true;
      setTimeout(() => {
        console.log('oi', this.userEmail)
      }, 1000);
      this.roles = this.tokenStorage.getAuthorities();
      this.roles.every(role => {
        if (role === 'ROLE_ADMIN') {
          this.authority = 'admin';
          return false;
        } 
        this.authority = 'user';
        return true;
      });
    }
    else 
    {
      this.router.navigate(['login']);
    }
  }

  useEmail(){
    this.userEmail = this.tokenStorage.getUsername().split("@")[0]
  }

  logout() {
    this.tokenStorage.signOut();
    this.authService.login = false;
    //window.location.reload()
    this.router.navigate(['login']);
  }
}
