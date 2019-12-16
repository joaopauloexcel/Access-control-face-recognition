import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { NgxLoadingModule } from 'ngx-loading';
import { ToastrModule } from 'ngx-toastr';
import { ChartsModule } from 'ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AcessosComponent } from './acessos/acessos.component';
import { MensagensComponent } from './mensagens/mensagens.component';
import { PessoasComponent } from './pessoas/pessoas.component';
import { LoginrecComponent } from './loginrec/loginrec.component';
import { TreinamentoComponent } from './treinamento/treinamento.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AppComponent,
    LoginComponent,
    AcessosComponent,
    MensagensComponent,
    PessoasComponent,
    LoginrecComponent,
    TreinamentoComponent
  ],
  imports: [
    BrowserModule,
    NgxLoadingModule.forRoot({}),
    AppRoutingModule,
    ChartsModule,
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      closeButton:true,
      positionClass: 'toast-bottom-right',
      preventDuplicates: false,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
