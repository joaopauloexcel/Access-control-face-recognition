import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule'
  },
  { 
    path: 'login', 
    loadChildren: './login/login.module#LoginPageModule' 
  },
  { 
    path: 'detail-usuario/:id', 
    loadChildren: './detail-usuario/detail-usuario.module#DetailUsuarioPageModule' 
  },
  /*{ 
    path: 'detail-usuario', 
    loadChildren: './detail-usuario/detail-usuario.module#DetailUsuarioPageModule' 
  },*/
  { 
    path: 'login-recover', 
    loadChildren: './login-recover/login-recover.module#LoginRecoverPageModule' 
  },
  { 
    path: 'menus-dropdown', 
    loadChildren: './menus-dropdown/menus-dropdown.module#MenusDropdownPageModule'
  },
  { 
    path: 'sendemails', 
    loadChildren: './sendemails/sendemails.module#SendemailsPageModule' 
  },
  { 
    path: 'sendmessages', 
    loadChildren: './sendmessages/sendmessages.module#SendmessagesPageModule' 
  },
  { 
    path: 'mensageuser', 
    loadChildren: './mensageuser/mensageuser.module#MensageuserPageModule' 
  },
  { 
    path: 'mensagens', 
    loadChildren: './mensagens/mensagens.module#MensagensPageModule' 
  },
  { path: 'access', loadChildren: './access/access.module#AccessPageModule' },
  { path: 'news', loadChildren: './news/news.module#NewsPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
