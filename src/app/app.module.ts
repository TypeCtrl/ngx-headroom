import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MdoButtonModule } from '@ctrl/ngx-github-buttons';

import { AppComponent } from './app.component';
import { HeadroomModule } from '../lib/headroom.module';


@NgModule({
  declarations: [
    AppComponent,
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
