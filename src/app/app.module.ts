import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MdoButtonModule } from '@ctrl/ngx-github-buttons';

import { HeadroomModule } from '../lib/public_api';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent,
    AppFooterComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MdoButtonModule,
    HeadroomModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
