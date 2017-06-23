import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TemplateSyntaxComponent } from './template-syntax/template-syntax.component';

@NgModule({
  declarations: [
    AppComponent,
    TemplateSyntaxComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
