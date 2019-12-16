import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenusDropdownPage } from './menus-dropdown/menus-dropdown.page';
import { SendemailsPage } from './sendemails/sendemails.page';
import { SendmessagesPage } from './sendmessages/sendmessages.page';
import { MensageuserPage } from './mensageuser/mensageuser.page';
import { NewsPage } from './news/news.page';



@NgModule({
  declarations: [AppComponent, MenusDropdownPage, SendemailsPage, SendmessagesPage, MensageuserPage, NewsPage],
  entryComponents: [MenusDropdownPage, SendemailsPage, SendmessagesPage, MensageuserPage, NewsPage],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
