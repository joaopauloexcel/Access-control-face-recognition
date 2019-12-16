import { Injectable } from '@angular/core';

const TOKEN_KEY = 'AuthToken';
const USERNAME_KEY = 'AuthUsername';
const AUTHORITIES_KEY = 'AuthAuthorities';

@Injectable({
  providedIn: 'root'
})

export class TokenService {
  private roles: Array<string> = [];
  constructor() { }

  signOut() {//Exclui a atual sessão do usuário
    window.sessionStorage.clear();
  }

  public saveToken(token: string) {
    window.sessionStorage.removeItem(TOKEN_KEY);//limpa o atual cabeçalho do token
    window.sessionStorage.setItem(TOKEN_KEY, token);//cria um novo token passando esse para o cabeçalho
  }

  public getToken(): string {//lê o atual token
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUsername(username: string) {//salva o atual nome do usuário em login/sessão 
    window.sessionStorage.removeItem(USERNAME_KEY);
    window.sessionStorage.setItem(USERNAME_KEY, username);
  }

  public getUsername(): string {//lê o atual nome do usuário em login/sessão
    return sessionStorage.getItem(USERNAME_KEY);
  }
  public saveAuthorities(authorities: string[]) {//salva a atual autorização do usuário na sessão
    window.sessionStorage.removeItem(AUTHORITIES_KEY);
    window.sessionStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));
  }

  public getAuthorities(): string[] {//lê as autorizações
    this.roles = [];

    if (sessionStorage.getItem(TOKEN_KEY)) {//se houver usuário em sessão
      JSON.parse(sessionStorage.getItem(AUTHORITIES_KEY)).forEach(authority => {
        this.roles.push(authority);//puxa a atual autorização do usuário
      });
    }

    return this.roles;//retorna autorização
  }
}
