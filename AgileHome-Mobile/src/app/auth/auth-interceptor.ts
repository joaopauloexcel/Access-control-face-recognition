import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { TokenService } from './token-service';

const TOKEN_HEADER_KEY = 'x-access-token';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private token: TokenService) { }

//função de interceptação da sessão atual do usuário permitndo o acesso há várias páginas por ele sem perder a identidade da sessão
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        let authReq = req;
        const token = this.token.getToken();
        if (token != null) {//se já houver token de algum usuário em uso
            authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, token) });//clona a requisição via token em outro corpo de página (body)
        }
        return next.handle(authReq);//retorna requisição lidando a mesma com o clone ou com a nova requisição em si
    }
}
// Essa configuração necessária informa ao Angular que HTTP_INTERCEPTORS é um token para um multiprovedor que injeta uma matriz de valores, em vez de um único valor.
export const httpInterceptorProviders = [//ou seja, retorna uma matriz de instâncias. Isso é útil para permitir que vários provedores espalhados em vários arquivos forneçam informações de configuração para um token comum.
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
