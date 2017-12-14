import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MdoButtonModule } from '@ctrl/ngx-github-buttons';

import { AppComponent } from './app.component';
import { HeadroomComponent } from './headroom.component';


@NgModule({
  declarations: [
    AppComponent,
    HeadroomComponent,
  ],
  imports: [
    BrowserModule,
    MdoButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
