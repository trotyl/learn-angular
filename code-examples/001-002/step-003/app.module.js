import { AppComponent } from './app.component.js'

export class AppModule { }

AppModule.annotations = [
  new ng.core.NgModule({
    imports: [
      ng.platformBrowser.BrowserModule,
    ],
    declarations: [
      AppComponent,
    ],
    bootstrap: [
      AppComponent,
    ],
  })
]
