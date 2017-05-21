import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AppComponent } from './app.component.js'

export class AppModule { }

AppModule.annotations = [
  new NgModule({
    imports: [
      BrowserModule,
    ],
    declarations: [
      AppComponent,
    ],
    bootstrap: [
      AppComponent,
    ],
  })
]
