import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AcessosComponent } from './acessos/acessos.component';
import { MensagensComponent } from './mensagens/mensagens.component';
import { PessoasComponent } from './pessoas/pessoas.component';
import { LoginrecComponent } from './loginrec/loginrec.component';
import { TreinamentoComponent } from './treinamento/treinamento.component';

const routes: Routes = [
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  }, 
  {
    path: 'loginrec',
    component: LoginrecComponent,
  },
  {
    path: 'pessoas',
    component: PessoasComponent,
  },
  {
    path: 'acessos',
    component: AcessosComponent,
  },
  {
    path: 'mensagens',
    component: MensagensComponent,
  },
  {
    path: 'treinamento',
    component: TreinamentoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
